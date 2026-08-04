import { UserProfile, Role, Permission } from './types';

// Dedicated mock auth module containing example users for UI testing.
// Replaceable later with real implementation; do not scatter mock data.

const permissionMap: Record<Role, Permission[]> = {
  super_admin: [
    'dashboard.view',
    'users.manage',
    'content.edit',
    'content.view',
    'settings.manage',
  ],
  editor: ['dashboard.view', 'content.edit', 'content.view'],
  viewer: ['dashboard.view', 'content.view'],
};

const users: UserProfile[] = [
  {
    id: 'u-1',
    name: 'Super Admin',
    email: 'super@polyrib.local',
    role: 'super_admin',
    permissions: permissionMap['super_admin'],
  },
  {
    id: 'u-2',
    name: 'Editor User',
    email: 'editor@polyrib.local',
    role: 'editor',
    permissions: permissionMap['editor'],
  },
  {
    id: 'u-3',
    name: 'Viewer User',
    email: 'viewer@polyrib.local',
    role: 'viewer',
    permissions: permissionMap['viewer'],
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
