import { AlertTriangle } from "lucide-react";
import { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isBusy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  isBusy = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) confirmRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm animate-rise-in rounded-2xl border border-border bg-surface-raised p-5 shadow-raised"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-danger-soft p-2 text-danger">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h3 id="confirm-dialog-title" className="text-sm font-semibold text-ink">
              {title}
            </h3>
            <p className="mt-1 text-sm text-subtle">{description}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={isBusy}
            className="rounded-lg border border-border-strong bg-surface px-3.5 py-2 text-sm font-medium text-ink transition hover:bg-canvas disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            disabled={isBusy}
            className="rounded-lg bg-danger px-3.5 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {isBusy ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
