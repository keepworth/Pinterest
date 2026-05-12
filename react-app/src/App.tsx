import { useState, useMemo, useCallback, useEffect } from 'react';
import type { InspirationItem, InspirationFormData, ToastMessage, ToastType, SortMode, NavItem, AppView, SourceType, Board } from './types/inspiration';
import { CATEGORY_CONFIG } from './utils/constants';
import { readCachedItems, writeCachedItems } from './utils/cache';
import { inspirationService, ApiError } from './services/inspirationService';
import { boardService } from './services/boardService';
import { uploadImage } from './services/uploadService';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import { AuthPage } from './pages/AuthPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { CategoryRail } from './components/CategoryRail';
import { ContentHeader } from './components/ContentHeader';
import { ImageGrid } from './components/ImageGrid';
import { InspirationFormModal } from './components/InspirationFormModal';
import { DetailModal } from './components/DetailModal';
import { BoardList } from './components/BoardList';
import { BoardFormModal } from './components/BoardFormModal';
import { SearchOverlay } from './components/SearchOverlay';
import { SearchFilterPanel } from './components/SearchFilterPanel';
import { PlaceholderPage } from './components/PlaceholderPage';
import { LoadingState } from './components/LoadingState';
import { Toast } from './components/Toast';
import { matchesInspiration, matchesBoard, getSearchSuggestions, getTrendingSearches } from './utils/search';
import { getRecentSearches, addRecentSearch, clearRecentSearches } from './utils/searchStorage';

function viewToNav(view: AppView): NavItem | null {
  if (view === 'profile') return null;
  if (view === 'board') return 'collections';
  return view as NavItem;
}

type SearchResultType = 'all' | 'images' | 'boards' | 'people' | 'products';

function App() {
  const auth = useAuth();
  if (auth.isLoading) return <div className="auth-loading"><p>正在检查登录状态...</p></div>;
  if (!auth.isAuthenticated) return <AuthPage />;
  return <AuthenticatedApp />;
}

function AuthenticatedApp() {
  const auth = useAuth();
  const { t } = useLanguage();
  const [items, setItems] = useState<InspirationItem[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  const [appView, setAppView] = useState<AppView>('home');
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('newest');

  // 搜索 UI 状态
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResultType, setSearchResultType] = useState<SearchResultType>('all');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InspirationItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<InspirationItem | null>(null);
  const [isBoardFormOpen, setIsBoardFormOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastType, text: string) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => { const next = [...prev, { id, type, text }]; return next.length > 3 ? next.slice(-3) : next; });
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2200);
  }, []);

  const activeBoard = useMemo(() => boards.find((b) => b.id === activeBoardId) || null, [boards, activeBoardId]);

  // ======================== 初始化 ========================
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [id, bd] = await Promise.all([inspirationService.getAll(), boardService.getAll()]);
        if (cancelled) return;
        setItems(id); writeCachedItems(id); setBoards(bd);
      } catch {
        if (cancelled) return;
        const cached = readCachedItems();
        if (cached.length > 0) { setItems(cached); addToast('info', '后端连接失败，已使用本地缓存'); }
        else { setItems([]); addToast('error', '后端连接失败'); }
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [addToast]);

  const refreshBoards = useCallback(async () => { try { setBoards(await boardService.getAll()); } catch { /* */ } }, []);

  // ======================== 搜索匹配的 items / boards ========================
  const searchedItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const t = searchTerm.trim();
    return items.filter((i) => matchesInspiration(i, t) || (i.boardId && boards.some((b) => b.id === i.boardId && matchesBoard(b, t))));
  }, [items, boards, searchTerm]);

  const searchedBoards = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return boards.filter((b) => matchesBoard(b, searchTerm.trim()));
  }, [boards, searchTerm]);

  // 合并受搜索影响的 item 集合用于筛选
  const searchAffectedItems = searchTerm.trim() ? searchedItems : items;

  // ======================== 筛选 ========================
  const filteredItems = useMemo(() => {
    let result = [...searchAffectedItems];
    if (activeBoardId) result = result.filter((i) => i.boardId === activeBoardId);
    const term = searchTerm.trim().toLowerCase();
    if (term) result = result.filter((i) => matchesInspiration(i, term) || (i.boardId && boards.some((b) => b.id === i.boardId && matchesBoard(b, term))));
    if (activeCategory !== '全部') result = result.filter((i) => i.category === activeCategory);
    if (showFavoritesOnly) result = result.filter((i) => i.favorite);
    return result;
  }, [searchAffectedItems, activeBoardId, searchTerm, activeCategory, showFavoritesOnly, boards]);

  const sortedItems = useMemo(() => {
    const arr = [...filteredItems];
    switch (sortMode) {
      case 'newest': return arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest': return arr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'favorites': return arr.sort((a, b) => { if (a.favorite !== b.favorite) return a.favorite ? -1 : 1; return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); });
      default: return arr;
    }
  }, [filteredItems, sortMode]);

  const totalFavCount = useMemo(() => items.filter((i) => i.favorite).length, [items]);
  const contentTitle = useMemo(() => {
    if (searchTerm) return t('content.search', { term: searchTerm });
    if (activeBoard && activeBoardId) return activeBoard.name;
    if (showFavoritesOnly) return t('content.favorites');
    if (activeCategory !== '全部') return activeCategory;
    return t('content.all');
  }, [searchTerm, activeBoard, activeBoardId, showFavoritesOnly, activeCategory, t]);

  // 搜索建议 & 热门
  const suggestions = useMemo(() => getSearchSuggestions(items, boards, searchTerm), [items, boards, searchTerm]);
  const trending = useMemo(() => getTrendingSearches(items), [items]);
  const recentSearches = useMemo(() => getRecentSearches(), []);

  const handleSearchSelect = useCallback((term: string) => {
    setSearchTerm(term);
    addRecentSearch(term);
    setIsSearchFocused(false);
  }, []);

  const handleSearchClear = useCallback(() => { setSearchTerm(''); setIsSearchFocused(false); }, []);

  // ======================== 导航 ========================
  const backToCollections = useCallback(() => { setAppView('collections'); setActiveBoardId(null); }, []);
  const handleNavSelect = useCallback((nav: NavItem) => {
    const map: Record<NavItem, AppView> = { home: 'home', explore: 'explore', collections: 'collections', favorites: 'favorites', create: 'home', settings: 'settings' };
    if (nav === 'create') { handleAddClick(); return; }
    if (nav === 'explore') { setAppView('explore'); setActiveBoardId(null); return; }
    if (nav === 'collections') { setAppView('collections'); setActiveBoardId(null); return; }
    if (nav === 'settings') { setAppView('settings'); setActiveBoardId(null); return; }
    setAppView(map[nav]); setActiveBoardId(null);
    if (nav === 'favorites') setShowFavoritesOnly(true);
    if (nav === 'home') { setShowFavoritesOnly(false); setActiveCategory('全部'); }
  }, []);
  const handleProfileClick = useCallback(() => setAppView('profile'), []);

  // ======================== CRUD ========================
  const handleToggleFavorite = useCallback(async (id: string) => {
    const target = items.find((i) => i.id === id); if (!target) return;
    try {
      const updated = await inspirationService.toggleFavorite(id, !target.favorite);
      setItems((prev) => { const next = prev.map((i) => (i.id === id ? updated : i)); writeCachedItems(next); return next; });
      addToast(!target.favorite ? 'success' : 'info', !target.favorite ? '已加入收藏' : '已取消收藏');
    } catch (err) { addToast('error', err instanceof ApiError ? err.message : '操作失败'); }
  }, [items, addToast]);

  const handleDelete = useCallback(async (id: string) => {
    const target = items.find((i) => i.id === id); if (!target) return;
    if (!window.confirm(`确定要删除「${target.title}」吗？`)) return;
    try {
      await inspirationService.remove(id);
      setItems((prev) => { const next = prev.filter((i) => i.id !== id); writeCachedItems(next); return next; });
      addToast('info', '已删除');
      if (detailItem?.id === id) { setDetailItem(null); setIsDetailOpen(false); } refreshBoards();
    } catch (err) { addToast('error', err instanceof ApiError ? err.message : '删除失败'); }
  }, [items, addToast, detailItem, refreshBoards]);

  const handleViewDetail = useCallback((id: string) => { const item = items.find((i) => i.id === id); if (item) { setDetailItem(item); setIsDetailOpen(true); } }, [items]);
  const handleAddClick = useCallback(() => { setEditingItem(null); setIsFormOpen(true); }, []);
  const handleEdit = useCallback((id: string) => { const item = items.find((i) => i.id === id); if (item) { setEditingItem(item); setIsFormOpen(true); } }, [items]);

  const handleFormSubmit = useCallback(async (formData: InspirationFormData) => {
    try {
      let finalImageUrl = formData.imageUrl; let finalSourceType: SourceType = 'url';
      if (formData.imageFile) { finalImageUrl = await uploadImage(formData.imageFile); finalSourceType = 'upload'; }
      else if (!finalImageUrl && editingItem) { finalImageUrl = editingItem.imageUrl; finalSourceType = editingItem.sourceType; }
      const finalData: InspirationFormData = { title: formData.title, imageUrl: finalImageUrl, category: formData.category, tags: formData.tags, boardId: formData.boardId };
      if (editingItem) {
        const updated = await inspirationService.update(editingItem.id, finalData, finalSourceType);
        setItems((prev) => { const next = prev.map((i) => i.id === editingItem.id ? updated : i); writeCachedItems(next); return next; });
        addToast('success', '修改成功');
      } else {
        const created = await inspirationService.create(finalData, finalSourceType);
        setItems((prev) => { const next = [created, ...prev]; writeCachedItems(next); return next; });
        addToast('success', '添加成功');
      }
      setIsFormOpen(false); setEditingItem(null); refreshBoards();
    } catch (err) { addToast('error', err instanceof ApiError ? err.message : '保存失败'); }
  }, [editingItem, addToast, refreshBoards]);

  const handleClearFilters = useCallback(() => { setSearchTerm(''); setActiveCategory('全部'); setShowFavoritesOnly(false); }, []);

  // ======================== 画板 ========================
  const handleBoardClick = useCallback((board: Board) => { setActiveBoardId(board.id); setAppView('board'); }, []);
  const handleBoardCreate = useCallback(async (name: string, description: string) => {
    try { await boardService.create(name, description); await refreshBoards(); setIsBoardFormOpen(false); addToast('success', '画板创建成功'); }
    catch (err) { addToast('error', err instanceof ApiError ? err.message : '创建失败'); }
  }, [refreshBoards, addToast]);
  const handleBoardEditSubmit = useCallback(async (name: string, description: string) => {
    if (!editingBoard) return;
    try { await boardService.update(editingBoard.id, { name, description }); await refreshBoards(); setIsBoardFormOpen(false); setEditingBoard(null); addToast('success', '画板已更新'); }
    catch (err) { addToast('error', err instanceof ApiError ? err.message : '更新失败'); }
  }, [editingBoard, refreshBoards, addToast]);
  const handleBoardDelete = useCallback(async (board: Board) => {
    if (!window.confirm(`确定要删除画板「${board.name}」吗？`)) return;
    try { await boardService.remove(board.id); await refreshBoards(); addToast('info', '画板已删除'); }
    catch (err) { addToast('error', err instanceof ApiError ? err.message : '删除失败'); }
  }, [refreshBoards, addToast]);

  // ======================== 渲染 ========================
  if (loading) {
    return (
      <div className="app-shell">
        <Sidebar activeNav="home" onNavSelect={() => {}} onCreateClick={() => {}} onProfileClick={() => {}} userName={auth.user?.username} avatarUrl={auth.user?.avatarUrl} onLogout={auth.logout} />
        <div className="main-container"><TopBar searchTerm="" onSearchChange={() => {}} onSearchFocus={() => {}} onSearchBlur={() => {}} onClear={() => {}} onUploadClick={() => {}} onNavigateProfile={() => {}} onNavigateSettings={() => {}} onLogout={auth.logout} onToast={() => {}} userName={auth.user?.username} email={auth.user?.email} avatarUrl={auth.user?.avatarUrl} /><LoadingState /></div>
      </div>
    );
  }

  const isSearching = !!searchTerm.trim();

  const renderInspirationContent = () => (
    <>
      {activeBoard && (
        <div className="board-view-header">
          <button className="board-back-btn" onClick={backToCollections}>← 返回画板列表</button>
          <h2 className="board-view-name">{activeBoard.name}</h2>
          {activeBoard.description && <p className="board-view-desc">{activeBoard.description}</p>}
          <span className="board-view-count">{t('board.count', { count: filteredItems.length })}</span>
        </div>
      )}

      {/* 搜索结果布局 */}
      {isSearching ? (
        <div className="search-result-layout">
          <div className="search-result-main">
            {/* 类型 Tabs */}
            <div className="profile-tabs">
              {(['all', 'images', 'boards', 'people', 'products'] as SearchResultType[]).map((t) => (
                <button key={t} className={`profile-tab${searchResultType === t ? ' active' : ''}`} onClick={() => setSearchResultType(t)}>
                  {t === 'all' ? 'All' : t === 'images' ? 'Images' : t === 'boards' ? 'Boards' : t === 'people' ? 'People' : 'Products'}
                </button>
              ))}
            </div>

            <CategoryRail categories={CATEGORY_CONFIG} activeCategory={activeCategory} onSelect={setActiveCategory} />
            <ContentHeader title={contentTitle} filteredCount={filteredItems.length} totalFavCount={totalFavCount} sortMode={sortMode} onSortChange={setSortMode} />

            {searchResultType === 'people' ? (
              <PlaceholderPage title="People" icon="👥" description="People search will be available later." hint="" />
            ) : searchResultType === 'products' ? (
              <PlaceholderPage title="Products" icon="🛍️" description="Products will be available later." hint="" />
            ) : searchResultType === 'boards' ? (
              searchedBoards.length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon">📁</div><h3>没有找到匹配的画板</h3><button className="empty-state-btn" onClick={handleSearchClear}>清空搜索</button></div>
              ) : (
                <div className="board-grid">
                  {searchedBoards.map((b) => (
                    <div key={b.id} className="board-card" onClick={() => handleBoardClick(b)}>
                      <div className="board-card-cover">{b.displayCover || b.coverImageUrl ? <img src={b.displayCover || b.coverImageUrl} alt="" /> : <span className="board-card-cover-empty">📁</span>}</div>
                      <div className="board-card-body"><h3 className="board-card-name">{b.name}</h3><span className="board-card-count">{b.inspirationCount ?? 0} 张灵感</span></div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <ImageGrid items={sortedItems} totalItems={items.length} onToggleFavorite={handleToggleFavorite} onEdit={handleEdit} onDelete={handleDelete} onViewDetail={handleViewDetail} onAddClick={handleAddClick} onClearFilters={handleSearchClear}
                emptyMessage="没有找到匹配的灵感" emptyActionLabel="清空搜索" />
            )}
          </div>

          {/* 右侧筛选面板 */}
          <SearchFilterPanel
            contentType={searchResultType}
            onContentTypeChange={(v) => setSearchResultType(v as SearchResultType)}
            onClearAll={() => { setActiveCategory('全部'); setShowFavoritesOnly(false); }}
            onToast={(text) => addToast('success', text)}
          />
        </div>
      ) : (
        <>
          <CategoryRail categories={CATEGORY_CONFIG} activeCategory={activeCategory} onSelect={setActiveCategory} />
          <ContentHeader title={contentTitle} filteredCount={filteredItems.length} totalFavCount={totalFavCount} sortMode={sortMode} onSortChange={setSortMode} />
          <ImageGrid items={sortedItems} totalItems={items.length} onToggleFavorite={handleToggleFavorite} onEdit={handleEdit} onDelete={handleDelete} onViewDetail={handleViewDetail} onAddClick={handleAddClick} onClearFilters={handleClearFilters}
            emptyMessage={activeBoard ? '这个画板还没有灵感' : undefined} emptyActionLabel={activeBoard ? '添加到这个画板' : undefined} />
        </>
      )}
    </>
  );

  const renderMainContent = () => {
    switch (appView) {
      case 'home': case 'favorites': case 'board': return renderInspirationContent();
      case 'collections': return <BoardList boards={boards} onCreateClick={() => { setEditingBoard(null); setIsBoardFormOpen(true); }} onBoardClick={handleBoardClick} onEdit={(b) => { setEditingBoard(b); setIsBoardFormOpen(true); }} onDelete={handleBoardDelete} />;
      case 'explore': return <PlaceholderPage title="Explore" icon="🔍" description="发现更多灵感" hint="探索功能将在接入后端后实现" />;
      case 'settings': return <SettingsPage boards={boards} onNavigateProfile={() => setAppView('profile')} onBoardCreate={() => { setEditingBoard(null); setIsBoardFormOpen(true); }} onToast={(t) => addToast('success', t)} />;
      case 'profile': return <ProfilePage items={items} boards={boards} onToggleFavorite={handleToggleFavorite} onEdit={handleEdit} onDelete={handleDelete} onViewDetail={handleViewDetail} onAddClick={handleAddClick} onBoardClick={handleBoardClick} onNavigateSettings={() => setAppView('settings')} />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar activeNav={viewToNav(appView)} onNavSelect={handleNavSelect} onCreateClick={handleAddClick} onProfileClick={handleProfileClick} userName={auth.user?.username} avatarUrl={auth.user?.avatarUrl} onLogout={auth.logout} />
      <div className="main-container" style={{ position: 'relative' }}>
        <TopBar
          searchTerm={searchTerm} onSearchChange={setSearchTerm}
          onSearchFocus={() => setIsSearchFocused(true)}
          onSearchBlur={() => setIsSearchFocused(false)}
          onClear={handleSearchClear} onUploadClick={handleAddClick}
          onNavigateProfile={handleProfileClick}
          onNavigateSettings={() => setAppView('settings')}
          onLogout={auth.logout} onToast={(t) => addToast('success', t)}
          userName={auth.user?.username} email={auth.user?.email} avatarUrl={auth.user?.avatarUrl}
        >
          {isSearchFocused && (
            <SearchOverlay
              suggestions={suggestions} trending={trending}
              recentSearches={recentSearches}
              onSelect={handleSearchSelect}
              onClearRecent={clearRecentSearches}
            />
          )}
        </TopBar>

        {renderMainContent()}
      </div>

      <InspirationFormModal isOpen={isFormOpen} editingItem={editingItem} boards={boards} defaultBoardId={activeBoardId || undefined} onClose={() => { setIsFormOpen(false); setEditingItem(null); }} onSubmit={handleFormSubmit} onToast={addToast} />
      <DetailModal isOpen={isDetailOpen} item={detailItem} onClose={() => setIsDetailOpen(false)} />
      <BoardFormModal isOpen={isBoardFormOpen} editingBoard={editingBoard} onClose={() => { setIsBoardFormOpen(false); setEditingBoard(null); }} onSubmit={editingBoard ? handleBoardEditSubmit : handleBoardCreate} />
      <Toast toasts={toasts} />
    </div>
  );
}

export default App;