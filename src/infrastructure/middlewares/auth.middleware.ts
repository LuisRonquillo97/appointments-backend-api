// src/infrastructure/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../domain/services/auth.service';

// Define a custom interface that extends Request
export interface RequestWithUser extends Request {
  user: any;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        data: null,
        error: 'Unauthorized: No token provided',
        timestamp: new Date().toISOString(),
        statusCode: 401,
      });
      return; // Return without calling next()
    }

    const token = authHeader.split(' ')[1];
    const authService = new AuthService();

    const decoded = authService.verifyToken(token);

    // Use type assertion to assign to user property
    (req as RequestWithUser).user = decoded;

    next(); // Call next() to proceed to the next middleware
  } catch (error) {
    res.status(401).json({
      success: false,
      data: null,
      error: 'Unauthorized: Invalid token',
      timestamp: new Date().toISOString(),
      statusCode: 401,
    });
    // Don't call next() here, as we've already sent a response
  }
};
