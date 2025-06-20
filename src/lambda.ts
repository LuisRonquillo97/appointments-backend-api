import 'reflect-metadata';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import { createServer } from './infrastructure/http/server';
import { AppDataSource } from './infrastructure/database/datasource';
import { Request } from 'express';

dotenv.config();

// Initialize database connection
let isDbConnected = false;

const initializeDb = async () => {
  if (!isDbConnected) {
    try {
      await AppDataSource.initialize();
      console.log('Database connected');
      isDbConnected = true;
    } catch (error) {
      console.error('Error connecting to database:', error);
      throw error;
    }
  }
};

// Create Express app
const app = createServer();

// Define tipos básicos para los parámetros
interface LambdaContext {
  callbackWaitsForEmptyEventLoop: boolean;
  [key: string]: any;
}

// Lambda handler
export const handler = serverless(app, {
  async request(request: Request, event: any, context: LambdaContext) {
    // Cold start - initialize DB connection
    await initializeDb();
    context.callbackWaitsForEmptyEventLoop = false;
  },
});
