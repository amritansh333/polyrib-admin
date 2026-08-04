export type Role = 'super_admin' | 'editor' | 'viewer';

export type Permission =
  'dashboard.view' | 'users.manage' | 'content.edit' | 'content.view' | 'settings.manage';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
}
