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
import type { DataEntity } from '../types/admin';

const EXPERIENCE_OPTIONS = [
  { label: 'Semi Finished', value: 'semi_finished' },
  { label: 'Machine Components', value: 'machine_components' },
];

export default function ProductFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const repository = useRepository();
  const config = resources.find((r) => r.key === 'products');

  const { item, loading, error, save } = useResourceItem('products', mode === 'edit' ? id : undefined);
  const itemAny = item as any;
  const [categories, setCategories] = React.useState<Array<{ id: string; name: string }>>([]);
  const [subcategories, setSubcategories] = React.useState<Array<{ id: string; name: string }>>([]);
  const [brands, setBrands] = React.useState<Array<{ id: string; name: string }>>([]);
  const [materials, setMaterials] = React.useState<Array<{ id: string; name: string }>>([]);
  const [industries, setIndustries] = React.useState<Array<{ id: string; name: string }>>([]);
  const [values, setValues] = React.useState<any>({
    name: '',
    slug: '',
    category: '',
    subCategory: '',
    brand: '',
    materials: [] as string[],
    industries: [] as string[],
    experience: '',
    order: 99,
    path: '',
    pdfUrl: '',
    isVisible: true,
    image: null,
    description: [] as string[],
    keyFeatures: [] as string[],
    applications: [] as string[],
    specifications: {} as Record<string, unknown>,
    downloads: [] as { label?: string; url?: string }[],
    seo: { metaTitle: '', metaDescription: '', keywords: [] as string[] },
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    async function loadOptions() {
      try {
        const [categoryResult, subcategoryResult, brandResult, materialResult, industryResult] =
          await Promise.all([
            repository.list('categories', { pageSize: 200 }),
            repository.list('subcategories', { pageSize: 200 }),
            repository.list('brands', { pageSize: 200 }),
            repository.list('materials', { pageSize: 200 }),
            repository.list('industries', { pageSize: 200 }),
          ]);

        setCategories(
          categoryResult.rows.map((entry) => ({ id: entry.id, name: entry.name || entry.slug || entry.id }))
        );
        setSubcategories(
          subcategoryResult.rows.map((entry) => ({ id: entry.id, name: entry.name || entry.slug || entry.id }))
        );
        setBrands(
          brandResult.rows.map((entry) => ({ id: entry.id, name: entry.name || entry.slug || entry.id }))
        );
        setMaterials(
          materialResult.rows.map((entry) => ({ id: entry.id, name: entry.name || entry.slug || entry.id }))
        );
        setIndustries(
          industryResult.rows.map((entry) => ({ id: entry.id, name: entry.name || entry.slug || entry.id }))
        );
      } catch {
        // ignore option load failures
      }
    }

    void loadOptions();
  }, [repository]);

  React.useEffect(() => {
    if (!item) return;

    setValues((cur: any) => ({
      ...cur,
      name: item.name ?? '',
      slug: item.slug ?? '',
      category: itemAny?.categoryId ?? normalizeReferenceId(itemAny?.category) ?? '',
      subCategory: itemAny?.subCategoryId ?? normalizeReferenceId(itemAny?.subCategory) ?? '',
      brand: itemAny?.brandId ?? normalizeReferenceId(itemAny?.brand) ?? '',
      materials: Array.isArray(itemAny?.materials)
        ? itemAny.materials.map((material: unknown) => normalizeReferenceId(material)).filter(Boolean)
        : [],
      industries: Array.isArray(itemAny?.industries)
        ? itemAny.industries.map((industry: unknown) => normalizeReferenceId(industry)).filter(Boolean)
        : [],
      experience: itemAny?.experience ?? '',
      order: itemAny?.order ?? 99,
      path: itemAny?.path ?? '',
      pdfUrl: itemAny?.pdfUrl ?? '',
      isVisible: itemAny?.isVisible ?? true,
      image: null,
      description: Array.isArray(itemAny?.description)
        ? itemAny.description
        : itemAny?.description
          ? [String(itemAny.description)]
          : [],
      keyFeatures: Array.isArray(itemAny?.keyFeatures) ? itemAny.keyFeatures : [],
      applications: Array.isArray(itemAny?.applications) ? itemAny.applications : [],
      specifications:
        itemAny?.specifications && typeof itemAny.specifications === 'object'
          ? Object.fromEntries(Object.entries(itemAny.specifications))
          : {},
      downloads: Array.isArray(itemAny?.downloadRecords)
        ? itemAny.downloadRecords
        : Array.isArray(itemAny?.downloads)
          ? itemAny.downloads
          : [],
      seo:
        item.seo && typeof item.seo === 'object'
          ? item.seo
          : { metaTitle: '', metaDescription: '', keywords: [] },
    }));
  }, [item]);

  const updateField = (path: string, value: unknown) => {
    setValues((cur: any) => {
      const next = { ...cur };
      const parts = path.split('.');
      let target: any = next;
      for (let i = 0; i < parts.length - 1; i += 1) {
        const part = parts[i];
        if (target[part] === undefined || target[part] === null) {
          target[part] = {};
        }
        target = target[part];
      }
      target[parts[parts.length - 1]] = value;
      return next;
    });
  };

  const addArrayItem = (key: string, value: string = '') => {
    setValues((cur: any) => ({ ...cur, [key]: [...(cur[key] ?? []), value] }));
  };

  const removeArrayItem = (key: string, index: number) => {
    setValues((cur: any) => ({
      ...cur,
      [key]: (cur[key] ?? []).filter((_: any, i: number) => i !== index),
    }));
  };

  const toggleMaterial = (materialId: string) => {
    setValues((cur: any) => {
      const materials = Array.isArray(cur.materials) ? [...cur.materials] : [];
      if (materials.includes(materialId)) {
        return { ...cur, materials: materials.filter((id: string) => id !== materialId) };
      }
      return { ...cur, materials: [...materials, materialId] };
    });
  };

  const toggleIndustry = (industryId: string) => {
    setValues((cur: any) => {
      const industries = Array.isArray(cur.industries) ? [...cur.industries] : [];
      if (industries.includes(industryId)) {
        return { ...cur, industries: industries.filter((id: string) => id !== industryId) };
      }
      return { ...cur, industries: [...industries, industryId] };
    });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!values.name) nextErrors.name = 'Name is required.';
    if (!values.slug) nextErrors.slug = 'Slug is required.';
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
        category: values.category || undefined,
        subCategory: values.subCategory || undefined,
        brand: values.brand || undefined,
        materials: Array.isArray(values.materials)
          ? values.materials.filter(Boolean)
          : undefined,
        industries: Array.isArray(values.industries)
          ? values.industries.filter(Boolean)
          : undefined,
        experience: values.experience || undefined,
        order: Number(values.order ?? 99),
        path: values.path ? String(values.path) : undefined,
        pdfUrl: values.pdfUrl ? String(values.pdfUrl) : undefined,
        isVisible: Boolean(values.isVisible),
        description: Array.isArray(values.description)
          ? values.description
          : [],
        keyFeatures: Array.isArray(values.keyFeatures) ? values.keyFeatures : [],
        applications: Array.isArray(values.applications) ? values.applications : [],
        specifications: cleanedSpecifications,
        downloads: Array.isArray(values.downloads)
          ? values.downloads.filter((download: any) => download.label || download.url)
          : [],
        seo: values.seo || {},
      };

      if (values.image instanceof File) {
        const asset = await uploadService.uploadImage(values.image as File, {
          resourceKey: 'products',
        });
        payload.image = asset.url;
      }

      await save(payload);
      toast.push('Product saved successfully.', 'success');
      navigate('/products');
    } catch (err: any) {
      toast.push(err?.message ?? 'Unable to save product.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader
          eyebrow={config?.eyebrow}
          title={mode === 'create' ? 'New Product' : `Edit ${item?.name ?? 'Product'}`}
          description={config?.description}
          breadcrumbs={[
            { to: '/dashboard', label: 'Admin' },
            { to: '/products', label: 'Products' },
          ]}
          meta={<div />}
        />
        <PageContainer>
          <LoadingSkeleton className="h-64 w-full" />
        </PageContainer>
      </>
    );
  }

  if (mode === 'edit' && (error || !item)) {
    return (
      <>
        <PageHeader
          eyebrow={config?.eyebrow}
          title={`Edit ${item?.name ?? 'Product'}`}
          description={config?.description}
          breadcrumbs={[
            { to: '/dashboard', label: 'Admin' },
            { to: '/products', label: 'Products' },
          ]}
          meta={<div />}
        />
        <PageContainer>
          <EmptyState title="Product unavailable" description={error ?? 'This product cannot be edited.'} />
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={config?.eyebrow}
        title={mode === 'create' ? 'New Product' : `Edit ${item?.name ?? 'Product'}`}
        description={config?.description}
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/products', label: 'Products' },
          { to: mode === 'create' ? '/products/new' : `/products/${id}/edit`, label: mode === 'create' ? 'New' : 'Edit' },
        ]}
        meta={<div />}
      />

      <PageContainer>
        <DashboardCard title="Product Details">
          <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Name</label>
                <input
                  className="mt-1 block w-full rounded border border-divider px-3 py-2"
                  value={values.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
                {errors.name && <p className="mt-1 text-xs font-semibold text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Slug</label>
                <input
                  className="mt-1 block w-full rounded border border-divider px-3 py-2"
                  value={values.slug}
                  onChange={(e) => updateField('slug', e.target.value)}
                />
                {errors.slug && <p className="mt-1 text-xs font-semibold text-red-600">{errors.slug}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Category</label>
                <select
                  className="mt-1 block w-full rounded border border-divider bg-white px-3 py-2"
                  value={values.category}
                  onChange={(e) => updateField('category', e.target.value)}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Subcategory</label>
                <select
                  className="mt-1 block w-full rounded border border-divider bg-white px-3 py-2"
                  value={values.subCategory}
                  onChange={(e) => updateField('subCategory', e.target.value)}
                >
                  <option value="">Select subcategory</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Brand</label>
                <select
                  className="mt-1 block w-full rounded border border-divider bg-white px-3 py-2"
                  value={values.brand}
                  onChange={(e) => updateField('brand', e.target.value)}
                >
                  <option value="">Select brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Experience</label>
                <select
                  className="mt-1 block w-full rounded border border-divider bg-white px-3 py-2"
                  value={values.experience}
                  onChange={(e) => updateField('experience', e.target.value)}
                >
                  <option value="">Select experience</option>
                  {EXPERIENCE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Order</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded border border-divider px-3 py-2"
                  value={values.order}
                  onChange={(e) => updateField('order', Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Path</label>
                <input
                  className="mt-1 block w-full rounded border border-divider px-3 py-2"
                  value={values.path}
                  onChange={(e) => updateField('path', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">PDF URL</label>
                <input
                  className="mt-1 block w-full rounded border border-divider px-3 py-2"
                  value={values.pdfUrl}
                  onChange={(e) => updateField('pdfUrl', e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Primary Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2"
                  onChange={(e) => updateField('image', e.target.files?.[0] ?? null)}
                />
                {item?.image && !values.image && (
                  <p className="mt-2 text-sm text-muted-foreground">Current image: {item.image}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Visibility</label>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    className={`rounded-full px-3 py-2 text-sm ${values.isVisible ? 'bg-primary text-white' : 'border border-divider text-charcoal'}`}
                    onClick={() => updateField('isVisible', true)}
                  >
                    Visible
                  </button>
                  <button
                    type="button"
                    className={`rounded-full px-3 py-2 text-sm ${!values.isVisible ? 'bg-secondary text-white' : 'border border-divider text-charcoal'}`}
                    onClick={() => updateField('isVisible', false)}
                  >
                    Hidden
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Materials</label>
                <div className="mt-2 space-y-2">
                  <select
                    value=""
                    onChange={(e) => {
                      const next = e.target.value;
                      if (next) toggleMaterial(next);
                    }}
                    className="block w-full rounded border border-divider bg-white px-3 py-2"
                  >
                    <option value="">Add material</option>
                    {materials.map((material) => (
                      <option key={material.id} value={material.id}>
                        {material.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-2">
                    {(values.materials || []).map((materialId: string) => {
                      const material = materials.find((entry) => entry.id === materialId);
                      return (
                        <span key={materialId} className="inline-flex items-center gap-2 rounded-full border border-divider bg-surface-subtle px-3 py-1 text-xs">
                          {material?.name ?? materialId}
                          <button type="button" onClick={() => toggleMaterial(materialId)} className="text-red-600">×</button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Industries</label>
                <div className="mt-2 space-y-2">
                  <select
                    value=""
                    onChange={(e) => {
                      const next = e.target.value;
                      if (next) toggleIndustry(next);
                    }}
                    className="block w-full rounded border border-divider bg-white px-3 py-2"
                  >
                    <option value="">Add industry</option>
                    {industries.map((industry) => (
                      <option key={industry.id} value={industry.id}>
                        {industry.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-2">
                    {(values.industries || []).map((industryId: string) => {
                      const industry = industries.find((entry) => entry.id === industryId);
                      return (
                        <span key={industryId} className="inline-flex items-center gap-2 rounded-full border border-divider bg-surface-subtle px-3 py-1 text-xs">
                          {industry?.name ?? industryId}
                          <button type="button" onClick={() => toggleIndustry(industryId)} className="text-red-600">×</button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Description</label>
                <div className="mt-2 space-y-2">
                  {(values.description || []).map((value: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <input
                        className="flex-1 rounded border border-divider px-3 py-2"
                        value={value}
                        onChange={(e) =>
                          setValues((cur: any) => ({
                            ...cur,
                            description: cur.description.map((item: any, idx: number) => (idx === index ? e.target.value : item)),
                          }))
                        }
                      />
                      <Button type="button" variant="outline" onClick={() => removeArrayItem('description', index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button type="button" onClick={() => addArrayItem('description', '')}>
                    Add line
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Key Features</label>
                <div className="mt-2 space-y-2">
                  {(values.keyFeatures || []).map((value: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <input
                        className="flex-1 rounded border border-divider px-3 py-2"
                        value={value}
                        onChange={(e) =>
                          setValues((cur: any) => ({
                            ...cur,
                            keyFeatures: cur.keyFeatures.map((item: any, idx: number) => (idx === index ? e.target.value : item)),
                          }))
                        }
                      />
                      <Button type="button" variant="outline" onClick={() => removeArrayItem('keyFeatures', index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button type="button" onClick={() => addArrayItem('keyFeatures', '')}>
                    Add feature
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Applications</label>
                <div className="mt-2 space-y-2">
                  {(values.applications || []).map((value: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <input
                        className="flex-1 rounded border border-divider px-3 py-2"
                        value={value}
                        onChange={(e) =>
                          setValues((cur: any) => ({
                            ...cur,
                            applications: cur.applications.map((item: any, idx: number) => (idx === index ? e.target.value : item)),
                          }))
                        }
                      />
                      <Button type="button" variant="outline" onClick={() => removeArrayItem('applications', index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button type="button" onClick={() => addArrayItem('applications', '')}>
                    Add application
                  </Button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Specifications</label>
                <div className="mt-2 space-y-3">
                  {Object.entries(values.specifications || {}).map(([key, value]: [string, any], index: number) => (
                    <div key={index} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
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
                        onChange={(e) =>
                          setValues((cur: any) => ({
                            ...cur,
                            specifications: { ...cur.specifications, [key]: e.target.value },
                          }))
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setValues((cur: any) => {
                            const specs = { ...cur.specifications };
                            delete specs[key];
                            return { ...cur, specifications: specs };
                          })
                        }
                      >
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
                <div className="mt-2 space-y-3">
                  {(values.downloads || []).map((download: any, index: number) => (
                    <div key={index} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                      <input
                        className="rounded border border-divider px-3 py-2"
                        placeholder="Label"
                        value={download.label ?? ''}
                        onChange={(e) =>
                          setValues((cur: any) => ({
                            ...cur,
                            downloads: cur.downloads.map((item: any, idx: number) =>
                              idx === index ? { ...item, label: e.target.value } : item
                            ),
                          }))
                        }
                      />
                      <input
                        className="rounded border border-divider px-3 py-2"
                        placeholder="URL"
                        value={download.url ?? ''}
                        onChange={(e) =>
                          setValues((cur: any) => ({
                            ...cur,
                            downloads: cur.downloads.map((item: any, idx: number) =>
                              idx === index ? { ...item, url: e.target.value } : item
                            ),
                          }))
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeArrayItem('downloads', index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() =>
                      setValues((cur: any) => ({
                        ...cur,
                        downloads: [...(cur.downloads ?? []), { label: '', url: '' }],
                      }))
                    }
                  >
                    Add download
                  </Button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground">SEO</label>
                <input
                  className="mt-2 block w-full rounded border border-divider px-3 py-2"
                  placeholder="Meta title"
                  value={values.seo?.metaTitle ?? ''}
                  onChange={(e) => updateField('seo.metaTitle', e.target.value)}
                />
                <textarea
                  className="mt-2 block w-full rounded border border-divider px-3 py-2"
                  placeholder="Meta description"
                  value={values.seo?.metaDescription ?? ''}
                  onChange={(e) => updateField('seo.metaDescription', e.target.value)}
                />
                <label className="block mt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Keywords</label>
                <div className="mt-2 space-y-2">
                  {(values.seo?.keywords || []).map((keyword: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <input
                        className="flex-1 rounded border border-divider px-3 py-2"
                        value={keyword}
                        onChange={(e) =>
                          setValues((cur: any) => ({
                            ...cur,
                            seo: {
                              ...cur.seo,
                              keywords: cur.seo.keywords.map((item: string, idx: number) =>
                                idx === index ? e.target.value : item
                              ),
                            },
                          }))
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setValues((cur: any) => ({
                            ...cur,
                            seo: {
                              ...cur.seo,
                              keywords: cur.seo.keywords.filter((_: string, idx: number) => idx !== index),
                            },
                          }))
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() =>
                      setValues((cur: any) => ({
                        ...cur,
                        seo: {
                          ...cur.seo,
                          keywords: [...(cur.seo?.keywords ?? []), ''],
                        },
                      }))
                    }
                  >
                    Add keyword
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-divider pt-4">
              <Button type="button" variant="outline" onClick={() => navigate('/products')}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                <Save />
                {saving ? 'Saving...' : 'Save Product'}
              </Button>
            </div>
          </form>
        </DashboardCard>
      </PageContainer>
    </>
  );
}

function normalizeReferenceId(value: unknown) {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    const ref = value as { id?: string; _id?: string };
    return String(ref.id ?? ref._id ?? '');
  }
  return String(value);
}
