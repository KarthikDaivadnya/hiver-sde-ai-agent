import { CheckCircle2, ChevronRight, ArrowUpRight, Trash2 } from "lucide-react";
import type { HistoryItem } from "./types";
import { formatIntentLabel } from "../utils/taxonomy";
import { toPercent, truncate } from "../utils/format";

interface HistoryCardProps {
  item: HistoryItem;
  onView: (item: HistoryItem) => void;
  onDelete: (item: HistoryItem) => void;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function HistoryCard({ item, onView, onDelete }: HistoryCardProps) {
  const isAuto = item.decision === "AUTO_HANDLE";

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-card transition hover:border-border-strong">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-ink">
          {formatIntentLabel(item.intent)}
        </p>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isAuto
              ? "bg-success-soft text-success"
              : "bg-warning-soft text-warning"
          }`}
        >
          {isAuto ? <CheckCircle2 size={12} /> : <ArrowUpRight size={12} />}
          {isAuto ? "Auto-handle" : "Escalate"}
        </span>
      </div>

      <p className="mt-2.5 text-sm leading-relaxed text-subtle">
        "{truncate(item.query, 140)}"
      </p>

      <p className="mt-2 font-mono text-xs text-faint">{item.intent}</p>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-xs">
        <div>
          <p className="text-faint">Confidence</p>
          <p className="mt-0.5 font-mono font-medium text-ink">
            {toPercent(item.intent_confidence)}
          </p>
        </div>
        <div>
          <p className="text-faint">Retrieval</p>
          <p className="mt-0.5 font-mono font-medium text-ink">
            {item.retrieval_score.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-faint">Date</p>
          <p className="mt-0.5 font-medium text-ink">{formatDate(item.created_at)}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-3">
        <button
          onClick={() => onDelete(item)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-danger transition hover:bg-danger-soft"
        >
          <Trash2 size={13} />
          Delete
        </button>
        <button
          onClick={() => onView(item)}
          className="flex items-center gap-1 rounded-lg bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent transition hover:brightness-105"
        >
          View
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
