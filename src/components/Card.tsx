import React from 'react';
import clsx from 'clsx';

export default function Card({
  children,
  className,
  interactive = false,
  as: Component = 'div',
  ...rest
}: {
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  as?: React.ElementType;
} & Record<string, unknown>) {
  return (
    <Component
      className={clsx(
        'border border-border bg-surface-raised text-foreground shadow-card',
        interactive &&
          'transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover',
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
