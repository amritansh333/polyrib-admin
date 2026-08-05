import type { Permission, UserProfile } from '../auth/types';
import { MissingBackendApiError } from '../lib/api';
import type { AuthTokenDto } from '../repositories/dto';

export type AuthSession = {
  user: UserProfile;
  tokens: AuthTokenDto;
};

export type AuthService = {
  login(email: string, password: string, remember?: boolean): Promise<AuthSession>;
  logout(): Promise<void>;
  refreshToken(refreshToken: string): Promise<AuthTokenDto>;
  getCurrentUser(): Promise<UserProfile>;
  loadPermissions(): Promise<Permission[]>;
};

export const authService: AuthService = {
  async login(_email, _password, _remember) {
    throw new MissingBackendApiError('login', 'auth');
  },

  async logout() {
    throw new MissingBackendApiError('logout', 'auth');
  },

  async refreshToken(_refreshToken) {
    throw new MissingBackendApiError('refreshToken', 'auth');
  },

  async getCurrentUser() {
    throw new MissingBackendApiError('getCurrentUser', 'auth');
  },

  async loadPermissions() {
    throw new MissingBackendApiError('loadPermissions', 'auth');
  },
};
