// src/infrastructure/di/container.ts
import { DataSource } from 'typeorm';
import { UserRepository } from '../../domain/repositories/user.repository';
import { TypeORMUserRepository } from '../repositories/typeORMUserRepository';
import { CreateUserUseCase } from '../../application/useCases/user/createUser';
import { GetUserUseCase } from '../../application/useCases/user/getUser';
import { ListUsersUseCase } from '../../application/useCases/user/listUsers';
import { UpdateUserUseCase } from '../../application/useCases/user/updateUser';
import { DeleteUserUseCase } from '../../application/useCases/user/deleteUser';
import { UserApiAdapter } from '../adapters/api/userApiAdapter';

export class Container {
  private static instance: Container;
  private services: Map<string, any> = new Map();

  private constructor(dataSource: DataSource) {
    // Initialize repositories
    this.services.set('UserRepository', new TypeORMUserRepository(dataSource));

    // Initialize use cases
    this.services.set('CreateUserUseCase', new CreateUserUseCase(this.get('UserRepository')));
    this.services.set('GetUserUseCase', new GetUserUseCase(this.get('UserRepository')));
    this.services.set('ListUsersUseCase', new ListUsersUseCase(this.get('UserRepository')));
    this.services.set('UpdateUserUseCase', new UpdateUserUseCase(this.get('UserRepository')));
    this.services.set('DeleteUserUseCase', new DeleteUserUseCase(this.get('UserRepository')));

    // Initialize adapters
    this.services.set(
      'UserApiAdapter',
      new UserApiAdapter(
        this.get('CreateUserUseCase'),
        this.get('GetUserUseCase'),
        this.get('ListUsersUseCase'),
        this.get('UpdateUserUseCase'),
        this.get('DeleteUserUseCase'),
      ),
    );
  }

  static initialize(dataSource: DataSource): void {
    Container.instance = new Container(dataSource);
  }

  static getInstance(): Container {
    if (!Container.instance) {
      throw new Error('Container not initialized. Call initialize first.');
    }
    return Container.instance;
  }

  get<T>(serviceName: string): T {
    if (!this.services.has(serviceName)) {
      throw new Error(`Service ${serviceName} not found in container`);
    }
    return this.services.get(serviceName) as T;
  }
}
