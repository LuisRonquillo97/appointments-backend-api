import { User } from '../../../domain/entities/user';
import { UserRepository } from '../../../domain/repositories/user.repository';

export class CreateUserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    // Add validation logic here if needed
    
    const newUser: User = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return this.userRepository.create(newUser);
  }
}
