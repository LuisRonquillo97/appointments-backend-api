// src/domain/errors/userErrors.ts
import { DomainError } from './domainError';

export class UserNotFoundError extends DomainError {
  constructor(id: string) {
    super(`User with id ${id} not found`);
  }
}

export class InvalidUserDataError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class EmailAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
  }
}
