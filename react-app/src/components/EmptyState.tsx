import { useLanguage } from '../context/LanguageContext';

interface Props {
  type: 'empty' | 'no-results';
  onAddClick?: () => void; onClearFilters?: () => void;
  message?: string; actionLabel?: string;
}

export function EmptyState({ type, onAddClick, onClearFilters, message, actionLabel }: Props) {
  const { t } = useLanguage();

  if (type === 'empty') {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🖼️</div>
        <h3 className="empty-state-title">{message || t('empty.noInspirations')}</h3>
        <p className="empty-state-text">{t('empty.noInspirationsHint')}</p>
        {onAddClick && <button className="empty-state-btn" onClick={onAddClick}>{actionLabel || t('empty.addBtn')}</button>}
      </div>
    );
  }
  return (
    <div className="empty-state">
      <div className="empty-state-icon">🔍</div>
      <h3 className="empty-state-title">{message || t('empty.noResults')}</h3>
      <p className="empty-state-text">{t('empty.noResultsHint')}</p>
      {onClearFilters && <button className="empty-state-btn" onClick={onClearFilters}>{actionLabel || t('empty.clearBtn')}</button>}
    </div>
  );
}