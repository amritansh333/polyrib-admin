import api from '../lib/api';
import type { BackendEntityDto, BackendListDto, BackendSearchDto } from './dto';
import {
  toBackendEntity,
  toBackendListParams,
  toListResult,
  toSearchResults,
  unwrapEntity,
} from './transformers';
import type { ResourceRepository } from './types';

export const apiRepository: ResourceRepository = {
  source: 'api',

  async list(resourceKey, params = {}) {
    const response = await api.get<BackendListDto<BackendEntityDto>>(`/${resourceKey}`, {
      params: toBackendListParams(params),
    });
    return toListResult(response.data, params);
  },

  async get(resourceKey, id) {
    const response = await api.get<BackendEntityDto>(`/${resourceKey}/${id}`);
    return unwrapEntity(response.data);
  },

  async create(resourceKey, entity) {
    const response = await api.post<BackendEntityDto>(`/${resourceKey}`, toBackendEntity(entity));
    return unwrapEntity(response.data);
  },

  async update(resourceKey, id, entity) {
    const response = await api.put<BackendEntityDto>(
      `/${resourceKey}/${id}`,
      toBackendEntity(entity)
    );
    return unwrapEntity(response.data);
  },

  async delete(resourceKey, ids) {
    await api.delete(`/${resourceKey}`, { data: { ids } });
    return true;
  },

  async duplicate(resourceKey, id) {
    const response = await api.post<BackendEntityDto>(`/${resourceKey}/${id}/duplicate`);
    return unwrapEntity(response.data);
  },

  async archive(resourceKey, ids) {
    await api.post(`/${resourceKey}/archive`, { ids });
    return true;
  },

  async restore(resourceKey, ids) {
    await api.post(`/${resourceKey}/restore`, { ids });
    return true;
  },

  async search(query) {
    const response = await api.get<BackendSearchDto<BackendEntityDto>[]>('/search', {
      params: { q: query },
    });
    return toSearchResults(response.data);
  },

  async filter(resourceKey, params = {}) {
    return this.list(resourceKey, params);
  },

  async pagination(resourceKey, params = {}) {
    return this.list(resourceKey, params);
  },
};
