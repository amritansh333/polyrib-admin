import type React from 'react';

export type EntityStatus =
  'Published' | 'Draft' | 'Review' | 'Archived' | 'Active' | 'Pending' | 'Closed';

export type DataEntity = {
  id: string;
  name: string;
  description: string;
  status: EntityStatus;
  owner: string;
  updatedAt: string;
  createdAt: string;
  category?: string;
  brand?: string;
  material?: string;
  source?: string;
  email?: string;
  phone?: string;
  company?: string;
  region?: string;
  role?: string;
  size?: string;
  downloads?: number;
};

export type ResourceConfig = {
  key: string;
  title: string;
  eyebrow: string;
  description: string;
  basePath: string;
  createPath?: string;
  newLabel?: string;
  searchPlaceholder: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  filters: { label: string; value: string }[];
  formFields?: FormFieldConfig[];
};

export type ResourceSortKey = keyof DataEntity;

export type FormFieldConfig = {
  name: keyof DataEntity | 'notes' | 'publishedOn' | 'featured' | 'visibility' | 'file' | 'image';
  label: string;
  type:
    | 'text'
    | 'email'
    | 'tel'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'toggle'
    | 'date'
    | 'file'
    | 'image';
  required?: boolean;
  options?: { label: string; value: string }[];
};

export type SortDirection = 'asc' | 'desc';

export type SortState<T> = {
  key: keyof T;
  direction: SortDirection;
};
