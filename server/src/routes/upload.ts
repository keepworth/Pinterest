import { Router } from 'express';
import { upload } from '../utils/file';
import { createUploadController } from '../controllers/uploadController';
import { authMiddleware } from '../middleware/auth';
import { fail } from '../utils/response';

export function createUploadRoutes(): Router {
  const router = Router();
  const ctrl = createUploadController();

  router.post('/', authMiddleware, (req, res) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') return fail(res, '图片大小不能超过 5MB');
        return fail(res, err.message || '上传失败');
      }
      if (!req.file) return fail(res, '请选择要上传的图片');
      ctrl.upload(req, res);
    });
  });

  return router;
}