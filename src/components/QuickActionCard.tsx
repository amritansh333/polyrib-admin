import React from 'react';
import { ArrowRight } from 'lucide-react';
import Card from './Card';

export default function QuickActionCard({
  title,
  description,
  icon,
  onClick,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Card as="button" interactive className="group w-full p-4 text-left" onClick={onClick}>
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-base font-semibold text-charcoal group-hover:text-primary">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
          )}
        </div>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
      </div>
    </Card>
  );
}
