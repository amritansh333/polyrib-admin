import React from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

export default function Drawer({
  open,
  title,
  children,
  onClose,
  side = 'left',
  className,
}: {
  open: boolean;
  title?: string;
  children?: React.ReactNode;
  onClose: () => void;
  side?: 'left' | 'right';
  className?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close drawer"
        className="absolute inset-0 h-full w-full cursor-default bg-charcoal/55 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside
        className={clsx(
          'absolute top-0 h-full w-[min(88vw,340px)] border-border bg-surface-raised shadow-card-hover',
          side === 'left' ? 'left-0 border-r' : 'right-0 border-l',
          className
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-divider px-4">
          <h2 className="font-heading text-lg font-semibold text-charcoal">{title}</h2>
          <button
            type="button"
            aria-label="Close drawer"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center border border-border text-charcoal-light transition-colors hover:border-primary hover:text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="h-[calc(100%-4rem)] overflow-y-auto industrial-scrollbar">{children}</div>
      </aside>
    </div>
  );
}
