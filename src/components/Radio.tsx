import React from 'react';
import clsx from 'clsx';

export type RadioOption = {
  label: string;
  value: string;
  description?: string;
};

export default function Radio({
  name,
  value,
  options,
  onChange,
  className,
}: {
  name: string;
  value?: string;
  options: RadioOption[];
  onChange?: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={clsx('grid gap-2', className)}>
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-start gap-3 border border-border bg-surface px-3 py-2.5 text-sm transition-colors hover:border-primary/50"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange?.(option.value)}
            className="mt-0.5 h-4 w-4 accent-[hsl(var(--primary))]"
          />
          <span>
            <span className="block font-semibold text-charcoal">{option.label}</span>
            {option.description && (
              <span className="block text-xs text-muted-foreground">{option.description}</span>
            )}
          </span>
        </label>
      ))}
    </div>
  );
}
