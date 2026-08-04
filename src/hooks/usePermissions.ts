import { useAuthStore } from '../auth/authStore';

export function usePermissions() {
  const user = useAuthStore((s) => s.user);
  const hasPermission = (permission: string) => {
    if (!user) return false;
    return user.permissions.includes(permission as any);
  };
  const isRole = (role: string) => {
    if (!user) return false;
    return user.role === role;
  };
  return { user, hasPermission, isRole };
}
