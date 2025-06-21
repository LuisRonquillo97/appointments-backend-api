import { DomainError } from './domainError';

/**
 * Invalid user data error. Extends from domain error.
 */
export class InvalidUserDataError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * User not found error. Extends from domain error.
 */
export class UserNotFoundError extends DomainError {
  constructor(id: string) {
    super(`User with id ${id} not found`);
  }
}

/**
 * User email already exists error. Extends from domain error.
 */
export class EmailAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
  }
}

/**
 * User already deleted error. Extends from domain error.
 */
export class UserAlreadyDeletedError extends DomainError {
  constructor(id: string) {
    super(`User with id ${id} is already deleted`);
  }
}
