import React from 'react';
import clsx from 'clsx';
import Card from './Card';

export default function DashboardCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={clsx('overflow-hidden', className)}>
      {(title || description || action) && (
        <div className="flex items-start justify-between gap-4 border-b border-divider p-5">
          <div>
            {title && <h2 className="font-heading text-lg font-semibold text-charcoal">{title}</h2>}
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </Card>
  );
}
