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

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private userService: UserService,
    private eventBus: EventBus,
    private logger: Logger,
  ) {}

  async execute(userData: CreateUserDto): Promise<UserResponseDto> {
    try {
      await this.userService.validateUniqueEmail(userData.email);

      const email = new Email(userData.email);
      const password = Password.create(userData.password);

      const user = new User({
        name: userData.name,
        email: email,
        password: password,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const createdUser = await this.userRepository.create(user);
      await this.eventBus.publish(new UserCreatedEvent(createdUser));

      this.logger.info(`User ${createdUser.id} created successfully`);
      return UserDtoMapper.toResponseDto(createdUser);
    } catch (error: any) {
      if (error instanceof DomainError || error instanceof AppError) {
        throw error;
      }
      throw new UserCreationError(`Failed to create user: ${error.message}`);
    }
  }
}
