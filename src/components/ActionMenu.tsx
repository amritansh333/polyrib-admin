import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import clsx from 'clsx';

export type ActionMenuItem = {
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  onSelect?: () => void;
};

export default function ActionMenu({
  items,
  align = 'right',
}: {
  items: ActionMenuItem[];
  align?: 'left' | 'right';
}) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  return (
    <div ref={menuRef} className="relative inline-flex">
      <button
        type="button"
        aria-label="Open actions"
        aria-expanded={open}
        onClick={() => setOpen((state) => !state)}
        className="flex h-9 w-9 items-center justify-center border border-border bg-surface text-charcoal-light transition-colors hover:border-primary hover:text-primary"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div
          className={clsx(
            'absolute top-10 z-20 min-w-44 border border-border bg-surface-raised py-1 shadow-card-hover',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                item.onSelect?.();
                setOpen(false);
              }}
              className={clsx(
                'flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-surface-subtle',
                item.danger ? 'text-red-600 dark:text-red-300' : 'text-charcoal-light'
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
