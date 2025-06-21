import { UserDtoMapper } from '../../mappers/UserDtoMapper';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { PaginationOptions, PaginatedResult } from '../../../domain/types/pagination';
import { UserResponseDto } from '../../dtos/UserDto';
import { UserFetchError } from '../../errors/userAppErrors';
import { DomainError } from '../../../domain/errors/domainError';
import { AppError } from '../../errors/appError';

/**
 * List users Use Case.
 */
export class ListUsersUseCase {
  /**
   * User repsitory.
   */
  private userRepository: UserRepository;

  /**
   * constructor.
   * @param userRepository User repository.
   */
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Gets a paginated list of active users.
   * @param options Pagination options
   * @returns Paginated list of active users.
   * @throws UserFetchError if the users could not be fetched.
   */
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
