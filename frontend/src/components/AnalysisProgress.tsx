import { Check } from "lucide-react";
import { useEffect, useState } from "react";

const STAGES = [
  "Understanding query",
  "Classifying intent",
  "Finding historical evidence",
  "Evaluating support policy",
  "Drafting grounded response",
  "Running safety check",
];

// Purely a visual representation of the known pipeline shape — the
// backend does not stream real progress events, so this advances on
// a timer rather than claiming exact internal state.
const STAGE_INTERVAL_MS = 650;

export function AnalysisProgress() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i < STAGES.length - 1 ? i + 1 : i));
    }, STAGE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
      <p className="text-sm font-semibold text-ink">Analyzing customer request</p>
      <ul className="mt-4 space-y-3">
        {STAGES.map((stage, i) => {
          const done = i < activeIndex;
          const current = i === activeIndex;
          return (
            <li key={stage} className="flex items-center gap-3 text-sm">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  done
                    ? "border-success bg-success text-white"
                    : current
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-border-strong text-faint"
                }`}
              >
                {done ? (
                  <Check size={12} strokeWidth={3} />
                ) : current ? (
                  <span className="h-1.5 w-1.5 animate-pulse-ring rounded-full bg-accent" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </span>
              <span className={done || current ? "text-ink" : "text-faint"}>
                {stage}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
