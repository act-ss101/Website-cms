/**
 * Auth Context — React hook for authentication state
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, login as authLogin, logout as authLogout, getCurrentSession, register as authRegister, seedDefaultUsers } from '../services/authService';
import { initI18n } from '../services/i18nService';
import { seedDefaultPages } from '../services/cmsService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, role?: 'admin' | 'staff' | 'member') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize DB, seed data, restore session
  useEffect(() => {
    async function init() {
      try {
        await seedDefaultUsers();
        await initI18n();

        // Seed default pages if admin exists
        const session = await getCurrentSession();
        if (session) {
          setUser(session.user);
          await seedDefaultPages(session.user.id);
        }

        setInitialized(true);
      } catch (e) {
        console.error('Init error:', e);
        setInitialized(true);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authLogin(email, password);
    setUser(result.user);
    // Seed pages on first admin login
    if (result.user.role === 'admin') {
      await seedDefaultPages(result.user.id);
    }
  };

  const logout = async () => {
    await authLogout();
    setUser(null);
  };

  const register = async (email: string, password: string, name: string, role?: 'admin' | 'staff' | 'member') => {
    await authRegister(email, password, name, role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, initialized, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
