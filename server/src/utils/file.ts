import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import { v4 as uuid } from 'uuid';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

/** 上传根目录 */
const UPLOAD_BASE = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOAD_BASE)) fs.mkdirSync(UPLOAD_BASE, { recursive: true });

/** 获取用户上传目录并确保存在 */
export function getUserUploadDir(userId: string): string {
  const dir = path.join(UPLOAD_BASE, userId);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const uid = (req as unknown as Record<string, unknown>).user
      ? ((req as unknown as Record<string, { id: string }>).user.id)
      : 'anonymous';
    cb(null, getUserUploadDir(uid));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${uuid().slice(0, 8)}${ext}`);
  },
});

const fileFilter = (_req: unknown, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) cb(null, true);
  else cb(new Error('仅支持 JPG、PNG、WebP 格式'));
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// ─────────── 文件清理 ───────────

const UPLOAD_URL_PREFIX = `http://localhost:${PORT}/uploads/`;

export function isLocalUploadUrl(imageUrl: string): boolean {
  return imageUrl.startsWith(UPLOAD_URL_PREFIX);
}

/** 从 URL 安全提取绝对路径（URL 格式: /uploads/{userId}/{filename}） */
export function getUploadFilePathFromUrl(imageUrl: string): string | null {
  if (!isLocalUploadUrl(imageUrl)) return null;
  const subPath = imageUrl.slice(UPLOAD_URL_PREFIX.length);
  // subPath 应为 "userId/filename"，拒绝含多余 / 或 \ 的路径
  const parts = subPath.split('/');
  if (parts.length !== 2) return null;
  const [userId, filename] = parts;
  if (!userId || !filename || userId.includes('\\') || filename.includes('\\')) return null;
  return path.join(UPLOAD_BASE, userId, filename);
}

export function deleteUploadFile(imageUrl: string): void {
  const filePath = getUploadFilePathFromUrl(imageUrl);
  if (!filePath) return;
  try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); }
  catch (err) { console.warn(`[file] 无法删除: ${filePath}`, (err as Error).message); }
}