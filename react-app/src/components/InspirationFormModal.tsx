import { useState, useEffect, useRef } from 'react';
import type { InspirationItem, InspirationFormData, ToastType, Board } from '../types/inspiration';
import { CATEGORY_CONFIG } from '../utils/constants';
import { validateImageFile } from '../utils/image';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  isOpen: boolean; editingItem: InspirationItem | null;
  boards: Board[]; defaultBoardId?: string;
  onClose: () => void; onSubmit: (data: InspirationFormData) => void;
  onToast: (type: ToastType, text: string) => void;
}

export function InspirationFormModal(p: Props) {
  const { t } = useLanguage();
  const [urlInput, setUrlInput] = useState('');
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [boardId, setBoardId] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');
  const [previewError, setPreviewError] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const pt = useRef<ReturnType<typeof setTimeout> | null>(null);

  const revoke = () => { if (objectUrl) { URL.revokeObjectURL(objectUrl); setObjectUrl(null); } };

  useEffect(() => {
    if (!p.isOpen) return;
    if (p.editingItem) {
      setUrlInput(p.editingItem.imageUrl.startsWith('data:') ? '' : p.editingItem.imageUrl);
      setTitle(p.editingItem.title); setCategory(p.editingItem.category);
      setTagsInput(p.editingItem.tags.join(', ')); setBoardId(p.editingItem.boardId || '');
      setPreviewSrc(p.editingItem.imageUrl);
    } else {
      setUrlInput(''); setTitle(''); setCategory(''); setTagsInput('');
      setBoardId(p.defaultBoardId || ''); setPreviewSrc('');
    }
    setFileBase64(null); setFileName(''); revoke(); setErrors({}); setPreviewError(false);
  }, [p.isOpen, p.editingItem]);

  useEffect(() => () => { revoke(); if (pt.current) clearTimeout(pt.current); }, []);

  const handleUrl = (v: string) => {
    setUrlInput(v); setErrors((prev) => ({ ...prev, imageSource: '' }));
    if (fileBase64) { setFileBase64(null); setFileName(''); revoke(); }
    if (pt.current) clearTimeout(pt.current);
    if (v.trim()) { pt.current = setTimeout(() => { setPreviewSrc(v.trim()); setPreviewError(false); }, 500); }
    else if (!p.editingItem) setPreviewSrc('');
  };

  const handleFile = (file: File) => {
    const err = validateImageFile(file);
    if (err) { p.onToast('error', t(err.includes('格式') ? 'form.errorImageType' : 'form.errorImageTooLarge')); return; }
    setFileName(file.name); revoke();
    const url = URL.createObjectURL(file); setObjectUrl(url);
    const r = new FileReader(); r.onload = () => { setFileBase64(r.result as string); setUrlInput(''); setPreviewSrc(r.result as string); setPreviewError(false); setErrors((prev) => ({ ...prev, imageSource: '' })); };
    r.onerror = () => { p.onToast('error', t('form.errorImageRead')); setFileName(''); };
    r.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const n: Record<string, string> = {};
    if (!fileBase64 && !urlInput.trim() && !p.editingItem?.imageUrl) n.imageSource = t('form.errorUrlOrFile');
    if (!title.trim()) n.title = t('form.errorTitleRequired');
    if (!category) n.category = t('form.errorCategoryRequired');
    setErrors(n); return Object.keys(n).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); if (!validate()) return;
    const tags = tagsInput.split(/[,，]/).map((x) => x.trim()).filter(Boolean);
    p.onSubmit({ title: title.trim(), imageUrl: urlInput.trim(), category, tags, imageFile: fileBase64 ? undefined : undefined, boardId: boardId || undefined });
  };

  const close = () => { if (pt.current) clearTimeout(pt.current); p.onClose(); };
  if (!p.isOpen) return null;
  const ed = p.editingItem !== null;

  return (
    <div className="modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="modal">
        <div className="modal-header"><h2>{ed ? t('form.editTitle') : t('form.addTitle')}</h2><button className="modal-close" onClick={close}>&times;</button></div>
        <form onSubmit={submit} id="addForm">
          <div className="form-group"><label htmlFor="imageUrl">{t('form.imageUrl')}</label>
            <input id="imageUrl" type="text" className={`form-input${errors.imageSource ? ' input-error' : ''}`} placeholder={t('form.imageUrlPlaceholder')} value={urlInput} onChange={(e) => handleUrl(e.target.value)} />
            {errors.imageSource && <span className="form-error visible">{errors.imageSource}</span>}
          </div>
          <div className="form-group"><label>{t('form.chooseImage')}</label>
            <div className="file-upload-row">
              <input type="file" id="imageFile" className="file-input-hidden" accept="image/jpeg,image/png,image/webp" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
              <label htmlFor="imageFile" className="btn btn-secondary btn-sm file-label">{t('form.chooseImage')}</label>
              {fileName && <span className="file-name">{fileName}</span>}
            </div>
            <span className="form-hint">{t('form.imageHint')}</span>
          </div>
          {previewSrc && (
            <div className="form-group image-preview-group" style={{ display: 'block' }}><label>{t('form.preview')}</label>
              <div className="image-preview-wrapper">
                {!previewError ? <img className="image-preview" src={previewSrc} alt="" onError={() => setPreviewError(true)} onLoad={() => setPreviewError(false)} /> : <div className="image-preview-error" style={{ display: 'flex' }}><span>{t('form.previewFailed')}</span></div>}
              </div>
            </div>
          )}
          <div className="form-group"><label htmlFor="title">{t('form.title')} <span className="required">*</span></label>
            <input id="title" type="text" className={`form-input${errors.title ? ' input-error' : ''}`} placeholder={t('form.titlePlaceholder')} value={title} onChange={(e) => { setTitle(e.target.value); if (e.target.value.trim()) setErrors((prev) => ({ ...prev, title: '' })); }} />
            {errors.title && <span className="form-error visible">{errors.title}</span>}
          </div>
          <div className="form-group"><label htmlFor="category">{t('form.category')} <span className="required">*</span></label>
            <select id="category" className={`form-input${errors.category ? ' input-error' : ''}`} value={category} onChange={(e) => { setCategory(e.target.value); if (e.target.value) setErrors((prev) => ({ ...prev, category: '' })); }}>
              <option value="">{t('form.categoryPlaceholder')}</option>
              {CATEGORY_CONFIG.filter((c) => c.key !== '全部').map((c) => <option key={c.key} value={c.key}>{t(c.labelKey)}</option>)}
            </select>
            {errors.category && <span className="form-error visible">{errors.category}</span>}
          </div>
          <div className="form-group"><label htmlFor="tags">{t('form.tags')} <span className="hint">{t('form.tagsHint')}</span></label>
            <input id="tags" type="text" className="form-input" placeholder={t('form.tagsPlaceholder')} value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
          </div>
          <div className="form-group"><label htmlFor="boardId">{t('form.board')}</label>
            <select id="boardId" className="form-input" value={boardId} onChange={(e) => setBoardId(e.target.value)}>
              <option value="">{t('form.boardNone')}</option>
              {p.boards.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={close}>{t('form.cancel')}</button>
            <button type="submit" className="btn btn-primary">{ed ? t('form.saveEdit') : t('form.confirmAdd')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}