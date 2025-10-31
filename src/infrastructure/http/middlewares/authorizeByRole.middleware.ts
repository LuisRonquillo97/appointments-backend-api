// src/infrastructure/http/middlewares/authorize.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../../domain/valueObjects/userRole';
import { ApiResponseFormatter } from '../utils/apiResponse';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: UserRole; // <- Agregar role al tipo
  };
}

/**
 * Authorization middleware that checks if user has required roles.
 * @param allowedRoles Array of roles that can access the endpoint
 * @returns Express middleware function
 */
export const authorizeByRole = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ApiResponseFormatter.format(res, 'ERROR_401_UNAUTHORIZED', {}, [
        'Authentication required',
      ]);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return ApiResponseFormatter.format(res, 'ERROR_403_FORBIDDEN', {}, [
        'You are not allowed to perform this action.',
      ]);
    }

    next();
  };
};
