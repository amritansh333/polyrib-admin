import React from 'react';
import clsx from 'clsx';

export default function Avatar({
  name,
  size = 'md',
  className,
}: {
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const initials = (name || 'U')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={clsx(
        'inline-flex items-center justify-center bg-primary/10 font-semibold text-primary',
        size === 'sm' && 'h-8 w-8 text-xs',
        size === 'md' && 'h-10 w-10 text-sm',
        size === 'lg' && 'h-12 w-12 text-base',
        className
      )}
    >
      <span>{initials}</span>
    </div>
  );
}
