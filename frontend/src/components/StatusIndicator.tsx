import type { ApiStatus } from "../types/api";

const COPY: Record<ApiStatus, { label: string; dot: string; text: string }> = {
  checking: {
    label: "Checking connection",
    dot: "bg-faint",
    text: "text-subtle",
  },
  connected: {
    label: "API connected",
    dot: "bg-success",
    text: "text-success",
  },
  offline: {
    label: "API offline",
    dot: "bg-danger",
    text: "text-danger",
  },
};

export function StatusIndicator({ status }: { status: ApiStatus }) {
  const copy = COPY[status];
  return (
    <div
      className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium"
      role="status"
      aria-live="polite"
    >
      <span className="relative flex h-1.5 w-1.5">
        {status === "connected" && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${copy.dot}`} />
      </span>
      <span className={copy.text}>{copy.label}</span>
    </div>
  );
}
