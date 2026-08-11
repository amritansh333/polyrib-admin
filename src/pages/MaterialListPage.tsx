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
import type { DataEntity } from '../types/admin';

export default function MaterialListPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const repository = useRepository();
  const collection = useResourceCollection('materials');

  const columns: ResourceTableColumn<DataEntity>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-charcoal">{row.name}</p>
        </div>
      ),
    },
    { key: 'slug', header: 'Slug', sortable: true, render: (row) => row.slug ?? '—' },
    {
      key: 'description',
      header: 'Description',
      sortable: false,
      className: 'max-w-[32rem] min-w-[18rem]',
      render: (row) => (
        <div
          className="max-w-[32rem] truncate text-sm text-charcoal-light"
          title={row.description || undefined}
        >
          {row.description ?? '—'}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Technical Library"
        title="Materials"
        description="Maintain thermoplastic material families, grades, and usage guidance."
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/materials', label: 'Materials' },
        ]}
        action={
          <Button type="button" onClick={() => navigate('/materials/new')}>
            <Plus />
            New Material
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
              placeholder="Search materials and grades..."
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
                    onSelect: () => navigate(`/materials/${row.id}`),
                  },
                  {
                    label: 'Edit',
                    icon: <Edit3 className="h-4 w-4" />,
                    onSelect: () => navigate(`/materials/${row.id}/edit`),
                  },
                  {
                    label: 'Delete',
                    icon: <Edit3 className="h-4 w-4" />,
                    danger: true,
                    onSelect: async () => {
                      try {
                        await repository.delete('materials', [row.id!]);
                        toast.push('Material deleted.', 'success');
                        await collection.refresh();
                      } catch {
                        toast.push('Unable to delete material.', 'error');
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
