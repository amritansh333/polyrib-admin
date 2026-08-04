import React from 'react';
import type { DataEntity } from '../types/admin';
import { useRepository } from '../repositories/RepositoryProvider';

export default function useResourceItem(resourceKey: string, id?: string) {
  const repository = useRepository();
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
        const data = await repository.get(resourceKey, id);
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
  }, [id, repository, resourceKey]);

  const save = React.useCallback(
    async (entity: DataEntity) => {
      const data = entity.id
        ? await repository.update(resourceKey, entity.id, entity)
        : await repository.create(resourceKey, entity);
      setItem(data);
      return data;
    },
    [repository, resourceKey]
  );

  return { item, loading, error, save };
}
