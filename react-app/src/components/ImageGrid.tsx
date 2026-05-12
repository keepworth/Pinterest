import type { InspirationItem } from '../types/inspiration';
import { InspirationCard } from './InspirationCard';
import { EmptyState } from './EmptyState';

interface ImageGridProps {
  items: InspirationItem[];
  totalItems: number;
  onToggleFavorite: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetail: (id: string) => void;
  onAddClick: () => void;
  onClearFilters: () => void;
  emptyMessage?: string;
  emptyActionLabel?: string;
}

export function ImageGrid({
  items, totalItems, onToggleFavorite, onEdit, onDelete,
  onViewDetail, onAddClick, onClearFilters,
  emptyMessage, emptyActionLabel,
}: ImageGridProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        type={totalItems === 0 ? 'empty' : 'no-results'}
        onAddClick={onAddClick}
        onClearFilters={onClearFilters}
        message={emptyMessage}
        actionLabel={emptyActionLabel}
      />
    );
  }

  return (
    <main className="image-grid">
      {items.map((item) => (
        <InspirationCard key={item.id} item={item}
          onToggleFavorite={onToggleFavorite} onEdit={onEdit}
          onDelete={onDelete} onViewDetail={onViewDetail} />
      ))}
    </main>
  );
}