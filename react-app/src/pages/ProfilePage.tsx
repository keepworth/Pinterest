import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import type { InspirationItem, Board } from '../types/inspiration';

interface Props {
  items: InspirationItem[];
  boards: Board[];
  onToggleFavorite: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetail: (id: string) => void;
  onAddClick: () => void;
  onBoardClick: (b: Board) => void;
  onNavigateSettings: () => void;
}

type Tab = 'pins' | 'boards' | 'likes' | 'about';

export function ProfilePage({
  items, boards, onToggleFavorite, onEdit, onDelete,
  onViewDetail, onAddClick, onBoardClick, onNavigateSettings,
}: Props) {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('pins');
  if (!user) return null;

  const favItems = useMemo(() => items.filter((i) => i.favorite), [items]);
  const joined = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
    : '—';

  // 标签统计
  const tagCounts = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((i) => i.tags.forEach((t) => map.set(t, (map.get(t) || 0) + 1)));
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [items]);

  // 最近动态
  const recentActivity = useMemo(() => {
    const acts: { type: string; title: string; time: string }[] = [];
    [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 2).forEach((i) => acts.push({ type: 'Added', title: i.title, time: i.createdAt }));
    favItems.slice(0, 1).forEach((i) => acts.push({ type: 'Liked', title: i.title, time: i.createdAt }));
    boards.slice(0, 1).forEach((b) => acts.push({ type: 'Created board', title: b.name, time: b.createdAt }));
    return acts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 4);
  }, [items, favItems, boards]);

  const uploadCount = items.filter((i) => i.sourceType === 'upload').length;

  return (
    <div className="profile-page">
      {/* Hero Card */}
      <div className="profile-hero">
        <div className="profile-hero-left">
          <div className="profile-hero-avatar">
            {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : <span>{user.username[0].toUpperCase()}</span>}
          </div>
          <div className="profile-hero-info">
            <h1 className="profile-hero-name">{user.username}</h1>
            <p className="profile-hero-bio">Collecting ideas, boards, and visual inspiration.</p>
            <div className="profile-hero-meta">
              <span>{user.email}</span>
              <span className="hero-meta-dot">&middot;</span>
              <span>Joined {joined}</span>
            </div>
            <div className="profile-hero-stats">
              <span><strong>{items.length}</strong> Pins</span>
              <span><strong>{boards.length}</strong> Boards</span>
              <span><strong>{favItems.length}</strong> Likes</span>
            </div>
          </div>
        </div>
        <div className="profile-hero-right">
          <button className="profile-action-btn primary" onClick={onNavigateSettings}>Edit Profile</button>
          <button className="profile-action-btn" onClick={() => {}}>Share</button>
          <button className="profile-action-icon" onClick={() => {}}>⋯</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        {(['pins', 'boards', 'likes', 'about'] as Tab[]).map((t) => (
          <button key={t} className={`profile-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'pins' ? 'Pins' : t === 'boards' ? 'Boards' : t === 'likes' ? 'Likes' : 'About'}
          </button>
        ))}
      </div>

      {/* Main + Right */}
      <div className="profile-main-layout">
        <div className="profile-content">
          {tab === 'pins' && (
            items.length === 0 ? (
              <div className="empty-state"><div className="empty-state-icon">📌</div><h3>还没有发布任何灵感</h3><p className="empty-state-text">点击添加，收藏你的第一张图片灵感</p><button className="empty-state-btn" onClick={onAddClick}>添加灵感</button></div>
            ) : (
              <div className="image-grid">
                {items.map((item) => (
                  <div key={item.id} className="card">
                    <div className="card-image-wrapper" onClick={() => onViewDetail(item.id)}>
                      <img className="card-image" src={item.imageUrl} alt={item.title} loading="lazy" />
                      <button className={`card-fav-btn${item.favorite ? ' favorited' : ''}`} onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}>{item.favorite ? '♥' : '♡'}</button>
                    </div>
                    <div className="card-body">
                      <h3 className="card-title">{item.title}</h3>
                      <div className="card-meta-row"><span className="card-category">{item.category}</span></div>
                      <div className="card-actions">
                        <button className="card-action-btn edit-action" onClick={(e) => { e.stopPropagation(); onEdit(item.id); }}>编辑</button>
                        <button className="card-action-btn delete-action" onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}>删除</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {tab === 'boards' && (
            boards.length === 0 ? (
              <div className="empty-state"><div className="empty-state-icon">📁</div><h3>还没有画板</h3><p className="empty-state-text">创建一个画板来整理你的灵感</p></div>
            ) : (
              <div className="board-grid">
                {boards.map((b) => (
                  <div key={b.id} className="board-card" onClick={() => onBoardClick(b)}>
                    <div className="board-card-cover">{b.displayCover || b.coverImageUrl ? <img src={b.displayCover || b.coverImageUrl} alt="" /> : <span className="board-card-cover-empty">📁</span>}</div>
                    <div className="board-card-body"><h3 className="board-card-name">{b.name}</h3><span className="board-card-count">{b.inspirationCount ?? 0} 张灵感</span></div>
                  </div>
                ))}
              </div>
            )
          )}

          {tab === 'likes' && (
            favItems.length === 0 ? (
              <div className="empty-state"><div className="empty-state-icon">❤️</div><h3>还没有收藏</h3><p className="empty-state-text">点击图片上的爱心收藏喜欢的灵感</p></div>
            ) : (
              <div className="image-grid">
                {favItems.map((item) => (
                  <div key={item.id} className="card" onClick={() => onViewDetail(item.id)}>
                    <div className="card-image-wrapper"><img className="card-image" src={item.imageUrl} alt={item.title} loading="lazy" /></div>
                    <div className="card-body"><h3 className="card-title">{item.title}</h3></div>
                  </div>
                ))}
              </div>
            )
          )}

          {tab === 'about' && (
            <div className="profile-about-card">
              <h3>About {user.username}</h3>
              <div className="about-rows">
                <div className="about-row"><span className="about-label">Username</span><span>{user.username}</span></div>
                <div className="about-row"><span className="about-label">Email</span><span>{user.email}</span></div>
                <div className="about-row"><span className="about-label">Joined</span><span>{joined}</span></div>
                <div className="about-row"><span className="about-label">Pins</span><span>{items.length}</span></div>
                <div className="about-row"><span className="about-label">Boards</span><span>{boards.length}</span></div>
                <div className="about-row"><span className="about-label">Likes</span><span>{favItems.length}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="profile-right-panel">
          {/* Recent Activity */}
          <div className="panel-card">
            <h4 className="panel-title">Recent Activity</h4>
            {recentActivity.length === 0 ? <p className="panel-empty">暂无动态</p> : (
              <div className="activity-list">
                {recentActivity.map((a, i) => (
                  <div key={i} className="activity-item">
                    <span className="activity-icon">{a.type === 'Liked' ? '❤️' : a.type === 'Added' ? '📌' : '📁'}</span>
                    <div className="activity-text">
                      <span className="activity-action">{a.type}</span>
                      <span className="activity-title">{a.title}</span>
                      <span className="activity-time">{new Date(a.time).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Favorite Tags */}
          <div className="panel-card">
            <h4 className="panel-title">Favorite Tags</h4>
            {tagCounts.length === 0 ? <p className="panel-empty">暂无标签</p> : (
              <div className="fav-tags-list">
                {tagCounts.map(([tag, count]) => (
                  <div key={tag} className="fav-tag-row"><span className="fav-tag-name">{tag}</span><span className="fav-tag-count">{count}</span></div>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="panel-card">
            <h4 className="panel-title">Profile Stats</h4>
            <div className="stats-list">
              <div className="stat-row"><span>📌 Pins</span><span>{items.length}</span></div>
              <div className="stat-row"><span>📁 Boards</span><span>{boards.length}</span></div>
              <div className="stat-row"><span>❤️ Likes</span><span>{favItems.length}</span></div>
              <div className="stat-row"><span>📷 Uploads</span><span>{uploadCount}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}