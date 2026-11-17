import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { raiseToasts } from './AppToaster';

/** A modal built on the native <dialog>, which handles focus trapping and Escape for us. */
export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      raiseToasts();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-[2rem] border border-cream-300 bg-cream-50 p-0 text-ink-800 shadow-lift backdrop:bg-sage-950/55 backdrop:backdrop-blur-sm"
    >
      {/* The gold dot and green rule echo the mark, and give every dialog the same header. */}
      <div className="h-1.5 bg-gradient-to-r from-sage-800 via-sage-500 to-gold-500" aria-hidden="true" />
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-display text-2xl leading-tight text-sage-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1.5 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-600 transition hover:bg-sage-100 hover:text-sage-900"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </dialog>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Yes, continue',
  isLoading,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open={open} onClose={onCancel} title={title}>
      <div className="text-sm leading-relaxed text-ink-700">{message}</div>
      <div className="mt-7 flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} isLoading={isLoading}>
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
