// tests/unit/application/useCases/utils/userTestUtils.ts
import { UserRepository } from '../../../../../src/domain/repositories/user.repository';
import { UserService } from '../../../../../src/domain/services/userService';
import { EventBus } from '../../../../../src/domain/events/eventBus';
import { Logger } from '../../../../../src/domain/ports/logger';
import { User } from '../../../../../src/domain/entities/user';
import { Email } from '../../../../../src/domain/valueObjects/email';
import { Password } from '../../../../../src/domain/valueObjects/password';

export const mockUserId: string = '123';

/**
 * Crea un mock del repositorio de usuarios
 */
export function createMockUserRepository(): jest.Mocked<UserRepository> {
  return {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByEmail: jest.fn(),
  };
}

/**
 * Crea un mock del servicio de usuarios
 */
export function createMockUserService(): jest.Mocked<UserService> {
  return {
    validateUniqueEmail: jest.fn(),
  } as unknown as jest.Mocked<UserService>;
}

/**
 * Crea un mock del Event bus
 */
export function createMockEventBus(): jest.Mocked<EventBus> {
  return {
    publish: jest.fn(),
    subscribe: jest.fn(),
  };
}

/**
 * Crea un mock del Logger
 */
export function createMockLogger(): jest.Mocked<Logger> {
  return {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
  };
}

/**
 * Crea un mock del User - cada llamada crea un nuevo objeto
 */
export function createMockUser(): User {
  const mockEmail = { toString: () => 'john@example.com' } as Email;
  const mockPassword = {} as Password;

  return {
    id: mockUserId,
    name: 'John Doe',
    email: mockEmail,
    password: mockPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
    updateName: jest.fn(),
    updateEmail: jest.fn(),
    updatePassword: jest.fn(),
    delete: jest.fn(),
    restore: jest.fn(),
    validate: jest.fn(),
    isActive: true,
  } as unknown as User;
}
