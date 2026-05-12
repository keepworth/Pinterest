/**
 * localStorage 缓存工具
 * 后端 API 不可用时，作为降级数据源
 */

import type { InspirationItem } from '../types/inspiration';
import { CACHE_KEY } from './constants';

/** 读取缓存的灵感列表；解析失败或不存在则返回 [] */
export function readCachedItems(): InspirationItem[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** 将灵感列表写入缓存 */
export function writeCachedItems(items: InspirationItem[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(items));
  } catch {
    /* 存储空间满 —— 静默失败 */
  }
}

/** 清空缓存 */
export function clearCachedItems(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    /* ignore */
  }
}