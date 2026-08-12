import React from 'react';
import { Edit, ExternalLink } from 'lucide-react';
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

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { item, loading, error } = useResourceItem('products', id);
  const product = item as DataEntity & Record<string, unknown>;

  const status = product?.status ??
    (product?.isVisible === false ? 'Draft' : product?.isVisible === true ? 'Published' : 'Unknown');

  if (loading) {
    return (
      <PageContainer>
        <LoadingSkeleton className="h-64 w-full" />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <EmptyState title="Unable to load product" description={error} />
      </PageContainer>
    );
  }

  if (!item) {
    return (
      <PageContainer>
        <EmptyState title="Product not found" description="The requested product is unavailable." />
      </PageContainer>
    );
  }

  const descriptionArray = Array.isArray(product.description)
    ? product.description
    : product.description
      ? [String(product.description)]
      : [];

  const keyFeatures = Array.isArray(product.keyFeatures) ? product.keyFeatures : [];
  const applications = Array.isArray(product.applications) ? product.applications : [];
  const materials = Array.isArray(product.materials) ? product.materials : [];
  const industries = Array.isArray(product.industries) ? product.industries : [];
  const specifications = product.specifications && typeof product.specifications === 'object' ? product.specifications : {};
  const downloads = Array.isArray((product as any).downloadRecords)
    ? (product as any).downloadRecords
    : Array.isArray(product.downloads)
      ? (product.downloads as unknown[])
      : [];
  const machineComponentData =
    product.machineComponentData && typeof product.machineComponentData === 'object'
      ? (product.machineComponentData as Record<string, unknown>)
      : null;
  const seo = product.seo ?? {};
  const pdfUrl = String(product.pdfUrl ?? '');
  const productPath = String(product.path ?? '—');

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title={product.name ?? 'Product'}
        description={product.slug ?? 'Product details.'}
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/products', label: 'Products' },
          { to: `/products/${id}`, label: id ?? 'Record' },
        ]}
        action={
          item && (
            <Button type="button" onClick={() => navigate(`/products/${product.id}/edit`)}>
              <Edit />
              Edit
            </Button>
          )
        }
        meta={
          item && (
            <StatusBadge tone={status === 'Published' ? 'green' : 'neutral'}>{status}</StatusBadge>
          )
        }
      />

      <PageContainer>
        <div className="grid gap-6 xl:grid-cols-3">
          <DashboardCard title="Product Overview" className="xl:col-span-2">
            <dl className="grid gap-px overflow-hidden border border-divider bg-divider sm:grid-cols-2">
              <DetailRow label="ID" value={String(product.id ?? '—')} />
              <DetailRow label="Name" value={product.name ?? '—'} />
              <DetailRow label="Slug" value={product.slug ?? '—'} />
              <DetailRow label="Status" value={status} />
              <DetailRow label="Visible" value={product.isVisible === undefined ? '—' : String(product.isVisible)} />
              <DetailRow label="Experience" value={product.experience ?? '—'} />
              <DetailRow label="Order" value={product.order !== undefined ? String(product.order) : '—'} />
              <DetailRow label="Created at" value={formatDate(product.createdAt)} />
              <DetailRow label="Updated at" value={formatDate(product.updatedAt)} />
              <DetailRow label="Path" value={productPath} />
              <DetailRow
                label="PDF"
                value={pdfUrl ? <LinkValue url={pdfUrl} label="Open PDF" /> : '—'}
              />
            </dl>
          </DashboardCard>

          <DashboardCard title="Media">
            {product.image ? (
              <>
                <a href={resolveAdminAssetUrl(product.image)} target="_blank" rel="noreferrer" className="block">
                  <img
                    src={resolveAdminAssetUrl(product.image)}
                    alt={product.name ?? 'Product image'}
                    className="h-64 w-full rounded-3xl object-cover"
                  />
                </a>
                <div className="mt-3 flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.open(resolveAdminAssetUrl(product.image), '_blank')}
                  >
                    <ExternalLink />
                    Open image
                  </Button>
                  <div className="text-sm text-muted-foreground break-all">{product.image}</div>
                </div>
              </>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-3xl border border-divider bg-surface-subtle text-sm text-charcoal-light">
                No image available
              </div>
            )}
          </DashboardCard>

          <DashboardCard title="Relationships" className="xl:col-span-2">
            <div className="space-y-4">
              <DetailBlock label="Category" value={renderReference(product.category)} />
              <DetailBlock label="Subcategory" value={renderReference(product.subCategory)} />
              <DetailBlock label="Brand" value={renderReference(product.brand)} />
              <DetailBlock
                label="Materials"
                value={renderArray(materials, (item) => renderReference(item))}
              />
              <DetailBlock
                label="Industries"
                value={renderArray(industries, (item) => renderReference(item))}
              />
            </div>
          </DashboardCard>

          {descriptionArray.length > 0 && (
            <DashboardCard title="Description" className="xl:col-span-2">
              <div className="space-y-4">
                {descriptionArray.map((line, index) => (
                  <p key={index} className="whitespace-pre-wrap text-sm leading-6 text-charcoal-light">
                    {String(line)}
                  </p>
                ))}
              </div>
            </DashboardCard>
          )}

          {keyFeatures.length > 0 && (
            <DashboardCard title="Key Features">
              <ul className="list-disc pl-5">
                {keyFeatures.map((feature, index) => (
                  <li key={index}>{String(feature)}</li>
                ))}
              </ul>
            </DashboardCard>
          )}

          {applications.length > 0 && (
            <DashboardCard title="Applications">
              <ul className="list-disc pl-5">
                {applications.map((application, index) => (
                  <li key={index}>{String(application)}</li>
                ))}
              </ul>
            </DashboardCard>
          )}

          {Object.keys(specifications).length > 0 && (
            <DashboardCard title="Specifications" className="xl:col-span-2">
              <div className="grid gap-3">
                {Object.entries(specifications).map(([key, value]) => (
                  <div key={key} className="rounded-3xl border border-divider bg-surface-raised p-4">
                    <p className="text-sm font-semibold text-charcoal">{key}</p>
                    <p className="mt-1 text-sm text-charcoal-light">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </DashboardCard>
          )}

          {downloads.length > 0 && (
            <DashboardCard title="Downloads" className="xl:col-span-2">
              <ul className="space-y-3">
                {downloads.map((download: unknown, index: number) => (
                  <li
                    key={index}
                    className="rounded-3xl border border-divider bg-surface-raised p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-charcoal">{String((download as any).label ?? 'Download')}</p>
                      <p className="mt-1 text-sm text-charcoal-light break-all">{String((download as any).url ?? '—')}</p>
                    </div>
                    {(download as any).url ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.open(String((download as any).url), '_blank')}
                      >
                        Open
                      </Button>
                    ) : null}
                  </li>
                ))}
              </ul>
            </DashboardCard>
          )}

          {machineComponentData && Object.keys(machineComponentData).length > 0 && (
            <DashboardCard title="Machine Component Data" className="xl:col-span-2">
              {renderMachineComponentData(machineComponentData)}
            </DashboardCard>
          )}

          {(seo.metaTitle || seo.metaDescription || Array.isArray(seo.keywords) && seo.keywords.length > 0) && (
            <DashboardCard title="SEO" className="xl:col-span-2">
              <DetailRow label="Meta Title" value={seo.metaTitle ?? '—'} />
              <DetailRow label="Meta Description" value={seo.metaDescription ?? '—'} />
              <DetailRow label="Keywords" value={Array.isArray(seo.keywords) ? seo.keywords.join(', ') : '—'} />
            </DashboardCard>
          )}

          {(product as any).enquiries && Array.isArray((product as any).enquiries) && (product as any).enquiries.length > 0 && (
            <DashboardCard title="Related Enquiries" className="xl:col-span-2">
              <ul className="space-y-3">
                {((product as any).enquiries as any[]).map((enquiry, index) => (
                  <li key={index} className="rounded-3xl border border-divider bg-surface-raised p-4">
                    <p className="font-semibold text-charcoal">{enquiry.fullName ?? enquiry.name ?? `Enquiry ${index + 1}`}</p>
                    <p className="mt-1 text-sm text-charcoal-light">{enquiry.product ?? enquiry.productName ?? 'No product detail'}</p>
                    {enquiry.createdAt ? <p className="mt-2 text-xs text-muted-foreground">{formatDate(String(enquiry.createdAt))}</p> : null}
                  </li>
                ))}
              </ul>
            </DashboardCard>
          )}

          <DashboardCard title="Raw Data" className="xl:col-span-3">
            <pre className="max-h-96 overflow-auto p-3 text-xs">{JSON.stringify(product, null, 2)}</pre>
          </DashboardCard>
        </div>
      </PageContainer>
    </>
  );
}

function renderReference(value: unknown) {
  if (!value) return '—';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    const ref = value as { name?: string; slug?: string; id?: string; _id?: string };
    if (ref.name) {
      return ref.slug ? `${ref.name} (${ref.slug})` : ref.name;
    }
    return String(ref.id ?? ref._id ?? '—');
  }
  return String(value);
}

function renderArray(values: unknown[], renderItem: (value: unknown) => React.ReactNode) {
  if (!Array.isArray(values) || values.length === 0) {
    return '—';
  }
  return (
    <ul className="space-y-2">
      {values.map((value, index) => (
        <li key={index} className="rounded-3xl border border-divider bg-surface-raised px-3 py-2 text-sm text-charcoal">
          {renderItem(value)}
        </li>
      ))}
    </ul>
  );
}

function renderMachineComponentData(data: Record<string, unknown>) {
  return (
    <div className="space-y-4">
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{key}</p>
          <p className="mt-2 text-sm text-charcoal-light">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</p>
        </div>
      ))}
    </div>
  );
}

function LinkValue({ url, label }: { url: string; label: string }) {
  if (!url) return '—';
  return (
    <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-primary underline">
      <ExternalLink className="h-3 w-3" />
      {label}
    </a>
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

function DetailBlock({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-divider bg-surface-raised p-4">
      <p className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="mt-2 text-sm text-charcoal-light">{value}</div>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
