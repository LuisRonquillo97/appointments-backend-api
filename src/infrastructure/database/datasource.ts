// src/infrastructure/database/dataSource.ts
import { DataSource } from 'typeorm';
import { UserEntity } from '../../infrastructure/entities/user.entity';
import config from '../../config';

export const AppDataSource = new DataSource({
  type: config.database.type as 'mysql' | 'mariadb' | 'postgres' | 'sqlite' | 'mssql',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  synchronize: config.database.synchronize,
  logging: config.database.logging,
  entities: [UserEntity],
  subscribers: [],
  migrations: [],
});
