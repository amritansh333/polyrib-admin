import React from 'react';
import { Download, Plus, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import Toolbar from '../components/Toolbar';
import SearchBar from '../components/SearchBar';
import Select from '../components/Select';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import ResourceTable, { type ResourceTableColumn } from '../components/ResourceTable';
import MetricCard from '../components/MetricCard';
import ConfirmationDialog from '../components/ConfirmationDialog';
import useResourceCollection from '../hooks/useResourceCollection';
import { useRepository } from '../repositories/RepositoryProvider';
import { useToast } from '../providers/ToastProvider';
import { downloadCsv } from '../utils/csv';
import type { DataEntity, ResourceConfig } from '../types/admin';

export default function ResourceListPage({ config }: { config: ResourceConfig }) {
  const navigate = useNavigate();
  const toast = useToast();
  const repository = useRepository();
  const collection = useResourceCollection(config.key);
  const [deleteIds, setDeleteIds] = React.useState<string[]>([]);

  const runAction = async (action: () => Promise<void>, success: string) => {
    try {
      await action();
      toast.push(success, 'success');
    } catch {
      toast.push('Action failed. Retry from the current page.', 'error');
    }
  };

  const columns: ResourceTableColumn<DataEntity>[] = [
    {
      key: 'name',
      header: config.key === 'users' ? 'Name / Company' : 'Record',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-charcoal">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.id}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Type',
      sortable: true,
      render: (row) => row.category ?? row.role ?? row.source ?? 'CMS',
    },
    {
      key: 'owner',
      header: 'Owner',
      sortable: true,
      render: (row) => row.source ?? row.owner,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => <StatusBadge tone={statusTone(row.status)}>{row.status}</StatusBadge>,
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      sortable: true,
      render: (row) => row.updatedAt,
    },
  ];

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
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => downloadCsv(`${config.key}.csv`, collection.rows)}
            >
              <Download />
              Export
            </Button>
            {config.createPath && (
              <Button type="button" onClick={() => navigate(config.createPath!)}>
                <Plus />
                {config.newLabel}
              </Button>
            )}
          </>
        }
        meta={
          <>
            <StatusBadge tone="blue">{collection.total} records</StatusBadge>
            <StatusBadge tone={repository.source === 'api' ? 'green' : 'neutral'}>
              {repository.source === 'api' ? 'API Repository' : 'Mock Repository'}
            </StatusBadge>
          </>
        }
      />

      <PageContainer className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <MetricCard
            title="Total Records"
            value={String(collection.total)}
            description={
              repository.source === 'api'
                ? 'Loaded from backend API.'
                : 'Loaded from mock repository.'
            }
          />
          <MetricCard
            title="Published / Active"
            value={String(
              collection.rows.filter((row) => ['Published', 'Active'].includes(row.status)).length
            )}
            description="Records visible or operational."
          />
          <MetricCard
            title="Needs Review"
            value={String(
              collection.rows.filter((row) => ['Review', 'Pending', 'Draft'].includes(row.status))
                .length
            )}
            description="Items awaiting internal action."
          />
        </div>

        <Toolbar>
          <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
            <SearchBar
              value={collection.query}
              onChange={(event) => collection.setQuery(event.target.value)}
              placeholder={config.searchPlaceholder}
            />
            <Select
              value={collection.status}
              onChange={(event) => collection.setStatus(event.target.value)}
              options={config.filters}
              aria-label={`${config.title} filter`}
            />
          </div>
          <Button type="button" variant="outline" onClick={() => void collection.refresh()}>
            <RefreshCw />
            {collection.loading ? 'Refreshing...' : 'Refresh'}
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
          onView={(row) => navigate(`${config.basePath}/${row.id}`)}
          onEdit={(row) => navigate(`${config.basePath}/${row.id}/edit`)}
          onDelete={setDeleteIds}
          onDuplicate={(row) =>
            void runAction(() => collection.duplicate(row.id), `${row.name} duplicated.`)
          }
          onArchive={(ids) =>
            void runAction(() => collection.archive(ids), `${ids.length} record archived.`)
          }
          onRestore={(ids) =>
            void runAction(() => collection.restore(ids), `${ids.length} record restored.`)
          }
        />

        <ConfirmationDialog
          open={deleteIds.length > 0}
          title="Delete record"
          description={
            repository.source === 'api'
              ? 'This removes the selected record from the backend admin repository.'
              : 'This removes the selected mock record from the local admin repository.'
          }
          confirmLabel={collection.actionLoading ? 'Deleting...' : 'Delete'}
          danger
          onClose={() => setDeleteIds([])}
          onConfirm={() =>
            void runAction(async () => {
              if (deleteIds.length !== 1) {
                throw new Error(
                  'Bulk delete is not allowed for this resource. Select a single record to delete.'
                );
              }
              await collection.remove(deleteIds);
            }, `${deleteIds.length} record deleted.`)
          }
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

function statusTone(status: DataEntity['status']) {
  if (status === 'Published' || status === 'Active' || status === 'Closed' || status === 'Resolved')
    return 'green';
  if (status === 'Review' || status === 'Pending' || status === 'Draft' || status === 'In Progress')
    return 'amber';
  if (status === 'Archived') return 'neutral';
  return 'blue';
}
