import api from './api';
import { apiRepository } from '../repositories/apiRepository';

export type BlogPostType = 'Blog' | 'Gallery';
export type BlogPostStatus = 'draft' | 'published';

export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets: string[];
};

export type AdminBlogSeo = {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
};

export type AdminBlogListItem = {
  id: string;
  slug: string;
  type: BlogPostType;
  title: string;
  status: 'Published' | 'Draft';
  category: string;
  image: string;
  excerpt: string;
  tags: string[];
  readTime: string;
  readTimeMinutes: number;
  publishedAt: string;
  updatedAt: string;
  createdAt: string;
};

export type AdminBlogDetail = AdminBlogListItem & {
  intro: string;
  sections: BlogSection[];
  keyTakeaways: string[];
  galleryImages: string[];
  seo: AdminBlogSeo;
};

export type AdminBlogPayload = {
  title: string;
  slug?: string;
  type: BlogPostType;
  category: string;
  excerpt: string;
  image: string;
  readTimeMinutes: number;
  intro: string;
  tags: string[];
  keyTakeaways: string[];
  sections: BlogSection[];
  galleryImages?: string[];
  status: BlogPostStatus;
  publishedAt?: string;
  seo?: AdminBlogSeo;
};

export type AdminBlogListParams = {
  query?: string;
  type?: string;
  status?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

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

export async function listAdminBlogs(params: AdminBlogListParams) {
  // Reuse the central apiRepository which already normalizes admin list responses
  // (rows, pagination) across admin resources. Map caller params to repository params
  // and convert the repository result into the { items, meta } shape expected here.
  const repoResult = await apiRepository.list('blog', {
    query: params.query,
    status: params.status,
    page: params.page,
    pageSize: params.limit,
    // pass-through other filters via query string handled server-side if needed
  } as any);

  // Normalize repository rows into the AdminBlogListItem shape. apiRepository.list() returns
  // rows already normalized to DataEntity for most admin resources; for blog rows some
  // blog-specific fields may not be present, so provide sensible defaults while preserving
  // the expected AdminBlogListItem shape returned to callers.
  const items: AdminBlogListItem[] = (repoResult.rows || []).map((row: any) => ({
    id: String(row.id ?? row._id ?? ''),
    slug: row.slug ?? '',
    type: (row.type as BlogPostType) ?? 'Blog',
    title: String(row.title ?? row.name ?? ''),
    status: String(row.status ?? '').toLowerCase() === 'published' ? 'Published' : 'Draft',
    category: String(row.category ?? ''),
    // repository transformers sometimes place image on `image` or `size` depending on resource
    image: String(row.image ?? ''),
    excerpt: String(row.excerpt ?? row.description ?? ''),
    tags: Array.isArray(row.tags) ? row.tags : [],
    readTime: String(
      row.readTime ?? (row.readTimeMinutes ? `${row.readTimeMinutes} min read` : '')
    ),
    readTimeMinutes:
      typeof row.readTimeMinutes === 'number'
        ? row.readTimeMinutes
        : Number(row.readTimeMinutes) || 0,
    publishedAt: String(row.publishedAt ?? ''),
    updatedAt: String(row.updatedAt ?? row.updated_at ?? ''),
    createdAt: String(row.createdAt ?? row.created_at ?? ''),
  }));

  return {
    items,
    meta: {
      page: repoResult.page,
      limit: repoResult.pageSize,
      total: repoResult.total,
      pages: repoResult.totalPages,
    },
  };
}

export async function getAdminBlog(id: string): Promise<AdminBlogDetail> {
  const response = await api.get<AdminResponse<AdminBlogDetail>>(`/admin/blog/${id}`);
  return response.data.data;
}

export async function createAdminBlog(payload: AdminBlogPayload) {
  const response = await api.post<AdminResponse<AdminBlogDetail>>('/admin/blog', payload);
  return response.data.data;
}

export async function updateAdminBlog(id: string, payload: AdminBlogPayload) {
  const response = await api.put<AdminResponse<AdminBlogDetail>>(`/admin/blog/${id}`, payload);
  return response.data.data;
}

export async function deleteAdminBlog(id: string) {
  const response = await api.delete<AdminResponse<null>>(`/admin/blog/${id}`);
  return response.data.success;
}

export async function publishAdminBlog(id: string) {
  const response = await api.patch<AdminResponse<AdminBlogDetail>>(`/admin/blog/${id}/publish`);
  return response.data.data;
}

export async function unpublishAdminBlog(id: string) {
  const response = await api.patch<AdminResponse<AdminBlogDetail>>(`/admin/blog/${id}/unpublish`);
  return response.data.data;
}

export async function duplicateAdminBlog(id: string) {
  const response = await api.post<AdminResponse<AdminBlogDetail>>(`/admin/blog/${id}/duplicate`);
  return response.data.data;
}

export async function listAdminBlogCategories() {
  const response = await api.get<AdminResponse<string[]>>('/admin/blog/categories');
  return response.data.data;
}
