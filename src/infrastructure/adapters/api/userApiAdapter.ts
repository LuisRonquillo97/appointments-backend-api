import { Request, Response, NextFunction } from 'express';
import { CreateUserUseCase } from '../../../application/useCases/user/createUser';
import { GetUserUseCase } from '../../../application/useCases/user/getUser';
import { ListUsersUseCase } from '../../../application/useCases/user/listUsers';
import { UpdateUserUseCase } from '../../../application/useCases/user/updateUser';
import { DeleteUserUseCase } from '../../../application/useCases/user/deleteUser';
import {
  CreateUserDto,
  UpdateUserDto,
  UserLoginDto,
  RefreshTokenDto,
} from '../../../application/dtos/UserDto';
import { ApiResponseFormatter } from '../../http/utils/apiResponse';
import { LoginUserCase } from '../../../application/useCases/user/loginUser';
import { Container } from '../../di/container';
import { TokenPort } from '../../../domain/ports/tokenPort';

/**
 * User Api adapter.
 */
export class UserApiAdapter {
  /**
   * Constructor with all user use cases.
   * @param createUserUseCase Create use case.
   * @param getUserUseCase Get use case.
   * @param listUsersUseCase List use case.
   * @param updateUserUseCase Update use case.
   * @param deleteUserUseCase Delete use case.
   */
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly loginUserCase: LoginUserCase,
  ) {}

  /**
   * Get all users.
   * @param req Request
   * @param res Response
   * @param next Next function.
   * @returns All users, paginated.
   */
  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.listUsersUseCase.execute({ page, limit });
      return ApiResponseFormatter.format(res, 'OK_200_LISTUSERS', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user by id.
   * @param req Request
   * @param res Response
   * @param next Next function.
   * @returns User.
   */
  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await this.getUserUseCase.execute(id);

      if (!user) {
        return ApiResponseFormatter.format(res, 'ERROR_404_NOTFOUND', {}, ['User not found']);
      }

      return ApiResponseFormatter.format(res, 'OK_200_GETUSER', user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create user.
   * @param req Request
   * @param res Response
   * @param next Next function.
   * @returns Created user.
   */
  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const newUser = await this.createUserUseCase.execute(userData);

      return ApiResponseFormatter.format(res, 'OK_201_CREATEUSER', newUser);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update user.
   * @param req Request
   * @param res Response
   * @param next Next function.
   * @returns Updated user.
   */
  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userData: UpdateUserDto = req.body;

      const updatedUser = await this.updateUserUseCase.execute(id, userData);

      if (!updatedUser) {
        return ApiResponseFormatter.format(res, 'ERROR_404_NOTFOUND', {}, ['User not found']);
      }

      return ApiResponseFormatter.format(res, 'OK_200_UPDATEUSER', updatedUser);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete user.
   * @param req Request
   * @param res Response
   * @param next Next function.
   * @returns Deleted user.
   */
  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleted = await this.deleteUserUseCase.execute(id);

      if (!deleted) {
        return ApiResponseFormatter.format(res, 'ERROR_404_NOTFOUND', {}, ['User not found']);
      }

      return ApiResponseFormatter.format(res, 'OK_200_DELETEUSER', { id });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login user.
   * @param req Request
   * @param res Response
   * @param next Next function.
   * @returns Login response with token.
   */
  loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginData: UserLoginDto = req.body;
      const result = await this.loginUserCase.execute(loginData);

      return ApiResponseFormatter.format(res, 'OK_200_LOGIN', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Refresh token.
   * @param req Request
   * @param res Response
   * @param next Next function.
   * @returns New token.
   */
  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token }: RefreshTokenDto = req.body;
      const container = Container.getInstance();
      const tokenPort = container.get<TokenPort>('TokenPort');

      const newToken = tokenPort.refreshToken(token);

      if (!newToken) {
        return ApiResponseFormatter.format(res, 'ERROR_401_UNAUTHORIZED', {}, [
          'Invalid or expired refresh token',
        ]);
      }

      return ApiResponseFormatter.format(res, 'OK_200_REFRESH', { token: newToken });
    } catch (error) {
      next(error);
    }
  };
}
