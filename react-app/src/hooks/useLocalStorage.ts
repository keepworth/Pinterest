import { useState, useEffect } from 'react';

/**
 * 泛型 localStorage Hook
 * - 初始化时优先读取 localStorage，解析失败或不存在则使用默认值
 * - 每次 setValue 自动同步写入 localStorage
 * - 写入失败时静默处理，不打断用户操作
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        return JSON.parse(stored) as T;
      }
    } catch {
      /* JSON 解析失败 —— 使用默认值 */
    }
    return defaultValue;
  });

  // value 变化时同步到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.warn('localStorage 写入失败：存储空间可能已满');
    }
  }, [key, value]);

  return [value, setValue];
}