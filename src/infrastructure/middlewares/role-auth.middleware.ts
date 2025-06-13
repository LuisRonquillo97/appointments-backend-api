// src/infrastructure/middlewares/role-auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../domain/enums/user-role.enum';
import { RequestWithUser } from './auth.middleware';

export const requireRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // The user object should be set by the auth middleware
    const user = (req as RequestWithUser).user;

    if (!user) {
      res.status(401).json({
        success: false,
        data: null,
        error: 'Unauthorized',
        timestamp: new Date().toISOString(),
        statusCode: 401,
      });
      return; // Return without calling next()
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({
        success: false,
        data: null,
        error: 'Forbidden: Insufficient permissions',
        timestamp: new Date().toISOString(),
        statusCode: 403,
      });
      return; // Return without calling next()
    }

    next(); // Call next() to proceed to the next middleware
  };
};
