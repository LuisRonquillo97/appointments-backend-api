// src/lambda.ts
import 'reflect-metadata';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import { createServer } from './infrastructure/http/server';
import { AppDataSource } from './infrastructure/database/datasource';

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

// Lambda handler
export const handler = serverless(app, {
  async request(request, event, context) {
    // Cold start - initialize DB connection
    await initializeDb();
    context.callbackWaitsForEmptyEventLoop = false;
  }
});
