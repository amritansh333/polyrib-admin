import type { DataEntity, EntityStatus } from '../types/admin';
import { resources } from '../services/mockData';
import type {
  BackendBrandBySubcategoryDto,
  BackendEntityDto,
  BackendMachineComponentCatalogDto,
  BackendProductDetailDto,
  BackendProductFilterDto,
  BackendReferenceDto,
} from './dto';
import type { ResourceListParams, ResourceListResult, ResourceSearchResult } from './types';

const fallbackStatus: EntityStatus = 'Published';

export function toDataEntity(dto: BackendEntityDto): DataEntity {
  const id = String(dto.slug ?? dto._id ?? dto.id ?? '');
  const brand = toReferenceName(dto.brand);
  const material = toReferenceList(dto.materials).join(', ') || dto.material;
  const category = toReferenceName(dto.category) || toReferenceName(dto.subCategory);
  const description = Array.isArray(dto.description)
    ? dto.description.join(' ')
    : String(dto.description ?? '');

  return {
    id,
    name: String(dto.name ?? dto.title ?? ''),
    description,
    status: normalizeStatus(dto.status, dto.isVisible),
    owner: String(dto.owner ?? dto.assignedTo ?? dto.experience ?? 'Backend'),
    updatedAt: normalizeDate(dto.updatedAt ?? dto.updated_at),
    createdAt: normalizeDate(dto.createdAt ?? dto.created_at),
    category,
    brand,
    material,
    source: dto.path ?? dto.slug,
    size: dto.image ?? undefined,
    downloads: Array.isArray(dto.downloads) ? dto.downloads.length : dto.downloads,
  };
}

export function toProductListParams(params: ResourceListParams = {}) {
  return {
    search: params.query || undefined,
    page: params.page ?? 1,
    limit: params.pageSize ?? 8,
  };
}

export function toListResultFromRows(
  rows: BackendEntityDto[],
  params: ResourceListParams = {}
): ResourceListResult {
  const mappedRows = rows.map(toDataEntity);
  const filteredRows = applyClientFiltering(mappedRows, params);
  const sortedRows = applyClientSorting(filteredRows, params);
  const pageSize = Math.max(1, params.pageSize ?? 8);
  const page = Math.max(1, params.page ?? 1);
  const total = sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const normalizedPage = Math.min(page, totalPages);

  return {
    rows: sortedRows.slice((normalizedPage - 1) * pageSize, normalizedPage * pageSize),
    total,
    page: normalizedPage,
    pageSize,
    totalPages,
  };
}

export function toProductFilterResult(
  dto: BackendProductFilterDto,
  params: ResourceListParams = {}
): ResourceListResult {
  const rows = dto.products.map(toDataEntity);
  const pageSize = Math.max(1, params.pageSize ?? 8);
  const page = Math.max(1, params.page ?? 1);
  const total = rows.length;

  return {
    rows,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export function toProductDetail(dto: BackendProductDetailDto): DataEntity {
  return toDataEntity({
    ...dto.product,
    brand: dto.product.brand ?? dto.brand ?? undefined,
  });
}

export function toBrandRows(dtos: BackendBrandBySubcategoryDto[]): BackendEntityDto[] {
  return dtos.flatMap((dto) =>
    dto.brands.map((brand) => ({
      ...brand,
      subCategory: brand.subCategory ?? dto.subcategory,
    }))
  );
}

export function toMachineComponentRows(dto: BackendMachineComponentCatalogDto): BackendEntityDto[] {
  return Object.values(dto.data?.products ?? {});
}

export function toSearchResultsByResource(
  resourceKey: string,
  rows: DataEntity[]
): ResourceSearchResult[] {
  const resource = resources.find((item) => item.key === resourceKey);
  if (!resource) return [];
  return rows.map((row) => ({ resource, row }));
}

function applyClientFiltering(rows: DataEntity[], params: ResourceListParams) {
  const query = params.query?.trim().toLowerCase();
  const status = params.status;

  return rows.filter((row) => {
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
}

function applyClientSorting(rows: DataEntity[], params: ResourceListParams) {
  const sortKey = params.sortKey ?? 'updatedAt';
  const sortDirection = params.sortDirection ?? 'desc';

  return [...rows].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    const result =
      typeof aValue === 'number' && typeof bValue === 'number'
        ? aValue - bValue
        : String(aValue ?? '').localeCompare(String(bValue ?? ''));

    return sortDirection === 'asc' ? result : -result;
  });
}

function toReferenceName(value: string | BackendReferenceDto | null | undefined) {
  if (!value) return undefined;
  return typeof value === 'string' ? value : value.name;
}

function toReferenceList(values: Array<string | BackendReferenceDto> | undefined) {
  return (values ?? []).flatMap((value) => {
    const name = toReferenceName(value);
    return name ? [name] : [];
  });
}

function normalizeStatus(status: BackendEntityDto['status'], isVisible?: boolean): EntityStatus {
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
  return isVisible === false ? 'Draft' : fallbackStatus;
}

function normalizeDate(value: string | undefined) {
  return value ? value.slice(0, 10) : '';
}
