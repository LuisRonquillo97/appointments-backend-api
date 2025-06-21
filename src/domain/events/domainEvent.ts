/**
 * Domain single event from event bus.
 */
export interface DomainEvent {
  readonly eventName: string;
  readonly occurredOn: Date;
}
