import { CreateUserUseCase } from '../../src/application/useCases/user/createUser';
import { UserRepository } from '../../src/domain/repositories/user.repository';
import { jest } from '@jest/globals';

describe('CreateUserUseCase', () => {
  it('should create a user', async () => {
    // Mock repository
    const mockRepository: jest.Mocked<UserRepository> = {
      create: jest.fn().mockImplementation((user: any) => Promise.resolve({ ...user, id: '123' })),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const createUserUseCase = new CreateUserUseCase(mockRepository);
    const userData = { name: 'Test User', email: 'test@example.com' };

    const result = await createUserUseCase.execute(userData);

    expect(result).toHaveProperty('id', '123');
    expect(result.name).toBe(userData.name);
    expect(result.email).toBe(userData.email);
    expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining(userData));
  });
});
