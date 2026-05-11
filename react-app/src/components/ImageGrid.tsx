import type { InspirationItem } from '../types/inspiration';
import { InspirationCard } from './InspirationCard';

interface ImageGridProps {
  items: InspirationItem[];
  onToggleFavorite: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetail: (id: string) => void;
}

/** 瀑布流网格：CSS Columns 布局，渲染卡片列表 */
export function ImageGrid({
  items,
  onToggleFavorite,
  onEdit,
  onDelete,
  onViewDetail,
}: ImageGridProps) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">&#128444;</div>
        <p>暂无匹配的灵感</p>
        <p className="empty-hint">试试调整搜索条件或添加新的灵感吧</p>
      </div>
    );
  }

  return (
    <main className="image-grid">
      {items.map((item) => (
        <InspirationCard
          key={item.id}
          item={item}
          onToggleFavorite={onToggleFavorite}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetail={onViewDetail}
        />
      ))}
    </main>
  );
}