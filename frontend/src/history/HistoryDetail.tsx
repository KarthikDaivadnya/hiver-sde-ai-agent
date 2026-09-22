import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "../components/Toast";
import { describeDecisionRule, describeIntent, formatIntentLabel } from "../utils/taxonomy";
import { toPercent } from "../utils/format";
import type { HistoryItem } from "./types";

const FLAG_EXPLANATIONS: Record<string, string> = {
  UNSUPPORTED_ACTION:
    "The generated draft contained an operational claim that could not be safely supported.",
};

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HistoryDetail({
  item,
  onClose,
}: {
  item: HistoryItem;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();
  const isAuto = item.decision === "AUTO_HANDLE";
  const grounded = item.grounding_flags.length === 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.response);
      setCopied(true);
      showToast("Response copied");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      showToast("Couldn't copy — try selecting the text instead");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in justify-end bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-detail-title"
      onClick={onClose}
    >
      <div
        className="scrollbar-thin h-full w-full max-w-lg animate-rise-in overflow-y-auto border-l border-border bg-surface-raised p-6 shadow-raised sm:max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 id="history-detail-title" className="text-lg font-semibold text-ink">
              Analysis details
            </h2>
            <p className="mt-0.5 font-mono text-xs text-faint">
              Interaction #{item.id}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close details"
            className="rounded-lg border border-border p-1.5 text-subtle transition hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>

        <section className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-faint">
            Customer message
          </p>
          <p className="mt-1.5 rounded-xl border border-border bg-canvas p-3.5 text-sm leading-relaxed text-ink">
            {item.query}
          </p>
        </section>

        <section className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-faint">
            Detected intent
          </p>
          <p className="mt-1.5 font-mono text-sm font-semibold text-ink">
            {item.intent}
          </p>
          <p className="mt-0.5 text-sm text-subtle">
            {formatIntentLabel(item.intent)} — {describeIntent(item.intent)}
          </p>
          <p className="mt-1 text-xs text-faint">
            Confidence: <span className="font-mono">{toPercent(item.intent_confidence)}</span>
          </p>
        </section>

        <section className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-faint">
            Handling decision
          </p>
          <div
            className={`mt-1.5 flex items-center gap-2 rounded-xl border px-3.5 py-2.5 ${
              isAuto
                ? "border-success/30 bg-success-soft text-success"
                : "border-warning/30 bg-warning-soft text-warning"
            }`}
          >
            {isAuto ? <CheckCircle2 size={16} /> : <ArrowUpRight size={16} />}
            <span className="text-sm font-semibold">
              {isAuto ? "Auto-handle" : "Escalate to human support"}
            </span>
          </div>
          <p className="mt-2 text-sm text-ink">{item.decision_reason}</p>
          <p className="mt-1 font-mono text-xs text-subtle">{item.decision_rule}</p>
          <p className="mt-1 text-xs text-faint">{describeDecisionRule(item.decision_rule)}</p>
        </section>

        <section className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-faint">
            Historical evidence score
          </p>
          <p className="mt-1.5 font-mono text-sm font-semibold text-ink">
            {toPercent(item.retrieval_score, 1)}
          </p>
        </section>

        <section className="mt-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-faint">
              Suggested response
            </p>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-border-strong bg-canvas px-2.5 py-1 text-xs font-medium text-ink transition hover:bg-border/40"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-success" />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={12} />
                  Copy response
                </>
              )}
            </button>
          </div>
          <p className="mt-1.5 select-text whitespace-pre-line rounded-xl border border-border bg-canvas p-3.5 text-sm leading-relaxed text-ink">
            {item.response}
          </p>
          <p className="mt-2 inline-flex items-center rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
            AI-generated draft
          </p>
        </section>

        <section className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-faint">
            Grounding safety
          </p>
          {grounded ? (
            <div className="mt-1.5 flex items-start gap-2.5 rounded-xl border border-success/30 bg-success-soft px-3.5 py-2.5 text-success">
              <ShieldCheck size={16} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Grounding check passed</p>
                <p className="mt-0.5 text-xs text-success/90">
                  No unsupported operational claims were detected.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-1.5 space-y-2">
              <div className="flex items-center gap-2.5 rounded-xl border border-warning/30 bg-warning-soft px-3.5 py-2.5 text-warning">
                <AlertTriangle size={16} />
                <p className="text-sm font-semibold">Grounding safeguard triggered</p>
              </div>
              <ul className="space-y-2">
                {item.grounding_flags.map((flag) => (
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
        </section>

        <section className="mt-5 border-t border-border pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-faint">
            Metadata
          </p>
          <dl className="mt-1.5 grid grid-cols-2 gap-3 text-xs">
            <div>
              <dt className="text-faint">Timestamp</dt>
              <dd className="mt-0.5 text-ink">{formatTimestamp(item.created_at)}</dd>
            </div>
            <div>
              <dt className="text-faint">Database interaction ID</dt>
              <dd className="mt-0.5 font-mono text-ink">#{item.id}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
