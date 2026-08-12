import { create } from 'zustand';
import { UserProfile } from './types';
import { authService } from '../services/authService';

const STORAGE_KEY = 'polyrib_admin_auth_user_v1';

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  remember: boolean;
  initialized: boolean;
  init: () => Promise<void>;
  login: (email: string, password: string, remember?: boolean) => Promise<boolean>;
  logout: () => void;
  sendReset: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
}

// Typed set/get helpers for Zustand to avoid implicit any
type SetFn = (partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>)) => void;
// include get to inspect current state inside init
export const useAuthStore = create<AuthState>((set: SetFn, get) => ({
  user: null,
  loading: true,
  remember: false,
  initialized: false,
  init: async () => {
    // avoid re-running init
    if (get().initialized) return;
    set({ loading: true });
    try {
      // try to fetch current user from backend
      const resp = await authService.getCurrentUser();
      if (resp) {
        set({ user: resp, remember: true });
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(resp));
        } catch {}
      }
    } catch {
      // ignore
    } finally {
      set({ loading: false, initialized: true });
    }
  },
  login: async (email: string, password: string, remember = false) => {
    set({ loading: true });
    try {
      const session = await authService.login(email, password, remember);
      if (session && session.user) {
        set({ user: session.user, remember });
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(session.user));
        } catch {}
        return true;
      }
      return false;
    } finally {
      set({ loading: false });
    }
  },
  logout: () => {
    set({ user: null, remember: false });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    try {
      authService.logout();
    } catch {}
  },
  sendReset: async (email: string) => {
    set({ loading: true });
    try {
      // Not implemented on backend
      return false;
    } finally {
      set({ loading: false });
    }
  },
  resetPassword: async (token: string, newPassword: string) => {
    set({ loading: true });
    try {
      // Not implemented on backend
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
