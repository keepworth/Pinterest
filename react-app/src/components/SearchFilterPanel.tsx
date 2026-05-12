import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  contentType: string; onContentTypeChange: (v: string) => void;
  onClearAll: () => void; onToast: (text: string) => void;
}

export function SearchFilterPanel({ contentType, onContentTypeChange, onClearAll, onToast }: Props) {
  const { t } = useLanguage();
  const [orientation, setOrientation] = useState('All');
  const [colorMood, setColorMood] = useState('All');

  const chips = (opts: string[], sel: string, onSel: (v: string) => void) => (
    <div className="filter-chips">{opts.map((o) => <button key={o} className={`filter-chip${sel === o ? ' active' : ''}`} onClick={() => onSel(o)}>{o}</button>)}</div>
  );

  return (
    <div className="search-filter-panel">
      <div className="filter-header"><h4>{t('search.filters')}</h4><button className="filter-clear" onClick={() => { setOrientation('All'); setColorMood('All'); onContentTypeChange('all'); onClearAll(); }}>{t('search.clearAll')}</button></div>
      <div className="filter-section"><h5>{t('search.orientation')}</h5>{chips(['All', 'Portrait', 'Landscape', 'Square'], orientation, setOrientation)}</div>
      <div className="filter-section"><h5>{t('search.colorMood')}</h5>{chips(['All', 'Light', 'Warm', 'Dark', 'Green', 'Colorful'], colorMood, setColorMood)}</div>
      <div className="filter-section"><h5>{t('search.contentType')}</h5>{chips([t('search.all'), t('search.images'), t('search.boards')], contentType, onContentTypeChange)}</div>
      <div className="filter-section"><h5>{t('search.savedSearches')}</h5>
        <div className="saved-searches">{['Dream office', 'Neutral interiors', 'Workspace ideas'].map((s) => <button key={s} className="saved-search-item" onClick={() => onContentTypeChange(s)}>{s}</button>)}</div>
      </div>
      <button className="save-search-btn" onClick={() => onToast(t('toast.searchSaved'))}>{t('search.saveSearch')}</button>
    </div>
  );
}