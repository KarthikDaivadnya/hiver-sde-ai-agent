import { RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "../components/Toast";
import { deleteHistoryItem, getHistory, HistoryApiError } from "./api";
import { ConfirmDialog } from "./ConfirmDialog";
import { HistoryCard } from "./HistoryCard";
import { HistoryDetail } from "./HistoryDetail";
import { HistoryEmptyState } from "./HistoryEmptyState";
import { HistoryError } from "./HistoryError";
import { HistoryLoading } from "./HistoryLoading";
import type { HistoryItem } from "./types";

type Filter = "all" | "AUTO_HANDLE" | "ESCALATE";
type SortOrder = "newest" | "oldest";
type Status = "loading" | "success" | "error";

/**
 * Fully self-contained — not wired into the app's router or
 * navigation. Import { HistoryPage } from "./history" and render it
 * from a route once you've manually added one. It does depend on the
 * existing ToastProvider being an ancestor (App.tsx already provides
 * it), so delete confirmations can show a toast.
 */
export function HistoryPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const [viewing, setViewing] = useState<HistoryItem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<HistoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { showToast } = useToast();

  const load = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setStatus("loading");
    setError(null);
    try {
      const data = await getHistory();
      setItems(data.items);
      setStatus("success");
    } catch (err) {
      const message =
        err instanceof HistoryApiError
          ? err.message
          : "Something went wrong while loading analysis history.";
      setError(message);
      setStatus("error");
    } finally {
      if (isManualRefresh) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visibleItems = useMemo(() => {
    let result = items;

    if (filter !== "all") {
      result = result.filter((item) => item.decision === filter);
    }

    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (item) =>
          item.query.toLowerCase().includes(query) ||
          item.intent.toLowerCase().includes(query) ||
          item.decision.toLowerCase().includes(query),
      );
    }

    return [...result].sort((a, b) => {
      const diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return sortOrder === "newest" ? diff : -diff;
    });
  }, [items, filter, search, sortOrder]);

  const handleDeleteConfirmed = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteHistoryItem(pendingDelete.id);
      setItems((prev) => prev.filter((i) => i.id !== pendingDelete.id));
      showToast("Analysis deleted");
      setPendingDelete(null);
    } catch (err) {
      const message =
        err instanceof HistoryApiError
          ? err.message
          : "Couldn't delete this analysis.";
      showToast(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">
            Analysis History
          </h1>
          <p className="mt-1.5 text-[15px] text-subtle">
            Review customer-support analyses previously run through the AI agent.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {status === "success" && (
            <span className="text-xs text-faint">
              {items.length} {items.length === 1 ? "analysis" : "analyses"}
            </span>
          )}
          <button
            onClick={() => load(true)}
            disabled={isRefreshing || status === "loading"}
            className="flex items-center gap-1.5 rounded-lg border border-border-strong bg-surface px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-canvas disabled:opacity-50"
          >
            <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {status === "success" && items.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search analyses..."
              className="w-full rounded-lg border border-border bg-surface py-2 pl-8 pr-3 text-sm text-ink placeholder:text-faint focus:border-accent"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border bg-surface p-0.5 text-xs">
              {(["all", "AUTO_HANDLE", "ESCALATE"] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-md px-2.5 py-1.5 font-medium transition ${
                    filter === f ? "bg-accent-soft text-accent" : "text-subtle hover:text-ink"
                  }`}
                >
                  {f === "all" ? "All" : f === "AUTO_HANDLE" ? "Auto-handle" : "Escalate"}
                </button>
              ))}
            </div>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="rounded-lg border border-border bg-surface px-2 py-1.5 text-xs font-medium text-ink"
              aria-label="Sort order"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      )}

      {status === "loading" && <HistoryLoading />}

      {status === "error" && error && (
        <HistoryError message={error} onRetry={() => load()} />
      )}

      {status === "success" && items.length === 0 && <HistoryEmptyState />}

      {status === "success" && items.length > 0 && visibleItems.length === 0 && (
        <p className="rounded-xl border border-dashed border-border-strong p-6 text-center text-sm text-faint">
          No analyses match your search or filter.
        </p>
      )}

      {status === "success" && visibleItems.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {visibleItems.map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              onView={setViewing}
              onDelete={setPendingDelete}
            />
          ))}
        </div>
      )}

      {viewing && <HistoryDetail item={viewing} onClose={() => setViewing(null)} />}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this analysis?"
        description="This record will be permanently removed from your analysis history."
        isBusy={isDeleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
