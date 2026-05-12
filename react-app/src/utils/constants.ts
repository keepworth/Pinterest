import type { CategoryConfig, SortMode } from '../types/inspiration';

export const API_BASE_URL = 'http://localhost:3001/api';
export const STORAGE_KEY = 'inspiration-board-data';
export const CACHE_KEY = 'inspiration-board-cache';

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** 单张图片最大 5MB（前后端统一） */
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const CATEGORY_CONFIG: CategoryConfig[] = [
  { key: '全部', label: '全部', labelKey: 'category.all', icon: '📌' },
  { key: 'UI设计', label: 'UI设计', labelKey: 'category.ui', icon: '🎨' },
  { key: '网页设计', label: '网页设计', labelKey: 'category.web', icon: '💻' },
  { key: '插画', label: '插画', labelKey: 'category.illustration', icon: '✏️' },
  { key: '海报', label: '海报', labelKey: 'category.poster', icon: '📰' },
  { key: '装修', label: '装修', labelKey: 'category.decoration', icon: '🏠' },
  { key: '摄影', label: '摄影', labelKey: 'category.photography', icon: '📷' },
  { key: '其他', label: '其他', labelKey: 'category.other', icon: '📦' },
];

export const CATEGORY_KEYS = CATEGORY_CONFIG
  .filter((c) => c.key !== '全部')
  .map((c) => c.key);

/** key → labelKey 映射，供表单 select 使用 */
export const CATEGORY_LABEL_MAP: Record<string, string> = {};
CATEGORY_CONFIG.forEach((c) => { CATEGORY_LABEL_MAP[c.key] = c.labelKey; });

export const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'newest', label: '最新添加' },
  { value: 'oldest', label: '最早添加' },
  { value: 'favorites', label: '收藏优先' },
];