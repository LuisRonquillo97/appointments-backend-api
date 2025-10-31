import { Router } from 'express';
import { Container } from '../../di/container';
import { UserApiAdapter } from '../../adapters/api/userApiAdapter';
import { validate } from '../middlewares/validator.middleware';
import {
  createUserValidator,
  idValidator,
  updateUserValidator,
  loginUserValidator,
  refreshTokenValidator,
} from '../middlewares/validators/user.validator';
import { authenticateToken } from '../middlewares/auth.middleware';
import { authorizeByRole } from '../middlewares/authorizeByRole.middleware';
import { UserRole } from '../../../domain/valueObjects/userRole';
/**
 * User routes.
 * @param container Container instance.
 * @returns User routes.
 * @example
 * const userRoutes = createUserRoutes(container);
 */
export const createUserRoutes = (container: Container): Router => {
  const router = Router();
  const userApiAdapter = container.get<UserApiAdapter>('UserApiAdapter');

  // User routes
  //public routes
  router.post('/login', [validate(loginUserValidator)], userApiAdapter.loginUser);
  router.post('/refresh', [validate(refreshTokenValidator)], userApiAdapter.refreshToken);
  //private routes
  router.get(
    '/',
    [authenticateToken, authorizeByRole([UserRole.ADMIN])],
    userApiAdapter.getAllUsers,
  );
  router.get('/:id', [authenticateToken, validate(idValidator)], userApiAdapter.getUserById);
  router.post(
    '/',
    [authenticateToken, authorizeByRole([UserRole.ADMIN]), validate(createUserValidator)],
    userApiAdapter.createUser,
  );
  router.put(
    '/:id',
    [authenticateToken, authorizeByRole([UserRole.ADMIN]), validate(updateUserValidator)],
    userApiAdapter.updateUser,
  );
  router.delete(
    '/:id',
    [authenticateToken, authorizeByRole([UserRole.ADMIN]), validate(idValidator)],
    userApiAdapter.deleteUser,
  );

  return router;
};
