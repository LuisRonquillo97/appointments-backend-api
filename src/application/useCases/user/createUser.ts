// src/application/useCases/user/createUser.ts
import { User } from '../../../domain/entities/user';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserService } from '../../../domain/services/userService';
import { CreateUserDto, UserResponseDto } from '../../dtos/UserDto';

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private userService: UserService,
  ) {}

  async execute(userData: CreateUserDto): Promise<UserResponseDto> {
    // Validar email único
    await this.userService.validateUniqueEmail(userData.email);

    // Crear usuario con comportamiento
    const user = new User({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const createdUser = await this.userRepository.create(user);

    return {
      id: createdUser.id!,
      name: createdUser.name,
      email: createdUser.email,
      createdAt: createdUser.createdAt!,
      updatedAt: createdUser.updatedAt!,
    };
  }
}
