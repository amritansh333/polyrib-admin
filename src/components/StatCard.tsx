import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';
import Card from './Card';

export default function StatCard({
  label,
  value,
  detail,
  icon,
  trend,
  tone = 'blue',
}: {
  label: string;
  value: string;
  detail?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down';
  tone?: 'blue' | 'green' | 'amber' | 'red' | 'neutral';
}) {
  const TrendIcon = trend === 'down' ? ArrowDownRight : ArrowUpRight;
  const tones = {
    blue: 'bg-primary/10 text-primary',
    green: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    amber: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    red: 'bg-red-500/10 text-red-700 dark:text-red-300',
    neutral: 'bg-surface-subtle text-charcoal-light',
  };

  return (
    <Card interactive className="relative min-h-36 overflow-hidden p-5">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-primary" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          <div className="mt-4 font-heading text-3xl font-bold text-charcoal">{value}</div>
        </div>
        {icon && (
          <div className={clsx('flex h-10 w-10 shrink-0 items-center justify-center', tones[tone])}>
            {icon}
          </div>
        )}
      </div>
      {detail && (
        <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-charcoal-light">
          {trend && <TrendIcon className="h-3.5 w-3.5 text-primary" />}
          <span>{detail}</span>
        </div>
      )}
    </Card>
  );
}
