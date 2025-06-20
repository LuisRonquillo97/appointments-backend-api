import { DomainEvent } from '../../domain/events/domainEvent';
import { EventBus, EventHandler } from '../../domain/events/eventBus';

export class InMemoryEventBus implements EventBus {
  private handlers: Map<string, EventHandler<any>[]> = new Map();

  async publish<T extends DomainEvent>(event: T): Promise<void> {
    const eventHandlers = this.handlers.get(event.eventName) || [];

    for (const handler of eventHandlers) {
      await handler.handle(event);
    }
  }

  subscribe<T extends DomainEvent>(eventName: string, handler: EventHandler<T>): void {
    const handlers = this.handlers.get(eventName) || [];
    handlers.push(handler);
    this.handlers.set(eventName, handlers);
  }
}
