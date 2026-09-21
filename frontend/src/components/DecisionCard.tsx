import { ArrowUpRight, CheckCircle2, GitBranch } from "lucide-react";
import type { Decision } from "../types/api";
import { describeDecisionRule } from "../utils/taxonomy";

interface DecisionCardProps {
  decision: Decision;
  reason: string;
  rule: string;
}

export function DecisionCard({ decision, reason, rule }: DecisionCardProps) {
  const isAuto = decision === "AUTO_HANDLE";

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-faint">
        <GitBranch size={13} />
        Handling decision
      </div>

      <div
        className={`mt-3 flex items-center gap-2.5 rounded-xl border px-4 py-3 ${
          isAuto
            ? "border-success/30 bg-success-soft text-success"
            : "border-warning/30 bg-warning-soft text-warning"
        }`}
      >
        {isAuto ? (
          <CheckCircle2 size={18} strokeWidth={2.25} />
        ) : (
          <ArrowUpRight size={18} strokeWidth={2.25} />
        )}
        <span className="text-sm font-semibold">
          {isAuto ? "Auto-handle" : "Escalate to human support"}
        </span>
      </div>

      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-faint">
            Reason
          </dt>
          <dd className="mt-0.5 text-ink">{reason}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-faint">
            Policy rule
          </dt>
          <dd className="mt-0.5 font-mono text-ink">{rule}</dd>
          <dd className="mt-1 text-xs text-subtle">{describeDecisionRule(rule)}</dd>
        </div>
      </dl>

      <p className="mt-4 border-t border-border pt-3 text-xs text-faint">
        The escalation decision is determined by the explicit policy layer, not by
        the response generator.
      </p>
    </div>
  );
}
