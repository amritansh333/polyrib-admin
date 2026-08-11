import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/Button';
import Select from '../components/Select';
import StatusBadge from '../components/StatusBadge';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import useResourceItem from '../hooks/useResourceItem';
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

export default function EnquiryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const repository = useRepository();
  const { item, loading, error } = useResourceItem('enquiries', id);
  const [record, setRecord] = React.useState<DataEntity | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState<DataEntity['status']>('New');
  const [statusSaving, setStatusSaving] = React.useState(false);

  const displayItem = record ?? item;

  React.useEffect(() => {
    if (item) {
      setRecord(item);
      setSelectedStatus(item.status ?? 'New');
    }
  }, [item]);

  const handleUpdateStatus = async () => {
    if (!displayItem) return;
    setStatusSaving(true);

    try {
      const updated = await repository.updateStatus(
        'enquiries',
        displayItem.id,
        selectedStatus as string
      );
      setRecord(updated);
      toast.push('Enquiry status updated.', 'success');
    } catch {
      toast.push('Unable to update enquiry status.', 'error');
    } finally {
      setStatusSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Sales Queue"
        title={displayItem?.name ?? 'Enquiry'}
        description={displayItem?.description ?? 'Enquiry details from the website.'}
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/enquiries', label: 'Enquiries' },
          { to: `/enquiries/${id}`, label: id ?? 'Record' },
        ]}
        action={
          displayItem && (
            <Button type="button" onClick={() => navigate(`/enquiries/${displayItem.id}/edit`)}>
              Edit
            </Button>
          )
        }
        meta={
          displayItem && (
            <StatusBadge tone={statusTone(displayItem.status)}>{displayItem.status}</StatusBadge>
          )
        }
      />

      <PageContainer>
        {loading && <LoadingSkeleton className="h-80 w-full" />}
        {error && <EmptyState title="Unable to load record" description={error} />}
        {!loading && !displayItem && (
          <EmptyState title="Record not found" description="The requested record is unavailable." />
        )}

        {displayItem && (
          <div className="grid gap-6 xl:grid-cols-3">
            <DashboardCard title="Contact Information" className="xl:col-span-2">
              <dl className="grid gap-px overflow-hidden border border-divider bg-divider sm:grid-cols-2">
                <DetailRow
                  label="Full Name"
                  value={displayItem.fullName || displayItem.name || '—'}
                />
                <DetailRow label="Company" value={displayItem.company || '—'} />
                <DetailRow label="Email" value={displayItem.email || '—'} />
                <DetailRow label="Phone" value={displayItem.phone || '—'} />
              </dl>
            </DashboardCard>

            <DashboardCard title="Enquiry">
              <div className="space-y-4">
                <div>
                  <p className="section-label">Product</p>
                  <p className="mt-1 font-semibold text-charcoal">{displayItem.product || '—'}</p>
                </div>
                <div>
                  <p className="section-label">Requirement</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-charcoal-light">
                    {displayItem.requirement || '—'}
                  </p>
                </div>
                <div>
                  <p className="section-label">Notes</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-charcoal-light">
                    {displayItem.notes || '—'}
                  </p>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="Status">
              <dl className="grid gap-px overflow-hidden border border-divider bg-divider sm:grid-cols-1">
                <DetailRow
                  label="Current Status"
                  value={
                    <StatusBadge tone={statusTone(displayItem.status)}>
                      {displayItem.status}
                    </StatusBadge>
                  }
                />
                <DetailRow label="Created At" value={formatDate(displayItem.createdAt)} />
                <DetailRow label="Updated At" value={formatDate(displayItem.updatedAt)} />
              </dl>

              <div className="mt-4 space-y-4">
                <Select
                  label="Update Status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as DataEntity['status'])}
                  options={ENQUIRY_STATUS_OPTIONS}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedStatus(displayItem.status ?? 'New')}
                  >
                    Reset
                  </Button>
                  <Button
                    type="button"
                    onClick={handleUpdateStatus}
                    disabled={statusSaving || selectedStatus === displayItem.status}
                  >
                    {statusSaving ? 'Saving...' : 'Save status'}
                  </Button>
                </div>
              </div>
            </DashboardCard>
          </div>
        )}
      </PageContainer>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-surface-raised p-4">
      <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-charcoal">{value}</dd>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
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
