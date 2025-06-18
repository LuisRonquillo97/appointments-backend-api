// src/infrastructure/adapters/api/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../../domain/errors/domainError';
import {
  UserNotFoundError,
  InvalidUserDataError,
  EmailAlreadyExistsError,
} from '../../../domain/errors/userErrors';

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
