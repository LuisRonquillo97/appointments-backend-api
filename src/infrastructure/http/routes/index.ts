import { Router } from 'express';
import { Container } from '../../di/container';
import { createUserRoutes } from './user.routes';

/**
 * Create routes.
 * @param container Dependency injection container.
 * @returns Router instance.
 */
export const createRoutes = (container: Container): Router => {
  const router = Router();

  // Registrar rutas con el contenedor proporcionado
  router.use('/users', createUserRoutes(container));
  // Otras rutas...

  return router;
};
