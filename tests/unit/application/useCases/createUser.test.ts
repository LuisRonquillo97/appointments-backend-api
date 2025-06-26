import { CreateUserUseCase } from '../../../../src/application/useCases/user/createUser';
import { UserRepository } from '../../../../src/domain/repositories/user.repository';
import { UserService } from '../../../../src/domain/services/userService';
import { EventBus } from '../../../../src/domain/events/eventBus';
import { Logger } from '../../../../src/domain/ports/logger';
import { User } from '../../../../src/domain/entities/user';
import { Email } from '../../../../src/domain/valueObjects/email';
import { Password } from '../../../../src/domain/valueObjects/password';
import { EmailAlreadyExistsError } from '../../../../src/domain/errors/userErrors';
import { UserCreationError } from '../../../../src/application/errors/userAppErrors';
import {
  createMockUserRepository,
  createMockUserService,
  createMockEventBus,
  createMockLogger,
} from './utils/userTestUtils';

// Mock de los value objects
jest.mock('../../../../src/domain/valueObjects/email');
jest.mock('../../../../src/domain/valueObjects/password');

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockUserService: jest.Mocked<UserService>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockUserRepository = createMockUserRepository();
    mockUserService = createMockUserService();
    mockEventBus = createMockEventBus();
    mockLogger = createMockLogger();

    createUserUseCase = new CreateUserUseCase(
      mockUserRepository,
      mockUserService,
      mockEventBus,
      mockLogger,
    );
  });

  it('should create user successfully', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    const mockEmail = { toString: () => 'john@example.com' } as Email;
    const mockPassword = {} as Password;

    (Email as jest.MockedClass<typeof Email>).mockImplementation(() => mockEmail);
    (Password.create as jest.Mock).mockReturnValue(mockPassword);

    const mockCreatedUser = {
      id: '123',
      name: 'John Doe',
      email: mockEmail,
      password: mockPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    mockUserService.validateUniqueEmail.mockResolvedValue();
    mockUserRepository.create.mockResolvedValue(mockCreatedUser);
    mockEventBus.publish.mockResolvedValue();

    // Act
    const result = await createUserUseCase.execute(userData);

    // Assert
    expect(result).toEqual({
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: mockCreatedUser.createdAt,
      updatedAt: mockCreatedUser.updatedAt,
    });
    expect(mockUserService.validateUniqueEmail).toHaveBeenCalledWith('john@example.com');
    expect(Email).toHaveBeenCalledWith('john@example.com');
    expect(Password.create).toHaveBeenCalledWith('password123');
    expect(mockUserRepository.create).toHaveBeenCalled();
    expect(mockEventBus.publish).toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalledWith('User 123 created successfully');
  });

  it('should throw UserCreationError when email already exists', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'existing@example.com',
      password: 'password123',
    };

    const emailError = new EmailAlreadyExistsError('existing@example.com');
    mockUserService.validateUniqueEmail.mockRejectedValue(emailError);
    // Act & Assert
    await expect(createUserUseCase.execute(userData)).rejects.toThrow(emailError);
    expect(mockUserService.validateUniqueEmail).toHaveBeenCalledWith('existing@example.com');
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });

  it('should throw UserCreationError when repository fails', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    const mockEmail = { toString: () => 'john@example.com' } as Email;
    const mockPassword = {} as Password;

    (Email as jest.MockedClass<typeof Email>).mockImplementation(() => mockEmail);
    (Password.create as jest.Mock).mockReturnValue(mockPassword);

    mockUserService.validateUniqueEmail.mockResolvedValue();
    const dbError = new UserCreationError('Failed to create user: Database connection failed');
    mockUserRepository.create.mockRejectedValue(dbError);

    // Act & Assert
    await expect(createUserUseCase.execute(userData)).rejects.toThrow(
      'Failed to create user: Database connection failed',
    );
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should log error when event publishing fails but still return user', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    const mockEmail = { toString: () => 'john@example.com' } as Email;
    const mockPassword = {} as Password;

    (Email as jest.MockedClass<typeof Email>).mockImplementation(() => mockEmail);
    (Password.create as jest.Mock).mockReturnValue(mockPassword);

    const mockCreatedUser = {
      id: '123',
      name: 'John Doe',
      email: mockEmail,
      password: mockPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    mockUserService.validateUniqueEmail.mockResolvedValue();
    mockUserRepository.create.mockResolvedValue(mockCreatedUser);
    mockEventBus.publish.mockRejectedValue(new Error('Event bus error'));

    // Act
    const result = await createUserUseCase.execute(userData);

    // Assert
    expect(result).toBeDefined();
    expect(mockEventBus.publish).toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should create user with trimmed name', async () => {
    // Arrange
    const userData = {
      name: '  John Doe  ',
      email: 'john@example.com',
      password: 'password123',
    };

    const mockEmail = { toString: () => 'john@example.com' } as Email;
    const mockPassword = {} as Password;

    (Email as jest.MockedClass<typeof Email>).mockImplementation(() => mockEmail);
    (Password.create as jest.Mock).mockReturnValue(mockPassword);

    const mockCreatedUser = {
      id: '123',
      name: 'John Doe', // Trimmed
      email: mockEmail,
      password: mockPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    mockUserService.validateUniqueEmail.mockResolvedValue();
    mockUserRepository.create.mockResolvedValue(mockCreatedUser);
    mockEventBus.publish.mockResolvedValue();

    // Act
    const result = await createUserUseCase.execute(userData);

    // Assert
    expect(result.name).toBe('John Doe');
    // Verificar que se pasó el nombre trimmed al crear el usuario
    expect(mockUserRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Doe',
      }),
    );
  });

  it('should throw when Email constructor fails', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'invalid-email',
      password: 'password123',
    };

    const emailError = new Error('Invalid email format');
    (Email as jest.MockedClass<typeof Email>).mockImplementation(() => {
      throw emailError;
    });

    mockUserService.validateUniqueEmail.mockResolvedValue();

    // Act & Assert
    await expect(createUserUseCase.execute(userData)).rejects.toThrow(
      'Failed to create user: Invalid email format',
    );
    expect(mockUserService.validateUniqueEmail).toHaveBeenCalledWith('invalid-email');
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });

  it('should throw when Password.create fails', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'weak',
    };

    const mockEmail = { toString: () => 'john@example.com' } as Email;
    (Email as jest.MockedClass<typeof Email>).mockImplementation(() => mockEmail);

    const passwordError = new Error('Password too weak');
    (Password.create as jest.Mock).mockImplementation(() => {
      throw passwordError;
    });

    mockUserService.validateUniqueEmail.mockResolvedValue();

    // Act & Assert
    await expect(createUserUseCase.execute(userData)).rejects.toThrow(
      'Failed to create user: Password too weak',
    );
    expect(mockUserService.validateUniqueEmail).toHaveBeenCalledWith('john@example.com');
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });

  it('should log error but not throw when event publishing fails', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    const mockEmail = { toString: () => 'john@example.com' } as Email;
    const mockPassword = {} as Password;

    (Email as jest.MockedClass<typeof Email>).mockImplementation(() => mockEmail);
    (Password.create as jest.Mock).mockReturnValue(mockPassword);

    const mockCreatedUser = {
      id: '123',
      name: 'John Doe',
      email: mockEmail,
      password: mockPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    mockUserService.validateUniqueEmail.mockResolvedValue();
    mockUserRepository.create.mockResolvedValue(mockCreatedUser);

    const eventError = new Error('Event bus error');
    mockEventBus.publish.mockRejectedValue(eventError);

    // Act
    const result = await createUserUseCase.execute(userData);

    // Assert
    expect(result).toBeDefined();
    expect(mockEventBus.publish).toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalledWith(
      'Failed to publish on Event bus - Create user: Event bus error',
    );
    // Verificar que aún así se registra el éxito de la creación
    expect(mockLogger.info).toHaveBeenCalledWith('User 123 created successfully');
  });

  it('should create User object with correct properties', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    const mockEmail = { toString: () => 'john@example.com' } as Email;
    const mockPassword = {} as Password;

    (Email as jest.MockedClass<typeof Email>).mockImplementation(() => mockEmail);
    (Password.create as jest.Mock).mockReturnValue(mockPassword);

    const mockCreatedUser = {
      id: '123',
      name: 'John Doe',
      email: mockEmail,
      password: mockPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User; // Usar el cast simple como en los otros tests

    mockUserService.validateUniqueEmail.mockResolvedValue();
    mockUserRepository.create.mockResolvedValue(mockCreatedUser);
    mockEventBus.publish.mockResolvedValue();

    // Act
    await createUserUseCase.execute(userData);

    // Assert
    // Solo verificamos que se llama con los parámetros correctos
    expect(mockUserRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Doe',
        email: mockEmail,
        password: mockPassword,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });
});
