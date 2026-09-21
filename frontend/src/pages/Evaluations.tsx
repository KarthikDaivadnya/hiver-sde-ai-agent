import type { ReactNode } from "react";
import { EvaluationMetric } from "../components/EvaluationMetric";
import { FailureChart } from "../components/FailureChart";
import { toPercent } from "../utils/format";
import {
  ESCALATION_METRICS,
  FAILURE_ANALYSIS,
  INTENT_METRICS,
  RESPONSE_QUALITY,
  RETRIEVAL_METRICS,
} from "../utils/benchmarks";

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      {children}
      {note && <p className="mt-3 text-xs text-faint">{note}</p>}
    </section>
  );
}

export function Evaluations() {
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Evaluations
        </h1>
        <p className="mt-1.5 text-[15px] text-subtle">
          Offline benchmark results, not live production metrics.
        </p>
      </div>

      <Section
        title="Intent classification"
        note="Development benchmark; limited labelled data."
      >
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <EvaluationMetric
            label="Accuracy"
            value={toPercent(INTENT_METRICS.accuracy, 1)}
          />
          <EvaluationMetric
            label="Macro F1"
            value={toPercent(INTENT_METRICS.macroF1, 1)}
          />
          <EvaluationMetric
            label="Labelled examples"
            value={String(INTENT_METRICS.labeledExamples)}
          />
          <EvaluationMetric
            label="Validation set"
            value={String(INTENT_METRICS.validationExamples)}
          />
        </div>
      </Section>

      <Section title="Retrieval" note={`${RETRIEVAL_METRICS.benchmarkQueries} manually judged queries`}>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <EvaluationMetric label="Hit@1" value={toPercent(RETRIEVAL_METRICS.hitAt1)} />
          <EvaluationMetric label="Hit@3" value={toPercent(RETRIEVAL_METRICS.hitAt3)} />
          <EvaluationMetric label="MRR" value={toPercent(RETRIEVAL_METRICS.mrr, 2)} />
          <EvaluationMetric
            label="nDCG@3"
            value={toPercent(RETRIEVAL_METRICS.ndcgAt3, 2)}
          />
        </div>
      </Section>

      <Section
        title="Escalation policy"
        note="Project-defined policy labels; not independently verified ground truth."
      >
        <div className="mt-3 grid grid-cols-3 gap-3">
          <EvaluationMetric
            label="Precision"
            value={toPercent(ESCALATION_METRICS.precision, 2)}
          />
          <EvaluationMetric
            label="Recall"
            value={toPercent(ESCALATION_METRICS.recall, 2)}
          />
          <EvaluationMetric label="F1" value={toPercent(ESCALATION_METRICS.f1, 2)} />
        </div>
      </Section>

      <Section
        title="Response quality"
        note={`LLM-as-judge benchmark · ${RESPONSE_QUALITY.benchmarkResponses} generated responses`}
      >
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <EvaluationMetric
            label="Overall"
            value={`${RESPONSE_QUALITY.overall.toFixed(3)} / ${RESPONSE_QUALITY.scale}`}
          />
          <EvaluationMetric
            label="Tone"
            value={`${RESPONSE_QUALITY.tone.toFixed(3)} / ${RESPONSE_QUALITY.scale}`}
          />
          <EvaluationMetric
            label="Grounding"
            value={`${RESPONSE_QUALITY.grounding.toFixed(3)} / ${RESPONSE_QUALITY.scale}`}
          />
          <EvaluationMetric
            label="Helpfulness"
            value={`${RESPONSE_QUALITY.helpfulness.toFixed(3)} / ${RESPONSE_QUALITY.scale}`}
          />
        </div>
      </Section>

      <Section
        title="Failure analysis"
        note="Failure categories are tracked to identify operational weaknesses that aggregate quality scores may hide."
      >
        <div className="mt-4">
          <FailureChart data={FAILURE_ANALYSIS} />
        </div>
      </Section>
    </div>
  );
}
