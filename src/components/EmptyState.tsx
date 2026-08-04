import React from 'react';
import { PackageOpen } from 'lucide-react';
import clsx from 'clsx';

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'border border-dashed border-border bg-surface-subtle px-6 py-10 text-center',
        className
      )}
    >
      <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center bg-primary/10 text-primary">
        {icon ?? <PackageOpen className="h-5 w-5" strokeWidth={1.8} />}
      </div>
      <h3 className="font-heading text-lg font-semibold text-charcoal">{title}</h3>
      {description && (
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
