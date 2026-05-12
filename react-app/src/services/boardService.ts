import type { Board } from '../types/inspiration';
import { API_BASE_URL } from '../utils/constants';
import { getToken, handleAuthExpired } from '../utils/authStorage';
import { ApiError } from './inspirationService';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try { res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers }); }
  catch { throw new ApiError('网络请求失败', 0); }

  if (res.status === 401) { handleAuthExpired(); throw new ApiError('登录已失效，请重新登录', 401); }

  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.success) throw new ApiError(body.message || '请求失败', res.status);
  return body.data as T;
}

export const boardService = {
  getAll: () => request<Board[]>('/boards'),
  getById: (id: string) => request<Board>(`/boards/${id}`),
  create: (name: string, description?: string) =>
    request<Board>('/boards', { method: 'POST', body: JSON.stringify({ name, description }) }),
  update: (id: string, data: { name?: string; description?: string; coverImageUrl?: string }) =>
    request<Board>(`/boards/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => request<null>(`/boards/${id}`, { method: 'DELETE' }),
};