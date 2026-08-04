import api from '../lib/api';
import type {
  BackendBrandBySubcategoryDto,
  BackendEntityDto,
  BackendMachineComponentCatalogDto,
  BackendMaterialDetailDto,
  BackendProductDetailDto,
  BackendProductFilterDto,
} from './dto';
import {
  toBrandRows,
  toDataEntity,
  toListResultFromRows,
  toMachineComponentRows,
  toProductDetail,
  toProductFilterResult,
  toProductListParams,
  toSearchResultsByResource,
} from './transformers';
import type { ResourceListParams, ResourceRepository } from './types';

const connectedResources = new Set([
  'products',
  'categories',
  'brands',
  'materials',
  'machine-components',
]);

export class MissingBackendApiError extends Error {
  constructor(operation: string, resourceKey: string) {
    super(`Backend API missing for ${resourceKey}.${operation}`);
    this.name = 'MissingBackendApiError';
  }
}

export const apiRepository: ResourceRepository = {
  source: 'api',

  async list(resourceKey, params = {}) {
    switch (resourceKey) {
      case 'products':
        return listProducts(params);
      case 'categories':
        return listSimpleResource('/categories', params);
      case 'brands':
        return listBrands(params);
      case 'materials':
        return listSimpleResource('/materials', params);
      case 'machine-components':
        return listMachineComponents(params);
      default:
        throw new MissingBackendApiError('list', resourceKey);
    }
  },

  async get(resourceKey, id) {
    switch (resourceKey) {
      case 'products':
        return getProduct(id);
      case 'categories':
        return getSimpleResource('/categories', id);
      case 'materials':
        return getMaterial(id);
      case 'machine-components':
        return getMachineComponent(id);
      case 'brands':
        throw new MissingBackendApiError('get', resourceKey);
      default:
        throw new MissingBackendApiError('get', resourceKey);
    }
  },

  async create(resourceKey) {
    throw new MissingBackendApiError('create', resourceKey);
  },

  async update(resourceKey) {
    throw new MissingBackendApiError('update', resourceKey);
  },

  async delete(resourceKey) {
    throw new MissingBackendApiError('delete', resourceKey);
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
    const results = await Promise.all(
      [...connectedResources].map(async (resourceKey) => {
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

async function listProducts(params: ResourceListParams) {
  const response = await api.get<BackendProductFilterDto>('/products/filter', {
    params: toProductListParams(params),
  });

  return toProductFilterResult(response.data, params);
}

async function getProduct(slug: string) {
  const response = await api.get<BackendProductDetailDto>(`/products/${slug}`);
  return toProductDetail(response.data);
}

async function listSimpleResource(path: string, params: ResourceListParams) {
  const response = await api.get<BackendEntityDto[]>(path);
  return toListResultFromRows(response.data, params);
}

async function getSimpleResource(path: string, slug: string) {
  const response = await api.get<BackendEntityDto>(`${path}/${slug}`);
  return toDataEntity(response.data);
}

async function getMaterial(slug: string) {
  const response = await api.get<BackendMaterialDetailDto>(`/materials/${slug}`);
  return toDataEntity(response.data.material);
}

async function listBrands(params: ResourceListParams) {
  const categories = await api.get<BackendEntityDto[]>('/semi-finished/categories');
  const subcategoryResponses = await Promise.all(
    categories.data.map((category) =>
      api.get<BackendEntityDto[]>(`/semi-finished/subcategories/by-category/${category.slug}`)
    )
  );
  const subcategories = subcategoryResponses.flatMap((response) => response.data);
  const brandResponses = await Promise.all(
    subcategories.map((subcategory) =>
      api.get<BackendBrandBySubcategoryDto>(
        `/semi-finished/brands/by-subcategory/${subcategory.slug}`
      )
    )
  );

  return toListResultFromRows(toBrandRows(brandResponses.map((response) => response.data)), params);
}

async function listMachineComponents(params: ResourceListParams) {
  const response = await api.get<BackendMachineComponentCatalogDto>('/machine-components');
  return toListResultFromRows(toMachineComponentRows(response.data), params);
}

async function getMachineComponent(slug: string) {
  const result = await listMachineComponents({
    query: slug,
    page: 1,
    pageSize: 1000,
  });

  return result.rows.find((row) => row.id === slug) ?? null;
}
