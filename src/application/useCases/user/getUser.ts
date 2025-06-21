import { DomainError } from '../../../domain/errors/domainError';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserResponseDto } from '../../dtos/UserDto';
import { AppError } from '../../errors/appError';
import { UserFetchError, UserNotFoundError } from '../../errors/userAppErrors';
import { UserDtoMapper } from '../../mappers/UserDtoMapper';

/**
 * Get user Use Case.
 */
export class GetUserUseCase {
  /**
   * User repository.
   */
  private userRepository: UserRepository;
  /**
   * Constructor.
   * @param userRepository User repository.
   */
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Executes the use case.
   * @param id User id.
   * @returns User response DTO.
   * @throws UserNotFoundError if the user was not found.
   * @throws UserFetchError if the user could not be fetched.
   */
  async execute(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new UserNotFoundError(id);
      }
      return UserDtoMapper.toResponseDto(user);
    } catch (error: any) {
      if (error instanceof DomainError || error instanceof AppError) {
        throw error;
      }
      throw new UserFetchError(`Failed to fetch user: ${error.message}`);
    }
  }
}
