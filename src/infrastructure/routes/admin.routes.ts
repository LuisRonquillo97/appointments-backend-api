import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role-auth.middleware';
import { UserRole } from '../../domain/enums/user-role.enum';
import { AdminController } from '../controllers/admin.controller';
import { validateCreateAdmin } from '../middlewares/validation.middleware';

const router = Router();
const adminController = new AdminController();

// Route to create a new admin user (only accessible to admins)
router.post(
  '/users/admin/create',
  authMiddleware,
  requireRole([UserRole.ADMIN]),
  validateCreateAdmin,
  adminController.createAdmin
);

export default router;
