import type { Permission, UserProfile } from '../auth/types';
import api from '../lib/api';

export type AuthSession = {
  user: UserProfile;
};

export type AuthService = {
  login(email: string, password: string, remember?: boolean): Promise<AuthSession | null>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<UserProfile | null>;
  loadPermissions(): Promise<Permission[]>;
};

export const authService: AuthService = {
  async login(email, password, remember = false) {
    const response = await api.post('/admin/auth/login', { email, password, remember });
    if (response && response.data && response.data.success) {
      return { user: response.data.data.user };
    }
    return null;
  },

  async logout() {
    await api.post('/admin/auth/logout');
  },

  async getCurrentUser() {
    const response = await api.get('/admin/auth/me');
    if (response && response.data && response.data.success) return response.data.data;
    return null;
  },

  async loadPermissions() {
    // permissions are fetched via roles for the current user on demand; frontend uses stored user.role
    return [] as Permission[];
  },
};
