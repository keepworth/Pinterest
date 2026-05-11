/* ============================================================
   灵感收藏板 — 主逻辑脚本
   ============================================================ */

// ======================== 配置 & 常量 ========================

/** 内置分类列表（"全部"在渲染时手动追加） */
const CATEGORIES = [
    'UI设计',
    '网页设计',
    '插画',
    '海报',
    '装修',
    '其他',
];

/** localStorage 键名 */
const STORAGE_KEY = 'inspiration-board-data';

/** 图片大小上限 2MB */
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

/** 示例数据——首次打开时自动填充 */
const DEFAULT_ITEMS = [
    {
        id: 'default-1',
        title: '仪表盘界面设计',
        imageUrl: 'https://picsum.photos/seed/dash01/600/400',
        category: 'UI设计',
        tags: ['蓝色', '数据可视化', '后台'],
        favorite: false,
        createdAt: '2025-01-10T08:00:00.000Z',
    },
    {
        id: 'default-2',
        title: '移动端电商应用',
        imageUrl: 'https://picsum.photos/seed/mobile01/600/800',
        category: 'UI设计',
        tags: ['移动端', '电商', '极简'],
        favorite: true,
        createdAt: '2025-02-14T09:30:00.000Z',
    },
    {
        id: 'default-3',
        title: '图标设计合集',
        imageUrl: 'https://picsum.photos/seed/icons01/600/500',
        category: 'UI设计',
        tags: ['图标', '扁平化', '彩色'],
        favorite: false,
        createdAt: '2025-03-01T11:00:00.000Z',
    },
    {
        id: 'default-4',
        title: '极简博客设计',
        imageUrl: 'https://picsum.photos/seed/blog01/600/450',
        category: '网页设计',
        tags: ['极简', '博客', '排版'],
        favorite: false,
        createdAt: '2025-01-20T14:00:00.000Z',
    },
    {
        id: 'default-5',
        title: '电商网站首页',
        imageUrl: 'https://picsum.photos/seed/eshop01/600/700',
        category: '网页设计',
        tags: ['电商', '红色', '促销'],
        favorite: true,
        createdAt: '2025-03-10T10:00:00.000Z',
    },
    {
        id: 'default-6',
        title: '企业官网设计',
        imageUrl: 'https://picsum.photos/seed/corp01/600/400',
        category: '网页设计',
        tags: ['企业', '蓝色', '专业'],
        favorite: false,
        createdAt: '2025-02-28T16:00:00.000Z',
    },
    {
        id: 'default-7',
        title: '森系插画',
        imageUrl: 'https://picsum.photos/seed/forest01/600/800',
        category: '插画',
        tags: ['森林', '绿色', '手绘'],
        favorite: false,
        createdAt: '2025-04-01T08:00:00.000Z',
    },
    {
        id: 'default-8',
        title: '扁平风人物插画',
        imageUrl: 'https://picsum.photos/seed/people01/600/550',
        category: '插画',
        tags: ['人物', '扁平', '暖色'],
        favorite: true,
        createdAt: '2025-04-05T13:00:00.000Z',
    },
    {
        id: 'default-9',
        title: '音乐节海报设计',
        imageUrl: 'https://picsum.photos/seed/music01/600/750',
        category: '海报',
        tags: ['音乐', '渐变', '潮流'],
        favorite: false,
        createdAt: '2025-03-20T09:00:00.000Z',
    },
    {
        id: 'default-10',
        title: '电影海报设计',
        imageUrl: 'https://picsum.photos/seed/movie01/600/500',
        category: '海报',
        tags: ['电影', '暗色', '大片'],
        favorite: false,
        createdAt: '2025-05-12T15:00:00.000Z',
    },
    {
        id: 'default-11',
        title: '北欧风客厅',
        imageUrl: 'https://picsum.photos/seed/living01/600/600',
        category: '装修',
        tags: ['北欧', '极简', '温馨'],
        favorite: true,
        createdAt: '2025-06-01T10:00:00.000Z',
    },
    {
        id: 'default-12',
        title: '创意光影摄影',
        imageUrl: 'https://picsum.photos/seed/photo01/600/700',
        category: '其他',
        tags: ['摄影', '光影', '创意'],
        favorite: false,
        createdAt: '2025-06-10T12:00:00.000Z',
    },
];

// ======================== DOM 引用 ========================

const imageGrid = document.getElementById('imageGrid');
const emptyState = document.getElementById('emptyState');
const categoryNav = document.getElementById('categoryNav');
const searchInput = document.getElementById('searchInput');
const addBtn = document.getElementById('addBtn');
const favFilterBtn = document.getElementById('favFilterBtn');

// 添加/编辑 模态框
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const cancelBtn = document.getElementById('cancelBtn');
const modalTitle = document.getElementById('modalTitle');
const submitBtn = document.getElementById('submitBtn');
const addForm = document.getElementById('addForm');

// 详情模态框
const detailOverlay = document.getElementById('detailOverlay');
const detailClose = document.getElementById('detailClose');
const detailBody = document.getElementById('detailBody');

// 底部工具
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFileInput = document.getElementById('importFileInput');
const clearAllBtn = document.getElementById('clearAllBtn');
const resetDataBtn = document.getElementById('resetDataBtn');
const toastContainer = document.getElementById('toastContainer');
const totalCountEl = document.getElementById('totalCount');
const favCountEl = document.getElementById('favCount');

// 表单字段
const imageUrlInput = document.getElementById('imageUrl');
const imageFileInput = document.getElementById('imageFile');
const fileNameSpan = document.getElementById('fileName');
const imagePreviewGroup = document.getElementById('imagePreviewGroup');
const imagePreview = document.getElementById('imagePreview');
const imagePreviewError = document.getElementById('imagePreviewError');
const titleInput = document.getElementById('title');
const categorySelect = document.getElementById('category');
const tagsInput = document.getElementById('tags');
const imageUrlError = document.getElementById('imageUrlError');
const titleError = document.getElementById('titleError');
const categoryError = document.getElementById('categoryError');

// ======================== 应用状态 ========================

let items = [];                     // 全部灵感数据
let activeCategory = '全部';        // 当前选中的分类
let showFavoritesOnly = false;      // 是否仅显示收藏
let currentEditId = null;           // null = 添加模式，有值 = 编辑模式

// 图片上传相关状态
let pendingBase64 = null;           // 新选择的本地图片 base64（null 表示未选择）
let existingImageUrl = null;        // 编辑时原有的 imageUrl（用于保留图片）
let previewTimer = null;            // URL 输入预览防抖定时器

// ======================== 数据持久化 ========================

/** 将 items 数组写入 localStorage */
function saveToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
        showToast('保存失败：本地存储空间不足，请导出数据后清理', 'error');
    }
}

/** 从 localStorage 读取数据，无数据时返回 null */
function loadFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        const data = JSON.parse(raw);
        if (Array.isArray(data) && data.length > 0) return data;
        return null;
    } catch {
        return null;
    }
}

// ======================== Toast 通知 ========================

/**
 * 显示 Toast 通知（最多同时显示 3 条，超出则移除最早的）
 * @param {'success'|'error'|'info'} type
 */
function showToast(message, type) {
    // 限制同时显示的 Toast 数量
    const visible = toastContainer.querySelectorAll('.toast:not(.removing)');
    if (visible.length >= 3) {
        visible[0].classList.add('removing');
        visible[0].addEventListener('animationend', function () {
            this.remove();
        });
    }

    const iconMap = {
        success: { char: '✔', label: '成功' },
        error: { char: '✖', label: '错误' },
        info: { char: 'ℹ', label: '提示' },
    };
    const icon = iconMap[type] || iconMap.info;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${icon.char}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    // 2.2 秒后自动移除
    setTimeout(() => {
        toast.classList.add('removing');
        toast.addEventListener('animationend', () => toast.remove());
    }, 2200);
}

// ======================== 工具函数 ========================

function generateId() {
    return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

function parseTags(raw) {
    return raw
        .split(/[,，]/)
        .map(t => t.trim())
        .filter(Boolean);
}

/** 转义 HTML 特殊字符：< > & " ' —— 用于插入用户文本内容 */
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function formatDate(isoString) {
    const d = new Date(isoString);
    return d.toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// ======================== 图片文件处理 ========================

/**
 * 验证图片文件：类型 + 大小
 * @returns {boolean} 是否通过验证
 */
function validateImageFile(file) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
        showToast('仅支持 JPG、PNG、WebP 格式的图片', 'error');
        return false;
    }
    if (file.size > MAX_IMAGE_SIZE) {
        showToast('图片过大，请选择 2MB 以下的图片', 'error');
        return false;
    }
    return true;
}

/**
 * 将 File 转为 base64 Data URL
 * @returns {Promise<string>}
 */
function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('文件读取失败'));
        reader.readAsDataURL(file);
    });
}

/** 处理本地图片文件选择 */
async function handleImageFileChange(file) {
    if (!file) return;

    if (!validateImageFile(file)) {
        // 验证失败，清空文件选择
        imageFileInput.value = '';
        fileNameSpan.textContent = '';
        return;
    }

    fileNameSpan.textContent = file.name;

    try {
        pendingBase64 = await convertFileToBase64(file);
        // 本地图片优先：清空 URL 输入
        imageUrlInput.value = '';
        // 显示预览
        updateImagePreview(pendingBase64);
    } catch {
        showToast('图片读取失败，请重试', 'error');
        imageFileInput.value = '';
        fileNameSpan.textContent = '';
    }
}

/** 更新模态框中的图片预览 */
function updateImagePreview(src) {
    if (!src) {
        hideImagePreview();
        return;
    }

    imagePreviewGroup.style.display = 'block';
    imagePreview.style.display = 'block';
    imagePreviewError.style.display = 'none';
    imagePreview.src = src;

    imagePreview.onerror = () => {
        imagePreview.style.display = 'none';
        imagePreviewError.style.display = 'flex';
    };
}

/** 隐藏图片预览并清空 src */
function hideImagePreview() {
    imagePreviewGroup.style.display = 'none';
    imagePreview.src = '';
    imagePreview.style.display = 'block';
    imagePreviewError.style.display = 'none';
}

/** 重置图片上传相关状态（关闭弹窗时调用） */
function resetImageState() {
    pendingBase64 = null;
    existingImageUrl = null;
    imageFileInput.value = '';
    fileNameSpan.textContent = '';
    hideImagePreview();
    clearTimeout(previewTimer);
}

// ======================== 筛选逻辑 ========================

/**
 * 按 搜索关键词 → 分类 → 收藏 三重条件过滤 items
 * 三个条件是 AND 关系，返回新数组不修改原数据
 */
function getFilteredItems() {
    let result = [...items];
    const term = searchInput.value.trim().toLowerCase();

    if (term) {
        result = result.filter(item =>
            item.title.toLowerCase().includes(term) ||
            item.category.toLowerCase().includes(term) ||
            item.tags.some(tag => tag.toLowerCase().includes(term))
        );
    }

    if (activeCategory !== '全部') {
        result = result.filter(item => item.category === activeCategory);
    }

    if (showFavoritesOnly) {
        result = result.filter(item => item.favorite);
    }

    return result;
}

// ======================== 渲染引擎 ========================

/**
 * 创建单张图片卡片 DOM
 * 布局：图片（含收藏悬浮按钮 + hover 查看详情提示） > 标题/分类/标签 > hover 显示编辑/删除
 */
function createCard(item) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-id', item.id);

    card.innerHTML = `
        <div class="card-image-wrapper" title="点击查看详情">
            <img
                class="card-image"
                src="${escapeHTML(item.imageUrl)}"
                alt="${escapeHTML(item.title)}"
                loading="lazy"
            >
            <button
                class="card-fav-btn${item.favorite ? ' favorited' : ''}"
                data-action="fav"
                title="${item.favorite ? '取消收藏' : '收藏'}"
            >
                ${item.favorite ? '&#9829;' : '&#9825;'}
            </button>
            <div class="image-hover-hint">
                <span>查看详情</span>
            </div>
            <div class="card-image-error">
                <span class="error-icon">&#128247;</span>
                <span>图片加载失败</span>
            </div>
        </div>
        <div class="card-body">
            <h3 class="card-title" title="${escapeHTML(item.title)}">${escapeHTML(item.title)}</h3>
            <div class="card-meta">
                <span class="card-category">${escapeHTML(item.category)}</span>
            </div>
            <div class="card-tags">
                ${item.tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('')}
            </div>
            <div class="card-actions">
                <button class="card-action-btn edit-action" data-action="edit">编辑</button>
                <button class="card-action-btn delete-action" data-action="delete">删除</button>
            </div>
        </div>
    `;

    // 图片加载失败：隐藏图片、收藏按钮和 hover 提示，显示占位
    const img = card.querySelector('.card-image');
    const errorPlaceholder = card.querySelector('.card-image-error');
    const hoverHint = card.querySelector('.image-hover-hint');
    const favBtn = card.querySelector('.card-fav-btn');
    img.addEventListener('error', () => {
        img.style.display = 'none';
        if (hoverHint) hoverHint.style.display = 'none';
        if (favBtn) favBtn.style.display = 'none';
        errorPlaceholder.style.display = 'flex';
    });

    return card;
}

/** 渲染瀑布流：筛选 → 清空网格 → 批量创建卡片 → 更新统计 */
function renderBoard() {
    const filtered = getFilteredItems();
    imageGrid.innerHTML = '';

    if (filtered.length === 0) {
        emptyState.style.display = 'block';
        imageGrid.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        imageGrid.style.display = '';
        const fragment = document.createDocumentFragment();
        filtered.forEach(item => fragment.appendChild(createCard(item)));
        imageGrid.appendChild(fragment);
    }

    updateStats();
}

function updateStats() {
    const total = items.length;
    const favCount = items.filter(i => i.favorite).length;
    totalCountEl.textContent = `共 ${total} 张图片`;
    favCountEl.textContent = `已收藏 ${favCount} 张`;
}

function renderCategoryNav() {
    const allCategories = ['全部', ...CATEGORIES];
    categoryNav.innerHTML = allCategories
        .map(cat =>
            `<button class="category-btn${cat === activeCategory ? ' active' : ''}" data-category="${cat}">${cat}</button>`
        )
        .join('');
}

function initCategorySelect() {
    const options = CATEGORIES.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    categorySelect.insertAdjacentHTML('beforeend', options);
}

// ======================== CRUD 操作 ========================

function addItem(formData) {
    const newItem = {
        id: generateId(),
        title: formData.title.trim(),
        imageUrl: formData.imageUrl.trim(),
        category: formData.category,
        tags: parseTags(formData.tags),
        favorite: false,
        createdAt: new Date().toISOString(),
    };
    items.unshift(newItem);
    saveToStorage();
    renderBoard();
    showToast('灵感添加成功', 'success');
}

function updateItem(id, formData) {
    const item = items.find(i => i.id === id);
    if (!item) return;

    item.title = formData.title.trim();
    item.imageUrl = formData.imageUrl.trim();
    item.category = formData.category;
    item.tags = parseTags(formData.tags);

    saveToStorage();
    renderBoard();
    showToast('修改成功', 'success');
}

function deleteItem(id) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    if (!window.confirm(`确定要删除「${item.title}」吗？此操作不可恢复。`)) return;

    items = items.filter(i => i.id !== id);
    saveToStorage();
    renderBoard();
    showToast('已删除', 'info');
}

function toggleFavorite(id) {
    const item = items.find(i => i.id === id);
    if (!item) return;

    item.favorite = !item.favorite;
    saveToStorage();
    renderBoard();
    showToast(item.favorite ? '已加入收藏' : '已取消收藏', item.favorite ? 'success' : 'info');
}

function clearAllData() {
    if (items.length === 0) {
        showToast('没有可清空的数据', 'info');
        return;
    }
    if (!window.confirm(`当前共有 ${items.length} 张图片，确定要清空全部数据吗？`)) return;

    items = [];
    saveToStorage();
    renderBoard();
    showToast('全部数据已清空', 'info');
}

function resetToDefaults() {
    if (items.length > 0) {
        if (!window.confirm('恢复示例数据将覆盖当前所有数据，确定继续吗？')) return;
    }

    items = DEFAULT_ITEMS.map(item => ({
        ...item,
        id: generateId(),
        createdAt: new Date().toISOString(),
    }));

    saveToStorage();
    activeCategory = '全部';
    showFavoritesOnly = false;
    searchInput.value = '';
    updateFavFilterButton();
    renderCategoryNav();
    renderBoard();
    showToast('示例数据已恢复', 'success');
}

// ======================== 数据导入导出 ========================

/** 导出所有数据为 JSON 文件并触发下载 */
function exportData() {
    if (items.length === 0) {
        showToast('没有可导出的数据', 'info');
        return;
    }

    const json = JSON.stringify(items, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `inspire-board-data-${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('数据导出成功', 'success');
}

/**
 * 验证导入数据格式
 * 必须是数组，且每条至少包含 title / imageUrl / category
 */
function validateImportedData(data) {
    if (!Array.isArray(data) || data.length === 0) return false;
    return data.every(item =>
        item && typeof item.title === 'string' && item.title.trim() &&
        item && typeof item.imageUrl === 'string' && item.imageUrl.trim() &&
        item && typeof item.category === 'string' && item.category.trim()
    );
}

/** 处理 JSON 文件导入 */
function importData(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);
            if (!validateImportedData(data)) {
                showToast('导入失败，文件格式不正确', 'error');
                return;
            }
            if (!window.confirm(`即将导入 ${data.length} 条数据，这会覆盖当前所有数据，是否继续？`)) return;

            // 为每条数据补齐可能缺失的字段，生成新 ID
            items = data.map(item => ({
                id: item.id || generateId(),
                title: item.title.trim(),
                imageUrl: item.imageUrl.trim(),
                category: item.category.trim(),
                tags: Array.isArray(item.tags) ? item.tags : [],
                favorite: typeof item.favorite === 'boolean' ? item.favorite : false,
                createdAt: item.createdAt || new Date().toISOString(),
            }));

            saveToStorage();
            // 重置筛选
            activeCategory = '全部';
            showFavoritesOnly = false;
            searchInput.value = '';
            updateFavFilterButton();
            renderCategoryNav();
            renderBoard();
            showToast(`数据导入成功，共 ${items.length} 条`, 'success');
        } catch {
            showToast('导入失败，文件格式不正确', 'error');
        }
    };
    reader.onerror = () => {
        showToast('文件读取失败', 'error');
    };
    reader.readAsText(file);

    // 重置 file input，允许重复导入同一文件
    importFileInput.value = '';
}

// ======================== 表单验证 ========================

function clearFormErrors() {
    [imageUrlError, titleError, categoryError].forEach(el => el.classList.remove('visible'));
    [imageUrlInput, titleInput, categorySelect].forEach(el => el.classList.remove('input-error'));
}

/**
 * 表单验证
 * 图片来源：pendingBase64（本地）> URL 输入 > existingImageUrl（编辑保留）
 */
function validateForm() {
    let valid = true;
    const hasImage = pendingBase64 || imageUrlInput.value.trim() || existingImageUrl;

    // 图片来源验证
    if (!hasImage) {
        imageUrlError.textContent = '请填写图片 URL 或选择本地图片';
        imageUrlError.classList.add('visible');
        imageUrlInput.classList.add('input-error');
        valid = false;
    } else {
        imageUrlError.classList.remove('visible');
        imageUrlInput.classList.remove('input-error');
    }

    // 标题验证
    if (!titleInput.value.trim()) {
        titleError.textContent = '请输入图片标题';
        titleError.classList.add('visible');
        titleInput.classList.add('input-error');
        valid = false;
    } else {
        titleError.classList.remove('visible');
        titleInput.classList.remove('input-error');
    }

    // 分类验证
    if (!categorySelect.value) {
        categoryError.textContent = '请选择分类';
        categoryError.classList.add('visible');
        categorySelect.classList.add('input-error');
        valid = false;
    } else {
        categoryError.classList.remove('visible');
        categorySelect.classList.remove('input-error');
    }

    return valid;
}

// ======================== 添加 / 编辑 模态框 ========================

function openAddModal() {
    currentEditId = null;
    resetImageState();
    modalTitle.textContent = '添加灵感';
    submitBtn.textContent = '确认添加';
    addForm.reset();
    clearFormErrors();
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    imageUrlInput.focus();
}

function openEditModal(id) {
    const item = items.find(i => i.id === id);
    if (!item) return;

    currentEditId = id;
    resetImageState();

    modalTitle.textContent = '编辑灵感';
    submitBtn.textContent = '保存修改';

    // 回填表单数据 —— base64 图片不放入 URL 输入框，保留在 existingImageUrl
    if (item.imageUrl.startsWith('data:')) {
        imageUrlInput.value = '';
        existingImageUrl = item.imageUrl;
    } else {
        imageUrlInput.value = item.imageUrl;
        existingImageUrl = item.imageUrl;
    }
    titleInput.value = item.title;
    categorySelect.value = item.category;
    tagsInput.value = item.tags.join(', ');
    clearFormErrors();

    // 显示现有图片预览
    updateImagePreview(item.imageUrl);

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    imageUrlInput.focus();
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
        currentEditId = null;
        resetImageState();
        addForm.reset();
        clearFormErrors();
    }, 200);
}

/**
 * 表单提交的统一入口
 * 图片优先级：pendingBase64 > URL 输入 > existingImageUrl（编辑保留）
 */
function handleFormSubmit() {
    if (!validateForm()) return;

    // 确定最终 imageUrl
    let finalImageUrl;
    if (pendingBase64) {
        finalImageUrl = pendingBase64;
    } else if (imageUrlInput.value.trim()) {
        finalImageUrl = imageUrlInput.value.trim();
    } else {
        finalImageUrl = existingImageUrl;
    }

    const formData = {
        imageUrl: finalImageUrl,
        title: titleInput.value,
        category: categorySelect.value,
        tags: tagsInput.value,
    };

    if (currentEditId) {
        updateItem(currentEditId, formData);
    } else {
        addItem(formData);
    }

    closeModal();
}

// ======================== 详情模态框 ========================

/** 打开详情弹窗：大图预览 + 标题/分类/标签/收藏状态/创建时间 */
function openDetailModal(id) {
    const item = items.find(i => i.id === id);
    if (!item) return;

    detailBody.innerHTML = `
        <div class="detail-image-wrapper">
            <img
                class="detail-image"
                src="${escapeHTML(item.imageUrl)}"
                alt="${escapeHTML(item.title)}"
            >
            <div class="detail-image-error">
                <span>&#128247;</span>
                <span>图片加载失败</span>
            </div>
        </div>
        <div class="detail-info">
            <div class="detail-row">
                <span class="detail-label">标题</span>
                <span class="detail-value">${escapeHTML(item.title)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">分类</span>
                <span class="detail-value">${escapeHTML(item.category)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">标签</span>
                <div class="detail-value">
                    ${item.tags.length
                        ? `<div class="detail-tags">${item.tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('')}</div>`
                        : '无'
                    }
                </div>
            </div>
            <div class="detail-row">
                <span class="detail-label">收藏状态</span>
                <span class="detail-value${item.favorite ? ' fav-yes' : ''}">${item.favorite ? '已收藏' : '未收藏'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">创建时间</span>
                <span class="detail-value">${formatDate(item.createdAt)}</span>
            </div>
        </div>
    `;

    const detailImg = detailBody.querySelector('.detail-image');
    const detailImgError = detailBody.querySelector('.detail-image-error');
    if (detailImg) {
        detailImg.addEventListener('error', () => {
            detailImg.style.display = 'none';
            if (detailImgError) detailImgError.style.display = 'flex';
        });
    }

    detailOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDetailModal() {
    detailOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ======================== 收藏筛选按钮状态 ========================

function updateFavFilterButton() {
    if (showFavoritesOnly) {
        favFilterBtn.classList.add('fav-active');
    } else {
        favFilterBtn.classList.remove('fav-active');
    }
}

// ======================== 事件绑定 ========================

function bindEvents() {
    // --- 搜索 ---
    searchInput.addEventListener('input', () => renderBoard());

    // --- 添加按钮 ---
    addBtn.addEventListener('click', openAddModal);

    // --- 添加/编辑模态框关闭 ---
    modalClose.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // --- 详情模态框关闭 ---
    detailClose.addEventListener('click', closeDetailModal);
    detailOverlay.addEventListener('click', (e) => {
        if (e.target === detailOverlay) closeDetailModal();
    });

    // --- Esc 键关闭 ---
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (detailOverlay.classList.contains('active')) {
            closeDetailModal();
        } else if (modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // --- 表单提交 ---
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit();
    });

    // --- 本地图片选择 ---
    imageFileInput.addEventListener('change', (e) => {
        handleImageFileChange(e.target.files[0]);
    });

    // --- URL 输入框实时预览（防抖 600ms） ---
    imageUrlInput.addEventListener('input', () => {
        clearTimeout(previewTimer);
        const url = imageUrlInput.value.trim();
        if (!url) {
            // 如果有 pendingBase64 则保留其预览，否则隐藏
            if (!pendingBase64) hideImagePreview();
            return;
        }
        // 输入 URL 时清除本地图片状态（URL 优先被用户主动输入覆盖）
        if (pendingBase64) {
            pendingBase64 = null;
            imageFileInput.value = '';
            fileNameSpan.textContent = '';
        }
        previewTimer = setTimeout(() => updateImagePreview(url), 600);
    });

    // --- 分类导航 ---
    categoryNav.addEventListener('click', (e) => {
        const btn = e.target.closest('.category-btn');
        if (!btn) return;
        activeCategory = btn.dataset.category;
        showFavoritesOnly = false;
        updateFavFilterButton();
        renderCategoryNav();
        renderBoard();
    });

    // --- 收藏筛选 ---
    favFilterBtn.addEventListener('click', () => {
        showFavoritesOnly = !showFavoritesOnly;
        updateFavFilterButton();
        renderBoard();
    });

    // --- 卡片操作（事件委托） ---
    imageGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (!card) return;
        const id = card.getAttribute('data-id');

        const actionBtn = e.target.closest('[data-action]');
        if (actionBtn) {
            const action = actionBtn.dataset.action;
            if (action === 'fav')       toggleFavorite(id);
            else if (action === 'edit')  openEditModal(id);
            else if (action === 'delete') deleteItem(id);
            return;
        }

        const imageWrapper = e.target.closest('.card-image-wrapper');
        if (imageWrapper) {
            const errorEl = imageWrapper.querySelector('.card-image-error');
            if (errorEl && errorEl.style.display === 'flex') return;
            openDetailModal(id);
        }
    });

    // --- 导出数据 ---
    exportBtn.addEventListener('click', exportData);

    // --- 导入数据按钮 → 触发隐藏 file input ---
    importBtn.addEventListener('click', () => importFileInput.click());

    // --- 导入文件选择 ---
    importFileInput.addEventListener('change', (e) => {
        importData(e.target.files[0]);
    });

    // --- 清空数据 ---
    clearAllBtn.addEventListener('click', clearAllData);

    // --- 恢复示例数据 ---
    resetDataBtn.addEventListener('click', resetToDefaults);
}

// ======================== 初始化 ========================

function init() {
    const stored = loadFromStorage();
    if (stored) {
        items = stored;
    } else {
        items = DEFAULT_ITEMS.map(item => ({ ...item }));
        saveToStorage();
    }

    initCategorySelect();
    renderCategoryNav();
    updateFavFilterButton();
    renderBoard();
    bindEvents();
}

document.addEventListener('DOMContentLoaded', init);