interface PlaceholderPageProps {
  title: string;
  icon: string;
  description: string;
  hint: string;
}

/** 占位页面：展示标题 + 图标 + 说明 */
export function PlaceholderPage({ title, icon, description, hint }: PlaceholderPageProps) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon">{icon}</div>
      <h2 className="placeholder-title">{title}</h2>
      <p className="placeholder-desc">{description}</p>
      <p className="placeholder-hint">{hint}</p>
    </div>
  );
}