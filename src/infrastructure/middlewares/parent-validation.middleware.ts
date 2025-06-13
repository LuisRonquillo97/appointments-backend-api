// src/infrastructure/middlewares/parent-validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { ResponseUtil } from '../utils/response.util';
import { States } from '../../domain/enums/states.enum';

export const validateCreateParent = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters'),
  body('addressLine1').notEmpty().withMessage('Address line 1 is required'),
  body('zipCode').notEmpty().withMessage('Zip code is required'),
  body('houseNumber').notEmpty().withMessage('House number is required'),
  body('neighborhood').notEmpty().withMessage('Neighborhood is required'),
  body('state')
    .notEmpty()
    .withMessage('State is required')
    .isIn(Object.values(States))
    .withMessage('Invalid state'),
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isInt()
    .withMessage('User ID must be an integer'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Format errors as an array of objects
      const formattedErrors = errors.array().map((error) => {
        const errorObj = error as any;
        return {
          field: errorObj.path || errorObj.param,
          message: errorObj.msg,
        };
      });

      res.status(400).json({
        success: false,
        data: null,
        errors: formattedErrors,
        message: 'Validation failed',
        timestamp: new Date().toISOString(),
        statusCode: 400,
      });
    }
    next();
  },
];

export const validateUpdateParent = [
  param('id').isInt().withMessage('Parent ID must be an integer'),
  body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('lastName')
    .optional()
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters'),
  body('state').optional().isIn(Object.values(States)).withMessage('Invalid state'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseUtil.validationError(res, errors.array());
    }
    next();
  },
];

export const validateParentId = [
  param('id').isInt().withMessage('Parent ID must be an integer'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseUtil.validationError(res, errors.array());
    }
    next();
  },
];

export const validateUserId = [
  param('userId').isInt().withMessage('User ID must be an integer'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseUtil.validationError(res, errors.array());
    }
    next();
  },
];

export const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseUtil.validationError(res, errors.array());
    }
    next();
  },
];
