import React from 'react';
import clsx from 'clsx';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

const Input = React.forwardRef<HTMLInputElement, Props>(function Input(
  { label, hint, className, ...rest },
  ref
) {
  return (
    <label className="block text-sm">
      {label && (
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      )}
      <input
        ref={ref}
        className={clsx(
          'block h-10 w-full border border-border bg-surface px-3 text-sm text-charcoal outline-none transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 dark:text-foreground',
          className
        )}
        {...rest}
      />
      {hint && <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
});

export default Input;
