import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ExternalLink, Edit, Eye } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getAdminBlog, type AdminBlogDetail } from '../lib/adminBlogApi';
import { BLOG_FALLBACK_IMAGE, resolveBlogImageUrl } from '../lib/assetUrl';

function BlogGalleryImage({ src, alt }: { src?: string | null; alt: string }) {
  const [hasFallback, setHasFallback] = React.useState(false);

  React.useEffect(() => {
    setHasFallback(false);
  }, [src]);

  const resolvedSrc = hasFallback ? BLOG_FALLBACK_IMAGE : resolveBlogImageUrl(src);

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className="h-48 w-full rounded object-cover"
      onError={() => {
        if (hasFallback) {
          return;
        }
        setHasFallback(true);
      }}
    />
  );
}

function formatDate(value: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = React.useState<AdminBlogDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    void getAdminBlog(id)
      .then((item) => setBlog(item))
      .catch(() => setError('Unable to load this blog post.'))
      .finally(() => setLoading(false));
  }, [id]);

  const isPublished = blog ? String(blog.status ?? '').toLowerCase() === 'published' : false;
  const previewUrl = isPublished ? `/blog/${blog?.slug}` : undefined;
  const [featuredImageFailed, setFeaturedImageFailed] = React.useState(false);

  React.useEffect(() => {
    setFeaturedImageFailed(false);
  }, [id, blog?.id]);

  const featuredImageSrc = blog
    ? featuredImageFailed
      ? BLOG_FALLBACK_IMAGE
      : resolveBlogImageUrl(blog.image)
    : BLOG_FALLBACK_IMAGE;
  const publishedValue = isPublished && blog?.publishedAt ? formatDate(blog.publishedAt) : '—';

  return (
    <>
      <PageHeader
        eyebrow="Website Content"
        title={blog?.title ?? 'Blog post details'}
        description={
          blog?.excerpt ?? 'Review blog metadata, content structure, and publication settings.'
        }
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/blog', label: 'Blog & Gallery' },
          { to: id ? `/blog/${id}` : '/blog', label: id ?? 'Details' },
        ]}
        action={
          <div className="flex flex-wrap gap-2">
            {previewUrl ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => window.open(previewUrl, '_blank')}
              >
                <ExternalLink />
                Preview
              </Button>
            ) : (
              <Button type="button" variant="outline" disabled>
                <Eye />
                Preview
              </Button>
            )}
            <Button type="button" onClick={() => navigate(`/blog/${id}/edit`)}>
              <Edit />
              Edit
            </Button>
          </div>
        }
        meta={
          blog ? (
            <StatusBadge tone={isPublished ? 'green' : 'amber'}>
              {String(blog.status ?? 'Draft').toUpperCase()}
            </StatusBadge>
          ) : undefined
        }
      />

      <PageContainer className="space-y-6">
        {loading ? (
          <LoadingSkeleton className="h-80 w-full" />
        ) : error ? (
          <EmptyState title="Unable to load post" description={error} />
        ) : !blog ? (
          <EmptyState
            title="Blog not found"
            description="The requested blog post does not exist."
          />
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <DashboardCard title="Overview" className="lg:col-span-2">
                <dl className="grid gap-px overflow-hidden border border-divider bg-divider sm:grid-cols-2">
                  {[
                    ['Title', blog.title],
                    ['Slug', blog.slug],
                    ['Type', blog.type],
                    ['Category', blog.category],
                    ['Status', String(blog.status ?? 'Draft').toUpperCase()],
                    ['Published', publishedValue],
                    ['Updated', formatDate(blog.updatedAt)],
                    ['Read time', blog.readTime],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-surface-raised p-4">
                      <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {label}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-charcoal">
                        {value || 'Not assigned'}
                      </dd>
                    </div>
                  ))}
                </dl>
              </DashboardCard>
              <DashboardCard title="Tags & SEO">
                <div className="space-y-4">
                  <div>
                    <p className="section-label">Featured image</p>
                    <img
                      src={featuredImageSrc}
                      alt={blog.title}
                      className="mt-2 h-32 w-full rounded border border-border bg-surface-subtle object-cover"
                      onError={() => {
                        if (featuredImageFailed) {
                          return;
                        }
                        setFeaturedImageFailed(true);
                      }}
                    />
                  </div>
                  <div>
                    <p className="section-label">Tags</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {blog.tags.length > 0 ? (
                        blog.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No tags assigned.</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="section-label">SEO</p>
                    <dl className="mt-2 grid gap-2">
                      <div>
                        <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          Meta title
                        </dt>
                        <dd className="mt-1 text-sm text-charcoal">
                          {blog.seo.metaTitle || 'Not set'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          Meta description
                        </dt>
                        <dd className="mt-1 text-sm text-charcoal">
                          {blog.seo.metaDescription || 'Not set'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          Keywords
                        </dt>
                        <dd className="mt-1 text-sm text-charcoal">
                          {blog.seo.keywords.join(', ') || 'Not set'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </DashboardCard>
            </div>

            <DashboardCard title="Article Content" className="space-y-4">
              <div>
                <p className="section-label">Intro</p>
                <p className="mt-2 text-sm text-charcoal">{blog.intro}</p>
              </div>
              {blog.keyTakeaways.length > 0 && (
                <div>
                  <p className="section-label">Key Takeaways</p>
                  <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-charcoal">
                    {blog.keyTakeaways.map((takeaway, index) => (
                      <li key={index}>{takeaway}</li>
                    ))}
                  </ul>
                </div>
              )}
              {blog.sections.length > 0 && (
                <div className="space-y-6">
                  <p className="section-label">Sections</p>
                  {blog.sections.map((section, index) => (
                    <div key={index} className="rounded border border-border bg-surface p-4">
                      <h3 className="text-sm font-semibold text-charcoal">{section.heading}</h3>
                      {section.paragraphs.map((paragraph, idx) => (
                        <p key={idx} className="mt-3 text-sm leading-6 text-charcoal">
                          {paragraph}
                        </p>
                      ))}
                      {section.bullets.length > 0 && (
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-charcoal">
                          {section.bullets.map((bullet, idx) => (
                            <li key={idx}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </DashboardCard>

            {blog.type === 'Gallery' && (
              <DashboardCard title="Gallery Images">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {blog.galleryImages.length > 0 ? (
                    blog.galleryImages.map((url, index) => (
                      <BlogGalleryImage
                        key={`${url}-${index}`}
                        src={url}
                        alt={`Gallery image ${index + 1}`}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No gallery images added.</p>
                  )}
                </div>
              </DashboardCard>
            )}
          </div>
        )}
      </PageContainer>
    </>
  );
}
