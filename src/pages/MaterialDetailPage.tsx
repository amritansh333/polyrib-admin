import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/Button';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import useResourceItem from '../hooks/useResourceItem';
import type { DataEntity } from '../types/admin';

export default function MaterialDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { item, loading, error } = useResourceItem('materials', id);

  return (
    <>
      <PageHeader
        eyebrow="Technical Library"
        title={item?.name ?? 'Material'}
        description={item?.description ?? 'Material detail from backend.'}
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/materials', label: 'Materials' },
          { to: `/materials/${id}`, label: id ?? 'Record' },
        ]}
        action={
          item && (
            <Button type="button" onClick={() => navigate(`/materials/${item.id}/edit`)}>
              Edit
            </Button>
          )
        }
      />

      <PageContainer>
        {loading && <LoadingSkeleton className="h-80 w-full" />}
        {error && <EmptyState title="Unable to load record" description={error} />}
        {!loading && !item && (
          <EmptyState title="Record not found" description="The requested record is unavailable." />
        )}

        {item && (
          <div className="grid gap-6 xl:grid-cols-3">
            <DashboardCard title="Material" className="xl:col-span-2">
              <div className="space-y-4">
                <div>
                  <p className="section-label">Name</p>
                  <p className="mt-1 font-semibold text-charcoal">{item.name}</p>
                </div>
                <div>
                  <p className="section-label">Slug</p>
                  <p className="mt-1 text-sm text-charcoal-light">{item.slug}</p>
                </div>
                <div>
                  <p className="section-label">Description</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-charcoal-light">
                    {item.description}
                  </p>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="Metadata">
              <dl className="grid gap-px overflow-hidden border border-divider bg-divider sm:grid-cols-1">
                <DetailRow label="Created At" value={formatDate(item.createdAt)} />
                <DetailRow label="Updated At" value={formatDate(item.updatedAt)} />
              </dl>
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
