import React from 'react';
import Card from './Card';

export default function MetricCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {title}
          </p>
          <p className="mt-1 font-heading text-2xl font-bold text-charcoal">{value}</p>
        </div>
      </div>
      {description && <p className="mt-3 text-sm text-muted-foreground">{description}</p>}
    </Card>
  );
}
