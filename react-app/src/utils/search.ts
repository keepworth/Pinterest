import type { InspirationItem, Board } from '../types/inspiration';

/** 检查 inspiration 是否匹配搜索词 */
export function matchesInspiration(item: InspirationItem, term: string): boolean {
  const t = term.toLowerCase();
  return item.title.toLowerCase().includes(t) ||
    item.category.toLowerCase().includes(t) ||
    item.tags.some((tag) => tag.toLowerCase().includes(t));
}

/** 检查 board 是否匹配搜索词 */
export function matchesBoard(board: Board, term: string): boolean {
  const t = term.toLowerCase();
  return board.name.toLowerCase().includes(t) ||
    (board.description || '').toLowerCase().includes(t);
}

/** 从 items/boards 生成搜索建议（去重，最多 6 条） */
export function getSearchSuggestions(
  items: InspirationItem[], boards: Board[], term: string
): string[] {
  const t = term.toLowerCase();
  if (!t) return [];
  const seen = new Set<string>();
  const suggestions: string[] = [];

  for (const item of items) {
    if (item.title.toLowerCase().includes(t) && !seen.has(item.title)) {
      suggestions.push(item.title); seen.add(item.title);
    }
    if (item.category.toLowerCase().includes(t) && !seen.has(item.category)) {
      suggestions.push(item.category); seen.add(item.category);
    }
    for (const tag of item.tags) {
      if (tag.toLowerCase().includes(t) && !seen.has(tag)) {
        suggestions.push(tag); seen.add(tag);
      }
    }
  }
  for (const b of boards) {
    if (b.name.toLowerCase().includes(t) && !seen.has(b.name)) {
      suggestions.push(b.name); seen.add(b.name);
    }
  }
  return suggestions.slice(0, 6);
}

/** 从 tags 统计热门搜索词（最多 6 个） */
export function getTrendingSearches(items: InspirationItem[]): string[] {
  const map = new Map<string, number>();
  items.forEach((i) => i.tags.forEach((t) => map.set(t, (map.get(t) || 0) + 1)));
  const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k).slice(0, 6);
  if (sorted.length >= 4) return sorted;
  // 不足时补充默认词
  return [...sorted, 'clean desk setup', 'neutral workspace', 'home office ideas', 'simple design', 'minimal layout'].slice(0, 6);
}