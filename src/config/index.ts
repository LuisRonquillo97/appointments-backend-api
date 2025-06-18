// src/config/index.ts
import dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';

dotenv.config();

interface Config {
  server: {
    port: number;
    nodeEnv: string;
  };
  database: {
    options: DataSourceOptions;
  };
  auth: {
    jwtSecret: string;
    jwtExpiresIn: string;
  };
}

const config: Config = {
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  database: {
    options: {
      type: (process.env.DB_TYPE || 'mysql') as any,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'appointments',
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      logging: process.env.DB_LOGGING === 'true',
      entities: ['src/infrastructure/entities/**/*.ts'],
      migrations: ['src/infrastructure/database/migrations/**/*.ts'],
    },
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
};

export default config;
