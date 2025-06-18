import { UserRepository } from '../../../domain/repositories/user.repository';

export class DeleteUserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}
