import React from 'react';
import { Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/Button';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { FieldRenderer, type FormErrors, type FormValues } from '../components/FormFields';
import useResourceItem from '../hooks/useResourceItem';
import { useRepository } from '../repositories/RepositoryProvider';
import { useToast } from '../providers/ToastProvider';
import { uploadService } from '../services/uploadService';
import type { DataEntity, FormFieldConfig } from '../types/admin';

export default function BrandFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const repository = useRepository();
  const { item, loading, error, save } = useResourceItem(
    'brands',
    mode === 'edit' ? id : undefined
  );
  const [subcategories, setSubcategories] = React.useState<DataEntity[]>([]);
  const [values, setValues] = React.useState<FormValues>({
    name: '',
    slug: '',
    subCategory: '',
    image: null,
    description: '',
    order: '99',
  });
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (item) {
      setValues((current) => ({
        ...current,
        name: item.name ?? '',
        slug: item.slug ?? '',
        description: item.description ?? '',
        order: String((item as any).order ?? 99),
      }));
    }
  }, [item]);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const list = await repository.list('subcategories', { pageSize: 200 });
        if (!active) return;
        setSubcategories(list.rows ?? []);
      } catch {
        // ignore
      }
    })();
    return () => {
      active = false;
    };
  }, [repository]);

  const fields: FormFieldConfig[] = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'text', required: true },
    {
      name: 'subCategory',
      label: 'Subcategory',
      type: 'select',
      required: true,
      options: subcategories.map((s) => ({ label: s.name, value: s.id })),
    },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'image', label: 'Primary Image', type: 'image' },
    { name: 'order', label: 'Order', type: 'text' },
  ];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: FormErrors = {};
    if (!values.name) nextErrors.name = 'Name is required.';
    if (!values.slug) nextErrors.slug = 'Slug is required.';
    if (!values.subCategory) nextErrors.subCategory = 'Subcategory is required.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      const entity: DataEntity = {
        id: item?.id ?? '',
        name: String(values.name ?? ''),
        slug: String(values.slug ?? ''),
        description: String(values.description ?? ''),
        order: Number(String(values.order ?? '99')),
        // backend expects subCategory ObjectId field
        subCategory: String(values.subCategory ?? ''),
      } as any;

      if (values.image instanceof File) {
        const asset = await uploadService.uploadImage(values.image as File, {
          resourceKey: 'brands',
        });
        (entity as any).image = asset.url;
      }

      await save(entity);
      toast.push('Brand saved successfully.', 'success');
      navigate('/brands');
    } catch (err: any) {
      toast.push(err?.message ?? 'Unable to save brand.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Brand Portfolio"
        title={mode === 'create' ? 'New Brand' : `Edit ${item?.name ?? 'Brand'}`}
        description="Maintain brand family records."
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/brands', label: 'Brands' },
          {
            to: mode === 'create' ? '/brands/new' : `/brands/${id}/edit`,
            label: mode === 'create' ? 'New' : 'Edit',
          },
        ]}
        meta={<div />}
      />

      <PageContainer>
        <DashboardCard title="Brand Details">
          {loading ? (
            <LoadingSkeleton className="h-40 w-full" />
          ) : mode === 'edit' && (error || !item) ? (
            <EmptyState
              title="Brand unavailable"
              description={error ?? 'This brand cannot be edited.'}
            />
          ) : (
            <form onSubmit={submit} className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                {fields.map((field) => (
                  <div
                    key={String(field.name)}
                    className={field.type === 'textarea' ? 'md:col-span-2' : undefined}
                  >
                    <FieldRenderer
                      field={field}
                      value={(values as any)[String(field.name)]}
                      error={(errors as any)[String(field.name)]}
                      disabled={saving}
                      onChange={(name, value) => setValues((cur) => ({ ...cur, [name]: value }))}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 border-t border-divider pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/brands')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  <Save />
                  {saving ? 'Saving...' : 'Save Brand'}
                </Button>
              </div>
            </form>
          )}
        </DashboardCard>
      </PageContainer>
    </>
  );
}
