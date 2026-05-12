import type { Request, Response } from 'express';
import type { InspirationModel } from '../models/inspirationModel';
import { success, fail } from '../utils/response';
import { deleteUploadFile } from '../utils/file';
import type { InspirationInput, SourceType } from '../types/inspiration';

function validateInput(body: unknown): { valid: true; data: InspirationInput } | { valid: false; error: string } {
  if (typeof body !== 'object' || body === null) return { valid: false, error: '请求体不能为空' };
  const input = body as Record<string, unknown>;
  const result: InspirationInput = {};
  if (input.title !== undefined) { if (typeof input.title !== 'string' || !input.title.trim()) return { valid: false, error: 'title 不能为空' }; result.title = input.title.trim(); }
  if (input.imageUrl !== undefined) { if (typeof input.imageUrl !== 'string' || !input.imageUrl.trim()) return { valid: false, error: 'imageUrl 不能为空' }; result.imageUrl = input.imageUrl.trim(); }
  if (input.category !== undefined) { if (typeof input.category !== 'string' || !input.category.trim()) return { valid: false, error: 'category 不能为空' }; result.category = input.category.trim(); }
  if (input.tags !== undefined) { if (!Array.isArray(input.tags)) return { valid: false, error: 'tags 必须是数组' }; result.tags = input.tags.filter((t): t is string => typeof t === 'string'); }
  if (input.sourceType !== undefined) { if (input.sourceType !== 'url' && input.sourceType !== 'upload') return { valid: false, error: 'sourceType 只能是 url 或 upload' }; result.sourceType = input.sourceType as SourceType; }
  if (input.boardId !== undefined) result.boardId = typeof input.boardId === 'string' ? input.boardId : null;
  if (input.favorite !== undefined) { if (typeof input.favorite !== 'boolean') return { valid: false, error: 'favorite 必须是 boolean' }; result.favorite = input.favorite; }
  return { valid: true, data: result };
}

export function createInspirationController(model: InspirationModel) {
  const uid = (req: Request) => req.user!.id;

  return {
    getAll(req: Request, res: Response) { success(res, model.findAll(uid(req))); },

    getById(req: Request, res: Response) {
      const item = model.findById(req.params.id, uid(req));
      if (!item) return fail(res, '灵感不存在', 404);
      success(res, item);
    },

    create(req: Request, res: Response) {
      const check = validateInput(req.body);
      if (!check.valid) return fail(res, check.error);
      const { data } = check;
      if (!data.title || !data.imageUrl || !data.category) return fail(res, '缺少必填字段');
      success(res, model.create(data, uid(req)), 201);
    },

    update(req: Request, res: Response) {
      const id = req.params.id;
      const userId = uid(req);
      const check = validateInput(req.body);
      if (!check.valid) return fail(res, check.error);
      const oldItem = model.findById(id, userId);
      if (!oldItem) return fail(res, '灵感不存在', 404);
      const updated = model.update(id, check.data, userId);
      if (!updated) return fail(res, '灵感不存在', 404);
      if (oldItem.sourceType === 'upload' && oldItem.imageUrl !== updated.imageUrl) deleteUploadFile(oldItem.imageUrl);
      success(res, updated);
    },

    remove(req: Request, res: Response) {
      const userId = uid(req);
      const existing = model.findById(req.params.id, userId);
      if (!existing) return fail(res, '灵感不存在', 404);
      model.remove(req.params.id, userId);
      if (existing.sourceType === 'upload') deleteUploadFile(existing.imageUrl);
      success(res, null);
    },

    toggleFavorite(req: Request, res: Response) {
      const check = validateInput(req.body);
      if (!check.valid) return fail(res, check.error);
      if (check.data.favorite === undefined) return fail(res, 'favorite 字段必传');
      const item = model.setFavorite(req.params.id, check.data.favorite!, uid(req));
      if (!item) return fail(res, '灵感不存在', 404);
      success(res, item);
    },
  };
}