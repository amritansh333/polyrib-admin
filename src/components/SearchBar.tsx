import React from 'react';
import { Search } from 'lucide-react';
import clsx from 'clsx';

type SearchBarProps = React.InputHTMLAttributes<HTMLInputElement> & {
  containerClassName?: string;
};

export default function SearchBar({ className, containerClassName, ...rest }: SearchBarProps) {
  return (
    <label
      className={clsx(
        'flex h-10 items-center gap-2 border border-border bg-surface px-3 text-sm text-muted-foreground transition-all duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15',
        containerClassName
      )}
    >
      <Search className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.8} />
      <input
        className={clsx(
          'min-w-0 flex-1 bg-transparent text-charcoal outline-none placeholder:text-muted-foreground dark:text-foreground',
          className
        )}
        {...rest}
      />
    </label>
  );
}
