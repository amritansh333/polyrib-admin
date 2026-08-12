import React from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import DashboardCard from '../components/DashboardCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import useResourceItem from '../hooks/useResourceItem';
import type { DataEntity } from '../types/admin';

const KNOWN_LEAD_FIELDS = new Set([
  'id',
  'name',
  'companyName',
  'firstName',
  'lastName',
  'email',
  'mobileNumber',
  'phone',
  'productId',
  'productName',
  'productSlug',
  'downloadCount',
  'currentRoute',
  'status',
  'verifiedAt',
  'lastDownloadedAt',
  'createdAt',
  'updatedAt',
  '__v',
]);

export default function LeadDetailPage() {
  const { id } = useParams();
  const { item, loading, error } = useResourceItem('leads', id);

  const additionalFields = React.useMemo(() => {
    if (!item) return [] as [string, unknown][];
    return Object.entries(item)
      .filter(
        ([key, value]) =>
          !KNOWN_LEAD_FIELDS.has(key) && key !== '_id' && value !== undefined && value !== null
      )
      .sort(([a], [b]) => a.localeCompare(b));
  }, [item]);

  return (
    <>
      <PageHeader
        eyebrow="Lead Intelligence"
        title={item?.name ?? 'Lead'}
        description={item?.description ?? 'Lead detail from downloads and brochure requests.'}
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/leads', label: 'Leads' },
          { to: `/leads/${id}`, label: id ?? 'Record' },
        ]}
      />

      <PageContainer>
        {loading && <LoadingSkeleton className="h-80 w-full" />}
        {error && <EmptyState title="Unable to load record" description={error} />}
        {!loading && !item && (
          <EmptyState title="Record not found" description="The requested record is unavailable." />
        )}

        {item && (
          <div className="grid gap-6 xl:grid-cols-3">
            <DashboardCard title="Person" className="xl:col-span-1">
              <dl className="grid gap-px overflow-hidden border border-divider bg-divider sm:grid-cols-1">
                <DetailRow label="First Name" value={renderValue(item.firstName ?? '')} />
                <DetailRow label="Last Name" value={renderValue(item.lastName ?? '')} />
                <DetailRow label="Email" value={renderValue(item.email ?? '')} />
                <DetailRow
                  label="Mobile Number"
                  value={renderValue(item.mobileNumber ?? item.phone ?? '')}
                />
              </dl>
            </DashboardCard>

            <DashboardCard title="Company" className="xl:col-span-1">
              <dl className="grid gap-px overflow-hidden border border-divider bg-divider sm:grid-cols-1">
                <DetailRow
                  label="Company Name"
                  value={renderValue(item.companyName ?? item.company ?? '')}
                />
              </dl>
            </DashboardCard>

            <DashboardCard title="Product / Download" className="xl:col-span-1">
              <dl className="grid gap-px overflow-hidden border border-divider bg-divider sm:grid-cols-1">
                <DetailRow label="Product ID" value={renderValue(item.productId ?? '')} />
                <DetailRow
                  label="Product Name"
                  value={renderValue(item.productName ?? item.product ?? '')}
                />
                <DetailRow label="Product Slug" value={renderValue(item.productSlug ?? '')} />
                <DetailRow label="Download Count" value={renderValue(item.downloadCount ?? '')} />
                <DetailRow label="Current Route" value={renderValue(item.currentRoute ?? '')} />
              </dl>
            </DashboardCard>

            <DashboardCard title="Verification / Status" className="xl:col-span-3">
              <dl className="grid gap-px overflow-hidden border border-divider bg-divider sm:grid-cols-3">
                <DetailRow label="Status" value={renderValue(item.status ?? '')} />
                <DetailRow label="Verified At" value={renderValue(item.verifiedAt ?? '')} />
                <DetailRow
                  label="Last Downloaded At"
                  value={renderValue(item.lastDownloadedAt ?? '')}
                />
              </dl>
            </DashboardCard>

            <DashboardCard title="Record" className="xl:col-span-3">
              <dl className="grid gap-px overflow-hidden border border-divider bg-divider sm:grid-cols-3">
                <DetailRow label="ID" value={renderValue(item.id ?? '')} />
                <DetailRow label="Created At" value={renderValue(item.createdAt ?? '')} />
                <DetailRow label="Updated At" value={renderValue(item.updatedAt ?? '')} />
              </dl>
            </DashboardCard>

            {additionalFields.length > 0 && (
              <DashboardCard title="Additional Information" className="xl:col-span-3">
                <dl className="grid gap-px overflow-hidden border border-divider bg-divider sm:grid-cols-1">
                  {additionalFields.map(([key, value]) => (
                    <DetailRow key={key} label={formatLabel(key)} value={renderValue(value)} />
                  ))}
                </dl>
              </DashboardCard>
            )}
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

function formatLabel(key: string) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^[a-z]/, (match) => match.toUpperCase());
}

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value);
}

function isUrl(value: string) {
  return /^https?:\/\//.test(value) || value.startsWith('/');
}

function renderValue(value: unknown): React.ReactNode {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'string') {
    if (isIsoDate(value)) {
      return formatDate(value);
    }
    if (isUrl(value) && value.startsWith('http')) {
      return (
        <a href={value} className="text-primary hover:underline" target="_blank" rel="noreferrer">
          {value}
        </a>
      );
    }
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return '—';
    return (
      <ul className="list-inside list-disc text-sm text-charcoal-light">
        {value.map((entry, index) => (
          <li key={index}>{renderValue(entry)}</li>
        ))}
      </ul>
    );
  }
  if (value instanceof Date) {
    return formatDate(value.toISOString());
  }
  if (typeof value === 'object') {
    const objectValue = value as Record<string, unknown>;
    if ('$date' in objectValue && typeof objectValue.$date === 'string') {
      return formatDate(objectValue.$date);
    }
    if ('$oid' in objectValue && typeof objectValue.$oid === 'string') {
      return objectValue.$oid;
    }
    const entries = Object.entries(objectValue).filter(([, v]) => v !== undefined && v !== null);
    if (entries.length === 0) return '—';
    return (
      <div className="space-y-2 text-sm text-charcoal-light">
        {entries.map(([nestedKey, nestedValue]) => (
          <div key={nestedKey} className="flex flex-col gap-1">
            <span className="font-semibold text-charcoal">{formatLabel(nestedKey)}</span>
            <span>{renderValue(nestedValue)}</span>
          </div>
        ))}
      </div>
    );
  }
  return String(value);
}

function formatDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
