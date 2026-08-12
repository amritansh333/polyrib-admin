import React from 'react';
import { Edit3, Eye, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import Toolbar from '../components/Toolbar';
import SearchBar from '../components/SearchBar';
import Select from '../components/Select';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import ActionMenu from '../components/ActionMenu';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import { useRepository } from '../repositories/RepositoryProvider';
import useResourceCollection from '../hooks/useResourceCollection';
import { useToast } from '../providers/ToastProvider';
import { resources } from '../services/mockData';
import type { DataEntity } from '../types/admin';

const DRAWING_REQUEST_STATUS_OPTIONS = [
  { label: 'New', value: 'NEW' },
  { label: 'Under review', value: 'UNDER_REVIEW' },
  { label: 'Quoted', value: 'QUOTED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Rejected', value: 'REJECTED' },
];

export default function DrawingRequestListPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const repository = useRepository();
  const collection = useResourceCollection('drawing-requests');
  const config = resources.find((item) => item.key === 'drawing-requests');
  const [selectedItem, setSelectedItem] = React.useState<DataEntity | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState<DataEntity['status']>(
    'NEW' as DataEntity['status']
  );
  const [statusModalOpen, setStatusModalOpen] = React.useState(false);
  const [statusSaving, setStatusSaving] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const openStatusDialog = React.useCallback((row: DataEntity) => {
    setSelectedItem(row);
    setSelectedStatus(row.status ?? 'NEW');
    setStatusModalOpen(true);
  }, []);

  const closeStatusDialog = React.useCallback(() => {
    setStatusModalOpen(false);
    setSelectedItem(null);
  }, []);

  const handleStatusUpdate = React.useCallback(async () => {
    if (!selectedItem) return;

    setStatusSaving(true);
    try {
      await repository.updateStatus('drawing-requests', selectedItem.id, selectedStatus);
      toast.push('Drawing request status updated.', 'success');
      closeStatusDialog();
      await collection.refresh();
    } catch {
      toast.push('Unable to update drawing request status. Retry from the current page.', 'error');
    } finally {
      setStatusSaving(false);
    }
  }, [collection, closeStatusDialog, repository, selectedItem, selectedStatus, toast]);

  if (!config) {
    return (
      <PageContainer>
        <EmptyState
          title="Drawing Requests unavailable"
          description="The requested admin section is missing configuration."
        />
      </PageContainer>
    );
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
          <Button type="button" variant="outline" onClick={() => void collection.refresh()}>
            <RefreshCw />
            {collection.loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        }
        meta={
          <>
            <StatusBadge tone="blue">{collection.total} records</StatusBadge>
            <StatusBadge tone="green">API Repository</StatusBadge>
          </>
        }
      />

      <PageContainer className="space-y-6">
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
              aria-label="Drawing request status filter"
            />
          </div>
          <Button type="button" variant="outline" onClick={() => void collection.refresh()}>
            <RefreshCw />
            Refresh
          </Button>
        </Toolbar>

        {collection.loading && (
          <div className="grid gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <LoadingSkeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        )}

        {collection.error && !collection.loading && (
          <EmptyState title="Unable to load drawing requests" description={collection.error} />
        )}

        {!collection.loading && !collection.error && collection.rows.length === 0 && (
          <EmptyState
            title="No drawing requests found"
            description="Adjust the search or status filter to display matching records."
          />
        )}

        {!collection.loading && !collection.error && collection.rows.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-divider bg-surface-raised shadow-sm">
            <table className="min-w-full border-collapse text-left">
              <thead className="border-b border-divider bg-surface-subtle">
                <tr>
                  <th className="w-12 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <input
                      type="checkbox"
                      aria-label="Select all requests"
                      checked={
                        collection.rows.length > 0 && selectedIds.length === collection.rows.length
                      }
                      onChange={() => {
                        if (selectedIds.length === collection.rows.length) {
                          setSelectedIds([]);
                        } else {
                          setSelectedIds(collection.rows.map((row) => row.id));
                        }
                      }}
                      className="h-4 w-4 accent-[hsl(var(--primary))]"
                    />
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Full Name
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Company
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Email
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Files
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Created At
                  </th>
                  <th className="w-32 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider bg-white">
                {collection.rows.map((row) => {
                  const rowId = row.id;
                  const isSelected = selectedIds.includes(rowId);
                  return (
                    <tr key={rowId} className="hover:bg-surface-subtle">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          aria-label={`Select ${row.fullName ?? row.name ?? row.id}`}
                          checked={isSelected}
                          onChange={() => {
                            setSelectedIds((current) =>
                              current.includes(rowId)
                                ? current.filter((id) => id !== rowId)
                                : [...current, rowId]
                            );
                          }}
                          className="h-4 w-4 accent-[hsl(var(--primary))]"
                        />
                      </td>
                      <td className="max-w-[16rem] px-4 py-3 text-sm text-charcoal">
                        {row.fullName || row.name || '—'}
                      </td>
                      <td className="max-w-[16rem] px-4 py-3 text-sm text-charcoal-light truncate">
                        {row.company || '—'}
                      </td>
                      <td className="max-w-[18rem] px-4 py-3 text-sm text-charcoal-light truncate">
                        {row.email || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-charcoal-light">{row.phone || '—'}</td>
                      <td className="px-4 py-3">
                        <StatusBadge tone={statusTone(row.status)}>{row.status}</StatusBadge>
                      </td>
                      <td className="px-4 py-3 text-sm text-charcoal-light">
                        {row.files?.length ?? 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-charcoal-light">
                        {formatDate(row.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <ActionMenu
                          items={[
                            {
                              label: 'View',
                              icon: <Eye className="h-4 w-4" />,
                              onSelect: () => navigate(`${config.basePath}/${row.id}`),
                            },
                            {
                              label: 'Edit',
                              icon: <Edit3 className="h-4 w-4" />,
                              onSelect: () => navigate(`${config.basePath}/${row.id}/edit`),
                            },
                            {
                              label: 'Update Status',
                              icon: <Edit3 className="h-4 w-4" />,
                              onSelect: () => openStatusDialog(row),
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!collection.loading && !collection.error && collection.rows.length > 0 && (
          <Pagination
            page={collection.page}
            totalPages={collection.totalPages}
            onPageChange={collection.setPage}
          />
        )}
      </PageContainer>

      <Modal
        open={statusModalOpen}
        title="Update drawing request status"
        description={
          selectedItem
            ? `Change status for ${selectedItem.fullName ?? selectedItem.name}.`
            : 'Select a status and save the change.'
        }
        onClose={closeStatusDialog}
        footer={
          <>
            <Button type="button" variant="outline" onClick={closeStatusDialog}>
              Cancel
            </Button>
            <Button type="button" onClick={handleStatusUpdate} disabled={statusSaving}>
              {statusSaving ? 'Saving...' : 'Save status'}
            </Button>
          </>
        }
      >
        <div className="grid gap-4">
          <Select
            label="Status"
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value as DataEntity['status'])}
            options={DRAWING_REQUEST_STATUS_OPTIONS}
          />
        </div>
      </Modal>
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
  if (status === 'COMPLETED' || status === 'Resolved' || status === 'Closed') return 'green';
  if (status === 'UNDER_REVIEW' || status === 'QUOTED' || status === 'In Progress') return 'amber';
  if (status === 'REJECTED' || status === 'Draft') return 'neutral';
  return 'blue';
}
