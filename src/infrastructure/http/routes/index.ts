import { Router, Request, Response } from 'express';
import userRoutes from './user.routes';

const router = Router();
// In your routes/index.ts

router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

router.use('/users', userRoutes);

export default router;
