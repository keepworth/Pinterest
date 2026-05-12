import { useLanguage } from '../context/LanguageContext';

interface Props {
  suggestions: string[];
  trending: string[];
  recentSearches: string[];
  onSelect: (term: string) => void;
  onClearRecent: () => void;
}

const FALLBACK: Record<string, string[]> = {
  'zh-CN': ['极简工作区', '干净桌面布置', '中性内饰', '网页设计灵感', 'UI 卡片布局'],
  'en-US': ['minimal workspace', 'clean desk setup', 'neutral interiors', 'web design inspiration', 'UI card layout'],
};

export function SearchOverlay({ suggestions, trending, recentSearches, onSelect, onClearRecent }: Props) {
  const { t, language } = useLanguage();
  const fallback = FALLBACK[language] || FALLBACK['en-US'];

  return (
    <div className="search-overlay">
      <div className="search-overlay-panel">
        <div className="search-col">
          <h4 className="search-col-title">{recentSearches.length ? t('search.recent') : t('search.suggestions')}</h4>
          {(recentSearches.length ? recentSearches : fallback).map((s, i) => (
            <button key={i} className="search-item" onClick={() => onSelect(s)}>🔍 {s}</button>
          ))}
          {recentSearches.length > 0 && (
            <button className="search-clear-recent" onClick={onClearRecent}>{t('search.clearRecent')}</button>
          )}
          {suggestions.length > 0 && (
            <>
              <h4 className="search-col-title" style={{ marginTop: 16 }}>{t('search.suggestions')}</h4>
              {suggestions.map((s, i) => <button key={`s${i}`} className="search-item" onClick={() => onSelect(s)}>🔍 {s}</button>)}
            </>
          )}
        </div>
        <div className="search-divider" />
        <div className="search-col">
          <h4 className="search-col-title">{t('search.trending')}</h4>
          <div className="trending-chips">
            {trending.map((x, i) => <button key={i} className="trending-chip" onClick={() => onSelect(x)}>{x}</button>)}
          </div>
        </div>
      </div>
    </div>
  );
}