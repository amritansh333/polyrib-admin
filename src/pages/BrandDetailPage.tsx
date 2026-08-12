import React from 'react';
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
import { resolveAdminAssetUrl } from '../lib/assetUrl';
import type { DataEntity } from '../types/admin';

export default function BrandDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { item, loading, error } = useResourceItem('brands', id);

  return (
    <>
      <PageHeader
        eyebrow="Brand Portfolio"
        title={item?.name ?? 'Brand'}
        description={
          Array.isArray(item?.descriptionArray)
            ? item?.descriptionArray.join(' ')
            : (item?.description ?? 'Brand details.')
        }
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/brands', label: 'Brands' },
          { to: `/brands/${id}`, label: id ?? 'Record' },
        ]}
        action={
          item && (
            <Button type="button" onClick={() => navigate(`/brands/${item.id}/edit`)}>
              <Edit />
              Edit
            </Button>
          )
        }
        meta={
          item && (
            <StatusBadge tone={item.status === 'Published' ? 'green' : 'neutral'}>
              {item.status ||
                (item.isVisible === false
                  ? 'Draft'
                  : item.isVisible === true
                    ? 'Published'
                    : 'Unknown')}
            </StatusBadge>
          )
        }
      />

      <PageContainer>
        {loading && <LoadingSkeleton className="h-80 w-full" />}
        {error && <EmptyState title="Unable to load brand" description={error} />}
        {!loading && !item && (
          <EmptyState title="Brand not found" description="The requested brand is unavailable." />
        )}

        {item && (
          <div className="grid gap-6 xl:grid-cols-3">
            <DashboardCard title="Brand details" className="xl:col-span-2">
              <dl className="grid gap-px overflow-hidden border border-divider bg-divider sm:grid-cols-2">
                <DetailRow label="ID" value={item.id} />
                <DetailRow label="Name" value={item.name || '—'} />
                <DetailRow label="Slug" value={item.slug || '—'} />
                <DetailRow label="Experience" value={item.experience || '—'} />
                <DetailRow
                  label="Order"
                  value={item.order !== undefined ? String(item.order) : '—'}
                />
                <DetailRow
                  label="Visible"
                  value={item.isVisible === undefined ? '—' : String(item.isVisible)}
                />
                <DetailRow label="Created at" value={formatDate(item.createdAt)} />
                <DetailRow label="Updated at" value={formatDate(item.updatedAt)} />
              </dl>
            </DashboardCard>

            <DashboardCard title="Image preview">
              {item.image ? (
                <img
                  src={resolveAdminAssetUrl(item.image)}
                  alt={item.name ?? 'Brand image'}
                  className="h-64 w-full rounded-3xl object-cover"
                />
              ) : (
                <div className="flex h-64 items-center justify-center rounded-3xl border border-divider bg-surface-subtle text-sm text-charcoal-light">
                  No image available
                </div>
              )}
            </DashboardCard>

            <DashboardCard title="Description" className="xl:col-span-2">
              {Array.isArray(item.descriptionArray) ? (
                <div className="space-y-4">
                  {item.descriptionArray.map((line, index) => (
                    <p
                      key={index}
                      className="whitespace-pre-wrap text-sm leading-6 text-charcoal-light"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-6 text-charcoal-light">
                  {item.description || 'No description available.'}
                </p>
              )}
            </DashboardCard>

            <DashboardCard title="Relationships">
              <div className="space-y-6">
                <div>
                  <p className="section-label">Subcategory</p>
                  {item.subCategory ? (
                    <div className="mt-2 rounded-3xl border border-divider bg-surface-raised p-4 text-sm text-charcoal">
                      {typeof item.subCategory === 'string' ? (
                        item.subCategory
                      ) : (
                        <>
                          <p className="font-semibold text-charcoal">
                            {item.subCategory.name || '—'}
                          </p>
                          <p className="text-sm text-charcoal-light">
                            {item.subCategory.slug || '—'}
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            ID: {item.subCategory.id || '—'}
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-charcoal-light">No subcategory assigned.</p>
                  )}
                </div>

                <div>
                  <p className="section-label">Materials</p>
                  {Array.isArray(item.materials) && item.materials.length > 0 ? (
                    <ul className="mt-2 space-y-2">
                      {item.materials.map((material, index) => (
                        <li
                          key={index}
                          className="rounded-3xl border border-divider bg-surface-raised px-3 py-2 text-sm text-charcoal"
                        >
                          {typeof material === 'string'
                            ? material
                            : `${material.name || 'Unknown'}${material.slug ? ` (${material.slug})` : ''}`}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-charcoal-light">No materials assigned.</p>
                  )}
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
