// src/domain/services/user.service.ts
import { UserModel } from '../model/user.model';
import { IUserRepository } from '../repositories/user.repository.interface';
import { AuthService } from './auth.service';
import { UserAlreadyExistsError, InvalidCredentialsError } from '../errors/auth-errors';
import { UserRole } from '../enums/user-role.enum';

export class UserService {
  constructor(
    private userRepository: IUserRepository,
    private authService: AuthService
  ) {}

  async registerUser(userData: {
    email: string;
    password: string;
    name?: string;
    role?: UserRole;
  }): Promise<{ user: UserModel; token: string }> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new UserAlreadyExistsError();
    }

    const hashedPassword = await this.authService.hashPassword(userData.password);

    const user = await this.userRepository.create({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      role: userData.role || UserRole.CLIENT,
    });

    const token = this.authService.generateToken(user);

    return { user, token };
  }

  async loginUser(credentials: {
    email: string;
    password: string;
  }): Promise<{ user: UserModel; token: string }> {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.authService.comparePasswords(
      credentials.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const token = this.authService.generateToken(user);

    return { user, token };
  }

  async deleteUser(userId: number, deletedById: number): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return await this.userRepository.softDelete(userId, deletedById);
  }
}
