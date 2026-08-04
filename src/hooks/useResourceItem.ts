import React from 'react';
import { mockRepository } from '../services/mockRepository';
import type { DataEntity } from '../types/admin';

export default function useResourceItem(resourceKey: string, id?: string) {
  const [item, setItem] = React.useState<DataEntity | null>(null);
  const [loading, setLoading] = React.useState(Boolean(id));
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;

    async function load() {
      if (!id) {
        setItem(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await mockRepository.find(resourceKey, id);
        if (active) setItem(data);
      } catch {
        if (active) setError('Unable to load this record.');
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [id, resourceKey]);

  return { item, loading, error };
}
