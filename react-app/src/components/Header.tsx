interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  showFavoritesOnly: boolean;
  onFavoritesToggle: () => void;
}

/** 顶部栏：标题 + 搜索框 + 添加按钮 + 我的收藏 */
export function Header({
  searchTerm,
  onSearchChange,
  onAddClick,
  showFavoritesOnly,
  onFavoritesToggle,
}: HeaderProps) {
  return (
    <header className="header">
      <h1 className="logo">灵感收藏板</h1>

      <div className="header-controls">
        <div className="search-wrapper">
          <span className="search-icon">&#128269;</span>
          <input
            type="text"
            className="search-input"
            placeholder="搜索标题、分类、标签..."
            autoComplete="off"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={onAddClick}>
          + 添加灵感
        </button>

        <button
          className={`btn btn-ghost${showFavoritesOnly ? ' fav-active' : ''}`}
          onClick={onFavoritesToggle}
        >
          <span className="heart-icon">&#9825;</span> 我的收藏
        </button>
      </div>
    </header>
  );
}