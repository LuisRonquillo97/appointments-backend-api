import { UserRepository } from '../repositories/user.repository';
import { EmailAlreadyExistsError } from '../errors/userErrors';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async validateUniqueEmail(email: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new EmailAlreadyExistsError(email);
    }
  }
}
