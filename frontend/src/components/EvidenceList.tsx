import { BookOpen } from "lucide-react";
import type { EvidenceItem } from "../types/api";
import { toPercent } from "../utils/format";
import { EvidenceCard } from "./EvidenceCard";

interface EvidenceListProps {
  evidence: EvidenceItem[];
  retrievalScore: number;
}

export function EvidenceList({ evidence, retrievalScore }: EvidenceListProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-faint">
            <BookOpen size={13} />
            Historical evidence
          </div>
          <p className="mt-1 text-sm text-subtle">
            Similar support conversations retrieved from the AmazonHelp corpus.
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono text-lg font-semibold text-ink">
            {toPercent(retrievalScore, 1)}
          </p>
          <p className="text-xs text-faint">Retrieval score</p>
        </div>
      </div>

      {evidence.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-border-strong p-4 text-sm text-faint">
          No historical evidence was returned for this query.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {evidence.map((item, i) => (
            <EvidenceCard
              key={item.conversation_id ?? i}
              item={item}
              rank={i + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
