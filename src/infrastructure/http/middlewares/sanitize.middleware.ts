import { Request, Response, NextFunction } from 'express';

export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Remover campos potencialmente peligrosos
  const dangerousFields = ['__proto__', 'constructor', 'prototype'];

  const sanitizeObject = (obj: any): any => {
    if (obj && typeof obj === 'object') {
      for (const key of dangerousFields) {
        delete obj[key];
      }

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          obj[key] = sanitizeObject(obj[key]);
        }
      }
    }
    return obj;
  };

  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);

  next();
};
