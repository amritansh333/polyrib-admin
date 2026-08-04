import React from 'react';
import clsx from 'clsx';

export default function NotificationItem({
  title,
  description,
  time,
  unread = false,
  icon,
}: {
  title: string;
  description?: string;
  time: string;
  unread?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 border-b border-divider px-4 py-3 last:border-b-0">
      {icon && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={clsx(
              'text-sm font-semibold',
              unread ? 'text-charcoal' : 'text-charcoal-light'
            )}
          >
            {title}
          </h3>
          <span className="shrink-0 text-[11px] text-muted-foreground">{time}</span>
        </div>
        {description && (
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
        )}
      </div>
      {unread && <span className="mt-2 h-2 w-2 shrink-0 bg-primary" />}
    </div>
  );
}
