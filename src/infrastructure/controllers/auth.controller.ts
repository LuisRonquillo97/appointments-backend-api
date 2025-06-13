// src/infrastructure/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../domain/services/auth.service';
import { UserManagementService } from '../../application/services/user-management.service';
import { UserRepository } from '../repositories/user.repository';
import { ResponseUtil } from '../utils/response.util';

export class AuthController {
  private userManagementService: UserManagementService;

  constructor() {
    const authService = new AuthService();
    const userRepository = new UserRepository();
    this.userManagementService = new UserManagementService(userRepository, authService);
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, name } = req.body;

      const { token } = await this.userManagementService.registerUser({
        email,
        password,
        name,
      });

      ResponseUtil.success(res, { token }, 201);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      const { token } = await this.userManagementService.loginUser({
        email,
        password,
      });

      ResponseUtil.success(res, { token });
    } catch (error) {
      next(error);
    }
  };
}
