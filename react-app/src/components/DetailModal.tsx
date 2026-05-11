import { useState } from 'react';
import type { InspirationItem } from '../types/inspiration';

interface DetailModalProps {
  isOpen: boolean;
  item: InspirationItem | null;
  onClose: () => void;
}

/** 查看详情弹窗（Phase 1 — 基础展示） */
export function DetailModal({ isOpen, item, onClose }: DetailModalProps) {
  const [imageError, setImageError] = useState(false);

  if (!isOpen || !item) return null;

  const createdDate = new Date(item.createdAt).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className="modal-overlay active"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal detail-modal">
        <div className="modal-header">
          <h2>灵感详情</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="detail-body">
          {/* 大图 */}
          <div className="detail-image-wrapper">
            {!imageError ? (
              <img
                className="detail-image"
                src={item.imageUrl}
                alt={item.title}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="detail-image-error" style={{ display: 'flex' }}>
                <span>&#128247;</span>
                <span>图片加载失败</span>
              </div>
            )}
          </div>

          {/* 信息行 */}
          <div className="detail-info">
            <div className="detail-row">
              <span className="detail-label">标题</span>
              <span className="detail-value">{item.title}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">分类</span>
              <span className="detail-value">{item.category}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">标签</span>
              <div className="detail-value">
                {item.tags.length > 0 ? (
                  <div className="detail-tags">
                    {item.tags.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                ) : (
                  '无'
                )}
              </div>
            </div>
            <div className="detail-row">
              <span className="detail-label">收藏状态</span>
              <span className={`detail-value${item.favorite ? ' fav-yes' : ''}`}>
                {item.favorite ? '已收藏' : '未收藏'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">创建时间</span>
              <span className="detail-value">{createdDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}