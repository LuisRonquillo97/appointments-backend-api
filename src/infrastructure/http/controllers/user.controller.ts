import { Request, Response, NextFunction } from 'express';
import { CreateUserUseCase } from '../../../application/useCases/user/createUser';
import { GetUserUseCase } from '../../../application/useCases/user/getUser';
import { TypeORMUserRepository } from '../../repositories/typeORMUserRepository';
import { AppDataSource } from '../../database/datasource';


export class UserController {
  private userRepository: TypeORMUserRepository;

  // In UserController constructor
  constructor() {
    this.userRepository = new TypeORMUserRepository(AppDataSource);
  }

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userRepository.findAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const getUserUseCase = new GetUserUseCase(this.userRepository);
      const user = await getUserUseCase.execute(id);

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
      const userData = req.body;
      const createUserUseCase = new CreateUserUseCase(this.userRepository);
      const newUser = await createUserUseCase.execute(userData);

      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userData = req.body;
      const updatedUser = await this.userRepository.update(id, userData);

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
      const deleted = await this.userRepository.delete(id);

      if (!deleted) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
