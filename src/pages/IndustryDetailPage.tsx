import React from 'react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import useResourceItem from '../hooks/useResourceItem';
import { useRepository } from '../repositories/RepositoryProvider';
import { useToast } from '../providers/ToastProvider';

export default function IndustryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const repository = useRepository();
  const toast = useToast();
  const { item, loading, error } = useResourceItem('industries', id);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await repository.delete('industries', [id]);
      toast.push('Industry deleted.', 'success');
      navigate('/industries');
    } catch {
      toast.push('This industry is still associated with products and cannot be deleted.', 'error');
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title={item?.name ?? 'Industry detail'}
        description={item?.description || 'Industry overview and SEO settings.'}
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/industries', label: 'Industries' },
          { to: `/industries/${id ?? ''}`, label: item?.name ?? 'Industry' },
        ]}
        action={
          item ? (
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => navigate('/industries')}>
                <ArrowLeft />
                Back to Industries
              </Button>
              <Button type="button" onClick={() => navigate(`/industries/${item.id}/edit`)}>
                <Edit />
                Edit
              </Button>
              <Button type="button" variant="danger" onClick={() => void handleDelete()}>
                <Trash2 />
                Delete
              </Button>
            </div>
          ) : null
        }
      />

      <PageContainer>
        {loading && <LoadingSkeleton className="h-80 w-full" />}
        {error && <EmptyState title="Unable to load industry" description={error} />}
        {!loading && !item && !error && (
          <EmptyState
            title="Industry not found"
            description="The requested industry record is unavailable."
          />
        )}

        {item && (
          <div className="grid gap-6 xl:grid-cols-2">
            <DashboardCard title="General information">
              <dl className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <dt className="section-label">Name</dt>
                  <dd className="mt-1 text-lg font-semibold text-charcoal">{item.name}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="section-label">Slug</dt>
                  <dd className="mt-1 text-sm text-charcoal-light">{item.slug || '-'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="section-label">Description</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm text-charcoal-light">
                    {item.description || 'No description provided.'}
                  </dd>
                </div>
              </dl>
            </DashboardCard>

            <DashboardCard title="SEO">
              <dl className="grid gap-4">
                <div>
                  <dt className="section-label">Meta Title</dt>
                  <dd className="mt-1 text-sm text-charcoal-light">{item.seo?.metaTitle || '—'}</dd>
                </div>
                <div>
                  <dt className="section-label">Meta Description</dt>
                  <dd className="mt-1 text-sm text-charcoal-light">
                    {item.seo?.metaDescription || '—'}
                  </dd>
                </div>
                <div>
                  <dt className="section-label">Keywords</dt>
                  <dd className="mt-1 flex flex-wrap gap-2">
                    {item.seo?.keywords && item.seo.keywords.length > 0 ? (
                      item.seo.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full border border-border bg-surface-subtle px-2 py-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
                        >
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-charcoal-light">No keywords</span>
                    )}
                  </dd>
                </div>
              </dl>
            </DashboardCard>

            <DashboardCard title="Metadata" className="xl:col-span-2">
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="section-label">Created At</dt>
                  <dd className="mt-1 text-sm text-charcoal-light">{item.createdAt || '—'}</dd>
                </div>
                <div>
                  <dt className="section-label">Updated At</dt>
                  <dd className="mt-1 text-sm text-charcoal-light">{item.updatedAt || '—'}</dd>
                </div>
              </dl>
            </DashboardCard>
          </div>
        )}
      </PageContainer>
    </>
  );
}
