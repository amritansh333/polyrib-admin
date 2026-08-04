import React from 'react';
import clsx from 'clsx';
import Breadcrumb from './Breadcrumb';

export type BreadcrumbItem = {
  to: string;
  label: string;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  action,
  meta,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx('border-b border-divider bg-surface-subtle', className)}>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbs} className="mb-4" />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            {eyebrow && <p className="section-label mb-3">{eyebrow}</p>}
            <h1 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl">{title}</h1>
            {description && (
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            )}
            {meta && <div className="mt-4 flex flex-wrap gap-2">{meta}</div>}
          </div>
          {action && <div className="flex shrink-0 flex-wrap gap-2">{action}</div>}
        </div>
      </div>
    </section>
  );
}
