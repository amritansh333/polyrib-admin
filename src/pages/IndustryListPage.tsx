import React from 'react';
import { Building2, Plus, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import Toolbar from '../components/Toolbar';
import SearchBar from '../components/SearchBar';
import Button from '../components/Button';
import ResourceTable, { type ResourceTableColumn } from '../components/ResourceTable';
import ConfirmationDialog from '../components/ConfirmationDialog';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { useToast } from '../providers/ToastProvider';
import useResourceCollection from '../hooks/useResourceCollection';
import type { DataEntity } from '../types/admin';

const INDUSTRY_SORT_OPTIONS = [
  { label: 'Name A–Z', value: 'name:asc' },
  { label: 'Newest', value: 'createdAt:desc' },
  { label: 'Updated', value: 'updatedAt:desc' },
];

export default function IndustryListPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const collection = useResourceCollection('industries');
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await collection.remove([id]);
      toast.push('Industry deleted.', 'success');
      setDeleteId(null);
    } catch {
      toast.push('Unable to delete this industry.', 'error');
    }
  };

  const columns: ResourceTableColumn<DataEntity>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-charcoal">{row.name || 'Untitled industry'}</p>
          <p className="text-xs text-muted-foreground">{row.slug || '-'}</p>
        </div>
      ),
    },
    {
      key: 'slug',
      header: 'Slug',
      sortable: true,
      render: (row) => <span className="text-sm text-charcoal-light">{row.slug || '-'}</span>,
    },
    {
      key: 'description',
      header: 'Description',
      sortable: false,
      render: (row) => (
        <span className="line-clamp-2 text-sm text-charcoal-light">
          {row.description || 'No description provided.'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      sortable: true,
      render: (row) => formatDate(row.updatedAt),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title="Industries"
        description="Manage industry listings, SEO metadata, and public-market filters."
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/industries', label: 'Industries' },
        ]}
        action={
          <Button type="button" onClick={() => navigate('/industries/new')}>
            <Plus />
            New Industry
          </Button>
        }
        meta={
          <>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
              <Building2 className="h-3.5 w-3.5" />
              {collection.total} records
            </span>
          </>
        }
      />

      <PageContainer className="space-y-6">
        <Toolbar>
          <div className="grid min-w-0 flex-1 gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
            <SearchBar
              value={collection.query}
              onChange={(event) => collection.setQuery(event.target.value)}
              placeholder="Search industries by name or slug..."
            />
            <select
              aria-label="Sort industries"
              value={String(collection.sortKey)}
              onChange={(event) => collection.setSort(event.target.value as keyof DataEntity)}
              className="h-10 border border-border bg-surface px-3 text-sm font-medium text-charcoal outline-none transition-colors focus:border-primary"
            >
              {INDUSTRY_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value.split(':')[0]}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <Button type="button" variant="outline" onClick={() => void collection.refresh()}>
            <RefreshCw className={collection.loading ? 'animate-spin' : ''} />
            {collection.loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Toolbar>

        {collection.loading ? (
          <div className="grid gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <LoadingSkeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        ) : collection.error ? (
          <EmptyState title="Unable to load industries" description={collection.error} />
        ) : (
          <ResourceTable
            rows={collection.rows}
            columns={columns}
            page={collection.page}
            totalPages={collection.totalPages}
            sortKey={String(collection.sortKey)}
            sortDirection={collection.sortDirection}
            onPageChange={collection.setPage}
            onSortChange={(key) => collection.setSort(key as keyof DataEntity)}
            onView={(row) => navigate(`/industries/${row.id}`)}
            onEdit={(row) => navigate(`/industries/${row.id}/edit`)}
            onDelete={(ids) => setDeleteId(ids[0] ?? null)}
          />
        )}
      </PageContainer>

      <ConfirmationDialog
        open={Boolean(deleteId)}
        title="Delete industry"
        description="This industry is a shared catalog reference. Deleting it is blocked if products still reference it."
        confirmLabel={collection.actionLoading ? 'Deleting...' : 'Delete'}
        danger
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (!deleteId) return;
          void handleDelete(deleteId);
        }}
      />
    </>
  );
}

function formatDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
