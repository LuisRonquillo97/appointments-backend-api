import { DomainEvent } from '../events/domainEvent';

/**
 * Event store interface.
 */
export interface EventStore {
  /**
   * Save event to BD.
   * @param event Event to save.
   */
  saveEvent<T extends DomainEvent>(event: T): Promise<void>;
  /**
   * Get events from BD.
   * @param aggregateId Aggregate id.
   * @returns List of events.
   */
  getEvents(aggregateId?: string): Promise<DomainEvent[]>;
}
