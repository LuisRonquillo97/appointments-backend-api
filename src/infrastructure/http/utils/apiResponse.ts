import { Response } from 'express';
import { ResponseCode, ResponseCodes } from '../constants/responseCodes';

export interface ApiResponse<T> {
  code: string;
  message: string;
  success: boolean;
  errors: string[];
  data: T;
}

export class ApiResponseFormatter {
  static format<T>(
    res: Response,
    responseCode: keyof typeof ResponseCodes,
    data: T = {} as T,
    errors: string[] = [],
  ): Response {
    const { code, message, success } = ResponseCodes[responseCode];

    const response: ApiResponse<T> = {
      code,
      message,
      success,
      errors,
      data,
    };

    // Determinar el código de estado HTTP basado en el código de respuesta
    let statusCode = 200;
    if (code.includes('201')) statusCode = 201;
    if (code.includes('204')) statusCode = 204;
    if (code.includes('400')) statusCode = 400;
    if (code.includes('401')) statusCode = 401;
    if (code.includes('403')) statusCode = 403;
    if (code.includes('404')) statusCode = 404;
    if (code.includes('409')) statusCode = 409;
    if (code.includes('500')) statusCode = 500;

    return res.status(statusCode).json(response);
  }
}
