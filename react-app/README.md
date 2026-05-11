# 灵感收藏板

> Pinterest 风格的灵感图片收藏工具 ｜ 纯前端 · 零依赖 · TypeScript

一个轻量级的灵感图片管理与收藏应用。瀑布流卡片展示，支持 URL 与本地图片添加，数据保存在浏览器本地，可导出 JSON 备份。

## 快速开始

```bash
npm install
npm run dev        # 开发环境，默认 http://localhost:5173
npm run build      # 生产构建
```

打开浏览器即可使用，无需后端、无需登录。

## 功能概览

**灵感管理**
添加、编辑、删除灵感卡片。每条灵感包含图片、标题、分类和自定义标签。支持收藏标记，收藏状态自动持久化。

**图片来源**
支持两种方式添加图片：填写在线图片 URL 直接引用，或选择本地 JPG / PNG / WebP 文件（最大 2MB），自动转为 base64 存储。添加和编辑时均可实时预览。

**浏览与筛选**
卡片以 CSS Columns 瀑布流布局展示，hover 时上浮并显示操作按钮。支持关键词搜索（匹配标题、分类、标签）、分类筛选、仅看收藏三种过滤方式，可叠加使用。

**数据管理**
所有数据自动保存到浏览器 localStorage，刷新不丢失。支持一键导出全部数据为格式化的 JSON 文件，也可从 JSON 文件导入恢复数据（含格式校验与字段自动补齐）。

## 技术栈

| 类别 | 选型 |
|------|------|
| 构建工具 | Vite 6 |
| UI 框架 | React 18 |
| 类型系统 | TypeScript 5.6（strict 模式） |
| 样式方案 | 纯 CSS（CSS 自定义属性 + CSS Columns） |
| 状态管理 | React Hooks（useState / useMemo / useCallback） |
| 数据持久化 | localStorage（自定义泛型 `useLocalStorage` Hook） |

不依赖任何 UI 组件库、状态管理库或 CSS 框架。

## 项目结构

```
src/
├── main.tsx                         # ReactDOM 入口
├── App.tsx                          # 根组件：全局状态 + 所有业务逻辑
├── index.css                        # 全局样式（600+ 行）
├── types/
│   └── inspiration.ts               # InspirationItem / FormData / Toast 类型定义
├── data/
│   └── sampleItems.ts               # 12 条示例 mock 数据
├── utils/
│   ├── constants.ts                 # 分类列表 / localStorage 键名 / 图片限制
│   ├── helpers.ts                   # generateId / parseTags / formatDate
│   ├── image.ts                     # validateImageFile / convertFileToBase64
│   └── exportImport.ts              # JSON 导出 / 文件读取 / 导入数据规范化
├── hooks/
│   └── useLocalStorage.ts           # 泛型 localStorage 读写 Hook
└── components/
    ├── Header.tsx                   # 顶栏：logo + 搜索框 + 添加按钮 + 收藏切换
    ├── CategoryNav.tsx              # 分类胶囊导航
    ├── StatsBar.tsx                 # 统计栏：筛选数量 + 收藏总数
    ├── ImageGrid.tsx                # 瀑布流容器（CSS Columns）
    ├── InspirationCard.tsx          # 单张卡片：图片 / 收藏 / 标题 / 标签 / 操作
    ├── InspirationFormModal.tsx     # 添加 / 编辑弹窗（含图片上传与预览）
    ├── DetailModal.tsx              # 查看详情弹窗
    ├── Toast.tsx                    # Toast 通知组件
    └── FooterActions.tsx            # 页脚：导出 / 导入 / 清空 / 恢复
```

## 设计要点

**组件职责单向**
App.tsx 是唯一的状态持有者，通过 props 向子组件传递数据和回调。子组件不直接操作 localStorage 或修改全局状态。数据变更统一由 App.tsx 中的 setItems 触发，useLocalStorage Hook 自动同步到 localStorage。

**类型安全**
所有组件 props、工具函数、Hook 均有明确的 TypeScript 类型。导入数据使用 `unknown` 入参 + 类型守卫逐字段校验，不使用 `any`。

**图片优先级**
添加 / 编辑时图片来源优先级：新选择的本地文件 > URL 输入框 > 编辑时保留的原图。编辑模式下 base64 图片不填入 URL 输入框（避免超长字符串），但预览区正常显示。

## 注意事项

- localStorage 通常有 5–10 MB 上限。频繁使用本地图片上传（base64）会较快占满空间，建议定期导出 JSON 备份，或使用图床 URL 代替本地上传。
- 本应用为纯前端项目，数据仅保存在当前浏览器中，不同设备 / 浏览器间数据不互通。需要跨设备使用时，可导出 JSON 后再导入到另一设备。
- 导入 JSON 会完全覆盖当前数据，操作前请确认已备份。