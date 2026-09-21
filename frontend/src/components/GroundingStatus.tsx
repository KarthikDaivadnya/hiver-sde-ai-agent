import { AlertTriangle, ShieldCheck } from "lucide-react";

const FLAG_EXPLANATIONS: Record<string, string> = {
  UNSUPPORTED_ACTION:
    "The generated draft contained an operational claim that could not be safely supported.",
};

export function GroundingStatus({ flags }: { flags: string[] }) {
  const passed = flags.length === 0;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-faint">
        <ShieldCheck size={13} />
        Grounding safety
      </div>

      {passed ? (
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-success/30 bg-success-soft px-4 py-3 text-success">
          <ShieldCheck size={17} strokeWidth={2.25} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">Grounding check passed</p>
            <p className="mt-0.5 text-xs text-success/90">
              No unsupported operational claims detected.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-3 space-y-2.5">
          <div className="flex items-start gap-2.5 rounded-xl border border-warning/30 bg-warning-soft px-4 py-3 text-warning">
            <AlertTriangle size={17} strokeWidth={2.25} className="mt-0.5 shrink-0" />
            <p className="text-sm font-semibold">Grounding safeguard triggered</p>
          </div>
          <ul className="space-y-2">
            {flags.map((flag) => (
              <li key={flag} className="rounded-lg border border-border bg-canvas p-3">
                <p className="font-mono text-xs font-medium text-ink">{flag}</p>
                <p className="mt-1 text-xs text-subtle">
                  {FLAG_EXPLANATIONS[flag] ??
                    "The grounding check flagged this response for review."}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
