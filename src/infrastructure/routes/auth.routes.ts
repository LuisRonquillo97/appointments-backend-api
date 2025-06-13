// src/infrastructure/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRegister, validateLogin } from '../middlewares/validation.middleware';

const router = Router();
const authController = new AuthController();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

export default router;
