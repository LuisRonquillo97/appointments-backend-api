import { Router } from 'express';
import { Container } from '../../di/container';
import { UserApiAdapter } from '../../adapters/api/userApiAdapter';
import { validate } from '../middlewares/validator.middleware';
import {
  createUserValidator,
  idValidator,
  updateUserValidator,
} from '../middlewares/validators/user.validator';

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
  router.get('/', userApiAdapter.getAllUsers);
  router.get('/:id', validate(idValidator), userApiAdapter.getUserById);
  router.post('/', validate(createUserValidator), userApiAdapter.createUser);
  router.put('/:id', validate(updateUserValidator), userApiAdapter.updateUser);
  router.delete('/:id', validate(idValidator), userApiAdapter.deleteUser);

  return router;
};
