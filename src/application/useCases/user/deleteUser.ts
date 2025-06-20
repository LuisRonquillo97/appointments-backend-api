import { UserRepository } from '../../../domain/repositories/user.repository';
import { EventBus } from '../../../domain/events/eventBus';
import { UserDeletedEvent } from '../../../domain/events/userEvents';
import { UserDeletionError, UserNotFoundError } from '../../errors/userAppErrors';
import { DomainError } from '../../../domain/errors/domainError';
import { AppError } from '../../errors/appError';
import { Logger } from '../../../domain/ports/logger';
export class DeleteUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private eventBus: EventBus,
    private logger: Logger,
  ) {}

  async execute(id: string, softDelete: boolean = true): Promise<boolean> {
    try {
      const result = await this.userRepository.delete(id, softDelete);
      if (!result) {
        throw new UserNotFoundError(id);
      }
      await this.eventBus.publish(new UserDeletedEvent(id));
      this.logger.info(`User ${id} ${softDelete ? 'soft' : 'hard'} deleted successfully`);
      return result;
    } catch (error: any) {
      if (error instanceof DomainError || error instanceof AppError) {
        throw error;
      }
      throw new UserDeletionError(`Failed to create user: ${error.message}`);
    }
  }
}
