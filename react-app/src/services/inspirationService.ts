import type { InspirationItem, InspirationFormData, SourceType } from '../types/inspiration';
import { API_BASE_URL } from '../utils/constants';
import { getToken, handleAuthExpired } from '../utils/authStorage';

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); this.name = 'ApiError'; }
}

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

export const inspirationService = {
  getAll: () => request<InspirationItem[]>('/inspirations'),
  getById: (id: string) => request<InspirationItem>(`/inspirations/${id}`),
  create: (data: InspirationFormData, sourceType: SourceType) =>
    request<InspirationItem>('/inspirations', { method: 'POST', body: JSON.stringify({ ...data, sourceType }) }),
  update: (id: string, data: InspirationFormData, sourceType: SourceType) =>
    request<InspirationItem>(`/inspirations/${id}`, { method: 'PUT', body: JSON.stringify({ ...data, sourceType }) }),
  remove: (id: string) =>
    request<null>(`/inspirations/${id}`, { method: 'DELETE' }),
  toggleFavorite: (id: string, favorite: boolean) =>
    request<InspirationItem>(`/inspirations/${id}/favorite`, { method: 'PATCH', body: JSON.stringify({ favorite }) }),
};