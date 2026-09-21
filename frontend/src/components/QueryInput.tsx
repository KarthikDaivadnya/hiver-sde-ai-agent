import { Loader2, Search } from "lucide-react";
import { useEffect, useRef } from "react";

const MAX_LENGTH = 600;

const EXAMPLE_QUERIES = [
  "My package says delivered but I never received it.",
  "I can't access my account.",
  "I haven't received my refund yet.",
  "My payment was charged twice.",
];

interface QueryInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function QueryInput({ value, onChange, onSubmit, isLoading }: QueryInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const canSubmit = value.trim().length > 0 && !isLoading;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
      <label htmlFor="customer-message" className="text-sm font-semibold text-ink">
        Customer message
      </label>
      <div className="mt-3">
        <textarea
          id="customer-message"
          ref={textareaRef}
          value={value}
          maxLength={MAX_LENGTH}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canSubmit) {
              onSubmit();
            }
          }}
          placeholder="Example: My package says delivered but I never received it."
          rows={4}
          className="w-full resize-none rounded-xl border border-border bg-canvas px-4 py-3 text-[15px] text-ink placeholder:text-faint focus:border-accent"
        />
        <div className="mt-1.5 text-right text-xs text-faint">
          {value.length} / {MAX_LENGTH}
        </div>
      </div>

      <div className="mt-1 flex flex-wrap gap-2">
        {EXAMPLE_QUERIES.map((example) => (
          <button
            key={example}
            onClick={() => onChange(example)}
            className="rounded-full border border-border bg-canvas px-3 py-1.5 text-xs text-subtle transition hover:border-border-strong hover:text-ink"
          >
            {example}
          </button>
        ))}
      </div>

      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-ink transition enabled:hover:brightness-110 enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Search size={16} />
        )}
        {isLoading ? "Analyzing…" : "Analyze query"}
      </button>
    </div>
  );
}
