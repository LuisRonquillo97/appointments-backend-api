import { UserRepository } from '../../../domain/repositories/user.repository';
import { EventBus } from '../../../domain/events/eventBus';
import { UserDeletedEvent } from '../../../domain/events/userEvents';
import { UserDeletionError, UserNotFoundError } from '../../errors/userAppErrors';
import { DomainError } from '../../../domain/errors/domainError';
import { AppError } from '../../errors/appError';
import { Logger } from '../../../domain/ports/logger';

/**
 * Delete user Use Case.
 */
export class DeleteUserUseCase {
  /**
   * Contructor.
   * @param userRepository User Repository.
   * @param eventBus Event bus for events.
   * @param logger Logger.
   */
  constructor(
    private userRepository: UserRepository,
    private eventBus: EventBus,
    private logger: Logger,
  ) {}

  /**
   * Executes the use case.
   * @param id User id.
   * @param softDelete Soft delete flag.
   * @returns True if the user was deleted, false otherwise.
   * @throws UserNotFoundError if the user was not found.
   * @throws UserDeletionError if the user could not be deleted.
   */
  async execute(id: string, softDelete: boolean = true): Promise<boolean> {
    try {
      const result = await this.userRepository.delete(id, softDelete);
      if (!result) {
        throw new UserNotFoundError(id);
      }
      try {
        await this.eventBus.publish(new UserDeletedEvent(id));
        this.logger.info(`User ${id} ${softDelete ? 'soft' : 'hard'} deleted successfully`);
      } catch (error: any) {
        this.logger.error(`Failed to publish UserDeletedEvent: ${error.message}`);
      }

      return result;
    } catch (error: any) {
      this.logger.error(`Failed to delete user: ${error.message}`);
      if (error instanceof DomainError || error instanceof AppError) {
        throw error;
      }
      throw new UserDeletionError(`Failed to create user: ${error.message}`);
    }
  }
}
