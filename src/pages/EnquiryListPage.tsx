import React from 'react';
import { Eye, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import Toolbar from '../components/Toolbar';
import SearchBar from '../components/SearchBar';
import Select from '../components/Select';
import Button from '../components/Button';
import ResourceTable, { type ResourceTableColumn } from '../components/ResourceTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import ActionMenu from '../components/ActionMenu';
import useResourceCollection from '../hooks/useResourceCollection';
import { useRepository } from '../repositories/RepositoryProvider';
import { useToast } from '../providers/ToastProvider';
import type { DataEntity } from '../types/admin';

const ENQUIRY_STATUS_OPTIONS = [
  { label: 'New', value: 'New' },
  { label: 'Contacted', value: 'Contacted' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Resolved', value: 'Resolved' },
  { label: 'Closed', value: 'Closed' },
];

export default function EnquiryListPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const repository = useRepository();
  const collection = useResourceCollection('enquiries');

  const [statusModalOpen, setStatusModalOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<DataEntity | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState<DataEntity['status']>('New');
  const [statusSaving, setStatusSaving] = React.useState(false);

  const openStatusDialog = React.useCallback((row: DataEntity) => {
    setSelectedItem(row);
    setSelectedStatus(row.status ?? 'New');
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
      await repository.updateStatus('enquiries', selectedItem.id, selectedStatus as string);
      toast.push('Enquiry status updated.', 'success');
      closeStatusDialog();
      await collection.refresh();
    } catch {
      toast.push('Unable to update enquiry status. Retry from the current page.', 'error');
    } finally {
      setStatusSaving(false);
    }
  }, [collection, closeStatusDialog, repository, selectedItem, selectedStatus, toast]);

  const columns: ResourceTableColumn<DataEntity>[] = [
    {
      key: 'fullName',
      header: 'Name',
      sortable: true,
      render: (row) => (
        <div className="min-w-0">
          <p className="font-semibold text-charcoal">{row.fullName || row.name || '—'}</p>
        </div>
      ),
    },
    {
      key: 'company',
      header: 'Company',
      sortable: true,
      className: 'max-w-[16rem]',
      render: (row) => (
        <div className="max-w-[16rem] truncate text-sm text-charcoal-light">
          {row.company || '—'}
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      className: 'max-w-[18rem]',
      render: (row) => (
        <div className="max-w-[18rem] truncate text-sm text-charcoal-light">{row.email || '—'}</div>
      ),
    },
    { key: 'phone', header: 'Phone', sortable: true, render: (row) => row.phone || '—' },
    {
      key: 'product',
      header: 'Product',
      sortable: true,
      className: 'max-w-[20rem]',
      render: (row) => (
        <div className="max-w-[20rem] truncate text-sm text-charcoal-light">
          {row.product || '—'}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Sales Queue"
        title="Enquiries"
        description="Customer contact enquiries submitted via the website contact and quote forms."
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/enquiries', label: 'Enquiries' },
        ]}
        action={
          <>
            <Button type="button" variant="outline" onClick={() => void collection.refresh()}>
              Refresh
            </Button>
          </>
        }
        meta={<StatusBadge tone="blue">{collection.total} records</StatusBadge>}
      />

      <PageContainer className="space-y-6">
        <Toolbar>
          <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
            <SearchBar
              value={collection.query}
              onChange={(e) => collection.setQuery(e.target.value)}
              placeholder="Search enquiries..."
            />
            <Select
              value={collection.status}
              onChange={(e) => collection.setStatus(e.target.value)}
              options={ENQUIRY_STATUS_OPTIONS}
              aria-label="Enquiries filter"
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
                    onSelect: () => navigate(`/enquiries/${row.id}`),
                  },
                  {
                    label: 'Edit Status',
                    icon: <Edit3 className="h-4 w-4" />,
                    onSelect: () => openStatusDialog(row),
                  },
                ]}
              />
            </div>
          )}
        />

        <Modal
          open={statusModalOpen}
          title="Update enquiry status"
          description={
            selectedItem
              ? `Change status for ${selectedItem.name}.`
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
              onChange={(e) => setSelectedStatus(e.target.value as DataEntity['status'])}
              options={ENQUIRY_STATUS_OPTIONS}
            />
          </div>
        </Modal>
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

function statusTone(status?: DataEntity['status']) {
  if (!status) return 'blue';
  if (status === 'Published' || status === 'Active' || status === 'Closed' || status === 'Resolved')
    return 'green';
  if (status === 'Review' || status === 'Pending' || status === 'Draft' || status === 'In Progress')
    return 'amber';
  if (status === 'Archived') return 'neutral';
  return 'blue';
}
