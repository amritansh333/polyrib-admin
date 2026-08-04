import React from 'react';
import clsx from 'clsx';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
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
      <textarea
        ref={ref}
        className={clsx(
          'block min-h-28 w-full resize-y border border-border bg-surface px-3 py-2.5 text-sm text-charcoal outline-none transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 dark:text-foreground',
          className
        )}
        {...rest}
      />
      {hint && <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
});

export default Textarea;
