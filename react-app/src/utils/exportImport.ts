import type { InspirationItem } from '../types/inspiration';
import { generateId } from './helpers';

/**
 * 导出 items 为 JSON 文件并触发浏览器下载
 */
export function exportItemsToJson(items: InspirationItem[]): void {
  const json = JSON.stringify(items, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `inspire-board-data-${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

/**
 * 使用 FileReader 读取 JSON 文件内容并解析
 */
export function readJsonFile(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(reader.result as string));
      } catch {
        reject(new Error('文件 JSON 解析失败'));
      }
    };
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    reader.readAsText(file);
  });
}

/**
 * 将导入数据规范化为 InspirationItem[]
 * - 非数组 → 抛错
 * - 过滤无效项（缺少 title / imageUrl / category）
 * - 补齐缺失字段（id / tags / favorite / createdAt）
 * - 无有效项 → 抛错
 */
export function normalizeImportedItems(data: unknown): InspirationItem[] {
  if (!Array.isArray(data)) {
    throw new Error('导入失败：文件内容不是数组');
  }

  const items: InspirationItem[] = [];

  for (const raw of data) {
    if (typeof raw !== 'object' || raw === null) continue;

    const title = typeof (raw as Record<string, unknown>).title === 'string'
      ? ((raw as Record<string, unknown>).title as string).trim()
      : '';
    const imageUrl = typeof (raw as Record<string, unknown>).imageUrl === 'string'
      ? ((raw as Record<string, unknown>).imageUrl as string).trim()
      : '';
    const category = typeof (raw as Record<string, unknown>).category === 'string'
      ? ((raw as Record<string, unknown>).category as string).trim()
      : '';

    if (!title || !imageUrl || !category) continue;

    const rawTags = (raw as Record<string, unknown>).tags;
    const tags: string[] = Array.isArray(rawTags)
      ? rawTags.filter((t): t is string => typeof t === 'string')
      : [];

    const rawFav = (raw as Record<string, unknown>).favorite;
    const favorite = typeof rawFav === 'boolean' ? rawFav : false;

    const rawId = (raw as Record<string, unknown>).id;
    const id = typeof rawId === 'string' && rawId ? rawId : generateId();

    const rawCreated = (raw as Record<string, unknown>).createdAt;
    const createdAt = typeof rawCreated === 'string' ? rawCreated : new Date().toISOString();

    items.push({ id, title, imageUrl, category, tags, favorite, createdAt });
  }

  if (items.length === 0) {
    throw new Error('导入失败：没有有效的数据项');
  }

  return items;
}