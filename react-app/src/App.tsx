import { useState, useMemo, useCallback, useRef } from 'react';
import type { InspirationItem, InspirationFormData, ToastMessage, ToastType } from './types/inspiration';
import { sampleItems } from './data/sampleItems';
import { CATEGORIES, STORAGE_KEY } from './utils/constants';
import { generateId } from './utils/helpers';
import { useLocalStorage } from './hooks/useLocalStorage';
import { exportItemsToJson, readJsonFile, normalizeImportedItems } from './utils/exportImport';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { StatsBar } from './components/StatsBar';
import { ImageGrid } from './components/ImageGrid';
import { FooterActions } from './components/FooterActions';
import { InspirationFormModal } from './components/InspirationFormModal';
import { DetailModal } from './components/DetailModal';
import { Toast } from './components/Toast';

function App() {
  // ======================== 持久化数据 ========================
  const [items, setItems] = useLocalStorage<InspirationItem[]>(
    STORAGE_KEY,
    sampleItems.map((it) => ({ ...it }))
  );

  // ======================== 筛选状态 ========================
  const [activeCategory, setActiveCategory] = useState('全部');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // ======================== 模态框状态 ========================
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InspirationItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<InspirationItem | null>(null);

  // ======================== Toast 状态 ========================
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // ======================== 导入文件 input ref ========================
  const importFileRef = useRef<HTMLInputElement>(null);

  /** 添加一条 Toast，2.2s 后自动移除，最多同时显示 3 条 */
  const addToast = useCallback((type: ToastType, text: string) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => {
      const next = [...prev, { id, type, text }];
      return next.length > 3 ? next.slice(-3) : next;
    });
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2200);
  }, []);

  /** 重置所有筛选条件 + 关闭详情 */
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setActiveCategory('全部');
    setShowFavoritesOnly(false);
    setDetailItem(null);
    setIsDetailOpen(false);
  }, []);

  // ======================== 筛选逻辑 ========================

  const filteredItems = useMemo(() => {
    let result = [...items];
    const term = searchTerm.trim().toLowerCase();

    if (term) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term) ||
          item.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    if (activeCategory !== '全部') {
      result = result.filter((item) => item.category === activeCategory);
    }

    if (showFavoritesOnly) {
      result = result.filter((item) => item.favorite);
    }

    return result;
  }, [items, searchTerm, activeCategory, showFavoritesOnly]);

  const totalFavCount = useMemo(
    () => items.filter((i) => i.favorite).length,
    [items]
  );

  // ======================== CRUD 操作 ========================

  const handleToggleFavorite = useCallback(
    (id: string) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          const next = !item.favorite;
          addToast(next ? 'success' : 'info', next ? '已加入收藏' : '已取消收藏');
          return { ...item, favorite: next };
        })
      );
    },
    [setItems, addToast]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const target = items.find((i) => i.id === id);
      if (!target) return;
      if (!window.confirm(`确定要删除「${target.title}」吗？此操作不可恢复。`)) return;

      setItems((prev) => prev.filter((i) => i.id !== id));
      addToast('info', '已删除');

      if (detailItem?.id === id) {
        setDetailItem(null);
        setIsDetailOpen(false);
      }
    },
    [items, setItems, addToast, detailItem]
  );

  const handleViewDetail = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id);
      if (item) {
        setDetailItem(item);
        setIsDetailOpen(true);
      }
    },
    [items]
  );

  // ======================== 添加 / 编辑 ========================

  const handleAddClick = useCallback(() => {
    setEditingItem(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id);
      if (item) {
        setEditingItem(item);
        setIsFormOpen(true);
      }
    },
    [items]
  );

  const handleFormSubmit = useCallback(
    (formData: InspirationFormData) => {
      if (editingItem) {
        setItems((prev) =>
          prev.map((item) => {
            if (item.id !== editingItem.id) return item;
            return {
              ...item,
              title: formData.title,
              imageUrl: formData.imageUrl,
              category: formData.category,
              tags: formData.tags,
            };
          })
        );
        addToast('success', '修改成功');
      } else {
        const newItem: InspirationItem = {
          id: generateId(),
          title: formData.title,
          imageUrl: formData.imageUrl,
          category: formData.category,
          tags: formData.tags,
          favorite: false,
          createdAt: new Date().toISOString(),
        };
        setItems((prev) => [newItem, ...prev]);
        addToast('success', '添加成功');
      }

      setIsFormOpen(false);
      setEditingItem(null);
    },
    [editingItem, setItems, addToast]
  );

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setEditingItem(null);
  }, []);

  // ======================== 头部操作 ========================

  const handleFavoritesToggle = useCallback(() => {
    setShowFavoritesOnly((prev) => {
      addToast('info', prev ? '已退出我的收藏' : '已进入我的收藏');
      return !prev;
    });
  }, [addToast]);

  // ======================== 数据导出 ========================

  const handleExport = useCallback(() => {
    exportItemsToJson(items);
    addToast('success', items.length > 0 ? '数据导出成功' : '已导出空数据');
  }, [items, addToast]);

  // ======================== 数据导入 ========================

  /** 点击导入按钮 → 触发隐藏 file input */
  const handleImportClick = useCallback(() => {
    importFileRef.current?.click();
  }, []);

  /** 文件选择后：读取 → 校验 → 覆盖确认 → 写入 */
  const handleImportFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const data = await readJsonFile(file);
        const normalized = normalizeImportedItems(data);

        if (!window.confirm(`导入数据会覆盖当前所有数据，是否继续？`)) {
          /* 用户取消 — 重置 input 后退出 */
          if (importFileRef.current) importFileRef.current.value = '';
          return;
        }

        setItems(normalized);
        addToast('success', `数据导入成功，共 ${normalized.length} 条`);
        resetFilters();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : '导入失败，文件格式不正确';
        addToast('error', message);
      }

      // 重置 input 以允许重复选择同一文件
      if (importFileRef.current) importFileRef.current.value = '';
    },
    [setItems, addToast, resetFilters]
  );

  // ======================== 底部其他操作 ========================

  const handleClearAll = useCallback(() => {
    if (items.length === 0) {
      addToast('info', '没有可清空的数据');
      return;
    }
    if (!window.confirm('确定要清空全部灵感数据吗？此操作不可恢复。')) return;

    setItems([]);
    addToast('info', '已清空全部数据');
    resetFilters();
  }, [items, setItems, addToast, resetFilters]);

  const handleResetData = useCallback(() => {
    if (items.length > 0) {
      if (!window.confirm('恢复示例数据会覆盖当前数据，是否继续？')) return;
    }

    setItems(sampleItems.map((it) => ({ ...it })));
    addToast('success', '已恢复示例数据');
    resetFilters();
  }, [items, setItems, addToast, resetFilters]);

  // ======================== 渲染 ========================

  return (
    <div className="container">
      {/* 隐藏的导入文件选择器 */}
      <input
        ref={importFileRef}
        type="file"
        accept=".json,application/json"
        style={{ display: 'none' }}
        onChange={handleImportFileChange}
      />

      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={handleAddClick}
        showFavoritesOnly={showFavoritesOnly}
        onFavoritesToggle={handleFavoritesToggle}
      />

      <CategoryNav
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      <StatsBar
        filteredCount={filteredItems.length}
        totalFavCount={totalFavCount}
      />

      <ImageGrid
        items={filteredItems}
        onToggleFavorite={handleToggleFavorite}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetail={handleViewDetail}
      />

      <FooterActions
        onExport={handleExport}
        onImport={handleImportClick}
        onClearAll={handleClearAll}
        onResetData={handleResetData}
      />

      <InspirationFormModal
        isOpen={isFormOpen}
        editingItem={editingItem}
        categories={CATEGORIES.filter((c) => c !== '全部')}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        onToast={addToast}
      />

      <DetailModal
        isOpen={isDetailOpen}
        item={detailItem}
        onClose={() => setIsDetailOpen(false)}
      />

      <Toast toasts={toasts} />
    </div>
  );
}

export default App;