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
  const id = String(dto._id ?? dto.id ?? dto.slug ?? '');
  const brand = toReferenceName(dto.brand);
  const material = toReferenceList(dto.materials).join(', ') || dto.material;
  const category = toReferenceName(dto.category) || toReferenceName(dto.subCategory);
  const subCategoryName = toReferenceName(dto.subCategory);
  const description = Array.isArray(dto.description)
    ? dto.description.join(' ')
    : String(dto.description ?? '');
  const descriptionArray = Array.isArray(dto.description) ? dto.description : undefined;
  const image = dto.image ?? undefined;

  // Prefer explicit firstName/lastName for Lead DTOs, then fullName/name/title for other DTOs (Enquiries etc.)
  const nameValue =
    dto.name ??
    (dto.firstName || dto.lastName
      ? `${dto.firstName ?? ''} ${dto.lastName ?? ''}`.trim()
      : undefined) ??
    dto.fullName ??
    dto.title ??
    '';

  const categoryId = toReferenceId(dto.category);
  const subCategoryId = toReferenceId(dto.subCategory);
  const brandId = toReferenceId(dto.brand);
  const materialIds = Array.isArray(dto.materials)
    ? dto.materials.map(toReferenceId).filter(Boolean)
    : undefined;
  const industryIds = Array.isArray(dto.industries)
    ? dto.industries.map(toReferenceId).filter(Boolean)
    : undefined;
  const entity: any = {
    ...dto,
    id,
    name: String(nameValue),
    description,
    descriptionArray,
    status: normalizeStatus(dto.status, dto.isVisible),
    owner: String(dto.owner ?? dto.assignedTo ?? dto.experience ?? 'Backend'),
    updatedAt: normalizeDate(dto.updatedAt ?? dto.updated_at),
    createdAt: normalizeDate(dto.createdAt ?? dto.created_at),
    category,
    categoryName: category,
    categoryId,
    subCategoryName,
    subCategoryId,
    brand,
    brandId,
    material,
    materialIds,
    industryIds,
    source: dto.path ?? dto.slug,
    slug: dto.slug,
    size: image,
    image,
    seo: dto.seo ?? {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
    },
    // Normalize downloads for list-count semantics, preserve raw download records for detail pages
    downloads:
      dto.downloadCount !== undefined
        ? dto.downloadCount
        : Array.isArray(dto.downloads)
          ? dto.downloads.length
          : dto.downloads,
    downloadRecords: Array.isArray(dto.downloads) ? dto.downloads : undefined,
  };

  // Map Lead-specific fields when present
  if (dto.companyName !== undefined) entity.company = dto.companyName;
  if (dto.email !== undefined) entity.email = dto.email;
  if (dto.mobileNumber !== undefined) {
    // keep backward-compatible 'phone' key used by some UI parts
    entity.phone = dto.mobileNumber;
    entity.mobileNumber = dto.mobileNumber;
  }
  if (dto.productName !== undefined) entity.product = dto.productName;
  if (dto.downloadHistory !== undefined) entity.downloadHistory = dto.downloadHistory;
  if (dto.lastDownloadAt !== undefined) entity.lastDownloadAt = normalizeDate(dto.lastDownloadAt);
  if (dto.verifiedAt !== undefined) entity.verifiedAt = normalizeDate(dto.verifiedAt);

  // Preserve enquiry-specific fields if present (backwards compatibility)
  if (dto.fullName !== undefined) entity.fullName = dto.fullName;
  if (dto.company !== undefined && entity.company === undefined) entity.company = dto.company;
  if (dto.phone !== undefined && entity.phone === undefined) entity.phone = dto.phone;
  if (dto.product !== undefined && entity.product === undefined) entity.product = dto.product;
  if (dto.requirement !== undefined) entity.requirement = dto.requirement;
  if (dto.notes !== undefined) entity.notes = dto.notes;
  if (Array.isArray(dto.files)) {
    entity.files = dto.files.map((file) => ({
      originalName: String(file.originalName ?? ''),
      storedName: String(file.storedName ?? ''),
      mimeType: String(file.mimeType ?? ''),
      extension: String(file.extension ?? ''),
      size: Number(file.size ?? 0),
      relativePath: String(file.relativePath ?? ''),
    }));
  }

  return entity;
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
  return {
    ...toDataEntity({
      ...dto.product,
      brand: dto.product.brand ?? dto.brand ?? undefined,
    }),
    enquiries: dto.enquiries,
  } as any;
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

function toReferenceId(value: string | BackendReferenceDto | null | undefined) {
  if (!value) return undefined;
  return typeof value === 'string' ? value : String(value.id ?? value._id ?? value);
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
    status === 'Closed' ||
    status === 'New' ||
    status === 'Contacted' ||
    status === 'In Progress' ||
    status === 'Resolved'
  ) {
    return status;
  }
  return isVisible === false ? 'Draft' : fallbackStatus;
}

function normalizeDate(value: string | Date | undefined) {
  if (!value) return '';
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return String(value);
}
