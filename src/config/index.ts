import dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';

dotenv.config();

/**
 * Configurations interface.
 */
interface Config {
  server: {
    port: number;
    nodeEnv: string;
    rateLimiterTimeMinutes: number;
    rateLimiterMaxRequests: number;
    allowedOrigins: string;
    bodyLimit: string;
    logFormat: string;
  };
  database: {
    options: DataSourceOptions;
  };
  auth: {
    jwtSecret: string;
    jwtExpiresIn: string;
  };
}

/**
 * Supported database types for TypeORM.
 */
type SupportedDBType = 'mysql' | 'mariadb' | 'postgres' | 'sqlite' | 'mssql';

/**
 * Config object with environment variables.
 */
const config: Config = {
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    rateLimiterTimeMinutes: parseInt(process.env.RATE_LIMITER_MINUTES || '15'),
    rateLimiterMaxRequests: parseInt(process.env.RATE_LIMITER_MAX_REQUESTS || '15'),
    allowedOrigins: process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
    bodyLimit: process.env.BODY_LIMIT || '10mb',
    logFormat: process.env.MORGAN_LOG_FORMAT || 'combined',
  },
  database: {
    options: {
      type: (process.env.DB_TYPE || 'mysql') as SupportedDBType,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'appointments',
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      logging: process.env.DB_LOGGING === 'true',
    },
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
};

export default config;
