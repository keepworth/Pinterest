/** 内置分类列表 */
export const CATEGORIES = [
  '全部',
  'UI设计',
  '网页设计',
  '插画',
  '海报',
  '装修',
  '其他',
] as const;

/** localStorage 键名 */
export const STORAGE_KEY = 'inspiration-board-data';

/** 允许的图片格式 */
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** 单张图片最大 2MB */
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024;