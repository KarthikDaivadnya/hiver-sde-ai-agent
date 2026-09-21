import { Tag } from "lucide-react";
import { ConfidenceBar } from "./ConfidenceBar";
import { describeIntent, formatIntentLabel } from "../utils/taxonomy";

interface IntentCardProps {
  intent: string;
  confidence: number;
}

export function IntentCard({ intent, confidence }: IntentCardProps) {
  const isLow = (confidence <= 1 ? confidence : confidence / 100) < 0.5;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-faint">
        <Tag size={13} />
        Intent detected
      </div>
      <p className="mt-2 font-mono text-lg font-semibold text-ink">{intent}</p>
      <p className="mt-1 text-sm text-subtle">
        {formatIntentLabel(intent)} — {describeIntent(intent)}
      </p>
      <div className="mt-4">
        <ConfidenceBar
          label="Confidence"
          value={confidence}
          tone={isLow ? "warning" : "accent"}
        />
        {isLow && (
          <p className="mt-2 text-xs text-subtle">
            Lower confidence — worth a second look rather than treated as incorrect.
          </p>
        )}
      </div>
    </div>
  );
}
