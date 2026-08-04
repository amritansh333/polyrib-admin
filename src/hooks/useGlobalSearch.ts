import React from 'react';
import type { DataEntity, ResourceConfig } from '../types/admin';
import useDebouncedValue from './useDebouncedValue';
import { useRepository } from '../repositories/RepositoryProvider';

export type GlobalSearchResult = {
  resource: ResourceConfig;
  row: DataEntity;
};

export default function useGlobalSearch(query: string) {
  const repository = useRepository();
  const [results, setResults] = React.useState<GlobalSearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const debouncedQuery = useDebouncedValue(query);

  React.useEffect(() => {
    let active = true;

    async function search() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      const data = await repository.search(debouncedQuery);
      if (active) {
        setResults(data);
        setLoading(false);
      }
    }

    void search();
    return () => {
      active = false;
    };
  }, [debouncedQuery, repository]);

  return { results, loading };
}
