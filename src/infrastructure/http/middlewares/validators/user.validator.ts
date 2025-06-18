// src/infrastructure/http/validators/userValidator.ts
import { body } from 'express-validator';

export const createUserValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Must be a valid email'),
];
