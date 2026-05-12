const TOKEN_KEY = 'inspireboard_token';

export function getToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

export function setToken(token: string): void {
  try { localStorage.setItem(TOKEN_KEY, token); } catch { /* */ }
}

export function removeToken(): void {
  try { localStorage.removeItem(TOKEN_KEY); } catch { /* */ }
}

/** 清除 token 并广播 auth:expired 事件，触发 AuthContext 退出登录 */
export function handleAuthExpired(): void {
  removeToken();
  window.dispatchEvent(new CustomEvent('auth:expired'));
}