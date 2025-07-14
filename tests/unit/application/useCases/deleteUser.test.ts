import { DeleteUserUseCase } from '../../../../src/application/useCases/user/deleteUser';
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

jest.mock('../../../../src/domain/valueObjects/email');
jest.mock('../../../../src/domain/valueObjects/password');

describe('DeleteuseCase', () => {
  let deleteUserUseCase: DeleteUserUseCase;
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

    deleteUserUseCase = new DeleteUserUseCase(mockUserRepository, mockEventBus, mockLogger);
  });

  it('should delete a user successfully', async () => {
    mockUserRepository.delete.mockResolvedValue(true);

    const result = await deleteUserUseCase.execute(userId);

    expect(result).toBe(true);
    expect(mockUserRepository.delete).toHaveBeenCalledWith(userId, true);
    expect(mockEventBus.publish).toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalledWith(`User ${userId} soft deleted successfully`);
  });

  it('should throw UserNotFoundError when user is not found', async () => {
    mockUserRepository.delete.mockResolvedValue(false);
    const result = await deleteUserUseCase.execute(userId);
    expect(result).toBe(false);
    expect(mockUserRepository.delete).toHaveBeenCalledTimes(0);
    expect(result).rejects.toThrow(UserNotFoundError);
  });
});
