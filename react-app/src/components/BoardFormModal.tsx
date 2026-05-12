import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { Board } from '../types/inspiration';

interface Props {
  isOpen: boolean; editingBoard: Board | null;
  onClose: () => void; onSubmit: (name: string, description: string) => void;
}

export function BoardFormModal({ isOpen, editingBoard, onClose, onSubmit }: Props) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (editingBoard) { setName(editingBoard.name); setDescription(editingBoard.description || ''); }
    else { setName(''); setDescription(''); }
  }, [isOpen, editingBoard]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <h2>{editingBoard ? t('board.editBoard') : t('board.newBoard')}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (name.trim()) onSubmit(name.trim(), description.trim()); }} style={{ padding: '18px 24px 24px' }}>
          <div className="form-group"><label>{t('board.name')} <span className="required">*</span></label>
            <input className="form-input" placeholder={t('board.name')} value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>
          <div className="form-group"><label>{t('board.description')}</label>
            <input className="form-input" placeholder={t('board.description')} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>{t('form.cancel')}</button>
            <button type="submit" className="btn btn-primary">{editingBoard ? t('board.save') : t('board.create')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}