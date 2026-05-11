/**
 * 灵感收藏板 — 核心类型定义
 */

/** 单条灵感数据 */
export interface InspirationItem {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
}

/** 表单提交数据（tags 已解析为数组） */
export interface InspirationFormData {
  title: string;
  imageUrl: string;
  category: string;
  tags: string[];
}

/** 分类（后续可细化为联合类型） */
export type Category = string;

/** Toast 消息类型 */
export type ToastType = 'success' | 'error' | 'info';

/** 单条 Toast 消息 */
export interface ToastMessage {
  id: string;
  type: ToastType;
  text: string;
}