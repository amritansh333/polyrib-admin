import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/Button';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import Select from '../components/Select';
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

export default function EnquiryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const repository = useRepository();
  const { item, loading, error } = useResourceItem('enquiries', id);

  const [selectedStatus, setSelectedStatus] = React.useState<DataEntity['status']>('New');
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (item) setSelectedStatus(item.status ?? 'New');
  }, [item]);

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    setSaving(true);
    try {
      await repository.updateStatus('enquiries', item.id, selectedStatus as string);
      toast.push('Status updated', 'success');
      navigate('/enquiries');
    } catch {
      toast.push('Unable to update status', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Sales Queue"
        title={item?.name ?? 'Enquiry'}
        description="Edit enquiry status (full create/update not supported by backend)."
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/enquiries', label: 'Enquiries' },
          { to: id ? `/enquiries/${id}/edit` : '/enquiries', label: id ? 'Edit' : 'New' },
        ]}
      />

      <PageContainer>
        {loading && <LoadingSkeleton className="h-80 w-full" />}
        {error && <EmptyState title="Unable to load record" description={error} />}
        {!loading && !item && (
          <EmptyState title="Record not found" description="The selected enquiry is unavailable." />
        )}

        {item && (
          <form onSubmit={handleSaveStatus} className="space-y-6">
            <DashboardCard title="Contact Information">
              <dl className="grid gap-px overflow-hidden border border-divider bg-divider sm:grid-cols-2">
                <DetailRow label="Full Name" value={item.fullName || item.name || '—'} />
                <DetailRow label="Company" value={item.company || '—'} />
                <DetailRow label="Email" value={item.email || '—'} />
                <DetailRow label="Phone" value={item.phone || '—'} />
              </dl>
            </DashboardCard>

            <DashboardCard title="Enquiry">
              <div className="space-y-4">
                <div>
                  <p className="section-label">Product</p>
                  <p className="mt-1 font-semibold text-charcoal">{item.product || '—'}</p>
                </div>
                <div>
                  <p className="section-label">Requirement</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-charcoal-light">
                    {item.requirement || '—'}
                  </p>
                </div>
                <div>
                  <p className="section-label">Notes</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-charcoal-light">
                    {item.notes || '—'}
                  </p>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="Status">
              <div className="grid gap-4">
                <Select
                  label="Status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as DataEntity['status'])}
                  options={ENQUIRY_STATUS_OPTIONS}
                />
              </div>
            </DashboardCard>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate('/enquiries')}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save status'}
              </Button>
            </div>
          </form>
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
