import { User } from '../../src/domain/entities/user';
import { Email } from '../../src/domain/valueObjects/email';
import { Password } from '../../src/domain/valueObjects/password';

export class TestHelpers {
  static createValidUser(overrides: Partial<any> = {}): User {
    return new User({
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test User',
      email: new Email('test@example.com'),
      password: Password.create('password123'),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    });
  }

  static createValidUserData(overrides: any = {}) {
    return {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      ...overrides,
    };
  }

  static createMockLogger() {
    return {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    };
  }

  static createMockUserRepository() {
    return {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByEmail: jest.fn(),
    };
  }

  static createMockEventBus() {
    return {
      publish: jest.fn(),
      subscribe: jest.fn(),
    };
  }

  static createMockUserService() {
    return {
      validateUniqueEmail: jest.fn(),
    };
  }
}
