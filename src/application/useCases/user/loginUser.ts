import { DomainError } from '../../../domain/errors/domainError';
import { Logger } from '../../../domain/ports/logger';
import { TokenPort } from '../../../domain/ports/tokenPort';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserService } from '../../../domain/services/userService';
import { UserLoginDto, UserLoginResponseDto } from '../../dtos/UserDto';
import { AppError } from '../../errors/appError';
import { UserLoginError, UserNotFoundError } from '../../errors/userAppErrors';

export class LoginUserCase {
  constructor(
    private userRepository: UserRepository,
    private userService: UserService,
    private tokenPort: TokenPort,
    private logger: Logger,
  ) {}

  async execute(loginData: UserLoginDto): Promise<UserLoginResponseDto> {
    try {
      const user = await this.userRepository.findByEmail(loginData.email);
      if (!user) {
        throw new UserNotFoundError(`Email or password was incorrect or not found`);
      }
      if (!user.verifyPassword(loginData.password)) {
        throw new UserLoginError('Email or password was incorrect or not found');
      }

      const token = this.tokenPort.generateToken({
        id: user.id,
        email: user.email.getValue(),
        name: user.name,
        role: user.role.getValue(),
      });

      return {
        createdAt: new Date(),
        name: user.name,
        email: user.email.getValue(),
        role: user.role.getValue(),
        id: user.id ?? '',
        updatedAt: new Date(),
        token,
      };
    } catch (error: any) {
      if (error instanceof DomainError || error instanceof AppError) {
        throw error;
      }
      throw new UserLoginError(`Failed to login user: ${error.message}`);
    }
  }
}
