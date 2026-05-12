import type { CategoryConfig } from '../types/inspiration';
import { useLanguage } from '../context/LanguageContext';

interface Props { categories: CategoryConfig[]; activeCategory: string; onSelect: (key: string) => void; }

export function CategoryRail({ categories, activeCategory, onSelect }: Props) {
  const { t } = useLanguage();
  return (
    <div className="category-rail">
      {categories.map((cat) => (
        <button key={cat.key} className={`category-chip${cat.key === activeCategory ? ' active' : ''}`} onClick={() => onSelect(cat.key)}>
          <span className="chip-icon">{cat.icon}</span> {t(cat.labelKey)}
        </button>
      ))}
    </div>
  );
}