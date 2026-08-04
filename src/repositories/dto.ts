import type { EntityStatus } from '../types/admin';

export type BackendEntityDto = {
  id?: string | number;
  _id?: string | number;
  name?: string;
  title?: string;
  description?: string;
  status?: EntityStatus | string;
  owner?: string;
  assignedTo?: string;
  updatedAt?: string;
  updated_at?: string;
  createdAt?: string;
  created_at?: string;
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

export type BackendListDto<TDto> = {
  data?: TDto[];
  rows?: TDto[];
  items?: TDto[];
  results?: TDto[];
  total?: number;
  page?: number;
  pageSize?: number;
  page_size?: number;
  totalPages?: number;
  total_pages?: number;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    page_size?: number;
    totalPages?: number;
    total_pages?: number;
  };
};

export type BackendMutationDto<TDto> = {
  data?: TDto;
  item?: TDto;
  result?: TDto;
};

export type BackendSearchDto<TDto> = {
  resourceKey?: string;
  resource?: { key?: string };
  row?: TDto;
  item?: TDto;
  data?: TDto;
};

export type LoginRequestDto = {
  email: string;
  password: string;
  remember?: boolean;
};

export type AuthTokenDto = {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
};

export type PermissionDto = {
  key: string;
  label?: string;
};

export type CurrentUserDto = {
  id: string | number;
  name: string;
  email: string;
  role: string;
  permissions?: string[] | PermissionDto[];
};

export type UploadAssetDto = {
  id?: string | number;
  url?: string;
  name?: string;
  mimeType?: string;
  size?: number;
};
