// src/infrastructure/adapters/api/userApiAdapter.ts
import { Request, Response, NextFunction } from 'express';
import { CreateUserUseCase } from '../../../application/useCases/user/createUser';
import { GetUserUseCase } from '../../../application/useCases/user/getUser';
import { ListUsersUseCase } from '../../../application/useCases/user/listUsers';
import { UpdateUserUseCase } from '../../../application/useCases/user/updateUser';
import { DeleteUserUseCase } from '../../../application/useCases/user/deleteUser';
import { CreateUserDto, UpdateUserDto } from '../../../application/dtos/UserDto';

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
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await this.getUserUseCase.execute(id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const newUser = await this.createUserUseCase.execute(userData);

      res.status(201).json(newUser);
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
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleted = await this.deleteUserUseCase.execute(id);

      if (!deleted) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
