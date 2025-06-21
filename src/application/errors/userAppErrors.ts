import { AppError } from './appError';
/**
 * User not found application layer error. Extends from AppError.
 */
export class UserNotFoundError extends AppError {
  constructor(id: string) {
    super(`User with id ${id} not found`);
    this.name = 'UserNotFoundError';
  }
}

/**
 * User deleting on application layer error. Extends from AppError.
 */
export class UserDeletionError extends AppError {
  constructor(id: string) {
    super(`Error deleting user with id ${id}`);
    this.name = 'UserDeletionError';
  }
}

/**
 * User creating on application layer error. Extends from AppError.
 */
export class UserCreationError extends AppError {
  constructor(message: string) {
    super(message, 500);
    this.name = 'UserCreationError';
  }
}

/**
 * User updating on application layer error. Extends from AppError.
 */
export class UserUpdatingError extends AppError {
  constructor(message: string) {
    super(message, 500);
    this.name = 'UserUpdatingError';
  }
}

/**
 * User fetching on application layer error. Extends from AppError.
 */
export class UserFetchError extends AppError {
  constructor(message: string) {
    super(message, 500);
    this.name = 'UserFetchError';
  }
}
