import { AppError } from './app-error';

export class ParentNotFoundError extends AppError {
  constructor(message: string = 'Parent not found') {
    super(message, 404, 'PARENT_NOT_FOUND');
  }
}

export class UserNotFoundError extends AppError {
  constructor(message: string = 'User not found') {
    super(message, 404, 'USER_NOT_FOUND');
  }
}

export class ParentAlreadyExistsError extends AppError {
  constructor(message: string = 'Parent already exists for this user') {
    super(message, 400, 'PARENT_ALREADY_EXISTS');
  }
}
