interface StatsBarProps {
  filteredCount: number;
  totalFavCount: number;
}

/**
 * 统计信息栏
 * filteredCount — 当前筛选后的图片数量
 * totalFavCount — 全部数据中的收藏总数（不受筛选影响）
 */
export function StatsBar({ filteredCount, totalFavCount }: StatsBarProps) {
  return (
    <div className="stats-bar">
      <span>共 {filteredCount} 张图片</span>
      <span className="stats-divider">&middot;</span>
      <span>已收藏 {totalFavCount} 张</span>
    </div>
  );
}