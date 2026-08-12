import React from 'react';
import { Edit, ExternalLink } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import useResourceItem from '../hooks/useResourceItem';
import { useRepository } from '../repositories/RepositoryProvider';
import { resolveAdminAssetUrl } from '../lib/assetUrl';

export default function SubcategoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { item, loading, error } = useResourceItem('subcategories', id);
  const repository = useRepository();
  const [categoryName, setCategoryName] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    let active = true;
    async function loadCategory() {
      const current = item as any;
      if (!current) return;
      try {
        const cat = current.category;

        // If category looks like an id string, fetch category record
        if (typeof cat === 'string') {
          try {
            const data = await repository.get('categories', cat);
            if (active) setCategoryName(data?.name ?? undefined);
          } catch {
            if (active) setCategoryName(undefined);
          }
        } else if (cat && typeof cat === 'object') {
          if (active) setCategoryName(cat.name ?? (cat.id ? String(cat.id) : undefined));
        }
      } catch {
        if (active) setCategoryName(undefined);
      }
    }

    void loadCategory();
    return () => {
      active = false;
    };
  }, [item, repository]);

  function formatDate(value?: string) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  if (loading) return (
    <PageContainer>
      <LoadingSkeleton className="h-64 w-full" />
    </PageContainer>
  );

  if (error) return (
    <PageContainer>
      <EmptyState title="Unable to load subcategory" description={error} />
    </PageContainer>
  );

  if (!item) return (
    <PageContainer>
      <EmptyState title="Subcategory not found" description="The requested subcategory is unavailable." />
    </PageContainer>
  );

  const itm = item as any;
  const descriptionArray = Array.isArray(itm.description) ? itm.description : (itm.description ? [String(itm.description)] : []);

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title={itm.name ?? 'Subcategory'}
        description={descriptionArray.length > 0 ? descriptionArray.join(' ') : itm.slug ?? 'Subcategory details.'}
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/subcategories', label: 'Subcategories' },
          { to: `/subcategories/${id}`, label: id ?? 'Record' },
        ]}
        action={
          itm && (
            <Button type="button" onClick={() => navigate(`/subcategories/${itm.id}/edit`)}>
              <Edit />
              Edit
            </Button>
          )
        }
        meta={<div />}
      />

      <PageContainer>
        <div className="grid gap-6 xl:grid-cols-3">
          <DashboardCard title="Subcategory Overview" className="xl:col-span-2">
            <dl className="grid gap-px overflow-hidden border border-divider bg-divider sm:grid-cols-2">
              <DetailRow label="ID" value={itm._id ?? itm.id ?? '—'} />
              <DetailRow label="Name" value={itm.name ?? '—'} />
              <DetailRow label="Slug" value={itm.slug ?? '—'} />
              <DetailRow label="Category" value={categoryName ? `${categoryName} (${((itm.category) && (((itm.category as any).id ?? itm.category))) ?? '—'})` : (itm.category ? String(itm.category) : '—')} />
              <DetailRow label="Experience" value={itm.experience ?? '—'} />
              <DetailRow label="Order" value={itm.order !== undefined ? String(itm.order) : '—'} />
              <DetailRow label="Created at" value={formatDate(itm.createdAt)} />
              <DetailRow label="Updated at" value={formatDate(itm.updatedAt)} />
            </dl>
          </DashboardCard>

          <DashboardCard title="Media">
            {itm.image ? (
              <a href={resolveAdminAssetUrl(itm.image)} target="_blank" rel="noreferrer" className="block">
                <img src={resolveAdminAssetUrl(itm.image)} alt={itm.name ?? 'Image'} className="h-64 w-full rounded-3xl object-cover" />
              </a>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-3xl border border-divider bg-surface-subtle text-sm text-charcoal-light">
                No image available
              </div>
            )}
            {itm.image && (
              <div className="mt-3 flex items-center gap-2">
                <Button type="button" variant="outline" onClick={() => window.open(resolveAdminAssetUrl(itm.image), '_blank')}>
                  <ExternalLink />
                  Open image
                </Button>
                <div className="text-sm text-muted-foreground">{itm.image}</div>
              </div>
            )}
          </DashboardCard>

          <DashboardCard title="Hero Content" className="xl:col-span-2">
            <DetailBlock label="Hero Title" value={itm.heroTitle} />
            <DetailBlock label="Hero Subtitle" value={itm.heroSubtitle} />
          </DashboardCard>

          <DashboardCard title="Description" className="xl:col-span-2">
            {Array.isArray(itm.description) && itm.description.length > 0 ? (
              <div className="space-y-4">
                {itm.description.map((line: any, index: number) => (
                  <p key={index} className="whitespace-pre-wrap text-sm leading-6 text-charcoal-light">{String(line)}</p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-charcoal-light">No description available.</p>
            )}
          </DashboardCard>

          <DashboardCard title="Technical Characteristics">
            {Array.isArray(itm.technicalCharacteristics) && itm.technicalCharacteristics.length > 0 ? (
              <ul className="list-disc pl-5">
                {itm.technicalCharacteristics.map((t: any, idx: number) => (
                  <li key={idx}>{String(t)}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-charcoal-light">No technical characteristics.</p>
            )}
          </DashboardCard>

          <DashboardCard title="Applications">
            {Array.isArray(itm.applications) && itm.applications.length > 0 ? (
              <ul className="list-disc pl-5">
                {itm.applications.map((a: any, idx: number) => (
                  <li key={idx}>{String(a)}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-charcoal-light">No applications listed.</p>
            )}
          </DashboardCard>

          <DashboardCard title="Specifications" className="xl:col-span-2">
            {itm.specifications && Object.keys(itm.specifications).length > 0 ? (
              <div className="grid gap-3">
                {Object.entries(itm.specifications).map(([key, value]) => (
                  <div key={key} className="rounded-3xl border border-divider bg-surface-raised p-4">
                    <p className="text-sm font-semibold text-charcoal">{key}</p>
                    <p className="mt-1 text-sm text-charcoal-light">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-charcoal-light">No specifications available.</p>
            )}
          </DashboardCard>

          <DashboardCard title="Downloads" className="xl:col-span-2">
            {Array.isArray(itm.downloads) && itm.downloads.length > 0 ? (
              <ul className="space-y-3">
                {itm.downloads.map((d: any, idx: number) => (
                  <li key={idx} className="rounded-3xl border border-divider bg-surface-raised p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-charcoal">{d.label || 'Download'}</p>
                      <p className="mt-1 text-sm text-charcoal-light">{d.url}</p>
                    </div>
                    {d.url && (
                      <Button type="button" onClick={() => window.open(d.url, '_blank')}>
                        Open
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-charcoal-light">No downloads available.</p>
            )}
          </DashboardCard>

          <DashboardCard title="SEO" className="xl:col-span-2">
            <DetailRow label="Meta Title" value={itm.seo?.metaTitle ?? '—'} />
            <DetailRow label="Meta Description" value={itm.seo?.metaDescription ?? '—'} />
            <DetailRow label="Keywords" value={Array.isArray(itm.seo?.keywords) ? itm.seo.keywords.join(', ') : '—'} />
          </DashboardCard>

          <DashboardCard title="Raw Data" className="xl:col-span-3">
            <pre className="max-h-96 overflow-auto p-3 text-xs">{JSON.stringify(itm, null, 2)}</pre>
          </DashboardCard>
        </div>
      </PageContainer>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-surface-raised p-4">
      <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-charcoal">{value ?? '—'}</dd>
    </div>
  );
}

function DetailBlock({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-3xl border border-divider bg-surface-raised p-4">
      <p className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm text-charcoal-light">{value ?? '—'}</p>
    </div>
  );
}
