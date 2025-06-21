import { EventHandler } from '../../domain/events/eventBus';
import {
  UserCreatedEvent,
  UserUpdatedEvent,
  UserDeletedEvent,
} from '../../domain/events/userEvents';

/**
 * User created event handler. Logs the event to the console.
 * @param event UserCreatedEvent
 */
export class LogUserCreatedHandler implements EventHandler<UserCreatedEvent> {
  async handle(event: UserCreatedEvent): Promise<void> {
    console.log(
      `User created: ${event.user.id} - ${event.user.email.toString()} at ${event.occurredOn}`,
    );
  }
}

/**
 * User updated event handler. Logs the event to the console.
 * @param event UserUpdatedEvent
 */
export class LogUserUpdatedHandler implements EventHandler<UserUpdatedEvent> {
  async handle(event: UserUpdatedEvent): Promise<void> {
    console.log(
      `User updated: ${event.user.id} - ${event.user.email.toString()} at ${event.occurredOn}`,
    );
  }
}

/**
 * User deleted event handler. Logs the event to the console.
 * @param event UserDeletedEvent
 */
export class LogUserDeletedHandler implements EventHandler<UserDeletedEvent> {
  async handle(event: UserDeletedEvent): Promise<void> {
    console.log(`User deleted: ${event.userId} at ${event.occurredOn}`);
  }
}
