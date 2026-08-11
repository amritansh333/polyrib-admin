import React, { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from './authStore';
import { UserProfile } from './types';

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<boolean>;
  logout: () => void;
  sendReset: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const initialized = useAuthStore((s) => s.initialized);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const sendReset = useAuthStore((s) => s.sendReset);
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    (async () => {
      await init();
    })();
  }, [init]);

  // While initializing, show children but loading flag is set for consumers to react.
  return (
    <AuthContext.Provider
      value={{ user, loading, initialized, login, logout, sendReset, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
