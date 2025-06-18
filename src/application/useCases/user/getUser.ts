import { User } from '../../../domain/entities/user';
import { UserRepository } from '../../../domain/repositories/user.repository';

export class GetUserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}
