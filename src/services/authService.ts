import api from '../lib/api';
import type { Permission, Role, UserProfile } from '../auth/types';
import type {
  AuthTokenDto,
  CurrentUserDto,
  LoginRequestDto,
  PermissionDto,
} from '../repositories/dto';

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
  async login(email, password, remember) {
    const payload: LoginRequestDto = { email, password, remember };
    const response = await api.post<{ user: CurrentUserDto; tokens: AuthTokenDto }>(
      '/auth/login',
      payload
    );
    persistTokens(response.data.tokens);
    return {
      user: toUserProfile(response.data.user),
      tokens: response.data.tokens,
    };
  },

  async logout() {
    await api.post('/auth/logout');
    clearTokens();
  },

  async refreshToken(refreshToken) {
    const response = await api.post<AuthTokenDto>('/auth/refresh', { refreshToken });
    persistTokens(response.data);
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get<CurrentUserDto>('/auth/me');
    return toUserProfile(response.data);
  },

  async loadPermissions() {
    const response = await api.get<Array<string | PermissionDto>>('/auth/permissions');
    return response.data.map(toPermission);
  },
};

function persistTokens(tokens: AuthTokenDto) {
  if (tokens.accessToken) {
    window.localStorage.setItem('polyrib_admin_access_token', tokens.accessToken);
  }
  if (tokens.refreshToken) {
    window.localStorage.setItem('polyrib_admin_refresh_token', tokens.refreshToken);
  }
}

function clearTokens() {
  window.localStorage.removeItem('polyrib_admin_access_token');
  window.localStorage.removeItem('polyrib_admin_refresh_token');
}

function toUserProfile(dto: CurrentUserDto): UserProfile {
  return {
    id: String(dto.id),
    name: dto.name,
    email: dto.email,
    role: toRole(dto.role),
    permissions: (dto.permissions ?? []).map(toPermission),
  };
}

function toRole(role: string): Role {
  if (role === 'super_admin' || role === 'editor' || role === 'viewer') return role;
  return 'viewer';
}

function toPermission(permission: string | PermissionDto): Permission {
  const key = typeof permission === 'string' ? permission : permission.key;
  if (
    key === 'dashboard.view' ||
    key === 'users.manage' ||
    key === 'content.edit' ||
    key === 'content.view' ||
    key === 'settings.manage'
  ) {
    return key;
  }
  return 'content.view';
}
