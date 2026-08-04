import { create } from 'zustand';
import { UserProfile } from './types';
import * as mock from './mockAuth';

const STORAGE_KEY = 'polyrib_admin_auth_user_v1';

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  remember: boolean;
  init: () => Promise<void>;
  login: (email: string, password: string, remember?: boolean) => Promise<boolean>;
  logout: () => void;
  sendReset: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
}

// Typed set/get helpers for Zustand to avoid implicit any
type SetFn = (partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>)) => void;
type GetFn = () => AuthState;

export const useAuthStore = create<AuthState>((set: SetFn, get: GetFn) => ({
  user: null,
  loading: false,
  remember: false,
  init: async () => {
    set({ loading: true });
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const u = JSON.parse(raw) as UserProfile;
        set({ user: u, remember: true });
      }
    } catch (e) {
      // ignore
    } finally {
      set({ loading: false });
    }
  },
  login: async (email: string, password: string, remember = false) => {
    set({ loading: true });
    try {
      const user = await mock.authenticate(email, password);
      if (user) {
        set({ user, remember });
        if (remember) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
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
    } catch (e) {}
  },
  sendReset: async (email: string) => {
    set({ loading: true });
    try {
      const ok = await mock.sendResetEmail(email);
      return ok;
    } finally {
      set({ loading: false });
    }
  },
  resetPassword: async (token: string, newPassword: string) => {
    set({ loading: true });
    try {
      const ok = await mock.resetPassword(token, newPassword);
      return ok;
    } finally {
      set({ loading: false });
    }
  },
}));
