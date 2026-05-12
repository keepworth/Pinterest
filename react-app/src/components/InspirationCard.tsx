import { useState } from 'react';
import type { InspirationItem } from '../types/inspiration';
import { formatRelativeDate } from '../utils/helpers';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  item: InspirationItem;
  onToggleFavorite: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetail: (id: string) => void;
}

export function InspirationCard({ item, onToggleFavorite, onEdit, onDelete, onViewDetail }: Props) {
  const { t, language } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const maxTags = 3;
  const extra = Math.max(0, item.tags.length - maxTags);

  return (
    <div className="card">
      <div className="card-image-wrapper" title={t('card.viewDetail')} onClick={() => { if (!imageError) onViewDetail(item.id); }}>
        {!imageError ? (
          <>
            <img className="card-image" src={item.imageUrl} alt={item.title} loading="lazy" onError={() => setImageError(true)} />
            <button className={`card-fav-btn${item.favorite ? ' favorited' : ''}`} title={item.favorite ? t('card.favorited') : t('card.favorite')} onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}>
              {item.favorite ? '♥' : '♡'}
            </button>
            <div className="image-hover-hint"><span>{t('card.viewDetail')}</span></div>
          </>
        ) : (
          <div className="card-image-error"><span className="error-icon">🖼️</span><span>{t('card.loadFailed')}</span></div>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-title">{item.title}</h3>
        <div className="card-meta-row">
          <span className="card-category">{item.category}</span>
          <span className="card-date">{formatRelativeDate(item.createdAt, language)}</span>
        </div>
        {item.tags.length > 0 && (
          <div className="card-tags">
            {item.tags.slice(0, maxTags).map((tag) => <span key={tag} className="tag">{tag}</span>)}
            {extra > 0 && <span className="tag tag-more">+{extra}</span>}
          </div>
        )}
        <div className="card-actions">
          <button className="card-action-btn edit-action" onClick={(e) => { e.stopPropagation(); onEdit(item.id); }}>{t('card.edit')}</button>
          <button className="card-action-btn delete-action" onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}>{t('card.delete')}</button>
        </div>
      </div>
    </div>
  );
}