import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { EvidenceItem } from "../types/api";
import { toPercent, truncate } from "../utils/format";

const PREVIEW_LENGTH = 180;

export function EvidenceCard({ item, rank }: { item: EvidenceItem; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const text = item.conversation_text ?? "";
  const isLong = text.length > PREVIEW_LENGTH;

  return (
    <div className="rounded-xl border border-border bg-canvas p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-faint">
          Historical support case · #{rank}
        </p>
        <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-xs font-medium text-accent">
          {toPercent(item.score, 1)} match
        </span>
      </div>

      <p className="mt-2.5 whitespace-pre-line text-sm leading-relaxed text-ink">
        {expanded || !isLong ? text : truncate(text, PREVIEW_LENGTH)}
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 flex items-center gap-1 text-xs font-medium text-accent hover:underline"
        >
          {expanded ? "Show less" : "View full conversation"}
          <ChevronDown
            size={13}
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </div>
  );
}
