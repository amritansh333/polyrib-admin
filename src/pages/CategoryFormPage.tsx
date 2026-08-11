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

export default function CategoryFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const repository = useRepository();
  const { item, loading, error, save } = useResourceItem(
    'categories',
    mode === 'edit' ? id : undefined
  );

  const [values, setValues] = React.useState<FormValues>({
    name: '',
    slug: '',
    order: '99',
    image: null,
    description: '',
  });
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (item) {
      setValues((cur) => ({
        ...cur,
        name: item.name ?? '',
        slug: item.slug ?? '',
        order: String((item as any).order ?? 99),
        description: item.description ?? '',
      }));
    }
  }, [item]);

  const fields: FormFieldConfig[] = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'text', required: true },
    { name: 'order', label: 'Order', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'image', label: 'Primary Image', type: 'image' },
  ];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: FormErrors = {};
    if (!values.name) nextErrors.name = 'Name is required.';
    if (!values.slug) nextErrors.slug = 'Slug is required.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      const entity: DataEntity = {
        id: item?.id ?? '',
        name: String(values.name ?? ''),
        slug: String(values.slug ?? ''),
        order: Number(String(values.order ?? '99')),
        description: String(values.description ?? ''),
      } as any;

      if (values.image instanceof File) {
        const asset = await uploadService.uploadImage(values.image as File, {
          resourceKey: 'categories',
        });
        (entity as any).image = asset.url;
      }

      await save(entity);
      toast.push('Category saved successfully.', 'success');
      navigate('/categories');
    } catch (err: any) {
      toast.push(err?.message ?? 'Unable to save category.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title={mode === 'create' ? 'New Category' : `Edit ${item?.name ?? 'Category'}`}
        description="Maintain category taxonomy and ordering."
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/categories', label: 'Categories' },
          {
            to: mode === 'create' ? '/categories/new' : `/categories/${id}/edit`,
            label: mode === 'create' ? 'New' : 'Edit',
          },
        ]}
        meta={<div />}
      />

      <PageContainer>
        <DashboardCard title="Category Details">
          {loading ? (
            <LoadingSkeleton className="h-40 w-full" />
          ) : mode === 'edit' && (error || !item) ? (
            <EmptyState
              title="Category unavailable"
              description={error ?? 'This category cannot be edited.'}
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
                <Button type="button" variant="outline" onClick={() => navigate('/categories')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  <Save />
                  {saving ? 'Saving...' : 'Save Category'}
                </Button>
              </div>
            </form>
          )}
        </DashboardCard>
      </PageContainer>
    </>
  );
}
