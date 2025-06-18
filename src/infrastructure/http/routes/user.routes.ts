// src/infrastructure/http/routes/user.routes.ts
import { Router } from 'express';
import { Container } from '../../di/container';
import { UserApiAdapter } from '../../adapters/api/userApiAdapter';
import { validate } from '../middlewares/validator.middleware';
import { createUserValidator } from '../middlewares/validators/user.validator';

const router = Router();
const userApiAdapter = Container.getInstance().get<UserApiAdapter>('UserApiAdapter');

// User routes
router.get('/', userApiAdapter.getAllUsers);
router.get('/:id', userApiAdapter.getUserById);
router.post('/', validate(createUserValidator), userApiAdapter.createUser);
router.put('/:id', userApiAdapter.updateUser);
router.delete('/:id', userApiAdapter.deleteUser);

export default router;
