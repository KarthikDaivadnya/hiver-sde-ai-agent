import { AlertCircle, RotateCw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border border-danger/30 bg-danger-soft px-6 py-14 text-center"
      role="alert"
    >
      <div className="mb-4 rounded-full bg-surface p-3 text-danger">
        <AlertCircle size={22} strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-semibold text-ink">
        Couldn't analyze this message
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-subtle">{message}</p>
      <button
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border-strong bg-surface px-4 py-2 text-sm font-medium text-ink transition hover:bg-canvas active:scale-[0.98]"
      >
        <RotateCw size={14} />
        Try again
      </button>
    </div>
  );
}
