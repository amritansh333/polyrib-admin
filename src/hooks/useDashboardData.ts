import React from 'react';
import { resources } from '../services/mockData';
import api from '../lib/api';
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

      // If connected to API backend, fetch a single dashboard payload with counts to avoid many list requests
      // Use an in-module dedupe promise so React Strict Mode / double mounts in dev do NOT issue duplicate requests
      if (repository.source === 'api') {
        try {
          // dashboardPromise is module-scoped and dedupes concurrent fetches
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (globalThis as any).__dashboardPromise = (globalThis as any).__dashboardPromise || null;
          if (!(globalThis as any).__dashboardPromise) {
            (globalThis as any).__dashboardPromise = api.get('/admin/dashboard').finally(() => {
              // clear the promise so future navigations will refetch
              (globalThis as any).__dashboardPromise = null;
            });
          }

          const response = await (globalThis as any).__dashboardPromise;
          const payload = (response.data && response.data.data) || {};
          const remoteCounts = payload.counts || {};

          // Use the dashboard payload only — do NOT fetch individual resources when a summary endpoint exists
          const productRows = { rows: payload.latestProducts || [] };
          const leadRows = { rows: payload.latestLeads || [] };
          const downloadRows = { rows: payload.latestDownloads || [] };
          // Materials preview is not provided by the payload in some versions — default to empty
          const materialRows = { rows: payload.latestMaterials || [] };

          if (!active) return;

          setCounts(remoteCounts);
          setProducts(productRows.rows);
          setLeads(leadRows.rows);
          setDownloads(downloadRows.rows);
          setMaterials(materialRows.rows);
          setLoading(false);
          return;
        } catch (err) {
          // Fall through to mock behavior if dashboard endpoint is missing or fails
          // (api client will mark missing admin endpoints as necessary)
          console.warn('Dashboard API fetch failed, falling back to repository listing', err);
        }
      }

      // Fallback / mock repository behavior: compute counts locally but only for resources we render
      try {
        const relevantKeys = [
          'products',
          'categories',
          'brands',
          'materials',
          'catalogrequests',
          'media-library',
          'leads',
          'users',
          'roles',
        ];
        const resourceCounts = await Promise.all(
          resources
            .filter((r) => relevantKeys.includes(r.key))
            .map(async (resource) => {
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
          // Brochure download admin is now the Leads admin resource
          repository.list('leads', { query, pageSize: 4 }),
          repository.list('materials', { query, status: dashboardStatus, pageSize: 4 }),
        ]);

        if (!active) return;

        setCounts(Object.fromEntries(resourceCounts));
        setProducts(productRows.rows);
        setLeads(leadRows.rows);
        setDownloads(downloadRows.rows);
        setMaterials(materialRows.rows);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [division, period, query, repository, status]);

  return { loading, counts, products, leads, downloads, materials };
}
