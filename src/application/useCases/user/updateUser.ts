import { UserDtoMapper } from '../../mappers/UserDtoMapper';
import { Email } from '../../../domain/valueObjects/email';
import { Password } from '../../../domain/valueObjects/password';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UpdateUserDto, UserResponseDto } from '../../dtos/UserDto';
import { EventBus } from '../../../domain/events/eventBus';
import { UserService } from '../../../domain/services/userService';
import { UserUpdatedEvent } from '../../../domain/events/userEvents';
import { UserNotFoundError, UserUpdatingError } from '../../errors/userAppErrors';
import { DomainError } from '../../../domain/errors/domainError';
import { AppError } from '../../errors/appError';
import { Logger } from '../../../domain/ports/logger';
import { Role } from '../../../domain/valueObjects/userRole';

/**
 * Update user Use Case.
 */
export class UpdateUserUseCase {
  /**
   * Constructor.
   * @param userRepository User repository.
   * @param userService User service.
   * @param eventBus Event bus for events.
   * @param logger Logger.
   */
  constructor(
    private userRepository: UserRepository,
    private userService: UserService,
    private eventBus: EventBus,
    private logger: Logger,
  ) {}

  /**
   * Updates the provided User ID.
   * @param id User ID to search
   * @param userData Data to be updated.
   * @returns User updated.
   * @throws UserNotFoundError if the user was not found.
   * @throws UserUpdatingError if the user could not be updated.
   */
  async execute(id: string, userData: UpdateUserDto): Promise<UserResponseDto> {
    try {
      // 1. Get user
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new UserNotFoundError(id);
      }

      // 2. Apply domain changes
      if (userData.name !== undefined) {
        existingUser.updateName(userData.name);
      }

      if (userData.email !== undefined && userData.email !== existingUser.email.toString()) {
        await this.userService.validateUniqueEmailForUpdate(userData.email, id);
        existingUser.updateEmail(new Email(userData.email));
      }

      if (userData.password !== undefined) {
        const newPassword = Password.create(userData.password);
        existingUser.updatePassword(newPassword);
      }

      if (userData.role !== undefined) {
        existingUser.updateRole(Role.create(userData.role));
      }

      // 3. Save changes
      const updatedUser = await this.userRepository.update(id, existingUser);
      if (!updatedUser) {
        throw new UserNotFoundError(id);
      }
      // Publish update user
      await this.eventBus.publish(new UserUpdatedEvent(updatedUser));

      this.logger.info(`User ${id} updated successfully`);
      return UserDtoMapper.toResponseDto(updatedUser);
    } catch (error: any) {
      if (error instanceof DomainError || error instanceof AppError) {
        throw error;
      }
      throw new UserUpdatingError(`Failed to update user: ${error.message}`);
    }
  }
}
