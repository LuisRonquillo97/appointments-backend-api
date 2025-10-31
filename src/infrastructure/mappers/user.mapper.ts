import { User } from '../../domain/entities/user';
import { Email } from '../../domain/valueObjects/email';
import { Password } from '../../domain/valueObjects/password';
import { UserEntity } from '../entities/user.entity';
import { Role } from '../../domain/valueObjects/userRole';

/**
 * User infrastructure mapper.
 */
export class UserMapper {
  /**
   * Transform an user entity to a domain user.
   * @param entity
   * @returns
   */
  static toDomain(entity: UserEntity): User {
    const user = new User({
      id: entity.id,
      name: entity.name,
      email: new Email(entity.email),
      password: entity.password ? Password.fromHash(entity.password, entity.salt) : undefined,
      role: Role.create(entity.role),
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
    return user;
  }

  /**
   * Transform a domain user to an user entity.
   * @param domain
   * @returns
   */
  static toEntity(domain: User): UserEntity {
    const entity = new UserEntity();
    if (domain.id) {
      entity.id = domain.id;
    }
    entity.name = domain.name;
    entity.email = domain.email.toString();
    if (domain.password) {
      entity.password = domain.password.getHashedValue();
      entity.salt = domain.password.getSalt();
    }
    entity.role = domain.role.toString();
    entity.isActive = domain.isActive;
    entity.createdAt = domain.createdAt || new Date();
    entity.updatedAt = domain.updatedAt || new Date();
    return entity;
  }
}
