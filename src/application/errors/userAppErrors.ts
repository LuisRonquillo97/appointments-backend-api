import { AppError } from './appError';

export class UserNotFoundError extends AppError {
  constructor(id: string) {
    super(`User with id ${id} not found`);
    this.name = 'UserNotFoundError';
  }
}

export class UserDeletionError extends AppError {
  constructor(id: string) {
    super(`Error deleting user with id ${id}`);
    this.name = 'UserDeletionError';
  }
}

export class UserCreationError extends AppError {
  constructor(message: string) {
    super(message, 500); // Error 500 para problemas técnicos
    this.name = 'UserCreationError';
  }
}

export class UserUpdatingError extends AppError {
  constructor(message: string) {
    super(message, 500); // Error 500 para problemas técnicos
    this.name = 'UserUpdatingError';
  }
}

export class UserFetchError extends AppError {
  constructor(message: string) {
    super(message, 500);
    this.name = 'UserFetchError';
  }
}
