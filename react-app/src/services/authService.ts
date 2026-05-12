import type { AuthResponse, AuthUser } from '../types/auth';
import { API_BASE_URL } from '../utils/constants';
import { getToken } from '../utils/authStorage';

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); this.name = 'ApiError'; }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options?.headers as Record<string, string> || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  let res: Response;
  try { res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers }); }
  catch { throw new ApiError('网络请求失败', 0); }
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.success) throw new ApiError(body.message || '请求失败', res.status);
  return body.data as T;
}

export const authService = {
  register: (username: string, email: string, password: string) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password }) }),
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getMe: () => request<AuthUser>('/auth/me'),
  updateMe: (data: { username?: string; avatarUrl?: string }) =>
    request<AuthUser>('/auth/me', { method: 'PUT', body: JSON.stringify(data) }),
};