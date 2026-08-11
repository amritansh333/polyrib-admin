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
import { useToast } from '../providers/ToastProvider';
import type { DataEntity } from '../types/admin';

const emptyValues = {
  name: '',
  slug: '',
  description: '',
  metaTitle: '',
  metaDescription: '',
  keywords: '',
};

export default function IndustryFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { item, loading, error, save } = useResourceItem(
    'industries',
    mode === 'edit' ? id : undefined
  );
  const [values, setValues] = React.useState<FormValues>(emptyValues);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!item) return;
    setValues({
      name: item.name ?? '',
      slug: item.slug ?? '',
      description: item.description ?? '',
      metaTitle: item.seo?.metaTitle ?? '',
      metaDescription: item.seo?.metaDescription ?? '',
      keywords: (item.seo?.keywords ?? []).join(', '),
    });
  }, [item]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    const name = String(values.name ?? '').trim();
    const slug = slugify(String(values.slug ?? '') || name);
    const description = String(values.description ?? '').trim();
    const metaTitle = String(values.metaTitle ?? '').trim();
    const metaDescription = String(values.metaDescription ?? '').trim();
    const keywords = String(values.keywords ?? '')
      .split(',')
      .map((keyword) => keyword.trim())
      .filter(Boolean);

    if (!name) nextErrors.name = 'Industry name is required.';
    if (!slug) nextErrors.slug = 'Slug is required.';
    if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      nextErrors.slug = 'Use lowercase letters, numbers, and hyphens only.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      const payload: DataEntity = {
        id: item?.id ?? '',
        name,
        slug,
        description,
        seo: {
          metaTitle,
          metaDescription,
          keywords,
        },
        createdAt: item?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'Published',
        owner: 'Catalog Team',
      };

      const saved = await save(payload);
      toast.push('Industry saved successfully.', 'success');
      navigate(`/industries/${saved.id ?? id}`);
    } catch (err: any) {
      const message = err?.message || 'Unable to save this industry.';
      setErrors({ submit: message });
      toast.push(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'textarea';
    required?: boolean;
  }> = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'metaTitle', label: 'Meta Title', type: 'text' },
    { name: 'metaDescription', label: 'Meta Description', type: 'textarea' },
    { name: 'keywords', label: 'Keywords', type: 'text' },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Catalog"
        title={mode === 'create' ? 'New Industry' : `Edit ${item?.name ?? 'Industry'}`}
        description="Maintain the shared industry taxonomy used by the public site and product filters."
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: '/industries', label: 'Industries' },
          {
            to: mode === 'create' ? '/industries/new' : `/industries/${id}/edit`,
            label: mode === 'create' ? 'New' : 'Edit',
          },
        ]}
      />

      <PageContainer>
        <DashboardCard title="Industry Information">
          {loading ? (
            <div className="grid gap-4">
              <LoadingSkeleton className="h-10 w-full" />
              <LoadingSkeleton className="h-28 w-full" />
              <LoadingSkeleton className="h-10 w-full" />
            </div>
          ) : mode === 'edit' && (error || !item) ? (
            <EmptyState
              title="Industry unavailable"
              description={error ?? 'The selected industry is unavailable for editing.'}
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                {fields.map((field) => (
                  <div
                    key={field.name}
                    className={field.type === 'textarea' ? 'md:col-span-2' : undefined}
                  >
                    <FieldRenderer
                      field={field as any}
                      value={values[String(field.name)]}
                      error={errors[String(field.name)] ?? errors.submit}
                      disabled={saving}
                      onChange={(name, value) =>
                        setValues((current) => ({ ...current, [name]: value }))
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 border-t border-divider pt-5 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  onClick={() => navigate('/industries')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  <Save />
                  {saving ? 'Saving...' : 'Save Industry'}
                </Button>
              </div>
            </form>
          )}
        </DashboardCard>
      </PageContainer>
    </>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
