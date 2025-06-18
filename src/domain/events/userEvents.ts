// src/domain/events/userEvents.ts
import { DomainEvent } from './domainEvent';
import { User } from '../entities/user';

export class UserCreatedEvent implements DomainEvent {
  readonly eventName = 'user.created';
  readonly occurredOn: Date;

  constructor(public readonly user: User) {
    this.occurredOn = new Date();
  }
}

export class UserUpdatedEvent implements DomainEvent {
  readonly eventName = 'user.updated';
  readonly occurredOn: Date;

  constructor(public readonly user: User) {
    this.occurredOn = new Date();
  }
}

export class UserDeletedEvent implements DomainEvent {
  readonly eventName = 'user.deleted';
  readonly occurredOn: Date;

  constructor(public readonly userId: string) {
    this.occurredOn = new Date();
  }
}
