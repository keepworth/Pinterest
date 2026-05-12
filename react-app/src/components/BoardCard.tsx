import type { Board } from '../types/inspiration';
import { useLanguage } from '../context/LanguageContext';

interface Props { board: Board; onClick: () => void; onEdit: () => void; onDelete: () => void; }

export function BoardCard({ board, onClick, onEdit, onDelete }: Props) {
  const { t } = useLanguage();
  return (
    <div className="board-card" onClick={onClick}>
      <div className="board-card-cover">
        {board.displayCover || board.coverImageUrl ? <img src={board.displayCover || board.coverImageUrl} alt="" /> : <div className="board-card-cover-empty">📁</div>}
      </div>
      <div className="board-card-body">
        <h3 className="board-card-name">{board.name}</h3>
        {board.description && <p className="board-card-desc">{board.description}</p>}
        <span className="board-card-count">{t('board.count', { count: board.inspirationCount ?? 0 })}</span>
      </div>
      <div className="board-card-actions">
        <button className="card-action-btn edit-action" onClick={(e) => { e.stopPropagation(); onEdit(); }}>{t('card.edit')}</button>
        <button className="card-action-btn delete-action" onClick={(e) => { e.stopPropagation(); onDelete(); }}>{t('card.delete')}</button>
      </div>
    </div>
  );
}