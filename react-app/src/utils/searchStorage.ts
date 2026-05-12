const KEY = 'inspireboard_recent_searches';
const MAX = 5;

export function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data.slice(0, MAX) : [];
  } catch { return []; }
}

export function addRecentSearch(term: string): void {
  const trimmed = term.trim();
  if (!trimmed) return;
  const list = getRecentSearches().filter((s) => s !== trimmed);
  list.unshift(trimmed);
  try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX))); } catch { /* */ }
}

export function clearRecentSearches(): void {
  try { localStorage.removeItem(KEY); } catch { /* */ }
}