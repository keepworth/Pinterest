import type { Database } from 'sql.js';
import { v4 as uuid } from 'uuid';
import { saveToDisk } from '../db/database';
import type { InspirationItem, InspirationInput, SourceType } from '../types/inspiration';

interface Row {
  id: string; title: string; imageUrl: string; category: string;
  tags: string; favorite: number; sourceType: string;
  boardId: string | null; userId: string | null;
  createdAt: string; updatedAt: string;
}

function toItem(row: Row): InspirationItem {
  return {
    id: row.id, title: row.title, imageUrl: row.imageUrl, category: row.category,
    tags: JSON.parse(row.tags) as string[], favorite: row.favorite === 1,
    sourceType: row.sourceType as SourceType, boardId: row.boardId || undefined,
    createdAt: row.createdAt, updatedAt: row.updatedAt,
  };
}

function queryAll(db: Database, sql: string, params: unknown[] = []): Row[] {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params as unknown[]);
  const rows: Row[] = [];
  while (stmt.step()) rows.push(stmt.getAsObject() as unknown as Row);
  stmt.free();
  return rows;
}

function queryOne(db: Database, sql: string, params: unknown[] = []): Row | null {
  const rows = queryAll(db, sql, params);
  return rows[0] || null;
}

function execute(db: Database, sql: string, params: unknown[] = []): void {
  db.run(sql, params);
  saveToDisk();
}

export function createInspirationModel(db: Database) {
  return {
    findAll(userId: string): InspirationItem[] {
      return queryAll(db, 'SELECT * FROM inspirations WHERE userId = ? ORDER BY createdAt DESC', [userId]).map(toItem);
    },

    findById(id: string, userId: string): InspirationItem | null {
      const row = queryOne(db, 'SELECT * FROM inspirations WHERE id = ? AND userId = ?', [id, userId]);
      return row ? toItem(row) : null;
    },

    create(input: InspirationInput, userId: string): InspirationItem {
      const now = new Date().toISOString();
      const item: InspirationItem = {
        id: uuid(), title: input.title || '', imageUrl: input.imageUrl || '',
        category: input.category || '', tags: input.tags || [], favorite: false,
        sourceType: input.sourceType || 'url', boardId: input.boardId || undefined,
        createdAt: now, updatedAt: now,
      };
      execute(db,
        `INSERT INTO inspirations (id, title, imageUrl, category, tags, favorite, sourceType, boardId, userId, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?)`,
        [item.id, item.title, item.imageUrl, item.category, JSON.stringify(item.tags), item.sourceType, item.boardId || null, userId, item.createdAt, item.updatedAt]
      );
      return item;
    },

    update(id: string, input: InspirationInput, userId: string): InspirationItem | null {
      const existing = this.findById(id, userId);
      if (!existing) return null;
      const updated: InspirationItem = {
        ...existing, title: input.title ?? existing.title,
        imageUrl: input.imageUrl ?? existing.imageUrl, category: input.category ?? existing.category,
        tags: input.tags ?? existing.tags, sourceType: input.sourceType ?? existing.sourceType,
        boardId: input.boardId !== undefined ? input.boardId : existing.boardId,
        updatedAt: new Date().toISOString(),
      };
      execute(db,
        `UPDATE inspirations SET title=?, imageUrl=?, category=?, tags=?, sourceType=?, boardId=?, updatedAt=? WHERE id=? AND userId=?`,
        [updated.title, updated.imageUrl, updated.category, JSON.stringify(updated.tags), updated.sourceType, updated.boardId || null, updated.updatedAt, id, userId]
      );
      return updated;
    },

    remove(id: string, userId: string): boolean {
      const existing = this.findById(id, userId);
      if (!existing) return false;
      execute(db, 'DELETE FROM inspirations WHERE id = ? AND userId = ?', [id, userId]);
      return true;
    },

    setFavorite(id: string, favorite: boolean, userId: string): InspirationItem | null {
      const existing = this.findById(id, userId);
      if (!existing) return null;
      const now = new Date().toISOString();
      execute(db, 'UPDATE inspirations SET favorite = ?, updatedAt = ? WHERE id = ? AND userId = ?', [favorite ? 1 : 0, now, id, userId]);
      existing.favorite = favorite;
      existing.updatedAt = now;
      return existing;
    },
  };
}

export type InspirationModel = ReturnType<typeof createInspirationModel>;