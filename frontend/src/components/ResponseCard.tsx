import { Check, Copy, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useToast } from "./Toast";

export function ResponseCard({ response }: { response: string }) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      showToast("Response copied");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      showToast("Couldn't copy — try selecting the text instead");
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-faint">
          <MessageSquare size={13} />
          Suggested response
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-border-strong bg-canvas px-2.5 py-1.5 text-xs font-medium text-ink transition hover:bg-border/40 active:scale-[0.97]"
        >
          {copied ? (
            <>
              <Check size={13} className="text-success" />
              Copied
            </>
          ) : (
            <>
              <Copy size={13} />
              Copy response
            </>
          )}
        </button>
      </div>

      <p className="mt-3 select-text whitespace-pre-line rounded-xl border border-border bg-canvas p-4 text-[15px] leading-relaxed text-ink">
        {response}
      </p>

      <p className="mt-3 inline-flex items-center rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
        AI-generated draft
      </p>
    </div>
  );
}
