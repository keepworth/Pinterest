/**
 * 生成唯一 ID：时间戳(36进制) + 随机串
 */
export function generateId(): string {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

/**
 * 解析标签字符串（支持中英文逗号），自动去空
 */
export function parseTags(raw: string): string[] {
  return raw
    .split(/[,，]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * 格式化 ISO 日期为中文可读字符串
 */
export function formatDate(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}