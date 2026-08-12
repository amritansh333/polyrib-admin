import type React from 'react';

export type EntityStatus =
  | 'Published'
  | 'Draft'
  | 'Review'
  | 'Archived'
  | 'Active'
  | 'Pending'
  | 'Closed'
  | 'New'
  | 'Contacted'
  | 'In Progress'
  | 'Resolved'
  | 'UNDER_REVIEW'
  | 'QUOTED'
  | 'COMPLETED'
  | 'REJECTED';

export type DrawingRequestFile = {
  originalName: string;
  storedName: string;
  mimeType: string;
  extension: string;
  size: number;
  relativePath: string;
};

export type DataEntity = {
  id: string;
  name: string;
  description: string;
  descriptionArray?: string[];
  status: EntityStatus;
  owner: string;
  updatedAt: string;
  createdAt: string;
  category?: string;
  categoryId?: string;
  categoryName?: string;
  brand?: string;
  brandId?: string;
  material?: string;
  materialIds?: string[];
  industries?: Array<string | { id?: string; name?: string; slug?: string }>;
  industryIds?: string[];
  materials?: Array<string | { id?: string; name?: string; slug?: string }>;
  source?: string;
  slug?: string;
  experience?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  technicalCharacteristics?: string[];
  applications?: string[];
  specifications?: Record<string, unknown>;
  downloads?: number;
  downloadRecords?: Array<{ label?: string; url?: string }>;
  // Backend models often provide ordering and visibility flags
  order?: number;
  isVisible?: boolean;
  // Subcategory relationship
  subCategory?: string | { id?: string; name?: string; slug?: string };
  subCategories?: Array<string | { id?: string; name?: string; slug?: string }>;
  email?: string;
  phone?: string;
  company?: string;
  region?: string;
  role?: string;
  size?: string;
  image?: string;
  file?: string;
  files?: DrawingRequestFile[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  notes?: string;

  fullName?: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  companyName?: string;
  productId?: string;
  productName?: string;
  productSlug?: string;
  currentRoute?: string;
  downloadCount?: number;
  lastDownloadedAt?: string;
  downloadHistory?: any[];

  product?: string;

  requirement?: string;

  verifiedAt?: string;
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
  name:
    | keyof DataEntity
    | 'notes'
    | 'publishedOn'
    | 'featured'
    | 'visibility'
    | 'file'
    | 'image'
    | 'subCategory'
    | 'order';
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
