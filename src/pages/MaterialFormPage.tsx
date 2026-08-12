import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PageContainer from '../components/PageContainer';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/Button';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { FieldRenderer, type FormErrors, type FormValues } from '../components/FormFields';
import useResourceItem from '../hooks/useResourceItem';
import { useToast } from '../providers/ToastProvider';
import type { DataEntity, FormFieldConfig } from '../types/admin';

export default function MaterialFormPage({ mode }: { mode?: 'create' | 'edit' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { item, loading, error, save } = useResourceItem(
    'materials',
    mode === 'edit' ? id : undefined
  );

  const [values, setValues] = React.useState<FormValues>({ name: '', slug: '', description: '' });
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (item) {
      setValues({
        name: item.name ?? '',
        slug: item.slug ?? '',
        description: item.description ?? '',
      });
    }
  }, [item]);

  const fields: FormFieldConfig[] = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
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
        description: String(values.description ?? ''),
      } as any;

      await save(entity);
      toast.push('Material saved successfully.', 'success');
      navigate('/materials');
    } catch {
      toast.push('Unable to save material.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Technical Library"
        title={mode === 'create' ? 'New Material' : `Edit ${item?.name ?? 'Material'}`}
        description="Create or edit material records backed by the real Material model."
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/materials', label: 'Materials' },
          {
            to: mode === 'create' ? '/materials/new' : `/materials/${id}/edit`,
            label: mode === 'create' ? 'New' : 'Edit',
          },
        ]}
      />

      <PageContainer>
        {loading ? (
          <LoadingSkeleton className="h-80 w-full" />
        ) : mode === 'edit' && (error || !item) ? (
          <EmptyState
            title="Record unavailable"
            description={error ?? 'The selected material is unavailable for editing.'}
          />
        ) : (
          <form onSubmit={submit} className="space-y-6">
            <DashboardCard title="Material Details">
              <div className="grid gap-5 md:grid-cols-2">
                {fields.map((field) => (
                  <div
                    key={String(field.name)}
                    className={field.type === 'textarea' ? 'md:col-span-2' : undefined}
                  >
                    <FieldRenderer
                      field={field}
                      value={values[String(field.name)]}
                      error={errors[String(field.name)]}
                      disabled={saving}
                      onChange={(name, value) => setValues((cur) => ({ ...cur, [name]: value }))}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/materials')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Material'}
                </Button>
              </div>
            </DashboardCard>
          </form>
        )}
      </PageContainer>
    </>
  );
}
