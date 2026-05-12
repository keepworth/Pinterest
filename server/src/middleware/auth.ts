import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { fail } from '../utils/response';

export interface JwtPayload {
  id: string;
  username: string;
  email: string;
}

/** 扩展 Express Request 类型 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/** JWT 认证中间件 —— 校验 Bearer token，挂载 req.user */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    fail(res, '未提供认证令牌', 401);
    return;
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    fail(res, '认证令牌无效或已过期', 401);
  }
}