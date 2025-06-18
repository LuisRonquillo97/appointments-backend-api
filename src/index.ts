// src/index.ts
import 'reflect-metadata';
import dotenv from 'dotenv';
import { createServer } from './infrastructure/http/server';
import { AppDataSource } from './infrastructure/database/datasource';
import { seedDatabase } from './infrastructure/database/seeds';
import { Container } from './infrastructure/di/container';
import config from './config';

dotenv.config();

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    // Initialize dependency injection container
    Container.initialize(AppDataSource);

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
