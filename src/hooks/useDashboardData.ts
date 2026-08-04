import React from 'react';
import { resources } from '../services/mockData';
import type { DataEntity } from '../types/admin';
import { useRepository } from '../repositories/RepositoryProvider';

export default function useDashboardData({
  division,
  period,
  query,
  status,
}: {
  division: string;
  period: string;
  query: string;
  status: string;
}) {
  const repository = useRepository();
  const [loading, setLoading] = React.useState(true);
  const [counts, setCounts] = React.useState<Record<string, number>>({});
  const [products, setProducts] = React.useState<DataEntity[]>([]);
  const [leads, setLeads] = React.useState<DataEntity[]>([]);
  const [downloads, setDownloads] = React.useState<DataEntity[]>([]);
  const [materials, setMaterials] = React.useState<DataEntity[]>([]);

  React.useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      const dashboardStatus =
        status === 'review' ? 'Review' : status === 'published' ? 'Published' : 'all';
      const resourceCounts = await Promise.all(
        resources.map(async (resource) => {
          const result = await repository.list(resource.key, {
            query,
            status: dashboardStatus,
            pageSize: 1,
          });
          return [resource.key, result.total] as const;
        })
      );
      const [productRows, leadRows, downloadRows, materialRows] = await Promise.all([
        repository.list('products', { query, status: dashboardStatus, pageSize: 4 }),
        repository.list('leads', {
          query,
          status: status === 'review' ? 'Pending' : 'all',
          pageSize: 4,
        }),
        repository.list('brochure-downloads', { query, pageSize: 4 }),
        repository.list('materials', { query, status: dashboardStatus, pageSize: 4 }),
      ]);

      if (active) {
        setCounts(Object.fromEntries(resourceCounts));
        setProducts(productRows.rows);
        setLeads(leadRows.rows);
        setDownloads(downloadRows.rows);
        setMaterials(materialRows.rows);
        setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [division, period, query, repository, status]);

  return { loading, counts, products, leads, downloads, materials };
}
