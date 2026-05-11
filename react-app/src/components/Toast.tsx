import type { ToastMessage } from '../types/inspiration';

interface ToastProps {
  toasts: ToastMessage[];
}

const ICON_MAP: Record<ToastMessage['type'], string> = {
  success: '✔',
  error: '✖',
  info: 'ℹ',
};

/** Toast 通知展示组件，仅负责渲染，业务逻辑由父组件管理 */
export function Toast({ toasts }: ToastProps) {
  if (toasts.length === 0) {
    return <div className="toast-container" />;
  }

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">{ICON_MAP[t.type]}</span>
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  );
}