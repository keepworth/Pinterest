import { useState, type ReactNode } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AvatarMenu } from './AvatarMenu';

interface TopBarProps {
  searchTerm: string; onSearchChange: (v: string) => void;
  onSearchFocus: () => void; onSearchBlur: () => void; onClear: () => void;
  onUploadClick: () => void; onNavigateProfile: () => void;
  onNavigateSettings: () => void; onLogout: () => void; onToast: (t: string) => void;
  userName?: string; email?: string; avatarUrl?: string; children?: ReactNode;
}

export function TopBar(p: TopBarProps) {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const initial = p.userName ? p.userName[0].toUpperCase() : '?';

  return (
    <div className="topbar">
      <div className="search-area">
        <div className="search-input-wrapper">
          <span className="topbar-search-icon">🔍</span>
          <input type="text" className="topbar-search-input" placeholder={t('topbar.searchPlaceholder')}
            autoComplete="off" value={p.searchTerm} onChange={(e) => p.onSearchChange(e.target.value)}
            onFocus={p.onSearchFocus} onBlur={() => setTimeout(p.onSearchBlur, 150)}
            onKeyDown={(e) => { if (e.key === 'Escape') (e.target as HTMLInputElement).blur(); }} />
          {p.searchTerm && <button className="topbar-search-clear" onClick={p.onClear}>&times;</button>}
        </div>
        {p.children}
      </div>
      <div className="topbar-actions">
        <button className="topbar-upload-btn" onClick={p.onUploadClick}>{t('topbar.upload')}</button>
        <button className="topbar-icon-btn" title="Theme" onClick={() => p.onToast(t('toast.themeSoon'))}>◐</button>
        <div className="avatar-menu-wrapper">
          <div className="topbar-avatar" title={p.userName} onClick={() => setMenuOpen((v) => !v)}>
            {p.avatarUrl ? <img src={p.avatarUrl} alt="" className="topbar-avatar-img" /> : initial}
          </div>
          <AvatarMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)}
            userName={p.userName} email={p.email} avatarUrl={p.avatarUrl}
            onNavigateProfile={p.onNavigateProfile} onNavigateSettings={p.onNavigateSettings}
            onLogout={p.onLogout} onToast={p.onToast} />
        </div>
      </div>
    </div>
  );
}