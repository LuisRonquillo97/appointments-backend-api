import { body, param } from 'express-validator';

/**
 * Validation rules for creating a user
 */
export const createUserValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

/**
 * Validation rules for an ID
 */
export const idValidator = [
  param('id')
    .notEmpty()
    .withMessage('Id is required')
    .isUUID()
    .withMessage('Id must be a valid UUID'),
];

/**
 * Validation rules for updating a user
 */
export const updateUserValidator = [
  param('id')
    .notEmpty()
    .withMessage('Id is required')
    .isUUID()
    .withMessage('Id must be a valid UUID'),
  body('name').optional().notEmpty().withMessage('Name is required'),
  body('email').optional().isEmail().withMessage('Must be a valid email'),
  body('role').optional().notEmpty().withMessage('Role is required'),
  body('password')
    .optional()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body().custom((body) => {
    const allowedFields = ['name', 'email', 'password', 'role'];
    const receivedFields = Object.keys(body);

    const invalidFields = receivedFields.filter((field) => !allowedFields.includes(field));
    if (invalidFields.length > 0) {
      throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
    }
    return true;
  }),
];

/**
 * Validation rules for user login
 */
export const loginUserValidator = [
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const refreshTokenValidator = [body('token').notEmpty().withMessage('Token is required')];
