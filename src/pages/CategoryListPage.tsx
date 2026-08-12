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
import type { DataEntity } from '../types/admin';

export default function CategoryListPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const repository = useRepository();
  const collection = useResourceCollection('categories');
  const config = resources.find((item) => item.key === 'categories');

  const columns: ResourceTableColumn<DataEntity>[] = [
    {
      key: 'name',
      header: 'Category Name',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-charcoal">{row.name}</p>
        </div>
      ),
    },
    { key: 'slug', header: 'Slug', sortable: true, render: (row) => row.slug ?? '—' },
    { key: 'order', header: 'Order', sortable: true, render: (row) => String(row.order ?? '—') },
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
          <Button type="button" onClick={() => navigate('/categories/new')}>
            <Plus />
            New Category
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
                    onSelect: () => navigate(`/categories/${row.id}`),
                  },
                  {
                    label: 'Edit',
                    icon: <Edit3 className="h-4 w-4" />,
                    onSelect: () => navigate(`/categories/${row.id}/edit`),
                  },
                  {
                    label: 'Delete',
                    icon: <Edit3 className="h-4 w-4" />,
                    danger: true,
                    onSelect: async () => {
                      try {
                        await repository.delete('categories', [row.id!]);
                        toast.push('Category deleted.', 'success');
                        await collection.refresh();
                      } catch {
                        toast.push('Unable to delete category.', 'error');
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
