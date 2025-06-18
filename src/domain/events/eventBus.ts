import { DomainEvent } from './domainEvent';

export interface EventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}
export interface EventBus {
  publish<T extends DomainEvent>(event: T): Promise<void>;
  subscribe<T extends DomainEvent>(eventName: string, handler: EventHandler<T>): void;
}
