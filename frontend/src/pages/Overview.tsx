import { ArrowRight, Database, GitBranch, MessageCircle, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { MetricCard } from "../components/MetricCard";
import {
  CORPUS_STATS,
  RESPONSE_QUALITY,
  RETRIEVAL_METRICS,
} from "../utils/benchmarks";

export function Overview() {
  return (
    <div className="animate-fade-in space-y-8">
      <section>
        <span className="inline-flex items-center rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
          AmazonHelp
        </span>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          AI customer support intelligence
        </h1>
        <p className="mt-2 max-w-xl text-[15px] text-subtle">
          Understand customer intent, retrieve historical support evidence, and
          generate grounded responses.
        </p>
        <Link
          to="/analyze"
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition hover:brightness-110 active:scale-[0.99]"
        >
          Analyze a query
          <ArrowRight size={15} />
        </Link>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-ink">Historical support corpus</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricCard
            label="Reconstructed conversations"
            value={CORPUS_STATS.reconstructedConversations.toLocaleString()}
            icon={MessageCircle}
          />
          <MetricCard
            label="AmazonHelp conversations"
            value={CORPUS_STATS.amazonHelpConversations.toLocaleString()}
            icon={Database}
          />
          <MetricCard
            label="Retrieval corpus"
            value={CORPUS_STATS.retrievalCorpus.toLocaleString()}
            caption="Leakage-safe resolutions"
            icon={GitBranch}
          />
          <MetricCard
            label="Retrieval Hit@3"
            value={`${(RETRIEVAL_METRICS.hitAt3 * 100).toFixed(0)}%`}
            caption={`${RETRIEVAL_METRICS.benchmarkQueries}-query benchmark`}
            icon={Target}
          />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-ink">Response quality</h2>
        <div className="mt-3 rounded-2xl border border-border bg-surface p-5 shadow-card">
          <div className="flex items-baseline justify-between">
            <p className="text-sm text-subtle">Overall benchmark score</p>
            <p className="font-mono text-lg font-semibold text-ink">
              {RESPONSE_QUALITY.overall.toFixed(3)} / {RESPONSE_QUALITY.scale}
            </p>
          </div>
          <p className="mt-1 text-xs text-faint">
            {RESPONSE_QUALITY.benchmarkResponses}-response LLM-as-judge benchmark —
            not a live production accuracy figure.
          </p>
        </div>
      </section>
    </div>
  );
}
