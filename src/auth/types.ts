export type Role = 'super_admin' | 'catalog_manager' | 'sales_manager' | 'content_manager' | 'viewer';

export type Permission =
  | 'dashboard.view'
  | 'users.read'
  | 'users.create'
  | 'users.update'
  | 'users.delete'
  | 'roles.read'
  | 'roles.create'
  | 'roles.update'
  | 'roles.delete'
  | 'products.read'
  | 'products.create'
  | 'products.update'
  | 'products.delete'
  | 'brands.read'
  | 'brands.create'
  | 'brands.update'
  | 'brands.delete'
  | 'categories.read'
  | 'categories.create'
  | 'categories.update'
  | 'categories.delete'
  | 'subcategories.read'
  | 'subcategories.create'
  | 'subcategories.update'
  | 'subcategories.delete'
  | 'materials.read'
  | 'materials.create'
  | 'materials.update'
  | 'materials.delete'
  | 'industries.read'
  | 'industries.create'
  | 'industries.update'
  | 'industries.delete'
  | 'leads.read'
  | 'leads.update'
  | 'leads.delete'
  | 'enquiries.read'
  | 'enquiries.update'
  | 'enquiries.delete'
  | 'drawingRequests.read'
  | 'drawingRequests.update'
  | 'drawingRequests.delete'
  | 'catalogRequests.read'
  | 'catalogRequests.update'
  | 'catalogRequests.delete'
  | 'blogGallery.read'
  | 'blogGallery.create'
  | 'blogGallery.update'
  | 'blogGallery.delete'
  | 'websiteContent.read'
  | 'websiteContent.create'
  | 'websiteContent.update'
  | 'websiteContent.delete';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
}
