import type { Request, Response } from 'express';
import { success } from '../utils/response';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

export function createUploadController() {
  return {
    upload(req: Request, res: Response) {
      const uid = req.user!.id;
      const url = `http://localhost:${PORT}/uploads/${uid}/${req.file!.filename}`;
      success(res, { url });
    },
  };
}