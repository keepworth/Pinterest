import { Router } from 'express';
import type { BoardModel } from '../models/boardModel';
import { createBoardController } from '../controllers/boardController';
import { authMiddleware } from '../middleware/auth';

export function createBoardRoutes(model: BoardModel): Router {
  const router = Router();
  const ctrl = createBoardController(model);

  router.get('/', authMiddleware, (req, res) => ctrl.getAll(req, res));
  router.get('/:id', authMiddleware, (req, res) => ctrl.getById(req, res));
  router.post('/', authMiddleware, (req, res) => ctrl.create(req, res));
  router.put('/:id', authMiddleware, (req, res) => ctrl.update(req, res));
  router.delete('/:id', authMiddleware, (req, res) => ctrl.remove(req, res));

  return router;
}