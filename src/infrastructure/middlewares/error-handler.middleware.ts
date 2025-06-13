// src/infrastructure/middlewares/error-handler.middleware.ts
import { ErrorRequestHandler } from 'express';
import { AppError } from '../../domain/errors/app-error';
import { ResponseUtil } from '../utils/response.util';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof AppError) {
    ResponseUtil.error(res, err.message, err.statusCode);
  } else {
    // Handle unexpected errors
    ResponseUtil.error(res, 'An unexpected error occurred', 500);
  }
};
