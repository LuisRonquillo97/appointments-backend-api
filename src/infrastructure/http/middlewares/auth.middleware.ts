import { Request, Response, NextFunction } from 'express';
import { Container } from '../../di/container';
import { TokenPort } from '../../../domain/ports/tokenPort';
import { ApiResponseFormatter } from '../utils/apiResponse';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return ApiResponseFormatter.format(res, 'ERROR_401_UNAUTHORIZED', {}, [
      'Access token required',
    ]);
  }

  try {
    const container = Container.getInstance();
    const tokenPort = container.get<TokenPort>('TokenPort');

    const decoded = tokenPort.verifyToken(token);

    if (!decoded) {
      return ApiResponseFormatter.format(res, 'ERROR_401_UNAUTHORIZED', {}, [
        'Invalid or expired token',
      ]);
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch (error) {
    return ApiResponseFormatter.format(res, 'ERROR_401_UNAUTHORIZED', {}, ['Invalid token']);
  }
};
