import { History } from "lucide-react";

export function HistoryEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong bg-surface/60 px-6 py-16 text-center">
      <div className="mb-4 rounded-full bg-accent-soft p-3 text-accent">
        <History size={22} strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-semibold text-ink">No analysis history yet</h3>
      <p className="mt-1.5 max-w-sm text-sm text-subtle">
        Run a customer query from the Analyze page and your results will appear
        here.
      </p>
    </div>
  );
}
