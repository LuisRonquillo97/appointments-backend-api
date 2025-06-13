import { DataSource } from 'typeorm';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'appointments',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  entities: ['src/infrastructure/entities/**/*.ts'],
  migrations: ['src/infrastructure/migrations/**/*.ts'],
  subscribers: ['src/infrastructure/subscribers/**/*.ts'],
});
