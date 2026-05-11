interface CategoryNavProps {
  categories: readonly string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

/** 分类筛选导航：横向可滚动胶囊按钮 */
export function CategoryNav({
  categories,
  activeCategory,
  onSelect,
}: CategoryNavProps) {
  return (
    <nav className="category-nav">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`category-btn${cat === activeCategory ? ' active' : ''}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
}