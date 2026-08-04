import React from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

type DropdownProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: { label: string; value: string }[];
};

export default function Dropdown({ label, options, className, ...rest }: DropdownProps) {
  return (
    <label className="block text-sm">
      {label && (
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      )}
      <span className="relative block">
        <select
          className={clsx(
            'h-10 w-full appearance-none border border-border bg-surface px-3 pr-9 text-sm font-medium text-charcoal outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/15 dark:text-foreground',
            className
          )}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-primary" />
      </span>
    </label>
  );
}
