import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { authService, ApiError } from '../services/authService';
import type { Board, ToastMessage, ToastType } from '../types/inspiration';
import type { Language } from '../i18n';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { Toast } from '../components/Toast';

interface Props {
  boards: Board[];
  onNavigateProfile: () => void;
  onBoardCreate: () => void;
  onToast: (text: string) => void;
}

export function SettingsPage({ boards, onNavigateProfile, onBoardCreate, onToast }: Props) {
  const { user, updateUser } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [username, setUsername] = useState(user?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [notifPush, setNotifPush] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifMsg, setNotifMsg] = useState(false);
  const [notifWeekly, setNotifWeekly] = useState(true);
  const [autoplay, setAutoplay] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastType, text: string) => {
    const id = Date.now().toString(36);
    setToasts((prev) => { const next = [...prev, { id, type, text }]; return next.length > 3 ? next.slice(-3) : next; });
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 2200);
  };

  const handleSave = async () => {
    if (!username.trim()) { addToast('error', t('form.requiredTitle')); return; }
    setSaving(true);
    try {
      const u = await authService.updateMe({ username: username.trim(), avatarUrl: avatarUrl.trim() || '' });
      updateUser(u); addToast('success', t('toast.profileUpdated'));
    } catch (err) { addToast('error', err instanceof ApiError ? err.message : t('toast.actionFailed')); }
    setSaving(false);
  };

  const recentBoards = boards.slice(0, 3);
  const langOptions: { value: Language; label: string }[] = [
    { value: 'zh-CN', label: '中文' }, { value: 'en-US', label: 'English' },
  ];

  return (
    <div className="settings-page-v2">
      <div className="settings-header-v2"><h2>{t('settings.title')}</h2><p>{t('settings.description')}</p></div>
      <div className="settings-layout">
        <div className="settings-main-grid">
          {/* Personal Info */}
          <div className="settings-card">
            <h3>{t('settings.personalInfo')}</h3>
            <div className="personal-info-row">
              <div className="profile-photo-editor">
                <div className="profile-photo-preview">{avatarUrl ? <img src={avatarUrl} alt="" /> : <span>{user?.username?.[0]?.toUpperCase() || '?'}</span>}</div>
              </div>
              <div className="personal-info-form">
                <div className="form-group"><label>{t('settings.username')}</label><input className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} /></div>
                <div className="form-group"><label>{t('settings.email')}</label><input className="form-input" value={user?.email || ''} disabled style={{ opacity: 0.6 }} /></div>
                <div className="form-group"><label>{t('settings.avatarUrl')}</label><input className="form-input" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} /></div>
                <div className="form-group"><label>{t('settings.bio')}</label><input className="form-input" value={bio} onChange={(e) => setBio(e.target.value)} /></div>
              </div>
            </div>
            <div className="form-actions"><button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? t('settings.saving') : t('settings.saveChanges')}</button></div>
          </div>

          {/* Security */}
          <div className="settings-card">
            <h3>{t('settings.security')}</h3>
            <div className="settings-row"><span>{t('settings.email')}</span><span>{user?.email}</span></div>
            <div className="settings-row"><span>{t('settings.password')}</span><span>•••••••• <button className="link-btn" onClick={() => onToast(t('toast.passwordSoon'))}>{t('settings.change')}</button></span></div>
            <div className="settings-row"><span>{t('settings.twoFactor')}</span><span>Off</span></div>
            <div className="settings-row"><span>{t('settings.loginSessions')}</span><span><button className="link-btn" onClick={() => onToast(t('toast.notImplemented'))}>View</button></span></div>
          </div>

          {/* Preferences */}
          <div className="settings-card">
            <h3>{t('settings.preferences')}</h3>
            <div className="settings-row">
              <span>{t('settings.language')}</span>
              <select className="sort-select" value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
                {langOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="settings-row"><span>{t('settings.content')}</span><select className="sort-select"><option>All</option></select></div>
            <div className="settings-row"><span>{t('settings.autoplay')}</span><ToggleSwitch checked={autoplay} onChange={setAutoplay} /></div>
          </div>

          {/* Notifications */}
          <div className="settings-card">
            <h3>{t('settings.notifications')}</h3>
            <div className="settings-row"><span>{t('settings.pushNotif')}</span><ToggleSwitch checked={notifPush} onChange={setNotifPush} /></div>
            <div className="settings-row"><span>{t('settings.emailUpdates')}</span><ToggleSwitch checked={notifEmail} onChange={setNotifEmail} /></div>
            <div className="settings-row"><span>{t('settings.messages')}</span><ToggleSwitch checked={notifMsg} onChange={setNotifMsg} /></div>
            <div className="settings-row"><span>{t('settings.weeklySummary')}</span><ToggleSwitch checked={notifWeekly} onChange={setNotifWeekly} /></div>
          </div>

          {/* Connected */}
          <div className="settings-card">
            <h3>{t('settings.connectedAccounts')}</h3>
            <div className="settings-row"><span>Google</span><span className="connected-badge">Connected</span></div>
            <div className="settings-row"><span>Apple</span><span><button className="link-btn" onClick={() => onToast(t('toast.authSoon'))}>Connect</button></span></div>
            <div className="settings-row"><span>Facebook</span><span><button className="link-btn" onClick={() => onToast(t('toast.authSoon'))}>Connect</button></span></div>
          </div>

          {/* Privacy */}
          <div className="settings-card">
            <h3>{t('settings.privacy')}</h3>
            <div className="settings-row"><span>{t('settings.profileVisibility')}</span><span>Public</span></div>
            <div className="settings-row"><span>{t('settings.blocked')}</span><span>0</span></div>
            <div className="settings-row"><span>{t('settings.downloadData')}</span><span><button className="link-btn" onClick={() => onToast(t('toast.notImplemented'))}>Request</button></span></div>
            <div className="settings-row"><span style={{ color: 'var(--color-danger)' }}>{t('settings.deleteAccount')}</span><span><button className="link-btn danger" onClick={() => onToast(t('toast.notImplemented'))}>Delete</button></span></div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="settings-right-panel">
          <div className="settings-card">
            <h3>{t('settings.recentBoards')}</h3>
            {recentBoards.length === 0 ? <p className="panel-empty">—</p> : (
              <div className="recent-boards-list">
                {recentBoards.map((b) => (
                  <div key={b.id} className="recent-board-row">
                    <div className="recent-board-cover">{b.displayCover || b.coverImageUrl ? <img src={b.displayCover || b.coverImageUrl} alt="" /> : <span>📁</span>}</div>
                    <div><div className="recent-board-name">{b.name}</div><div className="recent-board-count">{t('board.count', { count: b.inspirationCount ?? 0 })}</div></div>
                  </div>
                ))}
              </div>
            )}
            <button className="link-btn" onClick={onNavigateProfile} style={{ marginTop: 8 }}>View all</button>
          </div>
          <div className="settings-card prompt-card">
            <div className="prompt-card-bg" />
            <div className="prompt-card-content">
              <h4>{t('settings.promptTitle')}</h4>
              <p>{t('settings.promptDesc')}</p>
              <button className="btn btn-primary btn-sm" onClick={onBoardCreate}>{t('settings.createBoard')}</button>
            </div>
          </div>
        </div>
      </div>
      <Toast toasts={toasts} />
    </div>
  );
}