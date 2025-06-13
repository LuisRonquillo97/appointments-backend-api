// src/infrastructure/middlewares/validation.middleware.ts
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '../utils/response.util';

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const validations = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
    body('name')
      .optional()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long'),
  ];

  Promise.all(validations.map((validation) => validation.run(req))).then(() => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  });
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const validations = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ];

  Promise.all(validations.map((validation) => validation.run(req))).then(() => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  });
};

export const validateCreateAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password, name } = req.body;

  const errors = [];

  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push('Valid email is required');
  }

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (errors.length > 0) {
    ResponseUtil.error(res, 'Validation failed: ' + errors.join(', '), 400);
    return;
  }

  next();
};
