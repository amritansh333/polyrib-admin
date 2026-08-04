import React from 'react';
import Card from './Card';

export default function InfoCard({
  title,
  description,
  icon,
  footer,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-heading text-lg font-semibold text-charcoal">{title}</h3>
          {description && (
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {footer && <div className="mt-4 border-t border-divider pt-4">{footer}</div>}
    </Card>
  );
}
