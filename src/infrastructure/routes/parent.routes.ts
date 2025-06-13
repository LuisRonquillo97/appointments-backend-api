// src/infrastructure/routes/parent.routes.ts
import { Router } from 'express';
import { ParentController } from '../controllers/parent.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role-auth.middleware';
import { UserRole } from '../../domain/enums/user-role.enum';
import {
  validateCreateParent,
  validateUpdateParent,
  validateParentId,
  validateUserId,
  validatePagination,
} from '../middlewares/parent-validation.middleware';

const router = Router();
const parentController = new ParentController();

// Protected routes (require authentication)
router.get('/', authMiddleware, validatePagination, parentController.listParents);

router.get('/:id', authMiddleware, validateParentId, parentController.getParentById);

router.get('/user/:userId', authMiddleware, validateUserId, parentController.getParentByUserId);

router.post('/', authMiddleware, validateCreateParent, parentController.createParent);

router.put('/:id', authMiddleware, validateUpdateParent, parentController.updateParent);

router.delete('/:id', authMiddleware, validateParentId, parentController.deleteParent);

// Admin-only routes
router.get(
  '/admin/all',
  authMiddleware,
  requireRole([UserRole.ADMIN]),
  validatePagination,
  parentController.listParents
);

export default router;
