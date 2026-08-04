import React from 'react';
import StatusBadge from './StatusBadge';

export default function ActivityItem({
  title,
  description,
  time,
  icon,
  status,
}: {
  title: string;
  description?: string;
  time: string;
  icon?: React.ReactNode;
  status?: string;
}) {
  return (
    <div className="flex gap-3 border-b border-divider py-3 last:border-b-0">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-charcoal">{title}</h3>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        {description && (
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
        )}
        {status && (
          <div className="mt-2">
            <StatusBadge tone="neutral">{status}</StatusBadge>
          </div>
        )}
      </div>
    </div>
  );
}
