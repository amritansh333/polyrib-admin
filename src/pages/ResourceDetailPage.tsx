import { Edit } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import useResourceItem from '../hooks/useResourceItem';
import type { DataEntity, ResourceConfig } from '../types/admin';

export default function ResourceDetailPage({ config }: { config: ResourceConfig }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { item, loading, error } = useResourceItem(config.key, id);

  return (
    <>
      <PageHeader
        eyebrow={config.eyebrow}
        title={item?.name ?? config.title}
        description={item?.description ?? config.description}
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: config.basePath, label: config.title },
          { to: `${config.basePath}/${id}`, label: id ?? 'Record' },
        ]}
        action={
          item && (
            <Button type="button" onClick={() => navigate(`${config.basePath}/${item.id}/edit`)}>
              <Edit />
              Edit
            </Button>
          )
        }
        meta={item && <StatusBadge tone={statusTone(item.status)}>{item.status}</StatusBadge>}
      />

      <PageContainer>
        {loading && <LoadingSkeleton className="h-80 w-full" />}
        {error && <EmptyState title="Unable to load record" description={error} />}
        {!loading && !item && (
          <EmptyState title="Record not found" description="The requested record is unavailable." />
        )}
        {item && (
          <div className="grid gap-6 xl:grid-cols-3">
            <DashboardCard title="Record details" className="xl:col-span-2">
              <dl className="grid gap-px overflow-hidden border border-divider bg-divider sm:grid-cols-2">
                <DetailRow label="ID" value={item.id} />
                <DetailRow label="Name" value={item.name || '—'} />
                <DetailRow label="Company" value={item.company || '—'} />
                <DetailRow label="Email" value={item.email || '—'} />
                <DetailRow label="Phone" value={item.phone || '—'} />
                <DetailRow
                  label="Status"
                  value={<StatusBadge tone={statusTone(item.status)}>{item.status}</StatusBadge>}
                />
                <DetailRow label="Created at" value={formatDate(item.createdAt)} />
                <DetailRow label="Updated at" value={formatDate(item.updatedAt)} />
              </dl>
            </DashboardCard>

            <DashboardCard title="Additional">
              <div className="space-y-4">
                <div>
                  <p className="section-label">Description</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-charcoal-light">
                    {item.description || item.requirement || '—'}
                  </p>
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
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function statusTone(status: DataEntity['status']) {
  if (status === 'Published' || status === 'Active' || status === 'Closed' || status === 'Resolved')
    return 'green';
  if (status === 'Review' || status === 'Pending' || status === 'Draft' || status === 'In Progress')
    return 'amber';
  return 'neutral';
}
