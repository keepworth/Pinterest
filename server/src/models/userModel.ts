import type { Database } from 'sql.js';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { saveToDisk } from '../db/database';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config';
import type { User, AuthUser, RegisterRequest } from '../types/user';

interface UserRow {
  id: string; username: string; email: string; passwordHash: string;
  avatarUrl: string | null; createdAt: string; updatedAt: string;
}

export interface ProfileUpdate { username?: string; avatarUrl?: string | null; }

function toAuthUser(row: UserRow): AuthUser {
  return { id: row.id, username: row.username, email: row.email, avatarUrl: row.avatarUrl || undefined, createdAt: row.createdAt };
}

function queryOne(db: Database, sql: string, params: unknown[] = []): UserRow | null {
  const stmt = db.prepare(sql); if (params.length) stmt.bind(params as unknown[]);
  let row: UserRow | null = null;
  if (stmt.step()) row = stmt.getAsObject() as unknown as UserRow;
  stmt.free(); return row;
}

function execute(db: Database, sql: string, params: unknown[] = []): void { db.run(sql, params); saveToDisk(); }

function makeToken(user: AuthUser): string {
  return jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function createUserModel(db: Database) {
  return {
    findById(id: string): AuthUser | null {
      const row = queryOne(db, 'SELECT * FROM users WHERE id = ?', [id]);
      return row ? toAuthUser(row) : null;
    },

    findByEmail(email: string): User | null {
      const row = queryOne(db, 'SELECT * FROM users WHERE email = ?', [email]);
      if (!row) return null;
      return { id: row.id, username: row.username, email: row.email, passwordHash: row.passwordHash, avatarUrl: row.avatarUrl, createdAt: row.createdAt, updatedAt: row.updatedAt };
    },

    async register(input: RegisterRequest): Promise<{ user: AuthUser; token: string }> {
      const existing = this.findByEmail(input.email);
      if (existing) throw new Error('该邮箱已被注册');
      const passwordHash = await bcrypt.hash(input.password, 10);
      const now = new Date().toISOString();
      const id = uuid();
      execute(db, `INSERT INTO users (id, username, email, passwordHash, avatarUrl, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?)`, [id, input.username.trim(), input.email.trim().toLowerCase(), passwordHash, null, now, now]);
      const user: AuthUser = { id, username: input.username.trim(), email: input.email.trim().toLowerCase(), createdAt: now };
      return { user, token: makeToken(user) };
    },

    async login(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
      const user = this.findByEmail(email.trim().toLowerCase());
      if (!user) throw new Error('邮箱或密码错误');
      if (!await bcrypt.compare(password, user.passwordHash)) throw new Error('邮箱或密码错误');
      const authUser = toAuthUser(user as unknown as UserRow);
      return { user: authUser, token: makeToken(authUser) };
    },

    updateProfile(id: string, data: ProfileUpdate): AuthUser | null {
      const existing = this.findById(id);
      if (!existing) return null;
      const now = new Date().toISOString();
      execute(db, `UPDATE users SET username=?, avatarUrl=?, updatedAt=? WHERE id=?`, [data.username ?? existing.username, data.avatarUrl !== undefined ? data.avatarUrl : existing.avatarUrl, now, id]);
      return this.findById(id);
    },
  };
}

export type UserModel = ReturnType<typeof createUserModel>;