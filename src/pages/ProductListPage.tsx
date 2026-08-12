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
import { resources } from '../services/mockData';
import { resolveAdminAssetUrl } from '../lib/assetUrl';
import type { DataEntity } from '../types/admin';

export default function ProductListPage() {
  const navigate = useNavigate();
  const collection = useResourceCollection('products');
  const repository = useRepository();
  const config = resources.find((item) => item.key === 'products');

  const columns: ResourceTableColumn<DataEntity>[] = [
    {
      key: 'image',
      header: 'Thumbnail',
      render: (row) =>
        row.image ? (
          <img
            src={resolveAdminAssetUrl(row.image)}
            alt={row.name ?? 'Image'}
            className="h-12 w-20 rounded object-cover"
          />
        ) : (
          <div className="h-12 w-20 rounded border border-divider bg-surface-subtle text-xs text-center text-charcoal-light flex items-center justify-center">
            No image
          </div>
        ),
    },
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-charcoal">{row.name || 'Untitled'}</p>
          <p className="mt-1 text-xs text-muted-foreground">{row.id}</p>
        </div>
      ),
    },
    { key: 'slug', header: 'Slug', sortable: true, render: (row) => row.slug ?? '—' },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (row) => renderReference(row.category),
    },
    {
      key: 'subCategory',
      header: 'Subcategory',
      sortable: true,
      render: (row) => renderReference(row.subCategory),
    },
    { key: 'brand', header: 'Brand', sortable: true, render: (row) => renderReference(row.brand) },
    {
      key: 'material',
      header: 'Material',
      sortable: true,
      render: (row) => row.material || '—',
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => row.status || (row.isVisible === false ? 'Draft' : 'Published'),
    },
    {
      key: 'order',
      header: 'Order',
      sortable: true,
      render: (row) => (row.order !== undefined ? String(row.order) : '—'),
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      render: (row) => formatDate(row.createdAt),
    },
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
          <Button type="button" onClick={() => navigate('/products/new')}>
            <Plus />
            New Product
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
                    onSelect: () => navigate(`/products/${row.id}`),
                  },
                  {
                    label: 'Edit',
                    icon: <Edit3 className="h-4 w-4" />,
                    onSelect: () => navigate(`/products/${row.id}/edit`),
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

function renderReference(value: unknown) {
  if (!value) return '—';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    const ref = value as { name?: string; slug?: string; id?: string; _id?: string };
    return ref.name ?? ref.slug ?? String(ref.id ?? ref._id ?? '—');
  }
  return String(value);
}

function formatDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
