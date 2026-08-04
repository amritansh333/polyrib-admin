import React from 'react';
import clsx from 'clsx';

export default function Toolbar({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'flex flex-col gap-3 border border-border bg-surface-raised p-3 shadow-card sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      {children}
    </div>
  );
}
