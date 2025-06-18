// src/application/useCases/user/getUser.ts
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserResponseDto } from '../../dtos/UserDto';

export class GetUserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return null;
    }

    return {
      id: user.id!,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt!,
      updatedAt: user.updatedAt!,
    };
  }
}
