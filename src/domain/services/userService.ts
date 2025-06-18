// src/domain/services/userService.ts
import { User } from '../entities/user';
import { UserRepository } from '../repositories/user.repository';
import { EmailAlreadyExistsError } from '../errors/userErrors';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async validateUniqueEmail(email: string): Promise<void> {
    const users = await this.userRepository.findAll();
    const existingUser = users.data.find((user) => user.email === email);

    if (existingUser) {
      throw new EmailAlreadyExistsError(email);
    }
  }

  // Otros métodos de servicio de dominio...
}
