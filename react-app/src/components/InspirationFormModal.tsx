import { useState, useEffect, useRef } from 'react';
import type { InspirationItem, InspirationFormData, ToastType } from '../types/inspiration';
import { validateImageFile, convertFileToBase64 } from '../utils/image';

interface Props {
  isOpen: boolean;
  editingItem: InspirationItem | null; // null = 添加模式
  categories: readonly string[];
  onClose: () => void;
  onSubmit: (data: InspirationFormData) => void;
  onToast: (type: ToastType, text: string) => void;
}

/**
 * 添加 / 编辑灵感弹窗
 * 支持：URL 输入、本地图片上传、图片预览、表单校验
 */
export function InspirationFormModal({
  isOpen,
  editingItem,
  categories,
  onClose,
  onSubmit,
  onToast,
}: Props) {
  // ---- 表单字段 ----
  const [urlInput, setUrlInput] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // ---- 图片文件 ----
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  // ---- 预览 ----
  const [previewSrc, setPreviewSrc] = useState('');
  const [previewError, setPreviewError] = useState(false);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---- 校验错误 ----
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ---- 弹窗打开时初始化表单 ----
  useEffect(() => {
    if (!isOpen) return;

    if (editingItem) {
      // 编辑模式：回填数据。base64 图片不放入 URL 输入框
      setUrlInput(
        editingItem.imageUrl.startsWith('data:') ? '' : editingItem.imageUrl
      );
      setTitle(editingItem.title);
      setCategory(editingItem.category);
      setTagsInput(editingItem.tags.join(', '));
      setPreviewSrc(editingItem.imageUrl);
    } else {
      // 添加模式：清空
      setUrlInput('');
      setTitle('');
      setCategory('');
      setTagsInput('');
      setPreviewSrc('');
    }
    setFileBase64(null);
    setFileName('');
    setErrors({});
    setPreviewError(false);
  }, [isOpen, editingItem]);

  // ---- 清理定时器 ----
  useEffect(() => {
    return () => {
      if (previewTimer.current) clearTimeout(previewTimer.current);
    };
  }, []);

  // ---- URL 输入变更 ----
  const handleUrlChange = (value: string) => {
    setUrlInput(value);
    setErrors((prev) => ({ ...prev, imageSource: '' }));

    // 如果之前选了本地文件，清掉
    if (fileBase64) {
      setFileBase64(null);
      setFileName('');
    }

    // 防抖预览
    if (previewTimer.current) clearTimeout(previewTimer.current);
    if (value.trim()) {
      previewTimer.current = setTimeout(() => {
        setPreviewSrc(value.trim());
        setPreviewError(false);
      }, 500);
    } else if (!editingItem) {
      setPreviewSrc('');
    }
  };

  // ---- 本地文件选择 ----
  const handleFileSelect = async (file: File) => {
    const error = validateImageFile(file);
    if (error) {
      onToast('error', error);
      return;
    }

    setFileName(file.name);

    try {
      const base64 = await convertFileToBase64(file);
      setFileBase64(base64);
      setUrlInput(''); // 本地优先，清 URL
      setPreviewSrc(base64);
      setPreviewError(false);
      setErrors((prev) => ({ ...prev, imageSource: '' }));
    } catch {
      onToast('error', '图片读取失败，请重试');
      setFileName('');
    }
  };

  // ---- 校验 ----
  const validate = (): boolean => {
    const next: Record<string, string> = {};

    // 图片来源：添加模式必须；编辑模式可保留原图
    const hasNewImage = fileBase64 || urlInput.trim();
    const hasExistingImage = !!editingItem?.imageUrl;
    if (!hasNewImage && !hasExistingImage) {
      next.imageSource = '请填写图片 URL 或选择本地图片';
    }

    if (!title.trim()) {
      next.title = '请输入图片标题';
    }

    if (!category) {
      next.category = '请选择分类';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // ---- 提交 ----
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // 图片来源优先级：本地 base64 > URL 输入 > 编辑保留原图
    let finalImageUrl: string;
    if (fileBase64) {
      finalImageUrl = fileBase64;
    } else if (urlInput.trim()) {
      finalImageUrl = urlInput.trim();
    } else {
      finalImageUrl = editingItem!.imageUrl;
    }

    // 解析标签
    const tags = tagsInput
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean);

    onSubmit({ title: title.trim(), imageUrl: finalImageUrl, category, tags });
  };

  // ---- 关闭 ----
  const handleClose = () => {
    if (previewTimer.current) clearTimeout(previewTimer.current);
    onClose();
  };

  // ---- 点击遮罩关闭 ----
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  if (!isOpen) return null;

  const isEditMode = editingItem !== null;

  return (
    <div className="modal-overlay active" onClick={handleOverlayClick}>
      <div className="modal">
        {/* 标题栏 */}
        <div className="modal-header">
          <h2>{isEditMode ? '编辑灵感' : '添加灵感'}</h2>
          <button className="modal-close" onClick={handleClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} id="addForm">
          {/* ---- 图片 URL ---- */}
          <div className="form-group">
            <label htmlFor="imageUrl">图片 URL</label>
            <input
              id="imageUrl"
              type="text"
              className={`form-input${errors.imageSource ? ' input-error' : ''}`}
              placeholder="请输入图片链接地址"
              value={urlInput}
              onChange={(e) => handleUrlChange(e.target.value)}
            />
            {errors.imageSource && (
              <span className="form-error visible">{errors.imageSource}</span>
            )}
          </div>

          {/* ---- 本地图片上传 ---- */}
          <div className="form-group">
            <label>或选择本地图片</label>
            <div className="file-upload-row">
              <input
                type="file"
                id="imageFile"
                className="file-input-hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                  // 重置以允许重复选同一文件
                  e.target.value = '';
                }}
              />
              <label htmlFor="imageFile" className="btn btn-secondary btn-sm file-label">
                选择图片
              </label>
              {fileName && <span className="file-name">{fileName}</span>}
            </div>
            <span className="form-hint">
              支持 JPG / PNG / WebP，单张最大 2MB。本地图片优先于 URL。
            </span>
          </div>

          {/* ---- 图片预览 ---- */}
          {previewSrc && (
            <div className="form-group image-preview-group" style={{ display: 'block' }}>
              <label>预览</label>
              <div className="image-preview-wrapper">
                {!previewError ? (
                  <img
                    className="image-preview"
                    src={previewSrc}
                    alt="预览"
                    onError={() => setPreviewError(true)}
                    onLoad={() => setPreviewError(false)}
                  />
                ) : (
                  <div className="image-preview-error" style={{ display: 'flex' }}>
                    <span>图片加载失败</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---- 标题 ---- */}
          <div className="form-group">
            <label htmlFor="title">
              标题 <span className="required">*</span>
            </label>
            <input
              id="title"
              type="text"
              className={`form-input${errors.title ? ' input-error' : ''}`}
              placeholder="请输入图片标题"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setErrors((prev) => ({ ...prev, title: '' }));
              }}
            />
            {errors.title && (
              <span className="form-error visible">{errors.title}</span>
            )}
          </div>

          {/* ---- 分类 ---- */}
          <div className="form-group">
            <label htmlFor="category">
              分类 <span className="required">*</span>
            </label>
            <select
              id="category"
              className={`form-input${errors.category ? ' input-error' : ''}`}
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (e.target.value) setErrors((prev) => ({ ...prev, category: '' }));
              }}
            >
              <option value="">请选择分类</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="form-error visible">{errors.category}</span>
            )}
          </div>

          {/* ---- 标签 ---- */}
          <div className="form-group">
            <label htmlFor="tags">
              标签 <span className="hint">（多个标签用逗号分隔）</span>
            </label>
            <input
              id="tags"
              type="text"
              className="form-input"
              placeholder="例如：蓝色, 极简, 卡片风"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          {/* ---- 操作按钮 ---- */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              取消
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditMode ? '保存修改' : '确认添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}