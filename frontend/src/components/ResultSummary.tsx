import { ArrowRight, CheckCircle2, GitBranch, ShieldCheck, Tag } from "lucide-react";
import type { AnalyzeResponse } from "../types/api";
import { formatIntentLabel } from "../utils/taxonomy";

export function ResultSummary({ result }: { result: AnalyzeResponse }) {
  const grounded = result.grounding_flags.length === 0;

  const steps = [
    {
      icon: Tag,
      label: "Intent",
      value: formatIntentLabel(result.intent),
      tone: "text-accent",
    },
    {
      icon: CheckCircle2,
      label: "Evidence",
      value: result.evidence.length > 0 ? "Retrieved" : "None found",
      tone: "text-ink",
    },
    {
      icon: GitBranch,
      label: "Decision",
      value: result.decision === "AUTO_HANDLE" ? "Auto-handle" : "Escalate",
      tone: result.decision === "AUTO_HANDLE" ? "text-success" : "text-warning",
    },
    {
      icon: ShieldCheck,
      label: "Safety",
      value: grounded ? "Grounded" : "Flagged",
      tone: grounded ? "text-success" : "text-warning",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-surface p-4 shadow-card">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-canvas px-3 py-2">
            <step.icon size={15} className={step.tone} />
            <div className="leading-tight">
              <p className="text-[10px] uppercase tracking-wide text-faint">
                {step.label}
              </p>
              <p className={`text-xs font-medium ${step.tone}`}>{step.value}</p>
            </div>
          </div>
          {i < steps.length - 1 && (
            <ArrowRight size={14} className="shrink-0 text-faint" />
          )}
        </div>
      ))}
    </div>
  );
}
