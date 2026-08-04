import Table, { type TableColumn } from './Table';

export type DataTableColumn<T> = TableColumn<T>;

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty,
}: {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: React.ReactNode;
}) {
  return <Table columns={columns} rows={rows} rowKey={rowKey} empty={empty} />;
}
