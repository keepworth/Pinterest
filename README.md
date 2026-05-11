# 灵感收藏板 — Inspiration Board

一个简洁的灵感收藏与图片管理工具，类 Pinterest 风格的瀑布流图片展示页面。纯前端实现，无需后端、无需登录、无需数据库。

## 功能列表

**灵感管理**
- 添加灵感（图片 URL 或本地图片 base64）
- 编辑灵感（标题、分类、标签、图片来源）
- 删除灵感（二次确认）
- 收藏 / 取消收藏

**浏览与发现**
- 瀑布流卡片布局（CSS Columns 实现）
- 图片 hover 上浮效果 + 查看详情提示
- 点击图片查看大图详情
- 图片加载失败优雅降级

**搜索与筛选**
- 关键词搜索（标题 / 分类 / 标签）
- 分类筛选（UI 设计 / 网页设计 / 插画 / 海报 / 装修 / 其他）
- 我的收藏（仅显示已收藏图片）

**数据持久化**
- 所有数据保存在浏览器 localStorage
- 数据导出为 JSON 文件（含 id / title / imageUrl / category / tags / favorite / createdAt）
- JSON 文件导入（自动校验格式，补齐缺失字段）
- 清空全部数据 / 恢复示例数据

**其他特性**
- 本地图片上传（JPG / PNG / WebP，单张 2MB 以内，转 base64）
- 添加/编辑时图片预览（URL 输入防抖预览 + 本地图片即时预览）
- 自定义 Toast 通知（成功 / 错误 / 提示，最多同时显示 3 条）

## 技术栈

- **HTML** — 语义化结构，表单关联 label，隐藏 file input
- **CSS** — CSS 自定义属性（变量）、CSS Columns 瀑布流、Flexbox 布局、`backdrop-filter` 毛玻璃效果
- **JavaScript** — 原生 ES6+，事件委托，FileReader API，Blob 下载，Promise 异步

无任何第三方库或框架。

## 文件结构

```
灵感收藏板/
├── index.html    # 页面结构与模态框
├── style.css     # 全部样式（变量、布局、组件、响应式）
├── script.js     # 全部逻辑（渲染、CRUD、筛选、持久化、导入导出）
└── README.md     # 项目说明（本文件）
```

## 如何运行

1. 将 `index.html`、`style.css`、`script.js` 放在同一目录下
2. 用浏览器打开 `index.html` 即可运行
3. 无需安装任何依赖，无需启动服务器

## 数据存储说明

所有灵感数据存储在浏览器 **localStorage** 中：

- 键名：`inspiration-board-data`
- 格式：JSON 数组，每条记录包含 id / title / imageUrl / category / tags / favorite / createdAt
- 刷新页面数据不丢失
- **注意**：localStorage 通常有 5-10 MB 的存储上限。使用本地图片上传（base64）会较快占用存储空间。建议定期导出数据备份，或将图片上传到图床后使用 URL 添加

## 本地图片上传说明

- 本地图片通过 `FileReader.readAsDataURL()` 转为 base64 编码的 Data URL
- base64 字符串直接存入 `imageUrl` 字段，与 URL 图片共用同一数据结构
- 单张图片限制 2MB
- 支持 JPG、PNG、WebP 格式
- 编辑模式下 base64 图片不会回填到 URL 输入框（避免超长字符串），但预览正常显示

## 数据导入导出说明

**导出**：点击页脚"导出数据"，浏览器下载 `inspire-board-data-YYYY-MM-DD.json`。文件包含完整的灵感数组。

**导入**：点击页脚"导入数据"，选择之前导出的 JSON 文件。导入前会：
1. 校验 JSON 格式（必须为数组，每条至少含 title / imageUrl / category）
2. 弹出覆盖确认
3. 为每条数据补齐缺失字段（tags / favorite / createdAt）
4. 覆盖当前所有数据并重新渲染

## 后续可扩展方向

- 拖拽排序卡片
- 图片压缩（上传时自动压缩大图）
- 多板（Board）管理，类似 Pinterest 的 Board 概念
- 标签自动补全 / 标签管理
- 暗色模式
- PWA 支持（离线访问）
- 接入对象存储（OSS / S3）替代 base64 本地存储
- 后端 API + 数据库（多设备同步）