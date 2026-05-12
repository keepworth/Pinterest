/** 灵感数据类型 —— 与前端保持一致 */

export type SourceType = 'url' | 'upload';

export interface InspirationItem {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  tags: string[];
  favorite: boolean;
  sourceType: SourceType;
  boardId?: string | null;
  createdAt: string;
  updatedAt: string;
}

/** POST / PUT 请求体 */
export interface InspirationInput {
  title?: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
  sourceType?: SourceType;
  boardId?: string | null;
  favorite?: boolean;
}