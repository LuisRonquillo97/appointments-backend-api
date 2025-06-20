import { DomainEvent } from '../../domain/events/domainEvent';
import { EventBus, EventHandler } from '../../domain/events/eventBus';
import { EventStore } from '../../domain/repositories/eventStore';

export class PersistentEventBus implements EventBus {
  private handlers: Map<string, EventHandler<any>[]> = new Map();

  constructor(private eventStore: EventStore) {}

  async publish<T extends DomainEvent>(event: T): Promise<void> {
    // Guardar el evento en el almacén
    await this.eventStore.saveEvent(event);

    // Distribuir el evento a los manejadores
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
