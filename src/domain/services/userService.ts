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

  /**
   * Validates that the email is unique for updates (excluding current user).
   * @param email Email to validate.
   * @param currentUserId ID of the user being updated.
   * @throws EmailAlreadyExistsError if the email already exists for another active user.
   */
  async validateUniqueEmailForUpdate(email: string, currentUserId: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser && existingUser.id !== currentUserId) {
      throw new EmailAlreadyExistsError(email);
    }
  }
}
