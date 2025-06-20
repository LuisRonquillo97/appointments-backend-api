import { User } from '../../domain/entities/user';
import { Email } from '../../domain/valueObjects/email';
import { Password } from '../../domain/valueObjects/password';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return new User({
      id: entity.id,
      name: entity.name,
      email: new Email(entity.email),
      password: entity.password ? Password.fromHash(entity.password, entity.salt) : undefined,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

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
    entity.isActive = domain.isActive;
    entity.createdAt = domain.createdAt || new Date();
    entity.updatedAt = domain.updatedAt || new Date();
    return entity;
  }
}
