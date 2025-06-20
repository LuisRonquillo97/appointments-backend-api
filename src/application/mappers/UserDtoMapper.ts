import { User } from '../../domain/entities/user';
import { UserResponseDto } from '../dtos/UserDto';

export class UserDtoMapper {
  static toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id!,
      name: user.name,
      email: user.email.toString(),
      createdAt: user.createdAt!,
      updatedAt: user.updatedAt!,
    };
  }
}
