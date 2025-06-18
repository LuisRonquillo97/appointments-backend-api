// src/application/useCases/user/listUsers.ts
import { UserRepository } from '../../../domain/repositories/user.repository';
import { PaginationOptions, PaginatedResult } from '../../../domain/types/pagination';
import { UserResponseDto } from '../../dtos/UserDto';

export class ListUsersUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(options?: PaginationOptions): Promise<PaginatedResult<UserResponseDto>> {
    const result = await this.userRepository.findAll(options);

    const userDtos = result.data.map((user) => ({
      id: user.id!,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt!,
      updatedAt: user.updatedAt!,
    }));

    return {
      data: userDtos,
      meta: result.meta,
    };
  }
}
