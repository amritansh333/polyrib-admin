import React from 'react';
import { mockRepository } from '../services/mockRepository';
import type { DataEntity, ResourceConfig } from '../types/admin';
import useDebouncedValue from './useDebouncedValue';

export type GlobalSearchResult = {
  resource: ResourceConfig;
  row: DataEntity;
};

export default function useGlobalSearch(query: string) {
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
      const data = await mockRepository.globalSearch(debouncedQuery);
      if (active) {
        setResults(data);
        setLoading(false);
      }
    }

    void search();
    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  return { results, loading };
}
