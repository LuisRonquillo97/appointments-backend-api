// src/infrastructure/routes/index.routes.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import parentRoutes from './parent.routes';

const router = Router();

// Register routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/parents', parentRoutes);

export default router;
