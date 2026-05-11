import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from './constants';

/**
 * 验证图片文件：检查类型和大小
 * @returns null 表示合法，否则返回错误信息字符串
 */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return '仅支持 JPG、PNG、WebP 格式的图片';
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return '图片过大，请选择 2MB 以下的图片';
  }
  return null;
}

/**
 * 将 File 转为 base64 Data URL
 * @returns Promise，resolve 为 base64 字符串
 */
export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
}