import React from 'react';
import { FileUp, ImageUp } from 'lucide-react';
import clsx from 'clsx';
import Input from './Input';
import Textarea from './Textarea';
import Select from './Select';
import Checkbox from './Checkbox';
import Radio from './Radio';
import Toggle from './Toggle';
import type { FormFieldConfig } from '../types/admin';

export type FormValues = Record<string, string | boolean | File | null>;
export type FormErrors = Record<string, string>;

export function FieldRenderer({
  field,
  value,
  error,
  disabled,
  onChange,
}: {
  field: FormFieldConfig;
  value: string | boolean | File | null | undefined;
  error?: string;
  disabled?: boolean;
  onChange: (name: string, value: string | boolean | File | null) => void;
}) {
  const common = {
    label: field.label,
    disabled,
  };

  return (
    <div>
      {field.type === 'textarea' && (
        <Textarea
          {...common}
          value={String(value ?? '')}
          onChange={(event) => onChange(String(field.name), event.target.value)}
        />
      )}
      {field.type === 'select' && (
        <Select
          {...common}
          value={String(value ?? '')}
          options={field.options ?? []}
          onChange={(event) => onChange(String(field.name), event.target.value)}
        />
      )}
      {field.type === 'checkbox' && (
        <Checkbox
          label={field.label}
          checked={Boolean(value)}
          disabled={disabled}
          onChange={(event) => onChange(String(field.name), event.target.checked)}
        />
      )}
      {field.type === 'radio' && (
        <Radio
          name={String(field.name)}
          value={String(value ?? '')}
          options={field.options ?? []}
          onChange={(nextValue) => onChange(String(field.name), nextValue)}
        />
      )}
      {field.type === 'toggle' && (
        <Toggle
          label={field.label}
          checked={Boolean(value)}
          onChange={(checked) => onChange(String(field.name), checked)}
        />
      )}
      {field.type === 'date' && (
        <Input
          {...common}
          type="date"
          value={String(value ?? '')}
          onChange={(event) => onChange(String(field.name), event.target.value)}
        />
      )}
      {(field.type === 'file' || field.type === 'image') && (
        <FileUploadField
          label={field.label}
          type={field.type}
          value={value instanceof File ? value : null}
          disabled={disabled}
          onChange={(file) => onChange(String(field.name), file)}
        />
      )}
      {['text', 'email', 'tel'].includes(field.type) && (
        <Input
          {...common}
          type={field.type}
          value={String(value ?? '')}
          onChange={(event) => onChange(String(field.name), event.target.value)}
        />
      )}
      {error && (
        <p className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-300">{error}</p>
      )}
    </div>
  );
}

function FileUploadField({
  label,
  type,
  value,
  disabled,
  onChange,
}: {
  label: string;
  type: 'file' | 'image';
  value: File | null;
  disabled?: boolean;
  onChange: (file: File | null) => void;
}) {
  const Icon = type === 'image' ? ImageUp : FileUp;
  return (
    <label className={clsx('block text-sm', disabled && 'opacity-60')}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="flex min-h-28 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-border bg-surface-subtle px-4 py-6 text-center transition-colors hover:border-primary">
        <Icon className="mb-2 h-6 w-6 text-primary" />
        <span className="text-sm font-semibold text-charcoal">
          {value ? value.name : type === 'image' ? 'Upload product image' : 'Upload technical file'}
        </span>
        <span className="mt-1 text-xs text-muted-foreground">
          {type === 'image' ? 'PNG, JPG, or WEBP' : 'PDF, DXF, STEP, or spreadsheet'}
        </span>
      </span>
      <input
        type="file"
        disabled={disabled}
        accept={type === 'image' ? 'image/*' : '.pdf,.dxf,.dwg,.step,.stp,.csv,.xlsx'}
        className="hidden"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
    </label>
  );
}
