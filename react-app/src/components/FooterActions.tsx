interface FooterActionsProps {
  onExport: () => void;
  onImport: () => void;
  onClearAll: () => void;
  onResetData: () => void;
}

/** 页脚操作区：导出 / 导入 / 清空 / 恢复示例 */
export function FooterActions({
  onExport,
  onImport,
  onClearAll,
  onResetData,
}: FooterActionsProps) {
  return (
    <footer className="footer">
      <button className="btn btn-text" onClick={onExport}>
        导出数据
      </button>
      <span className="footer-divider">&middot;</span>
      <button className="btn btn-text" onClick={onImport}>
        导入数据
      </button>
      <span className="footer-divider">&middot;</span>
      <button className="btn btn-text" onClick={onClearAll}>
        清空全部数据
      </button>
      <span className="footer-divider">&middot;</span>
      <button className="btn btn-text" onClick={onResetData}>
        恢复示例数据
      </button>
    </footer>
  );
}