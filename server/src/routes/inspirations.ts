import { Router } from 'express';
import type { InspirationModel } from '../models/inspirationModel';
import { createInspirationController } from '../controllers/inspirationController';
import { authMiddleware } from '../middleware/auth';

export function createInspirationRoutes(model: InspirationModel): Router {
  const router = Router();
  const ctrl = createInspirationController(model);

  router.get('/', authMiddleware, (req, res) => ctrl.getAll(req, res));
  router.get('/:id', authMiddleware, (req, res) => ctrl.getById(req, res));
  router.post('/', authMiddleware, (req, res) => ctrl.create(req, res));
  router.put('/:id', authMiddleware, (req, res) => ctrl.update(req, res));
  router.delete('/:id', authMiddleware, (req, res) => ctrl.remove(req, res));
  router.patch('/:id/favorite', authMiddleware, (req, res) => ctrl.toggleFavorite(req, res));

  return router;
}