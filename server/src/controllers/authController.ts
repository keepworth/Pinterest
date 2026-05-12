import type { Request, Response } from 'express';
import type { UserModel } from '../models/userModel';
import { success, fail } from '../utils/response';

export function createAuthController(model: UserModel) {
  return {
    async register(req: Request, res: Response) {
      try {
        const { username, email, password } = req.body || {};
        if (!username || typeof username !== 'string' || !username.trim()) return fail(res, '用户名不能为空');
        if (!email || typeof email !== 'string' || !email.trim()) return fail(res, '邮箱不能为空');
        if (!password || typeof password !== 'string' || password.length < 6) return fail(res, '密码长度至少 6 位');
        success(res, await model.register({ username, email, password }), 201);
      } catch (err) { fail(res, (err as Error).message, (err as Error).message.includes('已被注册') ? 409 : 400); }
    },

    async login(req: Request, res: Response) {
      try {
        const { email, password } = req.body || {};
        if (!email || typeof email !== 'string' || !email.trim()) return fail(res, '邮箱不能为空');
        if (!password || typeof password !== 'string') return fail(res, '密码不能为空');
        success(res, await model.login(email, password));
      } catch (err) { const msg = (err as Error).message; fail(res, msg, msg === '邮箱或密码错误' ? 401 : 400); }
    },

    me(req: Request, res: Response) {
      const user = model.findById(req.user!.id);
      if (!user) return fail(res, '用户不存在', 404);
      success(res, user);
    },

    updateProfile(req: Request, res: Response) {
      const { username, avatarUrl } = req.body || {};
      if (username !== undefined && (typeof username !== 'string' || !username.trim())) return fail(res, '用户名不能为空');
      const updated = model.updateProfile(req.user!.id, { username: username?.trim(), avatarUrl });
      if (!updated) return fail(res, '用户不存在', 404);
      success(res, updated);
    },
  };
}