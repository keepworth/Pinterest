import { useLanguage } from '../context/LanguageContext';

export function LoadingState() {
  const { t } = useLanguage();
  return <div className="loading-state"><p>{t('loading.default')}</p></div>;
}