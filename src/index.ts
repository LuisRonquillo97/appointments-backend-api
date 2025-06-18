import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import { createServer } from './infrastructure/http/server';
import { AppDataSource } from './infrastructure/database/datasource';
import config from './config';
import { seedDatabase } from './infrastructure/database/seeds';

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    // Seed the database with initial data
    await seedDatabase(AppDataSource);

    const app = createServer();
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
