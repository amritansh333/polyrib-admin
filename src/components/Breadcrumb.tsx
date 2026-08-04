import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import clsx from 'clsx';

export default function Breadcrumb({
  items,
  className,
}: {
  items?: { to: string; label: string }[];
  className?: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <nav
      aria-label="breadcrumb"
      className={clsx(
        'flex flex-wrap items-center gap-1.5 text-xs font-medium text-muted-foreground',
        className
      )}
    >
      <Home className="h-3.5 w-3.5 text-primary" />
      {items.map((it, idx) => (
        <React.Fragment key={it.to}>
          {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
          <Link
            to={it.to}
            className="text-charcoal-light transition-colors duration-200 hover:text-primary"
          >
            {it.label}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
}
