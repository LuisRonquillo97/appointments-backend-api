// src/infrastructure/utils/response.util.ts
import { Response } from 'express';
import { ApiResponse } from '../models/api-response.model';
import { ValidationError } from 'express-validator';

export class ResponseUtil {
  static success<T>(res: Response, data: T, statusCode: number = 200): void {
    const response: ApiResponse<T> = {
      success: true,
      data,
      error: null,
      timestamp: new Date().toISOString(),
      statusCode,
    };

    res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    error: string,
    statusCode: number = 500,
    validationErrors?: any[]
  ): void {
    const response: any = {
      success: false,
      data: null,
      error,
      timestamp: new Date().toISOString(),
      statusCode,
    };

    // Add validation errors if provided
    if (validationErrors && validationErrors.length > 0) {
      response.errors = validationErrors;
    }

    res.status(statusCode).json(response);
  }

  static validationError(res: Response, errors: any[]): void {
    const formattedErrors = errors.map((error) => {
      const errorObj = error as any;
      return {
        field: errorObj.path || errorObj.param,
        message: errorObj.msg,
      };
    });

    this.error(res, 'Validation failed', 400, formattedErrors);
  }
}
