import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ApiError } from '../services/authService';

type Mode = 'login' | 'register';

export function AuthPage() {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = (): string | null => {
    if (!email.trim()) return t('auth.errorEmail');
    if (!password) return t('auth.errorPassword');
    if (mode === 'register') {
      if (!username.trim()) return t('auth.errorUsername');
      if (password.length < 6) return t('auth.errorPasswordLen');
      if (password !== confirm) return t('auth.errorPasswordMatch');
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = validate(); if (msg) { setError(msg); return; }
    setSubmitting(true); setError('');
    try {
      if (mode === 'login') await login(email.trim(), password);
      else await register(username.trim(), email.trim(), password);
    } catch (err) { setError(err instanceof ApiError ? err.message : t('toast.actionFailed')); }
    setSubmitting(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">◆</div>
          <h1 className="auth-title">{t('app.name')}</h1>
          <p className="auth-subtitle">{t('app.subtitle')}</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <input className="auth-input" type="text" placeholder={t('auth.username')} value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          )}
          <input className="auth-input" type="email" placeholder={t('auth.email')} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <input className="auth-input" type="password" placeholder={t('auth.password')} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          {mode === 'register' && (
            <input className="auth-input" type="password" placeholder={t('auth.confirmPassword')} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
          )}
          {error && <p className="auth-error">{error}</p>}
          <button className="auth-btn" type="submit" disabled={submitting}>
            {submitting ? t('auth.pleaseWait') : mode === 'login' ? t('auth.loginBtn') : t('auth.registerBtn')}
          </button>
        </form>
        <p className="auth-switch">
          {mode === 'login' ? t('auth.switchToRegister') : t('auth.switchToLogin')}
          <button className="auth-switch-btn" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? t('auth.switchRegister') : t('auth.switchLogin')}
          </button>
        </p>
      </div>
    </div>
  );
}