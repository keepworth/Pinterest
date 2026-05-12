import { API_BASE_URL } from '../utils/constants';
import { getToken, handleAuthExpired } from '../utils/authStorage';
import { ApiError } from './inspirationService';

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try { res = await fetch(`${API_BASE_URL}/upload`, { method: 'POST', body: formData, headers }); }
  catch { throw new ApiError('上传失败', 0); }

  if (res.status === 401) { handleAuthExpired(); throw new ApiError('登录已失效，请重新登录', 401); }

  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.success) throw new ApiError(body.message || '上传失败', res.status);
  return body.data.url as string;
}