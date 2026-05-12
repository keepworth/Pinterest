import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AuthUser } from '../types/auth';
import { authService } from '../services/authService';
import { getToken, setToken, removeToken } from '../utils/authStorage';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (u: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = getToken();
    if (!savedToken) { setIsLoading(false); return; }
    setTokenState(savedToken); setToken(savedToken);
    authService.getMe().then(setUser).catch(() => { removeToken(); setTokenState(null); }).finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login(email, password);
    setToken(res.token); setTokenState(res.token); setUser(res.user);
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const res = await authService.register(username, email, password);
    setToken(res.token); setTokenState(res.token); setUser(res.user);
  }, []);

  const logout = useCallback(() => { removeToken(); setTokenState(null); setUser(null); }, []);

  const updateUser = useCallback((u: AuthUser) => setUser(u), []);

  useEffect(() => {
    const handler = () => { setUser(null); setTokenState(null); };
    window.addEventListener('auth:expired', handler);
    return () => window.removeEventListener('auth:expired', handler);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user && !!token, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}