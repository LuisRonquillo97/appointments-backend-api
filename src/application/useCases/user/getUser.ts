import { DomainError } from '../../../domain/errors/domainError';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserResponseDto } from '../../dtos/UserDto';
import { AppError } from '../../errors/appError';
import { UserFetchError, UserNotFoundError } from '../../errors/userAppErrors';
import { UserDtoMapper } from '../../mappers/UserDtoMapper';

export class GetUserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

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
