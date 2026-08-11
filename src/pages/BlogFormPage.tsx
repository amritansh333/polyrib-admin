import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Save } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/Button';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Select from '../components/Select';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { uploadService } from '../services/uploadService';
import { useToast } from '../providers/ToastProvider';
import {
  AdminBlogDetail,
  AdminBlogPayload,
  BlogSection,
  listAdminBlogCategories,
  getAdminBlog,
  createAdminBlog,
  updateAdminBlog,
} from '../lib/adminBlogApi';

const typeOptions = [
  { label: 'Blog', value: 'Blog' },
  { label: 'Gallery', value: 'Gallery' },
];

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
];

const defaultSeo = { metaTitle: '', metaDescription: '', keywords: [] };

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatDateForInput(value: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function normalizeStringArray(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function BlogFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = React.useState(mode === 'edit');
  const [error, setError] = React.useState<string | null>(null);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [saving, setSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [slugTouched, setSlugTouched] = React.useState(false);
  const [type, setType] = React.useState('Blog');
  const [category, setCategory] = React.useState('');
  const [excerpt, setExcerpt] = React.useState('');
  const [readTimeMinutes, setReadTimeMinutes] = React.useState(10);
  const [intro, setIntro] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState('');
  const [keyTakeaways, setKeyTakeaways] = React.useState<string[]>([]);
  const [newTakeaway, setNewTakeaway] = React.useState('');
  const [sections, setSections] = React.useState<BlogSection[]>([]);
  const [galleryImages, setGalleryImages] = React.useState<string[]>([]);
  const [galleryFiles, setGalleryFiles] = React.useState<File[]>([]);
  const [seoMetaTitle, setSeoMetaTitle] = React.useState('');
  const [seoMetaDescription, setSeoMetaDescription] = React.useState('');
  const [seoKeywords, setSeoKeywords] = React.useState('');
  const [status, setStatus] = React.useState('draft');
  const [publishedAt, setPublishedAt] = React.useState(new Date().toISOString().slice(0, 10));

  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

  const featuredImagePreview = React.useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return imageUrl;
  }, [imageFile, imageUrl]);

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const items = await listAdminBlogCategories();
        setCategories(items);
      } catch {
        setCategories([]);
      }
    };

    void loadCategories();
  }, []);

  React.useEffect(() => {
    if (mode === 'edit' && id) {
      setLoading(true);
      setError(null);
      void getAdminBlog(id)
        .then((item) => {
          setTitle(item.title);
          setSlug(item.slug);
          setSlugTouched(true);
          setType(item.type);
          setCategory(item.category);
          setExcerpt(item.excerpt);
          setReadTimeMinutes(item.readTimeMinutes ?? 10);
          setIntro(item.intro);
          setImageUrl(item.image);
          setTags(item.tags || []);
          setKeyTakeaways(item.keyTakeaways || []);
          setSections(item.sections || []);
          setGalleryImages(item.galleryImages || []);
          setSeoMetaTitle(item.seo?.metaTitle || '');
          setSeoMetaDescription(item.seo?.metaDescription || '');
          setSeoKeywords((item.seo?.keywords || []).join(', '));
          setStatus(item.status === 'Published' ? 'published' : 'draft');
          setPublishedAt(formatDateForInput(item.publishedAt));
        })
        .catch(() => {
          setError('Unable to load this blog post for editing.');
        })
        .finally(() => setLoading(false));
    }
  }, [id, mode]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!title.trim()) errors.title = 'Title is required.';
    if (!slug.trim()) errors.slug = 'Slug is required.';
    if (!category.trim()) errors.category = 'Category is required.';
    if (!excerpt.trim()) errors.excerpt = 'Excerpt is required.';
    if (!intro.trim()) errors.intro = 'Intro is required.';
    if (!imageUrl && !imageFile) errors.image = 'Featured image is required.';
    if (!Number.isFinite(readTimeMinutes) || readTimeMinutes < 1 || readTimeMinutes > 180) {
      errors.readTimeMinutes = 'Read time must be between 1 and 180 minutes.';
    }
    if (type === 'Gallery' && galleryImages.length === 0 && galleryFiles.length === 0) {
      errors.galleryImages = 'Gallery images are required for gallery posts.';
    }
    if (!publishedAt) errors.publishedAt = 'Publish date is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addTag = () => {
    const normalized = tagInput.trim();
    if (!normalized) return;
    setTags((current) => Array.from(new Set([...current, normalized])));
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags((current) => current.filter((item) => item !== tag));
  };

  const addKeyTakeaway = () => {
    const value = newTakeaway.trim();
    if (!value) return;
    setKeyTakeaways((current) => [...current, value]);
    setNewTakeaway('');
  };

  const removeKeyTakeaway = (index: number) => {
    setKeyTakeaways((current) => current.filter((_, idx) => idx !== index));
  };

  const updateSection = (index: number, section: BlogSection) => {
    setSections((current) => current.map((item, idx) => (idx === index ? section : item)));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    setSections((current) => {
      const next = [...current];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return current;
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return next;
    });
  };

  const addSection = () => {
    setSections((current) => [...current, { heading: '', paragraphs: [''], bullets: [] }]);
  };

  const removeSection = (index: number) => {
    setSections((current) => current.filter((_, idx) => idx !== index));
  };

  const addParagraph = (sectionIndex: number) => {
    setSections((current) =>
      current.map((section, idx) =>
        idx !== sectionIndex ? section : { ...section, paragraphs: [...section.paragraphs, ''] }
      )
    );
  };

  const removeParagraph = (sectionIndex: number, paragraphIndex: number) => {
    setSections((current) =>
      current.map((section, idx) =>
        idx !== sectionIndex
          ? section
          : {
              ...section,
              paragraphs: section.paragraphs.filter((_, pIdx) => pIdx !== paragraphIndex),
            }
      )
    );
  };

  const setParagraph = (sectionIndex: number, paragraphIndex: number, value: string) => {
    setSections((current) =>
      current.map((section, idx) =>
        idx !== sectionIndex
          ? section
          : {
              ...section,
              paragraphs: section.paragraphs.map((paragraph, pIdx) =>
                pIdx !== paragraphIndex ? paragraph : value
              ),
            }
      )
    );
  };

  const addBullet = (sectionIndex: number) => {
    setSections((current) =>
      current.map((section, idx) =>
        idx !== sectionIndex ? section : { ...section, bullets: [...section.bullets, ''] }
      )
    );
  };

  const removeBullet = (sectionIndex: number, bulletIndex: number) => {
    setSections((current) =>
      current.map((section, idx) =>
        idx !== sectionIndex
          ? section
          : {
              ...section,
              bullets: section.bullets.filter((_, bIdx) => bIdx !== bulletIndex),
            }
      )
    );
  };

  const setBullet = (sectionIndex: number, bulletIndex: number, value: string) => {
    setSections((current) =>
      current.map((section, idx) =>
        idx !== sectionIndex
          ? section
          : {
              ...section,
              bullets: section.bullets.map((bullet, bIdx) =>
                bIdx !== bulletIndex ? bullet : value
              ),
            }
      )
    );
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((current) => current.filter((_, idx) => idx !== index));
  };

  const moveGalleryImage = (index: number, direction: 'left' | 'right') => {
    setGalleryImages((current) => {
      const next = [...current];
      const target = direction === 'left' ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return current;
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return next;
    });
  };

  const handleGalleryFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    setGalleryFiles((current) => [...current, ...fileArray]);
  };

  const handleImageFile = (file: File | null) => {
    if (!file) return;
    setImageFile(file);
    setImageUrl('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSuccess(false);
    if (!validateForm()) return;

    setSaving(true);
    setError(null);
    try {
      const payload: AdminBlogPayload = {
        title: title.trim(),
        slug: normalizeSlug(slug || title),
        type: type as 'Blog' | 'Gallery',
        category: category.trim(),
        excerpt: excerpt.trim(),
        image: imageUrl || '',
        readTimeMinutes,
        intro: intro.trim(),
        tags: Array.from(new Set(tags.map((tag) => tag.trim()).filter(Boolean))),
        keyTakeaways: keyTakeaways.map((item) => item.trim()).filter(Boolean),
        sections: sections
          .map((section) => ({
            heading: section.heading.trim(),
            paragraphs: section.paragraphs.map((value) => value.trim()).filter(Boolean),
            bullets: section.bullets.map((value) => value.trim()).filter(Boolean),
          }))
          .filter(
            (section) => section.heading || section.paragraphs.length || section.bullets.length
          ),
        galleryImages: galleryImages,
        status: status as 'draft' | 'published',
        publishedAt: publishedAt,
        seo: {
          metaTitle: seoMetaTitle.trim(),
          metaDescription: seoMetaDescription.trim(),
          keywords: normalizeStringArray(seoKeywords),
        },
      };

      if (imageFile) {
        const uploaded = await uploadService.uploadImage(imageFile, { resourceKey: 'blog' });
        payload.image = uploaded.url;
      } else {
        payload.image = imageUrl;
      }

      if (galleryFiles.length > 0) {
        const uploaded = await uploadService.uploadMultipart(galleryFiles, { resourceKey: 'blog' });
        payload.galleryImages = [...galleryImages, ...uploaded.map((item) => item.url)];
      }

      if (mode === 'edit' && id) {
        await updateAdminBlog(id, payload);
        toast.push('Blog post updated successfully.', 'success');
      } else {
        await createAdminBlog(payload);
        toast.push('Blog post created successfully.', 'success');
      }

      setSuccess(true);
      window.setTimeout(() => navigate('/blog'), 400);
    } catch (err: any) {
      setError(err?.message || 'Unable to save this blog post.');
      toast.push('Unable to save this blog post.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const titleLabel = mode === 'create' ? 'Create Blog Post' : `Edit ${title || 'Blog Post'}`;

  if (loading) {
    return (
      <PageContainer>
        <LoadingSkeleton className="h-80 w-full" />
      </PageContainer>
    );
  }

  if (error && mode === 'edit' && !title) {
    return (
      <PageContainer>
        <EmptyState title="Unable to load blog post" description={error} />
      </PageContainer>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Website Content"
        title={titleLabel}
        description="Create or update blog content with structured article sections, galleries, SEO, and publish controls."
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/blog', label: 'Blog & Gallery' },
          {
            to: mode === 'create' ? '/blog/new' : `/blog/${id}/edit`,
            label: mode === 'create' ? 'New' : 'Edit',
          },
        ]}
        meta={
          success ? (
            <StatusBadge tone="green">Saved</StatusBadge>
          ) : (
            <StatusBadge tone="blue">Draft Safe</StatusBadge>
          )
        }
      />

      <PageContainer>
        <form onSubmit={handleSubmit} className="space-y-6">
          <DashboardCard
            title="Basic Information"
            description="Core blog metadata for listing, SEO, and publication."
            className="space-y-6"
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <Input
                label="Title"
                value={title}
                onChange={(event) => {
                  const nextTitle = event.target.value;
                  setTitle(nextTitle);
                  if (!slugTouched) setSlug(normalizeSlug(nextTitle));
                }}
                required
                hint={formErrors.title || undefined}
              />
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <Input
                label="Slug"
                value={slug}
                onChange={(event) => {
                  setSlug(event.target.value);
                  setSlugTouched(true);
                }}
                hint={formErrors.slug || 'SEO-friendly URL segment. Lowercase, hyphen-separated.'}
                required
              />
              <Select
                label="Type"
                value={type}
                onChange={(event) => setType(event.target.value)}
                options={typeOptions}
              />
              <Select
                label="Category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                options={[
                  { label: 'Select category', value: '' },
                  ...categories.map((item) => ({ label: item, value: item })),
                ]}
              />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <Textarea
                label="Excerpt"
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                rows={4}
                required
                hint={formErrors.excerpt || undefined}
              />
              <Input
                label="Read time (minutes)"
                type="number"
                min={1}
                max={180}
                value={readTimeMinutes}
                onChange={(event) => setReadTimeMinutes(Number(event.target.value))}
                required
                hint={formErrors.readTimeMinutes || undefined}
              />
            </div>
          </DashboardCard>

          <DashboardCard
            title="Featured Image"
            description="Upload a featured image through the existing media workflow."
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <Input
                  label="Featured image URL"
                  value={imageUrl}
                  onChange={(event) => {
                    setImageUrl(event.target.value);
                    if (event.target.value) setImageFile(null);
                  }}
                  placeholder="Enter an image URL or upload a file."
                  hint={formErrors.image || undefined}
                />
                <label className="block text-sm">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Upload image file
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleImageFile(event.target.files?.[0] ?? null)}
                    className="block w-full text-sm text-charcoal"
                  />
                </label>
                <p className="text-xs text-muted-foreground">
                  Use the media library or upload a new asset. Uploaded files are stored in the
                  admin uploads folder.
                </p>
              </div>
              <div className="flex items-center justify-center rounded border border-border bg-surface p-4">
                {featuredImagePreview ? (
                  <img
                    src={featuredImagePreview}
                    alt="Featured preview"
                    className="max-h-60 w-full max-w-full object-cover"
                  />
                ) : (
                  <div className="text-sm text-muted-foreground">No featured image selected.</div>
                )}
              </div>
            </div>
          </DashboardCard>

          <DashboardCard
            title="Article Content"
            description="Structured content for the public blog detail page."
            className="space-y-6"
          >
            <Textarea
              label="Intro"
              value={intro}
              onChange={(event) => setIntro(event.target.value)}
              rows={4}
              required
              hint={formErrors.intro || undefined}
            />
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-charcoal">Key Takeaways</h3>
                  <p className="text-xs text-muted-foreground">
                    Add short highlights for the post.
                  </p>
                </div>
                <Button type="button" onClick={addKeyTakeaway} disabled={!newTakeaway.trim()}>
                  Add takeaway
                </Button>
              </div>
              <div className="grid gap-3">
                <div className="grid gap-2 md:grid-cols-[1fr_auto]">
                  <Input
                    label="New takeaway"
                    value={newTakeaway}
                    onChange={(event) => setNewTakeaway(event.target.value)}
                    placeholder="Enter takeaway text"
                  />
                </div>
                {keyTakeaways.length > 0 && (
                  <div className="space-y-2">
                    {keyTakeaways.map((takeaway, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded border border-border bg-surface p-3"
                      >
                        <div className="flex-1 text-sm text-charcoal">{takeaway}</div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeKeyTakeaway(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-charcoal">Sections</h3>
                  <p className="text-xs text-muted-foreground">
                    Organize headings, paragraphs, and bullet lists.
                  </p>
                </div>
                <Button type="button" onClick={addSection}>
                  Add section
                </Button>
              </div>
              {sections.length === 0 ? (
                <EmptyState
                  title="No sections yet"
                  description="Add a section to build the article body."
                />
              ) : (
                <div className="space-y-4">
                  {sections.map((section, sectionIndex) => (
                    <div
                      key={sectionIndex}
                      className="space-y-3 rounded border border-border bg-surface p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h4 className="text-sm font-semibold text-charcoal">
                          Section {sectionIndex + 1}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => moveSection(sectionIndex, 'up')}
                            disabled={sectionIndex === 0}
                          >
                            Move up
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => moveSection(sectionIndex, 'down')}
                            disabled={sectionIndex === sections.length - 1}
                          >
                            Move down
                          </Button>
                          <Button
                            type="button"
                            variant="danger"
                            onClick={() => removeSection(sectionIndex)}
                          >
                            Remove section
                          </Button>
                        </div>
                      </div>
                      <Input
                        label="Heading"
                        value={section.heading}
                        onChange={(event) =>
                          updateSection(sectionIndex, { ...section, heading: event.target.value })
                        }
                      />
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-4">
                          <h5 className="text-sm font-semibold text-charcoal">Paragraphs</h5>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addParagraph(sectionIndex)}
                          >
                            Add paragraph
                          </Button>
                        </div>
                        {section.paragraphs.map((paragraph, paragraphIndex) => (
                          <div key={paragraphIndex} className="space-y-2">
                            <Textarea
                              label={`Paragraph ${paragraphIndex + 1}`}
                              value={paragraph}
                              onChange={(event) =>
                                setParagraph(sectionIndex, paragraphIndex, event.target.value)
                              }
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => removeParagraph(sectionIndex, paragraphIndex)}
                            >
                              Remove paragraph
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-4">
                          <h5 className="text-sm font-semibold text-charcoal">Bullets</h5>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addBullet(sectionIndex)}
                          >
                            Add bullet
                          </Button>
                        </div>
                        {section.bullets.map((bullet, bulletIndex) => (
                          <div key={bulletIndex} className="grid gap-2 md:grid-cols-[1fr_auto]">
                            <Input
                              label={`Bullet ${bulletIndex + 1}`}
                              value={bullet}
                              onChange={(event) =>
                                setBullet(sectionIndex, bulletIndex, event.target.value)
                              }
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => removeBullet(sectionIndex, bulletIndex)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DashboardCard>

          {type === 'Gallery' && (
            <DashboardCard
              title="Gallery Images"
              description="Upload multiple images for gallery posts."
              className="space-y-4"
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-3">
                  <label className="block text-sm">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Upload gallery images
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => void handleGalleryFiles(event.target.files)}
                      className="block w-full text-sm text-charcoal"
                    />
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Uploaded gallery images are added to this gallery post and stored through the
                    admin uploads service.
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {galleryImages.map((url, index) => (
                  <div
                    key={url + index}
                    className="group rounded border border-border bg-surface p-2"
                  >
                    <img
                      src={url}
                      alt={`Gallery ${index + 1}`}
                      className="h-36 w-full rounded object-cover"
                    />
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => moveGalleryImage(index, 'left')}
                        disabled={index === 0}
                      >
                        ←
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => moveGalleryImage(index, 'right')}
                        disabled={index === galleryImages.length - 1}
                      >
                        →
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => removeGalleryImage(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          )}

          <DashboardCard title="Tags" description="Organize posts with unique tag names.">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <Input
                label="Add tag"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                placeholder="Enter tag and press Add"
              />
              <Button type="button" onClick={addTag} disabled={!tagInput.trim()}>
                Add tag
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-sm text-charcoal"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </DashboardCard>

          <DashboardCard
            title="SEO"
            description="Search appearance settings for the blog post."
            className="space-y-4"
          >
            <Input
              label="Meta title"
              value={seoMetaTitle}
              onChange={(event) => setSeoMetaTitle(event.target.value)}
            />
            <Textarea
              label="Meta description"
              value={seoMetaDescription}
              onChange={(event) => setSeoMetaDescription(event.target.value)}
              rows={3}
            />
            <Input
              label="Keywords"
              value={seoKeywords}
              onChange={(event) => setSeoKeywords(event.target.value)}
              hint="Comma-separated keywords that support search engine snippets."
            />
          </DashboardCard>

          <DashboardCard
            title="Publication"
            description="Control post status and publish date."
            className="space-y-4"
          >
            <div className="grid gap-4 lg:grid-cols-3">
              <Select
                label="Status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                options={statusOptions}
              />
              <Input
                label="Published date"
                type="date"
                value={publishedAt}
                onChange={(event) => setPublishedAt(event.target.value)}
                required
                hint={formErrors.publishedAt || undefined}
              />
              <div className="flex items-end">
                <Button type="submit" disabled={saving}>
                  <Save />
                  {saving ? 'Saving...' : 'Save post'}
                </Button>
              </div>
            </div>
            {formErrors.image && <p className="text-xs text-red-600">{formErrors.image}</p>}
            {formErrors.galleryImages && (
              <p className="text-xs text-red-600">{formErrors.galleryImages}</p>
            )}
          </DashboardCard>

          {error && (
            <div className="rounded border border-red-400 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Blog post saved successfully.
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-divider pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => navigate('/blog')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              <Save />
              {saving ? 'Saving...' : 'Save post'}
            </Button>
          </div>
        </form>
      </PageContainer>
    </>
  );
}
