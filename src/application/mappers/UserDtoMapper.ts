import { User } from '../../domain/entities/user';
import { UserResponseDto } from '../dtos/UserDto';

/**
 * User Dto mapper. Maps a domain User entity to an application UserResponseDto.
 * @param user User entity
 * @returns UserResponseDto
 */
export class UserDtoMapper {
  /**
   * Maps a domain User entity to an application UserResponseDto.
   * @param user User entity
   * @returns Application UserResponseDto
   */
  static toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id!,
      name: user.name,
      email: user.email.toString(),
      role: user.role.toString(),
      createdAt: user.createdAt!,
      updatedAt: user.updatedAt!,
    };
  }
}
