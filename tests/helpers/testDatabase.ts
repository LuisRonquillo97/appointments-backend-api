import { DataSource } from 'typeorm';
import { Container } from '../../src/infrastructure/di/container';
import { UserEntity } from '../../src/infrastructure/entities/user.entity';
import { EventEntity } from '../../src/infrastructure/entities/event.entity';
import { UserRepositoryImpl } from '../../src/infrastructure/repositories/userRepositoryImpl';
import { EventBus } from '../../src/domain/events/eventBus';
import { Logger } from '../../src/domain/ports/logger';
import { UserService } from '../../src/domain/services/userService';
import { CreateUserUseCase } from '../../src/application/useCases/user/createUser';
import { GetUserUseCase } from '../../src/application/useCases/user/getUser';
import { ListUsersUseCase } from '../../src/application/useCases/user/listUsers';
import { UpdateUserUseCase } from '../../src/application/useCases/user/updateUser';
import { DeleteUserUseCase } from '../../src/application/useCases/user/deleteUser';
import { UserApiAdapter } from '../../src/infrastructure/adapters/api/userApiAdapter';

class TestDatabase {
  private mockContainer: MockContainer;

  constructor() {
    this.mockContainer = new MockContainer();
  }

  async connect(): Promise<void> {
    // No-op para tests
  }

  async disconnect(): Promise<void> {
    // No-op para tests
  }

  async clear(): Promise<void> {
    // No-op para tests
  }

  getContainer(): Container {
    return this.mockContainer as unknown as Container;
  }

  getDataSource(): DataSource {
    return null as unknown as DataSource;
  }
}

class MockContainer {
  private services: Map<string, any> = new Map();

  constructor() {
    // Mock logger
    const mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    };
    this.services.set('Logger', mockLogger);

    // Mock repository
    const mockUserRepository = {
      create: jest.fn().mockImplementation(async (user) => {
        return {
          ...user,
          id: '123',
        };
      }),
      findById: jest.fn(),
      findAll: jest.fn().mockResolvedValue([]),
      update: jest.fn(),
      delete: jest.fn(),
      findByEmail: jest.fn().mockResolvedValue(null),
    };
    this.services.set('UserRepository', mockUserRepository);

    // Mock event bus
    const mockEventBus = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    };
    this.services.set('EventBus', mockEventBus);

    // Mock user service
    const mockUserService = {
      validateUniqueEmail: jest.fn().mockResolvedValue(undefined),
    };
    this.services.set('UserService', mockUserService);

    // Mock use cases
    const createUserUseCase = new CreateUserUseCase(
      mockUserRepository,
      mockUserService as unknown as UserService,
      mockEventBus as unknown as EventBus,
      mockLogger as unknown as Logger,
    );
    this.services.set('CreateUserUseCase', createUserUseCase);

    const getUserUseCase = { execute: jest.fn() };
    this.services.set('GetUserUseCase', getUserUseCase);

    const listUsersUseCase = { execute: jest.fn().mockResolvedValue([]) };
    this.services.set('ListUsersUseCase', listUsersUseCase);

    const updateUserUseCase = { execute: jest.fn() };
    this.services.set('UpdateUserUseCase', updateUserUseCase);

    const deleteUserUseCase = { execute: jest.fn() };
    this.services.set('DeleteUserUseCase', deleteUserUseCase);

    // Mock API adapter
    const userApiAdapter = new UserApiAdapter(
      createUserUseCase,
      getUserUseCase as unknown as GetUserUseCase,
      listUsersUseCase as unknown as ListUsersUseCase,
      updateUserUseCase as unknown as UpdateUserUseCase,
      deleteUserUseCase as unknown as DeleteUserUseCase,
    );
    this.services.set('UserApiAdapter', userApiAdapter);
  }

  get<T>(serviceName: string): T {
    if (!this.services.has(serviceName)) {
      throw new Error(`Service ${serviceName} not found in container`);
    }
    return this.services.get(serviceName) as T;
  }
}

export const testDatabase = new TestDatabase();
