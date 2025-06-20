import { DomainEvent } from '../events/domainEvent';

export interface EventStore {
  saveEvent<T extends DomainEvent>(event: T): Promise<void>;
  getEvents(aggregateId?: string): Promise<DomainEvent[]>;
}
