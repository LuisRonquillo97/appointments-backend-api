// src/application/useCases/user/updateUser.ts
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UpdateUserDto, UserResponseDto } from '../../dtos/UserDto';

export class UpdateUserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id: string, userData: UpdateUserDto): Promise<UserResponseDto | null> {
    const updatedUser = await this.userRepository.update(id, userData);

    if (!updatedUser) {
      return null;
    }

    return {
      id: updatedUser.id!,
      name: updatedUser.name,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt!,
      updatedAt: updatedUser.updatedAt!,
    };
  }
}
