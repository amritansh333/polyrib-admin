import clsx from 'clsx';
import type React from 'react';

type StatusBadgeProps = {
  children: React.ReactNode;
  tone?: 'blue' | 'green' | 'amber' | 'red' | 'neutral';
};

const tones: Record<NonNullable<StatusBadgeProps['tone']>, string> = {
  blue: 'border-primary/25 bg-primary/10 text-primary',
  green: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  amber: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  red: 'border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300',
  neutral: 'border-divider bg-surface-subtle text-charcoal-light dark:text-muted-foreground',
};

export default function StatusBadge({ children, tone = 'neutral' }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest',
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}
