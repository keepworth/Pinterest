import type { Database } from 'sql.js';
import { v4 as uuid } from 'uuid';
import { saveToDisk } from '../db/database';

interface Row {
  id: string; name: string; description: string | null;
  coverImageUrl: string | null; userId: string | null;
  createdAt: string; updatedAt: string;
}

export interface Board {
  id: string; name: string; description?: string;
  coverImageUrl?: string; displayCover?: string;
  inspirationCount?: number; createdAt: string; updatedAt: string;
}

export interface BoardInput {
  name?: string; description?: string | null; coverImageUrl?: string | null;
}

function toBoard(row: Row): Board {
  return { id: row.id, name: row.name, description: row.description || undefined, coverImageUrl: row.coverImageUrl || undefined, createdAt: row.createdAt, updatedAt: row.updatedAt };
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
  const r = queryAll(db, sql, params);
  return r[0] || null;
}

function execute(db: Database, sql: string, params: unknown[] = []): void {
  db.run(sql, params); saveToDisk();
}

export function createBoardModel(db: Database) {
  return {
    /** 直接查表获取 coverImageUrl，避免调用 findById 引发循环递归 */
    getDisplayCover(boardId: string, userId: string): string | undefined {
      const boardRow = queryOne(db, 'SELECT coverImageUrl FROM boards WHERE id = ? AND userId = ?', [boardId, userId]);
      if (boardRow?.coverImageUrl) return boardRow.coverImageUrl;
      const inspRow = queryOne(db, 'SELECT imageUrl FROM inspirations WHERE boardId = ? AND userId = ? ORDER BY createdAt DESC LIMIT 1', [boardId, userId]);
      return inspRow ? (inspRow as unknown as { imageUrl: string }).imageUrl : undefined;
    },

    findAll(userId: string): (Board & { displayCover?: string; inspirationCount?: number })[] {
      return queryAll(db, 'SELECT * FROM boards WHERE userId = ? ORDER BY createdAt DESC', [userId]).map((row) => {
        const board = toBoard(row);
        return { ...board, displayCover: this.getDisplayCover(board.id, userId), inspirationCount: this.inspirationCount(board.id, userId) };
      });
    },

    findById(id: string, userId: string): (Board & { displayCover?: string; inspirationCount?: number }) | null {
      const row = queryOne(db, 'SELECT * FROM boards WHERE id = ? AND userId = ?', [id, userId]);
      if (!row) return null;
      return { ...toBoard(row), displayCover: this.getDisplayCover(id, userId), inspirationCount: this.inspirationCount(id, userId) };
    },

    create(input: BoardInput, userId: string): Board {
      const now = new Date().toISOString();
      const id = uuid();
      execute(db, `INSERT INTO boards (id, name, description, coverImageUrl, userId, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?)`,
        [id, input.name || '', input.description || null, input.coverImageUrl || null, userId, now, now]);
      return { id, name: input.name || '', description: input.description || undefined, coverImageUrl: input.coverImageUrl || undefined, createdAt: now, updatedAt: now };
    },

    update(id: string, input: BoardInput, userId: string): Board | null {
      const existing = this.findById(id, userId);
      if (!existing) return null;
      const now = new Date().toISOString();
      execute(db,
        `UPDATE boards SET name=?, description=?, coverImageUrl=?, updatedAt=? WHERE id=? AND userId=?`,
        [input.name ?? existing.name, input.description !== undefined ? input.description : existing.description, input.coverImageUrl !== undefined ? input.coverImageUrl : existing.coverImageUrl, now, id, userId]
      );
      return this.findById(id, userId)!;
    },

    remove(id: string, userId: string): boolean {
      const existing = this.findById(id, userId);
      if (!existing) return false;
      const count = this.inspirationCount(id, userId);
      if (count > 0) return false;
      execute(db, 'DELETE FROM boards WHERE id = ? AND userId = ?', [id, userId]);
      return true;
    },

    inspirationCount(boardId: string, userId: string): number {
      const row = queryOne(db, 'SELECT COUNT(*) as cnt FROM inspirations WHERE boardId = ? AND userId = ?', [boardId, userId]);
      return row ? (row as unknown as { cnt: number }).cnt : 0;
    },
  };
}

export type BoardModel = ReturnType<typeof createBoardModel>;