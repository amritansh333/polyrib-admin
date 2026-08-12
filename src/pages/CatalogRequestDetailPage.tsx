import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import useResourceItem from '../hooks/useResourceItem';

const FIELD_ORDER = ['_id', 'id', 'name', 'phone', 'email', 'catalog_name', 'message', 'created_at', '__v'];

export default function CatalogRequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { item, loading, error } = useResourceItem('catalogrequests', id);

  const fields = React.useMemo(() => {
    if (!item) return [];

    const availableFields = FIELD_ORDER.filter((key) => {
      const value = (item as Record<string, unknown>)[key];
      return value !== undefined && value !== null && value !== '';
    });

    const extras = Object.keys(item as Record<string, unknown>)
      .filter((key) => !FIELD_ORDER.includes(key))
      .filter((key) => !['description', 'descriptionArray', 'status', 'owner', 'updatedAt', 'createdAt', 'category', 'categoryName', 'brand', 'material', 'materialIds', 'industryIds', 'source', 'slug', 'experience', 'heroTitle', 'heroSubtitle', 'technicalCharacteristics', 'applications', 'specifications', 'downloads', 'downloadRecords', 'order', 'isVisible', 'subCategory', 'subCategories', 'company', 'region', 'role', 'size', 'image', 'file', 'files', 'seo', 'notes', 'fullName', 'firstName', 'lastName', 'mobileNumber', 'companyName', 'productId', 'productName', 'productSlug', 'currentRoute', 'downloadCount', 'lastDownloadedAt', 'downloadHistory', 'verifiedAt', 'product', 'requirement'].includes(key))
      .filter((key) => {
        const value = (item as Record<string, unknown>)[key];
        return value !== undefined && value !== null && value !== '';
      });

    return [...availableFields, ...extras].sort((a, b) => {
      const first = FIELD_ORDER.indexOf(a);
      const second = FIELD_ORDER.indexOf(b);
      if (first !== -1 || second !== -1) {
        return (first === -1 ? FIELD_ORDER.length : first) - (second === -1 ? FIELD_ORDER.length : second);
      }
      return a.localeCompare(b);
    });
  }, [item]);

  const labelForKey = (key: string) => {
    if (key === '_id') return 'ID';
    if (key === 'id') return 'ID';
    if (key === 'catalog_name') return 'Catalog';
    if (key === 'created_at') return 'Created At';
    return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <>
      <PageHeader
        eyebrow="Sales Requests"
        title={item?.name ?? 'Catalog Request'}
        description="View the full catalog request submission details from the website."
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/catalogrequests', label: 'Catalog Requests' },
          { to: `/catalogrequests/${id}`, label: id ?? 'Request' },
        ]}
      />

      <PageContainer>
        {loading && <LoadingSkeleton className="h-80 w-full" />}
        {error && <EmptyState title="Unable to load catalog request" description={error} />}
        {!loading && !error && !item && (
          <EmptyState
            title="Catalog request not found"
            description="The requested catalog request does not exist or could not be loaded."
          />
        )}

        {item && (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_320px]">
            <DashboardCard title="Request details" className="xl:col-span-1">
              <div className="grid gap-px overflow-hidden border border-divider bg-divider">
                {fields.map((key) => (
                  <DetailRow key={key} label={labelForKey(key)} value={renderFieldValue(key, (item as any)[key])} />
                ))}
              </div>
            </DashboardCard>

            <DashboardCard title="Administration" description="This resource is read-only. Catalog requests are submitted via the public website.">
              <div className="space-y-4">
                <div className="rounded-3xl border border-divider bg-surface-raised p-4">
                  <p className="text-sm font-semibold text-charcoal">Record source</p>
                  <p className="mt-2 text-sm text-charcoal-light">Public website submission</p>
                </div>
                <Button type="button" variant="outline" onClick={() => navigate('/catalogrequests')}>
                  Back to list
                </Button>
              </div>
            </DashboardCard>
          </div>
        )}
      </PageContainer>
    </>
  );
}

function renderFieldValue(key: string, value: unknown) {
  if (value === undefined || value === null || value === '') {
    return '—';
  }

  if (key === 'email' && typeof value === 'string') {
    return (
      <a className="text-primary underline" href={`mailto:${value}`}>
        {value}
      </a>
    );
  }

  if ((key === 'phone' || key === 'mobileNumber') && typeof value === 'string') {
    return (
      <a className="text-primary underline" href={`tel:${value}`}>
        {value}
      </a>
    );
  }

  if (key === '_id' || key === 'id') {
    return <code className="block break-all text-sm font-mono text-charcoal-light">{String(value)}</code>;
  }

  if (isDateLike(value)) {
    return formatDate(value instanceof Date ? value.toISOString() : String(value));
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '—';
    return (
      <ul className="list-disc space-y-1 pl-5 text-sm text-charcoal-light">
        {value.map((item, index) => (
          <li key={index}>{String(item)}</li>
        ))}
      </ul>
    );
  }

  if (typeof value === 'object') {
    return (
      <pre className="whitespace-pre-wrap break-words text-sm text-charcoal-light">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  return String(value);
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-surface-raised p-4">
      <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-charcoal">{value}</dd>
    </div>
  );
}

function formatDate(value: string) {
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

function isDateLike(value: unknown): value is Date | string {
  return value instanceof Date || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value));
}
