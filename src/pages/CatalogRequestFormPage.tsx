import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import useResourceItem from '../hooks/useResourceItem';
import type { DataEntity } from '../types/admin';

interface CatalogRequestFormPageProps {
  mode: 'create' | 'edit';
}

export default function CatalogRequestFormPage({ mode }: CatalogRequestFormPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { item, loading, error } = useResourceItem('catalogrequests', mode === 'edit' ? id : undefined);

  const title = mode === 'create' ? 'Create Catalog Request' : 'Edit Catalog Request';
  const description =
    mode === 'create'
      ? 'Catalog requests are submitted through the public website and cannot be created here.'
      : 'Catalog requests are read-only submissions. Edits are not supported by the backend API.';

  return (
    <>
      <PageHeader
        eyebrow="Sales Requests"
        title={title}
        description={description}
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/catalogrequests', label: 'Catalog Requests' },
          { to: mode === 'create' ? '/catalogrequests/new' : `/catalogrequests/${id}/edit`, label: mode === 'create' ? 'New' : 'Edit' },
        ]}
      />

      <PageContainer>
        {mode === 'create' && (
          <DashboardCard title="Create not available" description="Public submissions are the source of truth.">
            <div className="grid gap-4">
              <p className="text-sm leading-6 text-charcoal-light">
                Catalog requests can only be created by customers from the website. Use the list and detail views to review submissions.
              </p>
              <Button type="button" variant="outline" onClick={() => navigate('/catalogrequests')}>
                Back to catalog requests
              </Button>
            </div>
          </DashboardCard>
        )}

        {mode === 'edit' && loading && <LoadingSkeleton className="h-80 w-full" />}
        {mode === 'edit' && error && <EmptyState title="Unable to load request" description={error} />}
        {mode === 'edit' && !loading && !error && !item && (
          <EmptyState title="Catalog request unavailable" description="The selected request could not be found." />
        )}

        {mode === 'edit' && item && (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_320px]">
            <DashboardCard title="Request summary" className="xl:col-span-1">
              <div className="grid gap-px overflow-hidden border border-divider bg-divider">
                <DetailRow label="Name" value={item.name || '—'} />
                <DetailRow label="Phone" value={item.phone || '—'} />
                <DetailRow label="Email" value={item.email ? <a href={`mailto:${item.email}`} className="text-primary underline">{item.email}</a> : '—'} />
                <DetailRow label="Catalog" value={(item as any).catalog_name || '—'} />
                <DetailRow label="Message" value={(item as any).message || '—'} />
                <DetailRow
                  label="Created At"
                  value={formatDate(item.createdAt || (item as any).created_at)}
                />
              </div>
            </DashboardCard>

            <DashboardCard title="Read-only" description="The backend currently does not support editing catalog requests.">
              <div className="grid gap-4">
                <div className="rounded-3xl border border-divider bg-surface-raised p-4">
                  <p className="text-sm font-semibold text-charcoal">No edits available</p>
                  <p className="mt-2 text-sm text-charcoal-light">
                    This admin form displays request details and the source of truth is the public submission API.
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={() => navigate(`/catalogrequests/${item.id}`)}>
                  View request
                </Button>
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
      <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-charcoal">{value}</dd>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
