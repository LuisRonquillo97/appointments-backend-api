import { DomainEvent } from './domainEvent';

/**
 * Eventhandler interface
 * @param T extends DomainEvent
 */
export interface EventHandler<T extends DomainEvent> {
  /**
   * Handle event.
   * @param event T event.
   */
  handle(event: T): Promise<void>;
}
/**
 * EventBus interface.
 */
export interface EventBus {
  /**
   * Publish an event.
   * @param event T event to publish.
   */
  publish<T extends DomainEvent>(event: T): Promise<void>;
  /**
   * Subscribe to an event.
   * @param eventName string event name to subscribe
   * @param handler EventHandler<T> event handler
   */
  subscribe<T extends DomainEvent>(eventName: string, handler: EventHandler<T>): void;
}
