import 'reflect-metadata';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import { createServer } from './infrastructure/http/server';
import { AppDataSource } from './infrastructure/database/datasource';
import { Container } from './infrastructure/di/container';
import { Request } from 'express';

dotenv.config();

// Initialize database connection and container
let isDbConnected = false;
let container: Container;

/**
 * Initialize database.
 */
const initializeDb = async () => {
  if (!isDbConnected) {
    try {
      await AppDataSource.initialize();
      console.log('Database connected');

      // Initialize container after database connection
      container = Container.initialize(AppDataSource);

      isDbConnected = true;
    } catch (error) {
      console.error('Error connecting to database:', error);
      throw error;
    }
  }
};

// Create Express app with container
let app: any;

// Define tipos básicos para los parámetros
interface LambdaContext {
  callbackWaitsForEmptyEventLoop: boolean;
  [key: string]: any;
}

// Lambda handler
export const handler = serverless(
  async () => {
    // Initialize DB and container if not already done
    await initializeDb();

    // Create app if not already created
    if (!app) {
      app = createServer(container);
    }

    return app;
  },
  {
    async request(request: Request, event: any, context: LambdaContext) {
      context.callbackWaitsForEmptyEventLoop = false;
    },
  },
);
