import type { FailureCategory } from "../utils/benchmarks";

export function FailureChart({ data }: { data: FailureCategory[] }) {
  const max = Math.max(...data.map((d) => d.count));

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.code}>
          <div className="mb-1 flex items-baseline justify-between text-sm">
            <span className="text-ink">{item.label}</span>
            <span className="font-mono text-xs text-subtle">{item.count}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-accent/80 transition-[width] duration-700 ease-out"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
