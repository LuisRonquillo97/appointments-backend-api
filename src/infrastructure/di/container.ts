import { DataSource } from 'typeorm';
import { UserRepositoryImpl } from '../repositories/userRepositoryImpl';
import { CreateUserUseCase } from '../../application/useCases/user/createUser';
import { GetUserUseCase } from '../../application/useCases/user/getUser';
import { ListUsersUseCase } from '../../application/useCases/user/listUsers';
import { UpdateUserUseCase } from '../../application/useCases/user/updateUser';
import { DeleteUserUseCase } from '../../application/useCases/user/deleteUser';
import { UserApiAdapter } from '../adapters/api/userApiAdapter';
import { UserService } from '../../domain/services/userService';
import { EventBus } from '../../domain/events/eventBus';
import { EventStoreImpl } from '../events/eventStoreImpl';
import { PersistentEventBus } from '../events/persistentEventBus';
import {
  LogUserCreatedHandler,
  LogUserUpdatedHandler,
  LogUserDeletedHandler,
} from '../../application/eventHandlers/userEventHandlers';
import { LoggerFactory } from '../logging/loggerFactory';
import { Logger } from '../../domain/ports/logger';

/**
 * Dependency injection container.
 */
export class Container {
  /**
   * Container instance.
   */
  private static instance: Container;
  /**
   * Mapped services.
   */
  private services: Map<string, any> = new Map();

  /**
   * Constructor
   * @param dataSource Database entity.
   */
  private constructor(dataSource: DataSource) {
    // Agregar al inicio del constructor
    this.services.set('Logger', LoggerFactory.getLogger('AppRoot'));

    // Initialize repositories
    this.services.set('UserRepository', new UserRepositoryImpl(dataSource));

    // Initialize event store and bus
    const eventStore = new EventStoreImpl(dataSource);
    this.services.set('EventStore', eventStore);

    const eventBus = new PersistentEventBus(eventStore);
    this.services.set('EventBus', eventBus);

    // Initialize domain services
    this.services.set('UserService', new UserService(this.get('UserRepository')));

    // Initialize use cases
    this.services.set(
      'CreateUserUseCase',
      new CreateUserUseCase(
        this.get('UserRepository'),
        this.get('UserService'),
        this.get<EventBus>('EventBus'),
        this.get<Logger>('Logger'),
      ),
    );

    this.services.set('GetUserUseCase', new GetUserUseCase(this.get('UserRepository')));

    this.services.set('ListUsersUseCase', new ListUsersUseCase(this.get('UserRepository')));

    this.services.set(
      'UpdateUserUseCase',
      new UpdateUserUseCase(
        this.get('UserRepository'),
        this.get('UserService'),
        this.get<EventBus>('EventBus'),
        this.get<Logger>('Logger'),
      ),
    );

    this.services.set(
      'DeleteUserUseCase',
      new DeleteUserUseCase(
        this.get('UserRepository'),
        this.get<EventBus>('EventBus'),
        this.get<Logger>('Logger'),
      ),
    );

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

    // Register event handlers
    const logUserCreatedHandler = new LogUserCreatedHandler();
    const logUserUpdatedHandler = new LogUserUpdatedHandler();
    const logUserDeletedHandler = new LogUserDeletedHandler();

    eventBus.subscribe('user.created', logUserCreatedHandler);
    eventBus.subscribe('user.updated', logUserUpdatedHandler);
    eventBus.subscribe('user.deleted', logUserDeletedHandler);
  }

  /**
   * Initialize container.
   * @param dataSource Database entity.
   * @returns Container instance.
   */
  static initialize(dataSource: DataSource): Container {
    if (!Container.instance) {
      Container.instance = new Container(dataSource);
    }
    return Container.instance;
  }

  /**
   * Get instance of container.
   * @returns Container instance.
   */
  static getInstance(): Container {
    if (!Container.instance) {
      throw new Error('Container not initialized. Call initialize first.');
    }
    return Container.instance;
  }

  /**
   * Get service from container.
   * @param serviceName Service name.
   * @returns Service instance.
   */
  get<T>(serviceName: string): T {
    if (!this.services.has(serviceName)) {
      throw new Error(`Service ${serviceName} not found in container`);
    }
    return this.services.get(serviceName) as T;
  }
}
