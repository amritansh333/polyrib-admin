import type { DataEntity, ResourceConfig, SortDirection } from '../types/admin';

export type RepositoryDataSource = 'mock' | 'api';

export type ResourceListParams = {
  query?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sortKey?: keyof DataEntity;
  sortDirection?: SortDirection;
};

export type ResourceListResult = {
  rows: DataEntity[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type ResourceSearchResult = {
  resource: ResourceConfig;
  row: DataEntity;
};

export type ResourceRepository = {
  readonly source: RepositoryDataSource;
  list(resourceKey: string, params?: ResourceListParams): Promise<ResourceListResult>;
  get(resourceKey: string, id: string): Promise<DataEntity | null>;
  create(resourceKey: string, entity: DataEntity): Promise<DataEntity>;
  update(resourceKey: string, id: string, entity: DataEntity): Promise<DataEntity>;
  delete(resourceKey: string, ids: string[]): Promise<boolean>;
  duplicate(resourceKey: string, id: string): Promise<DataEntity | null>;
  archive(resourceKey: string, ids: string[]): Promise<boolean>;
  restore(resourceKey: string, ids: string[]): Promise<boolean>;
  search(query: string): Promise<ResourceSearchResult[]>;
  filter(resourceKey: string, params?: ResourceListParams): Promise<ResourceListResult>;
  pagination(resourceKey: string, params?: ResourceListParams): Promise<ResourceListResult>;
};
