import React from 'react';
import type { DataEntity, SortDirection } from '../types/admin';
import useDebouncedValue from './useDebouncedValue';
import { useRepository } from '../repositories/RepositoryProvider';
import { MissingBackendApiError } from '../lib/api';

export default function useResourceCollection(resourceKey: string) {
  const repository = useRepository();
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [rows, setRows] = React.useState<DataEntity[]>([]);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(8);
  const [total, setTotal] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [sortKey, setSortKey] = React.useState<keyof DataEntity>('updatedAt');
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc');
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const debouncedQuery = useDebouncedValue(query);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedQuery, status]);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await repository.list(resourceKey, {
        query: debouncedQuery,
        status,
        page,
        pageSize,
        sortKey,
        sortDirection,
      });
      setRows(data.rows);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      if (data.page !== page) setPage(data.page);
    } catch (err: any) {
      if (err?.name === 'MissingBackendApiError' || err instanceof MissingBackendApiError) {
        // Backend admin API for this resource is not implemented — show friendly message and empty state
        setRows([]);
        setTotal(0);
        setTotalPages(1);
        setError('Feature not implemented yet');
      } else {
        setError('Unable to load records. Retry the operation.');
      }
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, page, pageSize, repository, resourceKey, sortDirection, sortKey, status]);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const remove = React.useCallback(
    async (ids: string[]) => {
      setActionLoading(true);
      await repository.delete(resourceKey, ids);
      await refresh();
      setActionLoading(false);
    },
    [refresh, repository, resourceKey]
  );

  const duplicate = React.useCallback(
    async (id: string) => {
      setActionLoading(true);
      await repository.duplicate(resourceKey, id);
      await refresh();
      setActionLoading(false);
    },
    [refresh, repository, resourceKey]
  );

  const archive = React.useCallback(
    async (ids: string[]) => {
      setActionLoading(true);
      await repository.archive(resourceKey, ids);
      await refresh();
      setActionLoading(false);
    },
    [refresh, repository, resourceKey]
  );

  const restore = React.useCallback(
    async (ids: string[]) => {
      setActionLoading(true);
      await repository.restore(resourceKey, ids);
      await refresh();
      setActionLoading(false);
    },
    [refresh, repository, resourceKey]
  );

  const setSort = React.useCallback((key: keyof DataEntity) => {
    setPage(1);
    setSortKey((currentKey) => {
      if (currentKey === key) {
        setSortDirection((currentDirection) => (currentDirection === 'asc' ? 'desc' : 'asc'));
        return currentKey;
      }
      setSortDirection('asc');
      return key;
    });
  }, []);

  return {
    rows,
    total,
    page,
    pageSize,
    totalPages,
    sortKey,
    sortDirection,
    loading,
    actionLoading,
    error,
    query,
    setQuery,
    status,
    setStatus,
    setPage,
    setSort,
    refresh,
    remove,
    duplicate,
    archive,
    restore,
  };
}
