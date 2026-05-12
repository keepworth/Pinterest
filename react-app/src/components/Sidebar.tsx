import type { NavItem } from '../types/inspiration';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  activeNav: NavItem | null;
  onNavSelect: (item: NavItem) => void;
  onCreateClick: () => void;
  onProfileClick: () => void;
  userName?: string;
  avatarUrl?: string;
  onLogout: () => void;
}

export function Sidebar({ activeNav, onNavSelect, onCreateClick, onProfileClick, userName, avatarUrl, onLogout }: SidebarProps) {
  const { t } = useLanguage();
  const navs: { key: NavItem; labelKey: string; icon: string }[] = [
    { key: 'home', labelKey: 'nav.home', icon: '🏠' },
    { key: 'explore', labelKey: 'nav.explore', icon: '🔍' },
    { key: 'collections', labelKey: 'nav.collections', icon: '📁' },
    { key: 'favorites', labelKey: 'nav.favorites', icon: '❤️' },
  ];
  const bottoms: { key: NavItem; labelKey: string; icon: string }[] = [
    { key: 'create', labelKey: 'nav.create', icon: '✏️' },
    { key: 'settings', labelKey: 'nav.settings', icon: '⚙️' },
  ];

  const handleClick = (key: NavItem) => { if (key === 'create') onCreateClick(); else onNavSelect(key); };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo"><div className="logo-icon">◆</div><span className="logo-text">{t('app.name')}</span></div>
      <nav className="sidebar-nav">
        {navs.map((n) => (
          <button key={n.key} className={`sidebar-nav-item${activeNav === n.key ? ' active' : ''}`} onClick={() => handleClick(n.key)}>
            <span className="nav-icon">{n.icon}</span><span className="nav-label">{t(n.labelKey)}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-divider" />
      <nav className="sidebar-nav">
        {bottoms.map((n) => (
          <button key={n.key} className={`sidebar-nav-item${activeNav === n.key ? ' active' : ''}`} onClick={() => handleClick(n.key)}>
            <span className="nav-icon">{n.icon}</span><span className="nav-label">{t(n.labelKey)}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-user" onClick={onProfileClick}>
        <div className="user-avatar">{avatarUrl ? <img src={avatarUrl} alt="" className="user-avatar-img" /> : (userName ? userName[0].toUpperCase() : '?')}</div>
        <div className="user-info">
          <span className="user-name">{userName || t('common.notLoggedIn')}</span>
          <span className="user-sub" onClick={(e) => { e.stopPropagation(); onLogout(); }}>{t('nav.signOut')}</span>
        </div>
      </div>
    </aside>
  );
}