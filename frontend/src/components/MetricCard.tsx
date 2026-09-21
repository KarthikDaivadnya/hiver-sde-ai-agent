import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  caption?: string;
  icon?: LucideIcon;
}

export function MetricCard({ label, value, caption, icon: Icon }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-subtle">{label}</p>
        {Icon && (
          <div className="rounded-lg bg-accent-soft p-1.5 text-accent">
            <Icon size={16} strokeWidth={2} />
          </div>
        )}
      </div>
      <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-ink">
        {value}
      </p>
      {caption && <p className="mt-1 text-xs text-faint">{caption}</p>}
    </div>
  );
}
