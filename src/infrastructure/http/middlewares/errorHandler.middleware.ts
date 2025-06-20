// src/infrastructure/http/middlewares/errorHandler.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../application/errors/appError';
import { DomainError } from '../../../domain/errors/domainError';
import { EmailAlreadyExistsError } from '../../../domain/errors/userErrors';
import { ApiResponseFormatter } from '../utils/apiResponse';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  // Manejar errores de aplicación
  if (err instanceof AppError) {
    let responseCode: string;

    switch (err.statusCode) {
      case 400:
        responseCode = 'ERROR_400_BADREQUEST';
        break;
      case 404:
        responseCode = 'ERROR_404_NOTFOUND';
        break;
      case 409:
        responseCode = 'ERROR_409_CONFLICT';
        break;
      default:
        responseCode = 'ERROR_500_INTERNAL';
    }

    return ApiResponseFormatter.format(res, responseCode as any, {}, err.errors || [err.message]);
  }

  // Manejar errores de dominio
  if (err instanceof DomainError) {
    let responseCode: string;
    let statusCode: number;

    // Mapear errores de dominio específicos a códigos HTTP
    if (err instanceof EmailAlreadyExistsError) {
      responseCode = 'ERROR_409_CONFLICT';
      statusCode = 409;
    } else {
      responseCode = 'ERROR_400_BADREQUEST';
      statusCode = 400;
    }

    return ApiResponseFormatter.format(res, responseCode as any, {}, [err.message]);
  }

  // Errores no manejados
  return ApiResponseFormatter.format(res, 'ERROR_500_INTERNAL', {}, ['Internal server error']);
};
