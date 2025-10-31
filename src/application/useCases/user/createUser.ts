import { UserDtoMapper } from '../../mappers/UserDtoMapper';
import { User } from '../../../domain/entities/user';
import { Email } from '../../../domain/valueObjects/email';
import { Password } from '../../../domain/valueObjects/password';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserService } from '../../../domain/services/userService';
import { CreateUserDto, UserResponseDto } from '../../dtos/UserDto';
import { EventBus } from '../../../domain/events/eventBus';
import { UserCreatedEvent } from '../../../domain/events/userEvents';
import { DomainError } from '../../../domain/errors/domainError';
import { AppError } from '../../errors/appError';
import { UserCreationError } from '../../errors/userAppErrors';
import { Logger } from '../../../domain/ports/logger';
import { Role, UserRole } from '../../../domain/valueObjects/userRole';

/**
 * Use case for creating a new user.
 */
export class CreateUserUseCase {
  /**
   * Constructor for the CreateUserUseCase class.
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
   * Runs the create use case.
   * @param userData User data.
   * @returns UserResponseDto
   * @throws UserCreationError if user creation fails.
   * @throws EmailAlreadyExistsError if the provided email is already in use.
   */
  async execute(userData: CreateUserDto): Promise<UserResponseDto> {
    try {
      await this.userService.validateUniqueEmail(userData.email);

      const email = new Email(userData.email);
      const password = Password.create(userData.password);

      const user = new User({
        name: userData.name.trim(),
        email: email,
        password: password,
        role: Role.create(userData.role ?? UserRole.USER),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const createdUser = await this.userRepository.create(user);
      try {
        await this.eventBus.publish(new UserCreatedEvent(createdUser));
      } catch (error: any) {
        this.logger.error(`Failed to publish on Event bus - Create user: ${error.message}`);
      }

      this.logger.info(`User ${createdUser.id} created successfully`);
      return UserDtoMapper.toResponseDto(createdUser);
    } catch (error: any) {
      const message = `Failed to create user: ${error.message}`;
      this.logger.error(message);
      if (error instanceof DomainError || error instanceof AppError) {
        throw error;
      }

      throw new UserCreationError(message);
    }
  }
}
