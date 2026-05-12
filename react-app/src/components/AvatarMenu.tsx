import { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  isOpen: boolean; onClose: () => void;
  userName?: string; email?: string; avatarUrl?: string;
  onNavigateProfile: () => void; onNavigateSettings: () => void;
  onLogout: () => void; onToast: (text: string) => void;
}

export function AvatarMenu({ isOpen, onClose, userName, email, avatarUrl, onNavigateProfile, onNavigateSettings, onLogout, onToast }: Props) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', h); document.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', k); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const initial = userName ? userName[0].toUpperCase() : '?';

  return (
    <div className="avatar-menu" ref={ref}>
      <div className="avatar-menu-header">
        <div className="avatar-menu-avatar">{avatarUrl ? <img src={avatarUrl} alt="" /> : <span>{initial}</span>}</div>
        <div>
          <div className="avatar-menu-name">{userName || 'User'}</div>
          <div className="avatar-menu-email">{email || ''}</div>
        </div>
      </div>
      <div className="avatar-menu-items">
        <button className="avatar-menu-item" onClick={() => { onNavigateProfile(); onClose(); }}>👤 {t('nav.viewProfile')}</button>
        <button className="avatar-menu-item" onClick={() => { onNavigateSettings(); onClose(); }}>⚙️ {t('nav.settings')}</button>
        <button className="avatar-menu-item" onClick={() => { onToast(t('toast.notifSoon')); onClose(); }}>🔔 {t('settings.notifications')}</button>
        <button className="avatar-menu-item" onClick={() => { onToast(t('toast.themeSoon')); onClose(); }}>🎨 Appearance</button>
        <button className="avatar-menu-item" onClick={() => { onToast(t('toast.helpSoon')); onClose(); }}>❓ Help & support</button>
      </div>
      <div className="avatar-menu-divider" />
      <button className="avatar-menu-item signout-item" onClick={onLogout}>{t('nav.signOut')}</button>
    </div>
  );
}