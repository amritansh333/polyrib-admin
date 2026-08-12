import React from 'react';
import { Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/Button';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import useResourceItem from '../hooks/useResourceItem';
import { useRepository } from '../repositories/RepositoryProvider';
import { useToast } from '../providers/ToastProvider';
import { uploadService } from '../services/uploadService';
import { resources } from '../services/mockData';

export default function SubcategoryFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const repository = useRepository();
  const { item, loading, error, save } = useResourceItem('subcategories', mode === 'edit' ? id : undefined);
  const config = resources.find((r) => r.key === 'subcategories');
  const [categories, setCategories] = React.useState<Array<{ id: string; name: string }>>([]);

  const [values, setValues] = React.useState<any>({
    name: '',
    slug: '',
    category: '',
    order: 99,
    image: null,
    heroTitle: '',
    heroSubtitle: '',
    description: [] as string[],
    technicalCharacteristics: [] as string[],
    applications: [] as string[],
    specifications: {} as Record<string, unknown>,
    downloads: [] as { label?: string; url?: string }[],
    seo: { metaTitle: '', metaDescription: '', keywords: [] as string[] },
    experience: '',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    async function loadCategories() {
      try {
        const result = await repository.list('categories', { pageSize: 200 });
        setCategories(
          result.rows.map((category: any) => ({
            id: category.id,
            name: category.name || category.slug || category.id,
          }))
        );
      } catch {
        setCategories([]);
      }
    }

    void loadCategories();
  }, [repository]);

  React.useEffect(() => {
    if (item) {
      const categoryValue = item.category
        ? typeof item.category === 'object'
          ? String((item.category as any).id ?? (item.category as any)._id ?? item.category)
          : String(item.category)
        : '';

      setValues((cur: any) => ({
        ...cur,
        name: item.name ?? '',
        slug: item.slug ?? '',
        category: categoryValue,
        order: item.order ?? 99,
        image: null,
        heroTitle: item.heroTitle ?? '',
        heroSubtitle: item.heroSubtitle ?? '',
        description: Array.isArray(item.description) ? item.description : item.description ? [String(item.description)] : [],
        technicalCharacteristics: Array.isArray(item.technicalCharacteristics) ? item.technicalCharacteristics : [],
        applications: Array.isArray(item.applications) ? item.applications : [],
        specifications:
          item.specifications && typeof item.specifications === 'object'
            ? Object.fromEntries(Object.entries(item.specifications))
            : {},
        downloads: Array.isArray(item.downloads) ? item.downloads : [],
        seo: item.seo ? item.seo : { metaTitle: '', metaDescription: '', keywords: [] },
        experience: item.experience ?? '',
      }));
    }
  }, [item]);

  const updateField = (path: string, value: any) => {
    setValues((cur: any) => {
      const next = { ...cur };
      const parts = path.split('.');
      let target: any = next;
      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        target[p] = target[p] ?? {};
        target = target[p];
      }
      target[parts[parts.length - 1]] = value;
      return next;
    });
  };

  const addArrayItem = (key: string, value: string = '') => {
    setValues((cur: any) => ({ ...cur, [key]: [...(cur[key] ?? []), value] }));
  };

  const removeArrayItem = (key: string, idx: number) => {
    setValues((cur: any) => ({ ...cur, [key]: (cur[key] ?? []).filter((_: any, i: number) => i !== idx) }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!values.name) nextErrors.name = 'Name is required.';
    if (!values.slug) nextErrors.slug = 'Slug is required.';
    if (!values.category) nextErrors.category = 'Category is required.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      const cleanedSpecifications = Object.entries(values.specifications || {}).reduce(
        (acc: Record<string, unknown>, [key, value]) => {
          if (key && value !== undefined && value !== null && String(value).trim() !== '') {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      const payload: any = {
        id: item?.id ?? undefined,
        name: String(values.name ?? ''),
        slug: String(values.slug ?? ''),
        category: String(values.category ?? ''),
        order: Number(values.order ?? 99),
        heroTitle: String(values.heroTitle ?? ''),
        heroSubtitle: String(values.heroSubtitle ?? ''),
        description: Array.isArray(values.description) ? values.description : [],
        technicalCharacteristics: Array.isArray(values.technicalCharacteristics) ? values.technicalCharacteristics : [],
        applications: Array.isArray(values.applications) ? values.applications : [],
        specifications: cleanedSpecifications,
        downloads: Array.isArray(values.downloads) ? values.downloads.filter((download: any) => download.url || download.label) : [],
        seo: values.seo ? values.seo : {},
        experience: values.experience ?? undefined,
      };

      // handle image upload if a new File was selected
      if (values.image instanceof File) {
        const uploaded = await uploadService.uploadImage(values.image as File, { resourceKey: 'subcategories' });
        payload.image = uploaded.url;
      } else if (item && item.image && !values.image) {
        // preserve existing image when not replaced (do nothing)
      }

      // When creating, backend requires name, slug, category — others optional

      // Use save helper which calls repository.create/update
      await save(payload);
      toast.push('Subcategory saved successfully.', 'success');
      navigate('/subcategories');
    } catch (err: any) {
      toast.push(err?.message ?? 'Unable to save subcategory.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader eyebrow={config?.eyebrow} title={mode === 'create' ? 'New Subcategory' : `Edit ${item?.name ?? 'Subcategory'}`} description={config?.description} breadcrumbs={[{ to: '/dashboard', label: 'Admin' }, { to: '/subcategories', label: 'Subcategories' }]} meta={<div/>} />
        <PageContainer>
          <LoadingSkeleton className="h-64 w-full" />
        </PageContainer>
      </>
    );
  }

  if (mode === 'edit' && (error || !item)) {
    return (
      <>
        <PageHeader eyebrow={config?.eyebrow} title={`Edit ${item?.name ?? 'Subcategory'}`} description={config?.description} breadcrumbs={[{ to: '/dashboard', label: 'Admin' }, { to: '/subcategories', label: 'Subcategories' }]} meta={<div/>} />
        <PageContainer>
          <EmptyState title="Subcategory unavailable" description={error ?? 'This subcategory cannot be edited.'} />
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={config?.eyebrow}
        title={mode === 'create' ? (config?.newLabel ?? 'New Subcategory') : `Edit ${item?.name ?? 'Subcategory'}`}
        description={config?.description}
        breadcrumbs={[{ to: '/dashboard', label: 'Admin' }, { to: '/subcategories', label: 'Subcategories' }, { to: mode === 'create' ? '/subcategories/new' : `/subcategories/${id}/edit`, label: mode === 'create' ? 'New' : 'Edit' }]}
        meta={<div />}
      />

      <PageContainer>
        <DashboardCard title="Subcategory Details">
          <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Name</label>
                <input className="mt-1 block w-full rounded border border-divider px-3 py-2" value={values.name} onChange={(e) => updateField('name', e.target.value)} />
                {errors.name && <p className="mt-1 text-xs font-semibold text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Slug</label>
                <input className="mt-1 block w-full rounded border border-divider px-3 py-2" value={values.slug} onChange={(e) => updateField('slug', e.target.value)} />
                {errors.slug && <p className="mt-1 text-xs font-semibold text-red-600">{errors.slug}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Category</label>
                <select className="mt-1 block w-full rounded border border-divider bg-white px-3 py-2" value={values.category} onChange={(e) => updateField('category', e.target.value)}>
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-muted-foreground">Choose the category this subcategory belongs to.</p>
                {errors.category && <p className="mt-1 text-xs font-semibold text-red-600">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Order</label>
                <input type="number" className="mt-1 block w-full rounded border border-divider px-3 py-2" value={values.order} onChange={(e) => updateField('order', Number(e.target.value))} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Image</label>
                <div className="mt-2">
                  <input type="file" accept="image/*" onChange={(e) => updateField('image', e.target.files?.[0] ?? null)} />
                </div>
                {item?.image && !values.image && (
                  <div className="mt-2 text-sm text-muted-foreground">Current: {item.image}</div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Hero Title</label>
                <input className="mt-1 block w-full rounded border border-divider px-3 py-2" value={values.heroTitle} onChange={(e) => updateField('heroTitle', e.target.value)} />
                <label className="block mt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Hero Subtitle</label>
                <input className="mt-1 block w-full rounded border border-divider px-3 py-2" value={values.heroSubtitle} onChange={(e) => updateField('heroSubtitle', e.target.value)} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Description (multiple lines)</label>
                <div className="mt-2 space-y-2">
                  {(values.description || []).map((d: string, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <input className="flex-1 rounded border border-divider px-3 py-2" value={d} onChange={(e) => setValues((cur: any) => ({ ...cur, description: cur.description.map((v: any, i: number) => (i === idx ? e.target.value : v)) }))} />
                      <Button type="button" variant="outline" onClick={() => removeArrayItem('description', idx)}>Remove</Button>
                    </div>
                  ))}
                  <Button type="button" onClick={() => addArrayItem('description', '')}>Add line</Button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Technical Characteristics</label>
                <div className="mt-2 space-y-2">
                  {(values.technicalCharacteristics || []).map((d: string, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <input className="flex-1 rounded border border-divider px-3 py-2" value={d} onChange={(e) => setValues((cur: any) => ({ ...cur, technicalCharacteristics: cur.technicalCharacteristics.map((v: any, i: number) => (i === idx ? e.target.value : v)) }))} />
                      <Button type="button" variant="outline" onClick={() => removeArrayItem('technicalCharacteristics', idx)}>Remove</Button>
                    </div>
                  ))}
                  <Button type="button" onClick={() => addArrayItem('technicalCharacteristics', '')}>Add characteristic</Button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Applications</label>
                <div className="mt-2 space-y-2">
                  {(values.applications || []).map((d: string, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <input className="flex-1 rounded border border-divider px-3 py-2" value={d} onChange={(e) => setValues((cur: any) => ({ ...cur, applications: cur.applications.map((v: any, i: number) => (i === idx ? e.target.value : v)) }))} />
                      <Button type="button" variant="outline" onClick={() => removeArrayItem('applications', idx)}>Remove</Button>
                    </div>
                  ))}
                  <Button type="button" onClick={() => addArrayItem('applications', '')}>Add application</Button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Specifications</label>
                <div className="mt-2 space-y-4">
                  {(Object.entries(values.specifications || {}) as [string, any][]).map(([key, value], idx) => (
                    <div key={idx} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                      <input
                        className="rounded border border-divider px-3 py-2"
                        placeholder="Key"
                        value={key}
                        onChange={(e) => {
                          const nextKey = e.target.value;
                          setValues((cur: any) => {
                            const specs = { ...cur.specifications };
                            delete specs[key];
                            if (nextKey) specs[nextKey] = value;
                            return { ...cur, specifications: specs };
                          });
                        }}
                      />
                      <input
                        className="rounded border border-divider px-3 py-2"
                        placeholder="Value"
                        value={value ?? ''}
                        onChange={(e) => setValues((cur: any) => ({ ...cur, specifications: { ...cur.specifications, [key]: e.target.value } }))}
                      />
                      <Button type="button" variant="outline" onClick={() => setValues((cur: any) => {
                        const specs = { ...cur.specifications };
                        delete specs[key];
                        return { ...cur, specifications: specs };
                      })}>
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => setValues((cur: any) => ({
                      ...cur,
                      specifications: { ...cur.specifications, '': '' },
                    }))}
                  >
                    Add specification
                  </Button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Downloads</label>
                <div className="mt-2 space-y-2">
                  {(values.downloads || []).map((d: any, idx: number) => (
                    <div key={idx} className="grid gap-2 md:grid-cols-3">
                      <input className="rounded border border-divider px-3 py-2 md:col-span-1" placeholder="Label" value={d.label ?? ''} onChange={(e) => setValues((cur: any) => ({ ...cur, downloads: cur.downloads.map((v: any, i: number) => (i === idx ? { ...v, label: e.target.value } : v)) }))} />
                      <input className="rounded border border-divider px-3 py-2 md:col-span-1" placeholder="URL" value={d.url ?? ''} onChange={(e) => setValues((cur: any) => ({ ...cur, downloads: cur.downloads.map((v: any, i: number) => (i === idx ? { ...v, url: e.target.value } : v)) }))} />
                      <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" onClick={() => setValues((cur: any) => ({ ...cur, downloads: cur.downloads.filter((_: any, i: number) => i !== idx) }))}>Remove</Button>
                      </div>
                    </div>
                  ))}
                  <Button type="button" onClick={() => setValues((cur: any) => ({ ...cur, downloads: [...(cur.downloads ?? []), { label: '', url: '' }] }))}>Add download</Button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">SEO</label>
                <input className="mt-2 block w-full rounded border border-divider px-3 py-2" placeholder="Meta title" value={values.seo?.metaTitle ?? ''} onChange={(e) => updateField('seo.metaTitle', e.target.value)} />
                <textarea className="mt-2 block w-full rounded border border-divider px-3 py-2" placeholder="Meta description" value={values.seo?.metaDescription ?? ''} onChange={(e) => updateField('seo.metaDescription', e.target.value)} />
                <label className="block mt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Keywords</label>
                <div className="mt-2 space-y-2">
                  {(values.seo?.keywords || []).map((k: string, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <input className="flex-1 rounded border border-divider px-3 py-2" value={k} onChange={(e) => setValues((cur: any) => ({ ...cur, seo: { ...cur.seo, keywords: cur.seo.keywords.map((v: any, i: number) => (i === idx ? e.target.value : v)) } }))} />
                      <Button type="button" variant="outline" onClick={() => setValues((cur: any) => ({ ...cur, seo: { ...cur.seo, keywords: cur.seo.keywords.filter((_: any, i: number) => i !== idx) } }))}>Remove</Button>
                    </div>
                  ))}
                  <Button type="button" onClick={() => setValues((cur: any) => ({ ...cur, seo: { ...cur.seo, keywords: [...(cur.seo?.keywords ?? []), ''] } }))}>Add keyword</Button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Experience</label>
                <select className="mt-1 block w-full rounded border border-divider px-3 py-2" value={values.experience ?? ''} onChange={(e) => updateField('experience', e.target.value)}>
                  <option value="">(select)</option>
                  <option value="semi_finished">semi_finished</option>
                  <option value="machine_components">machine_components</option>
                </select>
                <p className="mt-1 text-xs text-muted-foreground">Choose the product experience for this subcategory.</p>
              </div>

            </div>

            <div className="flex justify-end gap-3 border-t border-divider pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/subcategories')}>Cancel</Button>
              <Button type="submit" disabled={saving}><Save />{saving ? 'Saving...' : 'Save Subcategory'}</Button>
            </div>
          </form>
        </DashboardCard>
      </PageContainer>
    </>
  );
}
