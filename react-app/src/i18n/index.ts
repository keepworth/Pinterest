import zh from './zh';
import en from './en';

export type Language = 'zh-CN' | 'en-US';
export type TranslationKey = keyof typeof zh;

const dictionaries: Record<Language, Record<string, string>> = {
  'zh-CN': zh as unknown as Record<string, string>,
  'en-US': en as unknown as Record<string, string>,
};

const LANG_KEY = 'inspireboard_language';

export function getStoredLanguage(): Language {
  try {
    const v = localStorage.getItem(LANG_KEY);
    if (v === 'zh-CN' || v === 'en-US') return v;
  } catch { /* */ }
  return 'zh-CN';
}

export function setStoredLanguage(lang: Language): void {
  try { localStorage.setItem(LANG_KEY, lang); } catch { /* */ }
}

/**
 * 获取翻译文案
 * @param lang 当前语言
 * @param key 翻译键
 * @param params 模板变量，如 { count: 3, name: 'test' }
 */
export function translate(
  lang: Language,
  key: string,
  params?: Record<string, string | number>
): string {
  const dict = dictionaries[lang];
  let text: string = (dict as Record<string, string>)[key] || dictionaries['zh-CN'][key] || key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}