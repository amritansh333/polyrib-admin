import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

export default function Modal({
  open,
  title,
  description,
  children,
  onClose,
  footer,
}: {
  open: boolean;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg border border-border bg-surface-raised shadow-card-hover">
        <div className="flex items-start justify-between gap-4 border-b border-divider p-5">
          <div>
            <h2 className="font-heading text-xl font-semibold text-charcoal">{title}</h2>
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center border border-border text-charcoal-light transition-colors hover:border-primary hover:text-primary"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
        <div className="flex justify-end gap-2 border-t border-divider bg-surface-subtle p-4">
          {footer ?? (
            <>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="button" onClick={onClose}>
                Confirm
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
