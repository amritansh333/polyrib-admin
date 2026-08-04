import React from 'react';
import clsx from 'clsx';

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string;
  description?: string;
};

export default function Checkbox({ label, description, className, ...rest }: CheckboxProps) {
  return (
    <label className={clsx('flex items-start gap-3 text-sm text-charcoal-light', className)}>
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 accent-[hsl(var(--primary))]"
        {...rest}
      />
      <span>
        {label && <span className="block font-semibold text-charcoal">{label}</span>}
        {description && <span className="block text-xs text-muted-foreground">{description}</span>}
      </span>
    </label>
  );
}
