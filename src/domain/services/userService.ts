import { UserRepository } from '../repositories/user.repository';
import { EmailAlreadyExistsError } from '../errors/userErrors';

/**
 * User service.
 */
export class UserService {
  /**
   * User constructor.
   * @param userRepository User repository.
   */
  constructor(private userRepository: UserRepository) {}

  /**
   * Validates that the email is unique on users table.
   * @param email Email to validate.
   * @throws EmailAlreadyExistsError if the email already exists.
   */
  async validateUniqueEmail(email: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new EmailAlreadyExistsError(email);
    }
  }
}
