import { UpdateUserUseCase } from '../../../../src/application/useCases/user/updateUser';
import { UserRepository } from '../../../../src/domain/repositories/user.repository';
import { UserService } from '../../../../src/domain/services/userService';
import { EventBus } from '../../../../src/domain/events/eventBus';
import { Logger } from '../../../../src/domain/ports/logger';
import { User } from '../../../../src/domain/entities/user';
import { Email } from '../../../../src/domain/valueObjects/email';
import { Password } from '../../../../src/domain/valueObjects/password';
import {
  UserNotFoundError,
  UserUpdatingError,
} from '../../../../src/application/errors/userAppErrors';
import { EmailAlreadyExistsError } from '../../../../src/domain/errors/userErrors';
import {
  createMockEventBus,
  createMockLogger,
  createMockUser,
  createMockUserRepository,
  createMockUserService,
  mockUserId,
} from './utils/userTestUtils';

// Mock de los value objects
jest.mock('../../../../src/domain/valueObjects/email');
jest.mock('../../../../src/domain/valueObjects/password');

describe('UpdateUserUseCase', () => {
  let updateUserUseCase: UpdateUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockUserService: jest.Mocked<UserService>;
  let mockEventBus: jest.Mocked<EventBus>;
  let mockLogger: jest.Mocked<Logger>;
  let mockUser: User;
  let userId: string;

  beforeEach(() => {
    // Recrear todos los mocks en cada test
    mockUserRepository = createMockUserRepository();
    mockUserService = createMockUserService();
    mockEventBus = createMockEventBus();
    mockLogger = createMockLogger();
    mockUser = createMockUser();
    userId = mockUserId;

    updateUserUseCase = new UpdateUserUseCase(
      mockUserRepository,
      mockUserService,
      mockEventBus,
      mockLogger,
    );
  });

  it('should update user name successfully', async () => {
    // Arrange
    const updateData = {
      name: 'Jane Doe',
    };

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.update.mockResolvedValue(mockUser);
    mockEventBus.publish.mockResolvedValue();

    // Act
    const result = await updateUserUseCase.execute(userId, updateData);

    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUser.updateName).toHaveBeenCalledWith('Jane Doe');
    expect(mockUserRepository.update).toHaveBeenCalledWith(userId, mockUser);
    expect(mockEventBus.publish).toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalledWith(`User ${userId} updated successfully`);
    expect(result).toBeDefined();
  });

  it('should update user email successfully', async () => {
    // Arrange
    const updateData = {
      email: 'jane@example.com',
    };

    const mockNewEmail = { toString: () => 'jane@example.com' } as Email;
    (Email as jest.MockedClass<typeof Email>).mockImplementation(() => mockNewEmail);

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserService.validateUniqueEmail.mockResolvedValue();
    mockUserRepository.update.mockResolvedValue(mockUser);
    mockEventBus.publish.mockResolvedValue();

    // Act
    const result = await updateUserUseCase.execute(userId, updateData);

    // Assert
    expect(mockUserService.validateUniqueEmail).toHaveBeenCalledWith('jane@example.com');
    expect(Email).toHaveBeenCalledWith('jane@example.com');
    expect(mockUser.updateEmail).toHaveBeenCalledWith(mockNewEmail);
    expect(mockUserRepository.update).toHaveBeenCalledWith(userId, mockUser);
    expect(mockEventBus.publish).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should update user password successfully', async () => {
    // Arrange
    const updateData = {
      password: 'newpassword123',
    };

    const mockNewPassword = {} as Password;
    (Password.create as jest.Mock).mockReturnValue(mockNewPassword);

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.update.mockResolvedValue(mockUser);
    mockEventBus.publish.mockResolvedValue();

    // Act
    const result = await updateUserUseCase.execute(userId, updateData);

    // Assert
    expect(Password.create).toHaveBeenCalledWith('newpassword123');
    expect(mockUser.updatePassword).toHaveBeenCalledWith(mockNewPassword);
    expect(mockUserRepository.update).toHaveBeenCalledWith(userId, mockUser);
    expect(mockEventBus.publish).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should update multiple fields successfully', async () => {
    // Arrange
    const updateData = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'newpassword123',
    };

    const mockNewEmail = { toString: () => 'jane@example.com' } as Email;
    const mockNewPassword = {} as Password;

    (Email as jest.MockedClass<typeof Email>).mockImplementation(() => mockNewEmail);
    (Password.create as jest.Mock).mockReturnValue(mockNewPassword);

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserService.validateUniqueEmail.mockResolvedValue();
    mockUserRepository.update.mockResolvedValue(mockUser);
    mockEventBus.publish.mockResolvedValue();

    // Act
    const result = await updateUserUseCase.execute(userId, updateData);

    // Assert
    expect(mockUser.updateName).toHaveBeenCalledWith('Jane Doe');
    expect(mockUserService.validateUniqueEmail).toHaveBeenCalledWith('jane@example.com');
    expect(mockUser.updateEmail).toHaveBeenCalledWith(mockNewEmail);
    expect(mockUser.updatePassword).toHaveBeenCalledWith(mockNewPassword);
    expect(mockUserRepository.update).toHaveBeenCalledWith(userId, mockUser);
    expect(mockEventBus.publish).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should throw UserNotFoundError when user does not exist', async () => {
    // Arrange
    const updateData = {
      name: 'Jane Doe',
    };

    mockUserRepository.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(updateUserUseCase.execute(userId, updateData)).rejects.toThrow(UserNotFoundError);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });

  // Solución 1: Combinar las expectativas
  it('should throw UserUpdatingError when repository update fails', async () => {
    // Arrange
    const updateData = {
      name: 'Jane Doe',
    };

    mockUserRepository.findById.mockResolvedValue(mockUser);
    const updateError = new Error('Database update failed');
    mockUserRepository.update.mockRejectedValue(updateError);

    // Act & Assert
    const promise = updateUserUseCase.execute(userId, updateData);

    await expect(promise).rejects.toThrow(UserUpdatingError);
    await expect(promise).rejects.toThrow('Failed to update user: Database update failed');

    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.update).toHaveBeenCalledWith(userId, mockUser);
  });

  it('should throw EmailAlreadyExistsError when email is already in use', async () => {
    // Arrange
    const updateData = {
      email: 'existing@example.com',
    };

    mockUserRepository.findById.mockResolvedValue(mockUser);
    const emailError = new EmailAlreadyExistsError('existing@example.com');
    mockUserService.validateUniqueEmail.mockRejectedValue(emailError);

    // Act & Assert
    await expect(updateUserUseCase.execute(userId, updateData)).rejects.toThrow(emailError);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUserService.validateUniqueEmail).toHaveBeenCalledWith('existing@example.com');
    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });

  it('should not validate email if it is the same as current', async () => {
    // Arrange
    const updateData = {
      email: 'john@example.com', // Same as current email
    };

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.update.mockResolvedValue(mockUser);
    mockEventBus.publish.mockResolvedValue();

    // Act
    await updateUserUseCase.execute(userId, updateData);

    // Assert
    expect(mockUserService.validateUniqueEmail).not.toHaveBeenCalled();
    expect(mockUser.updateEmail).not.toHaveBeenCalled();
    expect(mockUserRepository.update).toHaveBeenCalledWith(userId, mockUser);
  });

  it('should throw UserUpdatingError when an unexpected error occurs', async () => {
    // Arrange
    const updateData = {
      name: 'Jane Doe',
    };

    const unexpectedError = new Error('Unexpected error');
    mockUserRepository.findById.mockRejectedValue(unexpectedError);

    // Act & Assert
    await expect(updateUserUseCase.execute(userId, updateData)).rejects.toThrow(UserUpdatingError);
    await expect(updateUserUseCase.execute(userId, updateData)).rejects.toThrow(
      'Failed to update user: Unexpected error',
    );
  });

  it('should handle error when event publishing fails', async () => {
    // Arrange
    const updateData = {
      name: 'Jane Doe',
    };

    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.update.mockResolvedValue(mockUser);
    const eventError = new Error('Event bus error');
    mockEventBus.publish.mockRejectedValue(eventError);

    // Act & Assert
    await expect(updateUserUseCase.execute(userId, updateData)).rejects.toThrow(UserUpdatingError);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUser.updateName).toHaveBeenCalledWith('Jane Doe');
    expect(mockUserRepository.update).toHaveBeenCalledWith(userId, mockUser);
    expect(mockEventBus.publish).toHaveBeenCalled();
  });
});
