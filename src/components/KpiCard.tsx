import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Card from './Card';

export default function KpiCard({
  label,
  value,
  change,
  trend = 'up',
  icon,
}: {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  icon?: React.ReactNode;
}) {
  const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight;

  return (
    <Card interactive className="relative overflow-hidden p-5">
      <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          <div className="mt-4 font-heading text-3xl font-bold text-charcoal">{value}</div>
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
      {change && (
        <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-charcoal-light">
          <TrendIcon className="h-3.5 w-3.5 text-primary" />
          <span>{change}</span>
        </div>
      )}
    </Card>
  );
}
