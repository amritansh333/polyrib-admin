import api, { MissingBackendApiError, missingAdminApis } from '../lib/api';
import type {
  BackendEntityDto,
  BackendMaterialDetailDto,
  BackendProductDetailDto,
} from './dto';
import {
  toDataEntity,
  toMachineComponentRows,
  toProductDetail,
  toSearchResultsByResource,
} from './transformers';
import type { ResourceListParams, ResourceRepository } from './types';

type AdminResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

const connectedResources = new Set([
  'products',
  'categories',
  'brands',
  'materials',
  'machine-components',
  'semi-finished-products',
]);

const bulkDeleteResources = new Set(['categories', 'brands', 'materials', 'products']);


export const apiRepository: ResourceRepository = {
  source: 'api',

  async list(resourceKey, params = {}) {
    switch (resourceKey) {
      case 'products':
        return listProducts(params);
      case 'semi-finished-products':
        return listProducts({ ...params, experience: 'semi_finished' });
      case 'categories':
      case 'brands':
      case 'materials':
      case 'machine-components':
        return listAdminResource(resourceKey, params);
      default:
        try {
          return listAdminResource(resourceKey, params);
        } catch {
          return {
            rows: [],
            total: 0,
            page: params.page ?? 1,
            pageSize: params.pageSize ?? params.limit ?? 10,
            totalPages: 1,
          } as any;
        }
    }
  },

  async get(resourceKey, id) {
    switch (resourceKey) {
      case 'products':
        return getProduct(id);
      case 'categories':
      case 'brands':
      case 'materials':
      case 'machine-components':
        return adminGetResource(resourceKey, id);
      default:
        throw new MissingBackendApiError('get', resourceKey);
    }
  },

  async create(resourceKey, entity) {
    switch (resourceKey) {
      case 'products':
      case 'categories':
      case 'brands':
      case 'materials':
      case 'machine-components':
        return adminCreateResource(resourceKey, entity);
      default:
        throw new MissingBackendApiError('create', resourceKey);
    }
  },

  async update(resourceKey, id, entity) {
    switch (resourceKey) {
      case 'products':
      case 'categories':
      case 'brands':
      case 'materials':
      case 'machine-components':
        return adminUpdateResource(resourceKey, id, entity);
      default:
        throw new MissingBackendApiError('update', resourceKey);
    }
  },

  async delete(resourceKey, ids) {
    switch (resourceKey) {
      case 'products':
      case 'categories':
      case 'brands':
      case 'materials':
      case 'machine-components':
        return adminDeleteResource(resourceKey, ids);
      default:
        throw new MissingBackendApiError('delete', resourceKey);
    }
  },

  async duplicate(resourceKey) {
    throw new MissingBackendApiError('duplicate', resourceKey);
  },

  async archive(resourceKey) {
    throw new MissingBackendApiError('archive', resourceKey);
  },

  async restore(resourceKey) {
    throw new MissingBackendApiError('restore', resourceKey);
  },

  async search(query) {
    // Prefer single backend aggregated search endpoint when available
    try {
      const response = await api.get('/admin/search', { params: { q: query } });
      const data = (response.data && response.data.data) || {};
      // data shape: { products, categories, brands, materials, leads, brochureLeads }
      const components: any[] = [];
      if (data.products) components.push(...toSearchResultsByResource('products', data.products));
      if (data.categories) components.push(...toSearchResultsByResource('categories', data.categories));
      if (data.brands) components.push(...toSearchResultsByResource('brands', data.brands));
      if (data.materials) components.push(...toSearchResultsByResource('materials', data.materials));
      if (data.leads) components.push(...toSearchResultsByResource('leads', data.leads));
      if (data.brochureLeads) components.push(...toSearchResultsByResource('brochure-downloads', data.brochureLeads));
      return components.slice(0, 12);
    } catch (err) {
      // If backend search missing, fallback to per-resource listing (legacy)
    }

    const results = await Promise.all(
      [...connectedResources].filter((rk) => !missingAdminApis.has(rk)).map(async (resourceKey) => {
        const result = await this.list(resourceKey, { query, pageSize: 4 });
        return toSearchResultsByResource(resourceKey, result.rows);
      })
    );

    return results.flat().slice(0, 12);
  },

  async filter(resourceKey, params = {}) {
    return this.list(resourceKey, params);
  },

  async pagination(resourceKey, params = {}) {
    return this.list(resourceKey, params);
  },
};

function adminResourcePath(resourceKey: string) {
  return `/admin/${resourceKey.replaceAll('|', '').replaceAll(' ', '-')}`;
}

function toAdminQueryParams(params: ResourceListParams) {
  return {
    search: params.query || undefined,
    page: params.page ?? 1,
    limit: params.pageSize ?? 8,
  };
}

function toAdminListResult(
  rows: BackendEntityDto[],
  params: ResourceListParams,
  pagination?: { page: number; limit: number; total: number; pages: number }
) {
  const mappedRows = rows.map(toDataEntity);
  const pageSize = Math.max(1, params.pageSize ?? pagination?.limit ?? 8);
  const page = Math.max(1, params.page ?? pagination?.page ?? 1);
  const total = pagination?.total ?? mappedRows.length;
  const totalPages = pagination?.pages ?? Math.max(1, Math.ceil(total / pageSize));

  return {
    rows: mappedRows,
    total,
    page,
    pageSize,
    totalPages,
  };
}

async function listAdminResource(resourceKey: string, params: ResourceListParams) {
  // If we've previously observed the admin endpoint is missing, avoid repeated requests
  if (missingAdminApis.has(resourceKey)) {
    // Throw a specific error so the UI can show a "Feature not implemented yet" empty state
    throw new MissingBackendApiError('list', resourceKey);
  }

  try {
    const response = await api.get<AdminResponse<BackendEntityDto[]>>(
      adminResourcePath(resourceKey),
      {
        params: toAdminQueryParams(params),
      }
    );

    return toAdminListResult(response.data.data ?? [], params, response.data.pagination);
  } catch (err: any) {
    // If backend reports 404 for this admin resource, mark it as missing to prevent polling spams
    if (err?.status === 404 || err?.code === 'NOT_FOUND') {
    missingAdminApis.add(resourceKey);
      // Surface a MissingBackendApiError so consumers can render a friendly "Feature not implemented yet" state
      throw new MissingBackendApiError('list', resourceKey);
    }

    throw err;
  }
}

async function adminGetResource(resourceKey: string, id: string) {
  if (missingAdminApis.has(resourceKey)) throw new MissingBackendApiError('get', resourceKey);
  const response = await api.get<AdminResponse<BackendEntityDto>>(
    `${adminResourcePath(resourceKey)}/${id}`
  );
  return toDataEntity(response.data.data);
}

async function adminCreateResource(resourceKey: string, entity: BackendEntityDto) {
  if (missingAdminApis.has(resourceKey)) throw new MissingBackendApiError('create', resourceKey);
  const response = await api.post<AdminResponse<BackendEntityDto>>(
    adminResourcePath(resourceKey),
    entity
  );
  return toDataEntity(response.data.data);
}

async function adminUpdateResource(resourceKey: string, id: string, entity: BackendEntityDto) {
  if (missingAdminApis.has(resourceKey)) throw new MissingBackendApiError('update', resourceKey);
  const response = await api.put<AdminResponse<BackendEntityDto>>(
    `${adminResourcePath(resourceKey)}/${id}`,
    entity
  );
  return toDataEntity(response.data.data);
}

async function adminDeleteResource(resourceKey: string, ids: string[]) {
  if (missingAdminApis.has(resourceKey)) throw new MissingBackendApiError('delete', resourceKey);
  if (ids.length === 0) return true;
  if (ids.length === 1) {
    await api.delete(`${adminResourcePath(resourceKey)}/${ids[0]}`);
    return true;
  }

  if (bulkDeleteResources.has(resourceKey)) {
    await api.post(`${adminResourcePath(resourceKey)}/bulk-delete`, { ids });
    return true;
  }

  await Promise.all(
    ids.map((id) => api.delete(`${adminResourcePath(resourceKey)}/${id}`))
  );
  return true;
}

async function listProducts(params: ResourceListParams) {
  const response = await api.get<AdminResponse<BackendEntityDto[]>>('/admin/products', {
    params: toAdminQueryParams(params),
  });

  return toAdminListResult(response.data.data ?? [], params, response.data.pagination);
}

async function getProduct(id: string) {
  const response = await api.get<AdminResponse<BackendProductDetailDto>>(
    `/admin/products/${id}`
  );
  return toProductDetail(response.data.data);
}

async function getMaterial(id: string) {
  const response = await api.get<AdminResponse<BackendMaterialDetailDto>>(
    `/admin/materials/${id}`
  );

  return toDataEntity(response.data.data.material);
}

async function listBrands(params: ResourceListParams) {
  const response = await api.get<AdminResponse<BackendEntityDto[]>>('/admin/brands', {
    params: toAdminQueryParams(params),
  });

  return toAdminListResult(response.data.data ?? [], params, response.data.pagination);
}

async function listMachineComponents(params: ResourceListParams) {
  const response = await api.get<AdminResponse<BackendEntityDto[]>>(
    '/admin/machine-components',
    {
      params: toAdminQueryParams(params),
    }
  );

  return toAdminListResult(response.data.data ?? [], params, response.data.pagination);
}

async function getMachineComponent(id: string) {
  return adminGetResource('machine-components', id);
}
