import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../domain/services/user.service';
import { AuthService } from '../../domain/services/auth.service';
import { UserRepository } from '../repositories/user.repository';
import { UserRole } from '../../domain/enums/user-role.enum';
import { ResponseUtil } from '../utils/response.util';
import { RequestWithUser } from '../middlewares/auth.middleware';

export class AdminController {
  private userService: UserService;

  constructor() {
    const authService = new AuthService();
    const userRepository = new UserRepository();
    this.userService = new UserService(userRepository, authService);
  }

  createAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, name } = req.body;

      const { user, token } = await this.userService.registerUser({
        email,
        password,
        name,
        role: UserRole.ADMIN,
      });

      ResponseUtil.success(
        res,
        {
          message: 'Admin user created successfully',
          userId: user.id,
          email: user.email,
        },
        201
      );
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);
      const user = (req as RequestWithUser).user;
      const currentUserId = user.id; // From JWT token

      if (await this.userService.deleteUser(userId, currentUserId)) {
        ResponseUtil.success(res, { message: 'User deleted successfully' });
      } else {
        ResponseUtil.error(res, 'User not found or not deleted.');
      }
    } catch (error) {
      next(error);
    }
  };
}
