// src/infrastructure/database/datasource.ts
import { DataSource } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { EventEntity } from '../entities/event.entity';
import config from '../../config';

const { options } = config.database;

export const AppDataSource = new DataSource({
  ...options,
  synchronize: false, // Desactivar sincronización automática
  entities: [UserEntity, EventEntity],
  migrations: [__dirname + '/migrations/**/*.{js,ts}'],
  migrationsRun: true, // Ejecutar migraciones automáticamente
  migrationsTableName: 'migrations', // Nombre de la tabla de migraciones
});
