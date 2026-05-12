import type { Request, Response } from 'express';
import type { BoardModel } from '../models/boardModel';
import { success, fail } from '../utils/response';

export function createBoardController(model: BoardModel) {
  const uid = (req: Request) => req.user!.id;

  return {
    getAll(req: Request, res: Response) { success(res, model.findAll(uid(req))); },

    getById(req: Request, res: Response) {
      const b = model.findById(req.params.id, uid(req));
      if (!b) return fail(res, '画板不存在', 404);
      success(res, b);
    },

    create(req: Request, res: Response) {
      const { name } = req.body || {};
      if (!name || typeof name !== 'string' || !name.trim()) return fail(res, '画板名称不能为空');
      success(res, { ...model.create({ name: name.trim(), description: req.body?.description }, uid(req)), inspirationCount: 0 }, 201);
    },

    update(req: Request, res: Response) {
      const id = req.params.id;
      const userId = uid(req);
      if (!model.findById(id, userId)) return fail(res, '画板不存在', 404);
      if (req.body?.name !== undefined && (!req.body.name || typeof req.body.name !== 'string' || !req.body.name.trim())) return fail(res, '画板名称不能为空');
      const b = model.update(id, { name: req.body?.name, description: req.body?.description, coverImageUrl: req.body?.coverImageUrl }, userId);
      if (!b) return fail(res, '画板不存在', 404);
      success(res, { ...b, inspirationCount: model.inspirationCount(id, userId) });
    },

    remove(req: Request, res: Response) {
      const id = req.params.id;
      const userId = uid(req);
      const deleted = model.remove(id, userId);
      const exists = model.findById(id, userId);
      if (!exists) return fail(res, '画板不存在', 404);
      if (!deleted) return fail(res, '该画板下还有灵感，不能删除');
      success(res, null);
    },
  };
}