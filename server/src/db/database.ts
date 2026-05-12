import initSqlJs, { type Database } from 'sql.js';
import fs from 'node:fs';
import path from 'node:path';

const DB_DIR = path.join(__dirname, '..', '..', 'data');
const DB_PATH = path.join(DB_DIR, 'inspireboard.sqlite');

let db: Database | null = null;

export async function getDatabase(): Promise<Database> {
  if (db) return db;

  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

  const SQL = await initSqlJs();
  try { const buffer = fs.readFileSync(DB_PATH); db = new SQL.Database(buffer); }
  catch { db = new SQL.Database(); }

  // 建表
  db.run(`CREATE TABLE IF NOT EXISTS inspirations (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, imageUrl TEXT NOT NULL,
    category TEXT NOT NULL, tags TEXT NOT NULL DEFAULT '[]',
    favorite INTEGER NOT NULL DEFAULT 0, sourceType TEXT NOT NULL DEFAULT 'url',
    boardId TEXT, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS boards (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT,
    coverImageUrl TEXT, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, username TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL, avatarUrl TEXT, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL
  )`);

  // 兼容旧库：添加缺少的列
  try { db.run('ALTER TABLE inspirations ADD COLUMN boardId TEXT'); } catch { /* */ }
  try { db.run('ALTER TABLE inspirations ADD COLUMN userId TEXT'); } catch { /* */ }
  try { db.run('ALTER TABLE boards ADD COLUMN userId TEXT'); } catch { /* */ }

  // 旧数据迁移：将 userId 为空的数据归属到第一个用户
  const firstUserId = (db.prepare('SELECT id FROM users LIMIT 1').step() ? db.prepare('SELECT id FROM users LIMIT 1').getAsObject() as { id: string } : null)?.id;
  if (firstUserId) {
    db.run('UPDATE inspirations SET userId = ? WHERE userId IS NULL', [firstUserId]);
    db.run('UPDATE boards SET userId = ? WHERE userId IS NULL', [firstUserId]);
  }

  saveToDisk();
  return db;
}

export function saveToDisk(): void {
  if (!db) return;
  fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
}