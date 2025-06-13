import { AppError } from './app-error';

export class UserAlreadyExistsError extends AppError {
  constructor(message: string = 'User already exists') {
    super(message, 400, 'USER_ALREADY_EXISTS');
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message: string = 'Invalid credentials') {
    super(message, 401, 'INVALID_CREDENTIALS');
  }
}
