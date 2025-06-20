import { Request, Response, NextFunction } from 'express';
import { CreateUserUseCase } from '../../../application/useCases/user/createUser';
import { GetUserUseCase } from '../../../application/useCases/user/getUser';
import { ListUsersUseCase } from '../../../application/useCases/user/listUsers';
import { UpdateUserUseCase } from '../../../application/useCases/user/updateUser';
import { DeleteUserUseCase } from '../../../application/useCases/user/deleteUser';
import { CreateUserDto, UpdateUserDto } from '../../../application/dtos/UserDto';
import { ApiResponseFormatter } from '../../http/utils/apiResponse';

export class UserApiAdapter {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

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

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const newUser = await this.createUserUseCase.execute(userData);

      return ApiResponseFormatter.format(res, 'OK_201_CREATEUSER', newUser);
    } catch (error) {
      next(error);
    }
  };

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
}
