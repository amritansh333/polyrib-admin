import React from 'react';
import clsx from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'subtle';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
};

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex shrink-0 items-center justify-center gap-2 border font-semibold tracking-normal transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:pointer-events-none disabled:opacity-50 [&_svg]:h-4 [&_svg]:w-4';
  const sizes: Record<string, string> = {
    xs: 'h-8 px-2.5 text-xs',
    sm: 'h-9 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-sm',
    icon: 'h-10 w-10 p-0',
  };
  const variants: Record<string, string> = {
    primary:
      'border-primary bg-primary text-primary-foreground shadow-card hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-card-hover dark:hover:bg-primary-light',
    secondary:
      'border-charcoal bg-charcoal text-white hover:-translate-y-0.5 hover:bg-charcoal-light dark:border-surface-muted dark:bg-surface-muted',
    outline:
      'border-border bg-surface text-charcoal hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary hover:shadow-card',
    ghost:
      'border-transparent bg-transparent text-charcoal-light hover:bg-surface-subtle hover:text-primary',
    subtle:
      'border-divider bg-surface-subtle text-charcoal-light hover:border-primary/40 hover:text-primary',
    danger: 'border-red-600 bg-red-600 text-white hover:-translate-y-0.5 hover:bg-red-500',
  };

  return (
    <button className={clsx(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}
