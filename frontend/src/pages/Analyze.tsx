import { useOutletContext } from "react-router-dom";
import { AnalysisProgress } from "../components/AnalysisProgress";
import { DecisionCard } from "../components/DecisionCard";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { EvidenceList } from "../components/EvidenceList";
import { GroundingStatus } from "../components/GroundingStatus";
import { IntentCard } from "../components/IntentCard";
import { QueryInput } from "../components/QueryInput";
import { ResponseCard } from "../components/ResponseCard";
import { ResultSummary } from "../components/ResultSummary";
import type { OutletContext } from "../types/context";

export function Analyze() {
  const { message, setMessage, analyze } = useOutletContext<OutletContext>();
  const { status, result, error, run, reset } = analyze;
  const isLoading = status === "loading";

  const handleSubmit = () => {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;
    run(trimmed);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Analyze a customer query
        </h1>
        <p className="mt-1.5 text-[15px] text-subtle">
          See how the support agent understands, retrieves, decides, and responds.
        </p>
      </div>

      <QueryInput
        value={message}
        onChange={setMessage}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      {status === "loading" && <AnalysisProgress />}

      {status === "error" && error && (
        <ErrorState message={error} onRetry={() => run(message.trim())} />
      )}

      {status === "idle" && (
        <EmptyState
          title="Your support workspace is ready."
          description="Enter a customer message to see how the agent understands and handles it."
        />
      )}

      {status === "success" && result && (
        <div className="animate-rise-in space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Analysis complete</p>
            <button
              onClick={reset}
              className="text-xs font-medium text-subtle hover:text-ink"
            >
              Clear results
            </button>
          </div>

          <ResultSummary result={result} />

          <div className="grid gap-5 sm:grid-cols-2">
            <IntentCard intent={result.intent} confidence={result.intent_confidence} />
            <DecisionCard
              decision={result.decision}
              reason={result.decision_reason}
              rule={result.decision_rule}
            />
          </div>

          <EvidenceList
            evidence={result.evidence}
            retrievalScore={result.retrieval_score}
          />

          <ResponseCard response={result.response} />

          <GroundingStatus flags={result.grounding_flags} />
        </div>
      )}
    </div>
  );
}
