import type { DataEntity, EntityStatus } from '../types/admin';
import { resources } from '../services/mockData';
import type { BackendEntityDto, BackendListDto, BackendMutationDto, BackendSearchDto } from './dto';
import type { ResourceListParams, ResourceListResult, ResourceSearchResult } from './types';

const fallbackStatus: EntityStatus = 'Draft';

export function toDataEntity(dto: BackendEntityDto): DataEntity {
  return {
    id: String(dto.id ?? dto._id ?? ''),
    name: String(dto.name ?? dto.title ?? ''),
    description: String(dto.description ?? ''),
    status: normalizeStatus(dto.status),
    owner: String(dto.owner ?? dto.assignedTo ?? ''),
    updatedAt: String(dto.updatedAt ?? dto.updated_at ?? ''),
    createdAt: String(dto.createdAt ?? dto.created_at ?? ''),
    category: dto.category,
    brand: dto.brand,
    material: dto.material,
    source: dto.source,
    email: dto.email,
    phone: dto.phone,
    company: dto.company,
    region: dto.region,
    role: dto.role,
    size: dto.size,
    downloads: dto.downloads,
  };
}

export function toBackendEntity(entity: DataEntity): BackendEntityDto {
  return {
    id: entity.id || undefined,
    name: entity.name,
    description: entity.description,
    status: entity.status,
    owner: entity.owner,
    updatedAt: entity.updatedAt,
    createdAt: entity.createdAt,
    category: entity.category,
    brand: entity.brand,
    material: entity.material,
    source: entity.source,
    email: entity.email,
    phone: entity.phone,
    company: entity.company,
    region: entity.region,
    role: entity.role,
    size: entity.size,
    downloads: entity.downloads,
  };
}

export function toBackendListParams(params: ResourceListParams = {}) {
  return {
    q: params.query || undefined,
    status: params.status && params.status !== 'all' ? params.status : undefined,
    page: params.page,
    pageSize: params.pageSize,
    sort: params.sortKey ? String(params.sortKey) : undefined,
    order: params.sortDirection,
  };
}

export function toListResult(
  dto: BackendListDto<BackendEntityDto>,
  fallbackParams: ResourceListParams = {}
): ResourceListResult {
  const rows = dto.data ?? dto.rows ?? dto.items ?? dto.results ?? [];
  const meta = dto.meta ?? {};
  const pageSize = dto.pageSize ?? dto.page_size ?? meta.pageSize ?? meta.page_size ?? rows.length;
  const total = dto.total ?? meta.total ?? rows.length;
  const totalPages =
    dto.totalPages ??
    dto.total_pages ??
    meta.totalPages ??
    meta.total_pages ??
    Math.max(1, Math.ceil(total / Math.max(1, pageSize || fallbackParams.pageSize || 1)));

  return {
    rows: rows.map(toDataEntity),
    total,
    page: dto.page ?? meta.page ?? fallbackParams.page ?? 1,
    pageSize: pageSize || fallbackParams.pageSize || rows.length || 1,
    totalPages,
  };
}

export function unwrapEntity(dto: BackendEntityDto | BackendMutationDto<BackendEntityDto>) {
  const wrapped = dto as BackendMutationDto<BackendEntityDto>;
  return toDataEntity(wrapped.data ?? wrapped.item ?? wrapped.result ?? (dto as BackendEntityDto));
}

export function toSearchResults(
  dtos: BackendSearchDto<BackendEntityDto>[]
): ResourceSearchResult[] {
  return dtos.flatMap((dto) => {
    const resourceKey = dto.resourceKey ?? dto.resource?.key;
    const resource = resources.find((item) => item.key === resourceKey);
    const rowDto = dto.row ?? dto.item ?? dto.data;
    if (!resource || !rowDto) return [];
    return [{ resource, row: toDataEntity(rowDto) }];
  });
}

function normalizeStatus(status: BackendEntityDto['status']): EntityStatus {
  if (
    status === 'Published' ||
    status === 'Draft' ||
    status === 'Review' ||
    status === 'Archived' ||
    status === 'Active' ||
    status === 'Pending' ||
    status === 'Closed'
  ) {
    return status;
  }
  return fallbackStatus;
}
