import type { Language } from '../i18n';

export function generateId(): string {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

export function parseTags(raw: string): string[] {
  return raw.split(/[,，]/).map((t) => t.trim()).filter(Boolean);
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

/** 相对时间：今天 / 昨天 / N 天前，支持中英文 */
export function formatRelativeDate(isoString: string, lang: Language = 'zh-CN'): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffDays = Math.floor((now - then) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return formatDate(isoString);
  if (lang === 'en-US') {
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays} 天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} 周前`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} 个月前`;
  return `${Math.floor(diffDays / 365)} 年前`;
}

export function normalizeItemFields(item: Record<string, unknown> & { title: string; imageUrl: string; category: string }): any {
  return {
    id: item.id || generateId(),
    title: item.title, imageUrl: item.imageUrl, category: item.category,
    tags: Array.isArray(item.tags) ? item.tags : [],
    favorite: typeof item.favorite === 'boolean' ? item.favorite : false,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
    sourceType: item.sourceType || ((item.imageUrl as string).startsWith('data:') ? 'upload' : 'url'),
    boardId: item.boardId,
  };
}