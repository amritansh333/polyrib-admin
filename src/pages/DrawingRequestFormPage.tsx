import React from 'react';
import { CheckCircle2, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import Select from '../components/Select';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import useResourceItem from '../hooks/useResourceItem';
import { useRepository } from '../repositories/RepositoryProvider';
import { useToast } from '../providers/ToastProvider';
import type { DataEntity } from '../types/admin';

const DRAWING_REQUEST_STATUS_OPTIONS = [
  { label: 'New', value: 'NEW' },
  { label: 'Under review', value: 'UNDER_REVIEW' },
  { label: 'Quoted', value: 'QUOTED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Rejected', value: 'REJECTED' },
];

export default function DrawingRequestFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const repository = useRepository();
  const { item, loading, error } = useResourceItem('drawing-requests', id);
  const [status, setStatus] = React.useState<DataEntity['status']>('NEW' as DataEntity['status']);
  const [saving, setSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    if (item) {
      setStatus(item.status || 'NEW');
    }
  }, [item]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;
    setSaving(true);
    setSuccess(false);

    try {
      await repository.updateStatus('drawing-requests', id, status);
      setSuccess(true);
      toast.push('Drawing request status updated.', 'success');
      navigate(`/drawing-requests/${id}`);
    } catch {
      toast.push('Unable to save drawing request status.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Engineering Queue"
        title={item?.fullName ?? item?.name ?? 'Edit Drawing Request'}
        description="Update the status of a drawing request. Other request details are read-only because the backend only supports status updates."
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/drawing-requests', label: 'Drawing Requests' },
          { to: `/drawing-requests/${id}/edit`, label: 'Edit' },
        ]}
        meta={
          success ? (
            <StatusBadge tone="green">Saved</StatusBadge>
          ) : (
            <StatusBadge tone="blue">Draft Safe</StatusBadge>
          )
        }
      />

      <PageContainer>
        {loading && <LoadingSkeleton className="h-80 w-full" />}
        {error && <EmptyState title="Unable to load drawing request" description={error} />}
        {!loading && !error && !item && (
          <EmptyState
            title="Drawing request unavailable"
            description="The selected drawing request is unavailable for editing."
          />
        )}

        {item && (
          <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-3">
              <DashboardCard title="Request information" className="xl:col-span-2">
                <dl className="grid gap-px overflow-hidden border border-divider bg-divider sm:grid-cols-2">
                  <DetailRow label="Full Name" value={item.fullName || item.name || '—'} />
                  <DetailRow label="Company" value={item.company || '—'} />
                  <DetailRow label="Email" value={item.email || '—'} />
                  <DetailRow label="Phone" value={item.phone || '—'} />
                  <DetailRow
                    label="Notes"
                    value={
                      <p className="whitespace-pre-wrap text-sm leading-6 text-charcoal-light">
                        {item.notes || 'No notes were submitted.'}
                      </p>
                    }
                  />
                </dl>
              </DashboardCard>

              <DashboardCard title="Status update">
                <div className="space-y-6">
                  <Select
                    label="Status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value as DataEntity['status'])}
                    options={DRAWING_REQUEST_STATUS_OPTIONS}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <DetailRow label="Created At" value={formatDate(item.createdAt)} />
                    <DetailRow label="Updated At" value={formatDate(item.updatedAt)} />
                  </div>
                </div>
              </DashboardCard>
            </div>

            {success && (
              <div className="flex items-center gap-2 border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Drawing request status saved successfully.
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-divider pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/drawing-requests/${id}`)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                <Save />
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

function formatDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
