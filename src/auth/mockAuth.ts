import { UserProfile, Role, Permission } from './types';

// Dedicated mock auth module containing example users for UI testing.
// Replaceable later with real implementation; do not scatter mock data.

const permissionMap: Record<Role, Permission[]> = {
  super_admin: [
    'dashboard.view',
    'users.read',
    'users.create',
    'users.update',
    'users.delete',
    'roles.read',
    'roles.create',
    'roles.update',
    'roles.delete',
  ],
  catalog_manager: [
    'dashboard.view',
    'products.read',
    'products.create',
    'products.update',
    'products.delete',
    'brands.read',
    'brands.create',
    'brands.update',
    'brands.delete',
    'categories.read',
    'categories.create',
    'categories.update',
    'categories.delete',
    'subcategories.read',
    'subcategories.create',
    'subcategories.update',
    'subcategories.delete',
    'materials.read',
    'materials.create',
    'materials.update',
    'materials.delete',
    'industries.read',
    'industries.create',
    'industries.update',
    'industries.delete',
  ],
  sales_manager: [
    'dashboard.view',
    'leads.read',
    'leads.update',
    'leads.delete',
    'enquiries.read',
    'enquiries.update',
    'enquiries.delete',
    'drawingRequests.read',
    'drawingRequests.update',
    'drawingRequests.delete',
    'catalogRequests.read',
    'catalogRequests.update',
    'catalogRequests.delete',
  ],
  content_manager: [
    'dashboard.view',
    'blogGallery.read',
    'blogGallery.create',
    'blogGallery.update',
    'blogGallery.delete',
    'websiteContent.read',
    'websiteContent.create',
    'websiteContent.update',
    'websiteContent.delete',
  ],
  viewer: ['dashboard.view', 'websiteContent.read'],
};

const users: UserProfile[] = [
  {
    id: 'u-1',
    name: 'Super Admin',
    email: 'super@polyrib.local',
    role: 'super_admin',
    permissions: permissionMap['super_admin'],
  },
];

export function listMockUsers() {
  return users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role }));
}

export function findUserByEmail(email: string): UserProfile | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

// Very small in-memory credential check for UI flows. Passwords are fixed and local-only.
const credentials: Record<string, string> = {
  'super@polyrib.local': 'superpass',
  'editor@polyrib.local': 'editorpass',
  'viewer@polyrib.local': 'viewerpass',
};

export async function authenticate(email: string, password: string): Promise<UserProfile | null> {
  const user = findUserByEmail(email);
  await new Promise((r) => setTimeout(r, 400)); // simulate latency
  if (user && credentials[email.toLowerCase()] === password) return user;
  return null;
}

export async function sendResetEmail(email: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 300));
  return !!findUserByEmail(email);
}

export async function resetPassword(_token: string, _newPassword: string): Promise<boolean> {
  // token ignored in mock — always succeed
  await new Promise((r) => setTimeout(r, 300));
  return true;
}
