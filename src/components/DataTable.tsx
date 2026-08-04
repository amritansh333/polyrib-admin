import ResourceTable, { type ResourceTableColumn } from './ResourceTable';
import type React from 'react';

export type DataTableColumn<T> = ResourceTableColumn<T>;

export default function DataTable<T extends { id: string; status?: string }>({
  columns,
  rows,
}: {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey?: (row: T) => string;
  empty?: React.ReactNode;
}) {
  return <ResourceTable columns={columns} rows={rows} />;
}
