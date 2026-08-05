import React from 'react';
import {
  Archive,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Copy,
  Eye,
  Pencil,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import clsx from 'clsx';
import Card from './Card';
import ActionMenu from './ActionMenu';
import Checkbox from './Checkbox';
import Pagination from './Pagination';
import EmptyState from './EmptyState';
import LoadingSkeleton from './LoadingSkeleton';
import type { SortDirection } from '../types/admin';

export type ResourceTableColumn<T> = {
  key: keyof T | string;
  header: string;
  render: (row: T) => React.ReactNode;
  sortable?: boolean;
  getSortValue?: (row: T) => string | number;
  className?: string;
};

export default function ResourceTable<T extends { id: string; status?: string }>({
  rows,
  columns,
  loading,
  error,
  pageSize = 8,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onArchive,
  onRestore,
  page: controlledPage,
  totalPages: controlledTotalPages,
  sortKey,
  sortDirection,
  onPageChange,
  onSortChange,
}: {
  rows: T[];
  columns: ResourceTableColumn<T>[];
  loading?: boolean;
  error?: string | null;
  pageSize?: number;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (ids: string[]) => void;
  onDuplicate?: (row: T) => void;
  onArchive?: (ids: string[]) => void;
  onRestore?: (ids: string[]) => void;
  page?: number;
  totalPages?: number;
  sortKey?: string;
  sortDirection?: SortDirection;
  onPageChange?: (page: number) => void;
  onSortChange?: (key: string) => void;
}) {
  const [internalPage, setInternalPage] = React.useState(1);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [internalSort, setInternalSort] = React.useState<{
    key: string;
    direction: SortDirection;
  }>({ key: String(columns[0]?.key ?? 'id'), direction: 'asc' });
  const controlled = Boolean(onPageChange || onSortChange);
  const page = controlledPage ?? internalPage;
  const sort = {
    key: sortKey ?? internalSort.key,
    direction: sortDirection ?? internalSort.direction,
  };

  React.useEffect(() => {
    setSelected([]);
    if (!controlled) setInternalPage(1);
  }, [controlled, rows]);

  const sortedRows = React.useMemo(() => {
    if (controlled) return rows;
    const column = columns.find((item) => String(item.key) === sort.key);
    const getValue =
      column?.getSortValue ??
      ((row: T) => {
        const value = row[sort.key as keyof T];
        return typeof value === 'number' ? value : String(value ?? '');
      });

    return [...rows].sort((a, b) => {
      const aValue = getValue(a);
      const bValue = getValue(b);
      const result =
        typeof aValue === 'number' && typeof bValue === 'number'
          ? aValue - bValue
          : String(aValue).localeCompare(String(bValue));
      return sort.direction === 'asc' ? result : -result;
    });
  }, [columns, controlled, rows, sort]);

  const totalPages = controlledTotalPages ?? Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const pageRows = controlled
    ? sortedRows
    : sortedRows.slice((page - 1) * pageSize, page * pageSize);
  const allPageSelected = pageRows.length > 0 && pageRows.every((row) => selected.includes(row.id));

  const toggleSort = (column: ResourceTableColumn<T>) => {
    if (!column.sortable) return;
    if (onSortChange) {
      onSortChange(String(column.key));
      return;
    }
    setInternalSort((current) => ({
      key: String(column.key),
      direction: current.key === String(column.key) && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const toggleAll = () => {
    setSelected((current) =>
      allPageSelected
        ? current.filter((id) => !pageRows.some((row) => row.id === id))
        : [...new Set([...current, ...pageRows.map((row) => row.id)])]
    );
  };

  if (loading) {
    return (
      <div className="grid gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <LoadingSkeleton key={index} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    if (error === 'Feature not implemented yet') {
      return (
        <EmptyState
          title="Feature not implemented yet"
          description="This admin endpoint is not implemented in the backend yet. Refresh the page after the backend is updated."
        />
      );
    }

    return <EmptyState title="Records could not be loaded" description={error} />;
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        title="No records found"
        description="Adjust the search or filters to reveal matching CMS records."
      />
    );
  }

  return (
    <div className="space-y-3">
      {selected.length > 0 && (
        <div className="flex flex-col gap-3 border border-primary/20 bg-primary/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-charcoal">{selected.length} selected</p>
          <button
            type="button"
            onClick={() => onDelete?.(selected)}
            className="inline-flex h-9 items-center justify-center gap-2 border border-red-500/30 bg-red-500/10 px-3 text-xs font-semibold text-red-700 transition-colors hover:border-red-600 dark:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </button>
        </div>
      )}

      <div className="hidden overflow-hidden border border-border bg-surface-raised shadow-card lg:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-divider bg-surface-subtle">
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  aria-label="Select visible rows"
                  checked={allPageSelected}
                  onChange={toggleAll}
                  className="h-4 w-4 accent-[hsl(var(--primary))]"
                />
              </th>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={clsx(
                    'px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground',
                    column.className
                  )}
                >
                  <button
                    type="button"
                    disabled={!column.sortable}
                    onClick={() => toggleSort(column)}
                    className={clsx(
                      'inline-flex items-center gap-1.5',
                      column.sortable && 'hover:text-primary'
                    )}
                  >
                    {column.header}
                    {column.sortable &&
                      (sort.key === String(column.key) ? (
                        sort.direction === 'asc' ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )
                      ) : (
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      ))}
                  </button>
                </th>
              ))}
              <th className="w-12 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-divider">
            {pageRows.map((row) => (
              <tr key={row.id} className="transition-colors duration-200 hover:bg-surface-subtle">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label={`Select ${row.id}`}
                    checked={selected.includes(row.id)}
                    onChange={() =>
                      setSelected((current) =>
                        current.includes(row.id)
                          ? current.filter((id) => id !== row.id)
                          : [...current, row.id]
                      )
                    }
                    className="h-4 w-4 accent-[hsl(var(--primary))]"
                  />
                </td>
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={clsx('px-4 py-3 text-sm', column.className)}
                  >
                    {column.render(row)}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <ActionMenu
                    items={[
                      {
                        label: 'View',
                        icon: <Eye className="h-4 w-4" />,
                        onSelect: () => onView?.(row),
                      },
                      {
                        label: 'Edit',
                        icon: <Pencil className="h-4 w-4" />,
                        onSelect: () => onEdit?.(row),
                      },
                      {
                        label: 'Duplicate',
                        icon: <Copy className="h-4 w-4" />,
                        onSelect: () => onDuplicate?.(row),
                      },
                      row.status === 'Archived'
                        ? {
                            label: 'Restore',
                            icon: <RotateCcw className="h-4 w-4" />,
                            onSelect: () => onRestore?.([row.id]),
                          }
                        : {
                            label: 'Archive',
                            icon: <Archive className="h-4 w-4" />,
                            onSelect: () => onArchive?.([row.id]),
                          },
                      {
                        label: 'Delete',
                        icon: <Trash2 className="h-4 w-4" />,
                        danger: true,
                        onSelect: () => onDelete?.([row.id]),
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 lg:hidden">
        {pageRows.map((row) => (
          <Card key={row.id} className="p-4">
            <div className="mb-4 flex items-start justify-between gap-4">
              <Checkbox
                checked={selected.includes(row.id)}
                onChange={() =>
                  setSelected((current) =>
                    current.includes(row.id)
                      ? current.filter((id) => id !== row.id)
                      : [...current, row.id]
                  )
                }
              />
              <ActionMenu
                items={[
                  {
                    label: 'View',
                    icon: <Eye className="h-4 w-4" />,
                    onSelect: () => onView?.(row),
                  },
                  {
                    label: 'Edit',
                    icon: <Pencil className="h-4 w-4" />,
                    onSelect: () => onEdit?.(row),
                  },
                  {
                    label: 'Duplicate',
                    icon: <Copy className="h-4 w-4" />,
                    onSelect: () => onDuplicate?.(row),
                  },
                  row.status === 'Archived'
                    ? {
                        label: 'Restore',
                        icon: <RotateCcw className="h-4 w-4" />,
                        onSelect: () => onRestore?.([row.id]),
                      }
                    : {
                        label: 'Archive',
                        icon: <Archive className="h-4 w-4" />,
                        onSelect: () => onArchive?.([row.id]),
                      },
                  {
                    label: 'Delete',
                    icon: <Trash2 className="h-4 w-4" />,
                    danger: true,
                    onSelect: () => onDelete?.([row.id]),
                  },
                ]}
              />
            </div>
            <dl className="grid gap-3">
              {columns.map((column) => (
                <div key={String(column.key)} className="flex items-start justify-between gap-4">
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {column.header}
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

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange ?? setInternalPage}
      />
    </div>
  );
}
