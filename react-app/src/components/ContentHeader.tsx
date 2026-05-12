import type { SortMode } from '../types/inspiration';
import { SORT_OPTIONS } from '../utils/constants';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  title: string; filteredCount: number; totalFavCount: number;
  sortMode: SortMode; onSortChange: (m: SortMode) => void;
}

export function ContentHeader({ title, filteredCount, totalFavCount, sortMode, onSortChange }: Props) {
  const { t } = useLanguage();
  const labels: Record<SortMode, string> = {
    newest: t('sort.newest'), oldest: t('sort.oldest'), favorites: t('sort.favorites'),
  };

  return (
    <div className="content-header">
      <div className="content-header-left">
        <h2 className="content-title">{title}</h2>
        <span className="content-stats">{t('content.images', { count: filteredCount })} &middot; {t('content.favCount', { count: totalFavCount })}</span>
      </div>
      <div className="content-header-right">
        <select className="sort-select" value={sortMode} onChange={(e) => onSortChange(e.target.value as SortMode)}>
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{labels[o.value]}</option>)}
        </select>
      </div>
    </div>
  );
}