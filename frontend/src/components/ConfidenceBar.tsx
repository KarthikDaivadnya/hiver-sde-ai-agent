import { clamp, toPercent } from "../utils/format";

interface ConfidenceBarProps {
  label: string;
  value: number;
  tone?: "accent" | "success" | "warning" | "danger";
}

const TONE_CLASSES: Record<NonNullable<ConfidenceBarProps["tone"]>, string> = {
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export function ConfidenceBar({ label, value, tone = "accent" }: ConfidenceBarProps) {
  const pct = clamp(value <= 1 ? value * 100 : value, 0, 100);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-subtle">{label}</span>
        <span className="font-mono font-medium text-ink">{toPercent(value)}</span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${TONE_CLASSES[tone]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
