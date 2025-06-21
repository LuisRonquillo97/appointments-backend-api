import { DomainEvent } from '../../domain/events/domainEvent';
import { EventBus, EventHandler } from '../../domain/events/eventBus';

/**
 * In memory event bus implementation. Also implements EventBus.
 */
export class InMemoryEventBus implements EventBus {
  private handlers: Map<string, EventHandler<any>[]> = new Map();

  /**
   * Publish an in memory event.
   * @param event Event to publish.
   * @returns Promise<void>
   */
  async publish<T extends DomainEvent>(event: T): Promise<void> {
    const eventHandlers = this.handlers.get(event.eventName) || [];

    for (const handler of eventHandlers) {
      await handler.handle(event);
    }
  }

  /**
   * Subscribes to an specific event.
   */
  subscribe<T extends DomainEvent>(eventName: string, handler: EventHandler<T>): void {
    const handlers = this.handlers.get(eventName) || [];
    handlers.push(handler);
    this.handlers.set(eventName, handlers);
  }
}
