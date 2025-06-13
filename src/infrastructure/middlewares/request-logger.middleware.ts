import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../domain/services/logger.service';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const logger = new Logger();

  // Create a sanitized version of the body (remove sensitive data)
  const sanitizedBody = { ...req.body };
  if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';

  // Log the request
  logger.info(
    `${req.method} ${req.originalUrl} - Request params: ${JSON.stringify(req.params)} - Query: ${JSON.stringify(req.query)} - Body: ${JSON.stringify(sanitizedBody)}`
  );

  // Track response time
  const startTime = Date.now();

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(
      `${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Duration: ${duration}ms`
    );
  });

  next();
};
