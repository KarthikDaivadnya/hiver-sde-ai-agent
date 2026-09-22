function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 rounded bg-border" />
        <div className="h-5 w-24 rounded-full bg-border" />
      </div>
      <div className="mt-4 h-4 w-full rounded bg-border" />
      <div className="mt-2 h-4 w-2/3 rounded bg-border" />
      <div className="mt-4 h-3 w-40 rounded bg-border" />
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="h-8 rounded bg-border" />
        <div className="h-8 rounded bg-border" />
        <div className="h-8 rounded bg-border" />
      </div>
    </div>
  );
}

export function HistoryLoading() {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2"
      role="status"
      aria-label="Loading analysis history"
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
