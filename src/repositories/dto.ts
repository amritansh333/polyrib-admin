import type { EntityStatus } from '../types/admin';

export type BackendReferenceDto = {
  _id?: string;
  id?: string | number;
  name?: string;
  slug?: string;
  path?: string | null;
  image?: string | null;
};

export type BackendDownloadDto = {
  label?: string;
  url?: string;
};

export type BackendSeoDto = {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
};

export type BackendEntityDto = {
  _id?: string;
  id?: string | number;
  name?: string;
  title?: string;
  slug?: string;
  path?: string | null;
  description?: string | string[];
  status?: EntityStatus | string;
  owner?: string;
  assignedTo?: string;
  updatedAt?: string;
  updated_at?: string;
  createdAt?: string;
  created_at?: string;
  category?: string | BackendReferenceDto | null;
  subCategory?: string | BackendReferenceDto | null;
  brand?: string | BackendReferenceDto | null;
  materials?: Array<string | BackendReferenceDto>;
  industries?: Array<string | BackendReferenceDto>;
  material?: string;
  source?: string;
  email?: string;
  phone?: string;
  company?: string;
  region?: string;
  role?: string;
  size?: string;
  downloads?: number | BackendDownloadDto[];
  image?: string | null;
  pdfUrl?: string;
  order?: number;
  experience?: string;
  keyFeatures?: string[];
  applications?: string[];
  specifications?: Record<string, unknown>;
  isVisible?: boolean;
};

export type BackendProductFilterDto = {
  filtersApplied?: {
    category?: string | null;
    material?: string | null;
    industry?: string | null;
    search?: string | null;
  };
  products: BackendEntityDto[];
};

export type BackendProductDetailDto = {
  brand?: BackendEntityDto | null;
  product: BackendEntityDto;
};

export type BackendMaterialDetailDto = {
  material: BackendEntityDto;
  products: BackendEntityDto[];
};

export type BackendBrandBySubcategoryDto = {
  subcategory?: BackendEntityDto;
  brands: BackendEntityDto[];
};

export type BackendMachineComponentCatalogDto = {
  success: boolean;
  message?: string;
  data?: {
    experience?: string;
    sidebar?: unknown[];
    defaultProduct?: string | null;
    products?: Record<string, BackendEntityDto>;
  };
};

export type AuthTokenDto = {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
};
