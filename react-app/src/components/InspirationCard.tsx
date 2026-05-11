import { useState } from 'react';
import type { InspirationItem } from '../types/inspiration';

interface InspirationCardProps {
  item: InspirationItem;
  onToggleFavorite: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetail: (id: string) => void;
}

/** 单张灵感卡片：图片 + 收藏浮层 + 标题/分类/标签 + hover 编辑/删除 */
export function InspirationCard({
  item,
  onToggleFavorite,
  onEdit,
  onDelete,
  onViewDetail,
}: InspirationCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="card">
      {/* 图片区域 */}
      <div
        className="card-image-wrapper"
        title="点击查看详情"
        onClick={() => {
          if (!imageError) onViewDetail(item.id);
        }}
      >
        {!imageError ? (
          <>
            <img
              className="card-image"
              src={item.imageUrl}
              alt={item.title}
              loading="lazy"
              onError={() => setImageError(true)}
            />

            {/* 收藏悬浮按钮 */}
            <button
              className={`card-fav-btn${item.favorite ? ' favorited' : ''}`}
              title={item.favorite ? '取消收藏' : '收藏'}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(item.id);
              }}
            >
              {item.favorite ? '♥' : '♡'}
            </button>

            {/* hover 查看详情提示 */}
            <div className="image-hover-hint">
              <span>查看详情</span>
            </div>
          </>
        ) : (
          <div className="card-image-error" style={{ display: 'flex' }}>
            <span className="error-icon">&#128247;</span>
            <span>图片加载失败</span>
          </div>
        )}
      </div>

      {/* 卡片正文 */}
      <div className="card-body">
        <h3 className="card-title" title={item.title}>
          {item.title}
        </h3>
        <div className="card-meta">
          <span className="card-category">{item.category}</span>
        </div>
        <div className="card-tags">
          {item.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="card-actions">
          <button
            className="card-action-btn edit-action"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item.id);
            }}
          >
            编辑
          </button>
          <button
            className="card-action-btn delete-action"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
}