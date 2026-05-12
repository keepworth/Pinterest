import type { Board } from '../types/inspiration';
import { BoardCard } from './BoardCard';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  boards: Board[];
  onCreateClick: () => void;
  onBoardClick: (b: Board) => void;
  onEdit: (b: Board) => void;
  onDelete: (b: Board) => void;
}

export function BoardList({ boards, onCreateClick, onBoardClick, onEdit, onDelete }: Props) {
  const { t } = useLanguage();

  return (
    <div className="board-list-page">
      <div className="content-header">
        <div className="content-header-left">
          <h2 className="content-title">{t('board.myBoards')}</h2>
          <span className="content-stats">{t('board.boardsCount', { count: boards.length })}</span>
        </div>
        <button className="topbar-upload-btn" onClick={onCreateClick}>+ {t('board.newBoard')}</button>
      </div>
      {boards.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📁</div>
          <h3 className="empty-state-title">{t('board.noBoards')}</h3>
          <p className="empty-state-text">{t('board.createHint')}</p>
          <button className="empty-state-btn" onClick={onCreateClick}>{t('board.newBoard')}</button>
        </div>
      ) : (
        <div className="board-grid">
          {boards.map((b) => <BoardCard key={b.id} board={b} onClick={() => onBoardClick(b)} onEdit={() => onEdit(b)} onDelete={() => onDelete(b)} />)}
        </div>
      )}
    </div>
  );
}