import express from 'express';
import cors from 'cors';
import { getDatabase } from './db/database';
import { createInspirationModel } from './models/inspirationModel';
import { createInspirationRoutes } from './routes/inspirations';
import { createBoardModel } from './models/boardModel';
import { createBoardRoutes } from './routes/boards';
import { createUserModel } from './models/userModel';
import { createAuthRoutes } from './routes/auth';
import { createUploadRoutes } from './routes/upload';
import path from 'node:path';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

async function main() {
  const db = await getDatabase();
  const inspirationModel = createInspirationModel(db);
  const boardModel = createBoardModel(db);
  const userModel = createUserModel(db);

  const app = express();

  app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
  app.use(express.json({ limit: '10mb' }));

  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  app.use('/api/inspirations', createInspirationRoutes(inspirationModel));
  app.use('/api/boards', createBoardRoutes(boardModel));
  app.use('/api/upload', createUploadRoutes());
  app.use('/api/auth', createAuthRoutes(userModel));

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});