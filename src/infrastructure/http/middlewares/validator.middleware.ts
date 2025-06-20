import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from '../../../application/errors/appError';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Extraer los mensajes de error como array
    const extractedErrors = errors.array().map((err: any) => err.msg);

    // Pasar el array completo de errores
    return next(new AppError(extractedErrors, 400));
  };
};
