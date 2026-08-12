import React from 'react';
import { Eye, Edit3, Plus } from 'lucide-react';
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
import { resolveAdminAssetUrl } from '../lib/assetUrl';
import type { DataEntity } from '../types/admin';

export default function SubcategoryListPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const repository = useRepository();
  const collection = useResourceCollection('subcategories');
  const config = resources.find((item) => item.key === 'subcategories');

  const columns: ResourceTableColumn<DataEntity>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-charcoal">{row.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">{row.id}</p>
        </div>
      ),
    },
    { key: 'slug', header: 'Slug', sortable: true, render: (row) => row.slug ?? '—' },
    { key: 'experience', header: 'Experience', sortable: true, render: (row) => row.experience ?? '—' },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (row) => row.categoryName ?? (row.category ? String((row as any).category) : '—'),
    },
    {
      key: 'image',
      header: 'Image',
      render: (row) => (
        row.image ? (
          // eslint-disable-next-line jsx-a11y/img-redundant-alt
          <img
            src={resolveAdminAssetUrl(row.image)}
            alt={row.name ?? 'Image'}
            className="h-12 w-20 rounded object-cover"
          />
        ) : (
          <div className="h-12 w-20 rounded border border-divider bg-surface-subtle text-xs text-center text-charcoal-light flex items-center justify-center">
            No image
          </div>
        )
      ),
    },
    { key: 'order', header: 'Order', sortable: true, render: (row) => String((row as any).order ?? '—') },
  ];

  if (!config) return null;

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
          <Button type="button" onClick={() => navigate('/subcategories/new')}>
            <Plus />
            New Subcategory
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
                    onSelect: () => navigate(`/subcategories/${row.id}`),
                  },
                  {
                    label: 'Edit',
                    icon: <Edit3 className="h-4 w-4" />,
                    onSelect: () => navigate(`/subcategories/${row.id}/edit`),
                  },
                  {
                    label: 'Delete',
                    icon: <Edit3 className="h-4 w-4" />,
                    danger: true,
                    onSelect: async () => {
                      try {
                        await repository.delete('subcategories', [row.id!]);
                        toast.push('Subcategory deleted.', 'success');
                        await collection.refresh();
                      } catch {
                        toast.push('Unable to delete subcategory.', 'error');
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
