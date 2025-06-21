import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../../domain/errors/domainError';
import {
  UserNotFoundError,
  InvalidUserDataError,
  EmailAlreadyExistsError,
} from '../../../domain/errors/userErrors';

/**
 * Error handler.
 * Determinates what are going to do with some specific errors.
 * @param error Error to handle.
 * @param req Request
 * @param res Response
 * @param next Next function to execute.
 * @returns
 */
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error);

  if (error instanceof DomainError) {
    if (error instanceof UserNotFoundError) {
      return res.status(404).json({ message: error.message });
    }

    if (error instanceof InvalidUserDataError) {
      return res.status(400).json({ message: error.message });
    }

    if (error instanceof EmailAlreadyExistsError) {
      return res.status(409).json({ message: error.message });
    }

    return res.status(400).json({ message: error.message });
  }

  return res.status(500).json({ message: 'Internal server error' });
};
