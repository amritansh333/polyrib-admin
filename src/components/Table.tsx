import React from 'react';
import clsx from 'clsx';
import Card from './Card';

export type TableColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  mobileLabel?: string;
  className?: string;
};

export default function Table<T>({
  columns,
  rows,
  rowKey,
  empty,
  className,
}: {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: React.ReactNode;
  className?: string;
}) {
  if (rows.length === 0) return <>{empty}</>;

  return (
    <div className={clsx('w-full', className)}>
      <div className="hidden overflow-hidden border border-border bg-surface-raised shadow-card lg:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-divider bg-surface-subtle">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={clsx(
                    'px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground',
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-divider">
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                className="transition-colors duration-200 hover:bg-surface-subtle"
              >
                {columns.map((column) => (
                  <td key={column.key} className={clsx('px-4 py-3 text-sm', column.className)}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 lg:hidden">
        {rows.map((row) => (
          <Card key={rowKey(row)} className="p-4">
            <dl className="grid gap-3">
              {columns.map((column) => (
                <div key={column.key} className="flex items-start justify-between gap-4">
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {column.mobileLabel ?? column.header}
                  </dt>
                  <dd className="min-w-0 text-right text-sm text-charcoal-light">
                    {column.render(row)}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        ))}
      </div>
    </div>
  );
}
