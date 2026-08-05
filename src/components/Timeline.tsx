import React from 'react';
import clsx from 'clsx';

export type TimelineEntry = {
  title: string;
  description?: string;
  time: string;
  tone?: 'blue' | 'green' | 'amber' | 'red';
};

export default function Timeline({ items }: { items: TimelineEntry[] }) {
  const tones: Record<NonNullable<TimelineEntry['tone']>, string> = {
    blue: 'bg-primary',
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  };

  return (
    <ol className="relative space-y-5 border-l border-divider pl-5">
      {items.map((item, index) => (
        <li key={`${item.title}-${item.time}-${index}`} className="relative">
          <span
            className={clsx(
              'absolute -left-[25px] top-1.5 h-2.5 w-2.5 border-2 border-surface-raised',
              tones[item.tone ?? 'blue']
            )}
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-charcoal">{item.title}</h3>
            <span className="text-xs text-muted-foreground">{item.time}</span>
          </div>
          {item.description && (
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
