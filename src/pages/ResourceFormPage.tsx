import React from 'react';
import { CheckCircle2, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { uploadService } from '../services/uploadService';
import PageContainer from '../components/PageContainer';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { FieldRenderer, type FormErrors, type FormValues } from '../components/FormFields';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import useResourceItem from '../hooks/useResourceItem';
import { useToast } from '../providers/ToastProvider';
import type { DataEntity, FormFieldConfig, ResourceConfig } from '../types/admin';

export default function ResourceFormPage({
  config,
  mode,
}: {
  config: ResourceConfig;
  mode: 'create' | 'edit';
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { item, loading, error, save } = useResourceItem(
    config.key,
    mode === 'edit' ? id : undefined
  );
  const [values, setValues] = React.useState<FormValues>(() => createInitialValues(config));
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [saving, setSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    if (item) {
      setValues({
        name: item.name,
        description: item.description,
        status: item.status,
        owner: item.owner,
        category: item.category ?? '',
        brand: item.brand ?? '',
        material: item.material ?? '',
        email: item.email ?? '',
        phone: item.phone ?? '',
        publishedOn: item.updatedAt,
        featured: false,
        visibility: 'public',
        file: null,
        image: null,
      });
    }
  }, [item]);

  const fields = getFields(config);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(fields, values);
    setErrors(nextErrors);
    setSuccess(false);
    if (Object.keys(nextErrors).length > 0) return;
    setSaving(true);
    try {
      const entity: DataEntity = {
        id: item?.id ?? '',
        name: String(values.name ?? ''),
        description: String(values.description ?? ''),
        status: String(values.status ?? 'Draft') as DataEntity['status'],
        owner: String(values.owner ?? 'Catalog Team'),
        category: String(values.category ?? ''),
        brand: String(values.brand ?? ''),
        material: String(values.material ?? ''),
        email: String(values.email ?? ''),
        phone: String(values.phone ?? ''),
        createdAt: item?.createdAt ?? '2026-08-04',
        updatedAt: '2026-08-04',
      };

      if (!entity.slug && ['categories', 'brands', 'materials', 'machine-components'].includes(config.key)) {
        entity.slug = slugify(entity.name);
      }

      if (values.image instanceof File) {
        const asset = await uploadService.uploadImage(values.image, { resourceKey: config.key });
        (entity as DataEntity & { image?: string }).image = asset.url;
      }

      if (values.file instanceof File) {
        const asset = await uploadService.uploadPdf(values.file, { resourceKey: config.key });
        (entity as DataEntity & { file?: string }).file = asset.url;
      }

      await save(entity);
      setSuccess(true);
      toast.push('Record saved successfully.', 'success');
      window.setTimeout(() => navigate(config.basePath), 450);
    } catch {
      toast.push('Unable to save this record.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow={config.eyebrow}
        title={
          mode === 'create'
            ? (config.newLabel ?? `New ${config.title}`)
            : `Edit ${item?.name ?? config.title}`
        }
        description={`Maintain ${config.title.toLowerCase()} records with validation-ready CMS form controls.`}
        breadcrumbs={[
          { to: '/dashboard', label: 'Admin' },
          { to: config.basePath, label: config.title },
          {
            to:
              mode === 'create'
                ? (config.createPath ?? config.basePath)
                : `${config.basePath}/${id}/edit`,
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
        <DashboardCard
          title="Record Details"
          description="All controls are frontend-ready and API-replaceable."
        >
          {loading ? (
            <div className="grid gap-4">
              <LoadingSkeleton className="h-10 w-full" />
              <LoadingSkeleton className="h-28 w-full" />
              <LoadingSkeleton className="h-10 w-2/3" />
            </div>
          ) : mode === 'edit' && (error || !item) ? (
            <EmptyState
              title="Record unavailable"
              description={error ?? 'The selected CMS record is unavailable for editing.'}
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
                      value={values[String(field.name)]}
                      error={errors[String(field.name)]}
                      disabled={saving}
                      onChange={(name, value) =>
                        setValues((current) => ({ ...current, [name]: value }))
                      }
                    />
                  </div>
                ))}
              </div>

              {success && (
                <div className="flex items-center gap-2 border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  Record saved successfully.
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-divider pt-5 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  onClick={() => navigate(config.basePath)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  <Save />
                  {saving ? 'Saving...' : 'Save Record'}
                </Button>
              </div>
            </form>
          )}
        </DashboardCard>
      </PageContainer>
    </>
  );
}

function getFields(config: ResourceConfig): FormFieldConfig[] {
  return (
    config.formFields ?? [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: [
          { label: 'Published', value: 'Published' },
          { label: 'Draft', value: 'Draft' },
          { label: 'Review', value: 'Review' },
          { label: 'Active', value: 'Active' },
        ],
      },
      { name: 'owner', label: 'Owner', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'brand', label: 'Brand', type: 'text' },
      { name: 'material', label: 'Material', type: 'text' },
      { name: 'publishedOn', label: 'Publish Date', type: 'date' },
      { name: 'featured', label: 'Feature on public website', type: 'toggle' },
      {
        name: 'visibility',
        label: 'Visibility',
        type: 'radio',
        options: [
          { label: 'Public', value: 'public' },
          { label: 'Internal', value: 'internal' },
        ],
      },
      { name: 'image', label: 'Primary Image', type: 'image' },
      { name: 'file', label: 'Technical File', type: 'file' },
    ]
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function createInitialValues(config: ResourceConfig): FormValues {
  const values: FormValues = {};
  getFields(config).forEach((field) => {
    values[String(field.name)] =
      field.type === 'checkbox' || field.type === 'toggle'
        ? false
        : field.type === 'file' || field.type === 'image'
          ? null
          : field.type === 'date'
            ? '2026-08-04'
            : '';
  });
  values.status = 'Draft';
  values.owner = 'Catalog Team';
  values.visibility = 'public';
  return values;
}

function validate(fields: FormFieldConfig[], values: FormValues): FormErrors {
  return fields.reduce<FormErrors>((result, field) => {
    const value = values[String(field.name)];
    if (field.required && (value === '' || value === null || value === undefined)) {
      result[String(field.name)] = `${field.label} is required.`;
    }
    if (field.type === 'email' && value && !String(value).includes('@')) {
      result[String(field.name)] = 'Enter a valid email address.';
    }
    return result;
  }, {});
}
