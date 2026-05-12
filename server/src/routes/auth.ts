import { Router } from 'express';
import type { UserModel } from '../models/userModel';
import { createAuthController } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

export function createAuthRoutes(model: UserModel): Router {
  const router = Router();
  const ctrl = createAuthController(model);

  router.post('/register', (req, res) => ctrl.register(req, res));
  router.post('/login', (req, res) => ctrl.login(req, res));
  router.get('/me', authMiddleware, (req, res) => ctrl.me(req, res));
  router.put('/me', authMiddleware, (req, res) => ctrl.updateProfile(req, res));

  return router;
}