import { Request, Response, NextFunction } from 'express';
import { ApiResponseFormatter } from '../utils/apiResponse';

export const validateContentType = (req: Request, res: Response, next: NextFunction) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.get('Content-Type');

    if (!contentType || !contentType.includes('application/json')) {
      return ApiResponseFormatter.format(res, 'ERROR_400_BADREQUEST', {}, [
        'Content-Type must be application/json',
      ]);
    }
  }
  next();
};
