export type SourceType = 'url' | 'upload';
export type SortMode = 'newest' | 'oldest' | 'favorites';
export type NavItem = 'home' | 'explore' | 'collections' | 'favorites' | 'create' | 'settings';
export type AppView = 'home' | 'favorites' | 'explore' | 'collections' | 'settings' | 'profile' | 'board';

export interface InspirationItem {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  sourceType: SourceType;
  boardId?: string;
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  displayCover?: string;
  inspirationCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface InspirationFormData {
  title: string;
  imageUrl: string;
  category: string;
  tags: string[];
  imageFile?: File;
  boardId?: string;
}

export type Category = string;

export interface CategoryConfig { key: string; label: string; labelKey: string; icon: string; }

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage { id: string; type: ToastType; text: string; }