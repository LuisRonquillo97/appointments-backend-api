// src/domain/events/domainEvent.ts
export interface DomainEvent {
  readonly eventName: string;
  readonly occurredOn: Date;
}
