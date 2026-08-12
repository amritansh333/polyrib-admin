import { mockData, resources } from './mockData';
import type { DataEntity, SortDirection } from '../types/admin';
import type {
  ResourceListParams,
  ResourceListResult,
  ResourceRepository,
} from '../repositories/types';

const STORAGE_KEY = 'polyrib_admin_mock_repository_v1';

export type ListParams = {
  query?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sortKey?: keyof DataEntity;
  sortDirection?: SortDirection;
};

export type ListResult = {
  rows: DataEntity[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type RepositoryStore = Record<string, DataEntity[]>;

function cloneStore(): RepositoryStore {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw) as RepositoryStore;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
  return structuredClone(mockData);
}

function saveStore(store: RepositoryStore) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), 180);
  });
}

export const mockRepository: ResourceRepository = {
  source: 'mock',

  async list(resourceKey: string, params: ResourceListParams = {}): Promise<ResourceListResult> {
    const store = cloneStore();
    const query = params.query?.trim().toLowerCase();
    const status = params.status;
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.max(1, params.pageSize ?? 8);
    const sortKey = params.sortKey ?? 'updatedAt';
    const sortDirection = params.sortDirection ?? 'desc';
    const rows = store[resourceKey] ?? [];
    const filtered = rows.filter((row) => {
      const matchesQuery =
        !query ||
        Object.values(row)
          .filter((value) => typeof value === 'string' || typeof value === 'number')
          .join(' ')
          .toLowerCase()
          .includes(query);
      const matchesStatus =
        !status || status === 'all' || row.status === status || row.category === status;
      return matchesQuery && matchesStatus;
    });
    const sorted = filtered.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      const result =
        typeof aValue === 'number' && typeof bValue === 'number'
          ? aValue - bValue
          : String(aValue ?? '').localeCompare(String(bValue ?? ''));
      return sortDirection === 'asc' ? result : -result;
    });
    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const normalizedPage = Math.min(page, totalPages);
    const pagedRows = sorted.slice((normalizedPage - 1) * pageSize, normalizedPage * pageSize);

    return delay({
      rows: pagedRows,
      total,
      page: normalizedPage,
      pageSize,
      totalPages,
    });
  },

  async get(resourceKey: string, id: string) {
    const store = cloneStore();
    return delay((store[resourceKey] ?? []).find((row) => row.id === id) ?? null);
  },

  async create(resourceKey: string, entity: DataEntity) {
    return saveEntity(resourceKey, entity);
  },

  async update(resourceKey: string, id: string, entity: DataEntity) {
    return saveEntity(resourceKey, { ...entity, id });
  },

  async updateStatus(resourceKey: string, id: string, status: DataEntity['status']) {
    const store = cloneStore();
    const rows = store[resourceKey] ?? [];
    let updatedEntity: DataEntity | undefined;
    store[resourceKey] = rows.map((row) => {
      if (row.id !== id) return row;
      const nextRow: DataEntity = { ...row, status, updatedAt: today() };
      updatedEntity = nextRow;
      return nextRow;
    });
    saveStore(store);
    return delay(updatedEntity ?? (rows.find((row) => row.id === id) as DataEntity));
  },

  async delete(resourceKey: string, ids: string[]) {
    const store = cloneStore();
    store[resourceKey] = (store[resourceKey] ?? []).filter((row) => !ids.includes(row.id));
    saveStore(store);
    return delay(true);
  },

  async duplicate(resourceKey: string, id: string) {
    const store = cloneStore();
    const rows = store[resourceKey] ?? [];
    const row = rows.find((item) => item.id === id);
    if (!row) return delay(null);
    const copy: DataEntity = {
      ...row,
      id: createId(resourceKey),
      name: `${row.name} Copy`,
      status: row.status === 'Archived' ? restoreStatus(resourceKey) : row.status,
      createdAt: today(),
      updatedAt: today(),
    };
    store[resourceKey] = [copy, ...(store[resourceKey] ?? [])];
    saveStore(store);
    return delay(copy);
  },

  async archive(resourceKey: string, ids: string[]) {
    const store = cloneStore();
    store[resourceKey] = (store[resourceKey] ?? []).map((row) =>
      ids.includes(row.id) ? { ...row, status: 'Archived', updatedAt: today() } : row
    );
    saveStore(store);
    return delay(true);
  },

  async restore(resourceKey: string, ids: string[]) {
    const store = cloneStore();
    store[resourceKey] = (store[resourceKey] ?? []).map((row) =>
      ids.includes(row.id)
        ? { ...row, status: restoreStatus(resourceKey), updatedAt: today() }
        : row
    );
    saveStore(store);
    return delay(true);
  },

  async search(query: string) {
    const store = cloneStore();
    const normalized = query.trim().toLowerCase();
    if (!normalized) return delay([]);
    const results = resources.flatMap((resource) =>
      (store[resource.key] ?? [])
        .filter((row) =>
          Object.values(row)
            .filter((value) => typeof value === 'string' || typeof value === 'number')
            .join(' ')
            .toLowerCase()
            .includes(normalized)
        )
        .slice(0, 4)
        .map((row) => ({ resource, row }))
    );
    return delay(results.slice(0, 12));
  },

  async filter(resourceKey: string, params: ResourceListParams = {}) {
    return this.list(resourceKey, params);
  },

  async pagination(resourceKey: string, params: ResourceListParams = {}) {
    return this.list(resourceKey, params);
  },
};

async function saveEntity(resourceKey: string, entity: DataEntity) {
  const store = cloneStore();
  const rows = store[resourceKey] ?? [];
  const index = rows.findIndex((row) => row.id === entity.id);
  const nextEntity = {
    ...entity,
    id: entity.id || createId(resourceKey),
    updatedAt: today(),
    createdAt: entity.createdAt || today(),
  };
  const nextRows =
    index >= 0
      ? rows.map((row) => (row.id === entity.id ? nextEntity : row))
      : [nextEntity, ...rows];
  store[resourceKey] = nextRows;
  saveStore(store);
  return delay(nextEntity);
}

function createId(resourceKey: string) {
  return `${resourceKey.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;
}

function restoreStatus(resourceKey: string): DataEntity['status'] {
  if (
    [
      'brands',
      'media-library',
      'leads',
      'users',
      'roles',
      'system-logs',
      'support',
    ].includes(resourceKey)
  ) {
    return 'Active';
  }
  if (['leads', 'drawing-requests', 'enquiries'].includes(resourceKey)) return 'Pending';
  return 'Published';
}

function today() {
  return new Date().toISOString().slice(0, 10);
}
