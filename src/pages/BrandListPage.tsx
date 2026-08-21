import React from 'react';
import { Eye, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import Toolbar from '../components/Toolbar';
import SearchBar from '../components/SearchBar';
import Button from '../components/Button';
import ResourceTable, { type ResourceTableColumn } from '../components/ResourceTable';
import ActionMenu from '../components/ActionMenu';
import useResourceCollection from '../hooks/useResourceCollection';
import { useRepository } from '../repositories/RepositoryProvider';
import { useToast } from '../providers/ToastProvider';
import { resources } from '../services/mockData';
import type { DataEntity } from '../types/admin';


export default function BrandListPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const repository = useRepository();
  const collection = useResourceCollection('brands');
  const config = resources.find((item) => item.key === 'brands');

  const columns: ResourceTableColumn<DataEntity>[] = [
    {
      key: 'name',
      header: 'Brand Name',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-charcoal">{row.name}</p>
        </div>
      ),
    },
    { key: 'slug', header: 'Slug', sortable: true, render: (row) => row.slug ?? '—' },
    {
      key: 'createdAt',
      header: 'Created At',
      sortable: true,
      render: (row) => formatDate(row.createdAt),
    },
  ];

  if (!config) {
    return null;
  }

  return (
    <>
      <PageHeader
        eyebrow={config.eyebrow}
        title={config.title}
        description={config.description}
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: config.basePath, label: config.title },
        ]}
        action={
          <Button type="button" onClick={() => navigate('/brands/new')}>
            New Brand
          </Button>
        }
        meta={<div />}
      />

      <PageContainer className="space-y-6">
        <Toolbar>
          <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
            <SearchBar
              value={collection.query}
              onChange={(e) => collection.setQuery(e.target.value)}
              placeholder={config.searchPlaceholder}
            />
          </div>
          <Button type="button" variant="outline" onClick={() => void collection.refresh()}>
            Refresh
          </Button>
        </Toolbar>

        <ResourceTable
          rows={collection.rows}
          columns={columns}
          loading={collection.loading}
          error={collection.error}
          page={collection.page}
          totalPages={collection.totalPages}
          sortKey={String(collection.sortKey)}
          sortDirection={collection.sortDirection}
          onPageChange={collection.setPage}
          onSortChange={(key) => collection.setSort(key as keyof DataEntity)}
          renderRowActions={(row) => (
            <div style={{ minWidth: 140 }}>
              <ActionMenu
                items={[
                  {
                    label: 'View',
                    icon: <Eye className="h-4 w-4" />,
                    onSelect: () => navigate(`/brands/${row.id}`),
                  },
                  {
                    label: 'Edit',
                    icon: <Edit3 className="h-4 w-4" />,
                    onSelect: () => navigate(`/brands/${row.id}/edit`),
                  },
                  {
                    label: 'Delete',
                    icon: <Edit3 className="h-4 w-4" />,
                    danger: true,
                    onSelect: async () => {
                      try {
                        await repository.delete('brands', [row.id!]);
                        toast.push('Brand deleted.', 'success');
                        await collection.refresh();
                      } catch {
                        toast.push('Unable to delete brand.', 'error');
                      }
                    },
                  },
                ]}
              />
            </div>
          )}
        />
      </PageContainer>
    </>
  );
}

function formatDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
