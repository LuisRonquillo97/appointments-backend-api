import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import { createRoutes } from './routes';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { sanitizeInput } from './middlewares/sanitize.middleware';
import { Container } from '../di/container';
import config from '../../config';
import { securityHeaders } from './middlewares/security.middleware';
import { ApiResponseFormatter } from './utils/apiResponse';
/**
 * Method to create a server.
 * @param container Container instance.
 * @returns Express app.
 */
export const createServer = (container: Container) => {
  const app = express();
  if (config.server.nodeEnv === 'production') {
    app.set('trust proxy', 1);
  }
  app.disable('x-powered-by');
  // Después de crear la app
  app.use((req, res, next) => {
    res.setTimeout(30000, () => {
      // 30 segundos
      return ApiResponseFormatter.format(res, 'ERROR_408_TIMEOUT', {}, ['Request timeout']);
    });
    next();
  });

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
    }),
  );

  app.use(securityHeaders);

  // Rate limiting
  const limiter = rateLimit({
    windowMs: config.server.rateLimiterTimeMinutes * 60 * 1000,
    max: config.server.rateLimiterMaxRequests,
    message: {
      code: 'ERROR_429_RATELIMIT',
      message: 'Too many requests from this IP',
      success: false,
      errors: ['Rate limit exceeded'],
      data: {},
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Compression
  app.use(compression());

  // Logging
  app.use(morgan(config.server.logFormat || 'combined'));

  // CORS configurado de manera más segura
  app.use(
    cors({
      origin: config.server.allowedOrigins?.split(',') || ['http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  // Body parsing con límites
  app.use(express.json({ limit: config.server.bodyLimit }));
  app.use(express.urlencoded({ extended: true, limit: config.server.bodyLimit }));

  // Input sanitization
  app.use(sanitizeInput);

  // Apply rate limiting
  app.use('/api', limiter);

  // Routes
  app.use('/api/v2', createRoutes(container));

  app.use('*', (req, res) => {
    return ApiResponseFormatter.format(res, 'ERROR_404_NOTFOUND', {}, [
      `Route ${req.originalUrl} not found`,
    ]);
  });

  // Error handling
  app.use(errorHandler);

  return app;
};
