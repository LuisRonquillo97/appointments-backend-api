import { UserDtoMapper } from '../../mappers/UserDtoMapper';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { PaginationOptions, PaginatedResult } from '../../../domain/types/pagination';
import { UserResponseDto } from '../../dtos/UserDto';
import { UserFetchError } from '../../errors/userAppErrors';
import { DomainError } from '../../../domain/errors/domainError';
import { AppError } from '../../errors/appError';

export class ListUsersUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(options?: PaginationOptions): Promise<PaginatedResult<UserResponseDto>> {
    try {
      const result = await this.userRepository.findAll(options);
      const userDtos = result.records.map((user) => UserDtoMapper.toResponseDto(user));
      return {
        records: userDtos,
        meta: result.meta,
      };
    } catch (error: any) {
      if (error instanceof DomainError || error instanceof AppError) {
        throw error;
      }
      throw new UserFetchError(`Failed to fetch users: ${error.message}`);
    }
  }
}
