// src/infrastructure/http/server.ts
import express from 'express';
import cors from 'cors';
import { createRoutes } from './routes';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { Container } from '../di/container';

export const createServer = (container: Container) => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes - Pasar el contenedor inicializado
  app.use('/api/v2', createRoutes(container));

  // Error handling
  app.use(errorHandler);

  return app;
};
