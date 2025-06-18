// src/infrastructure/mappers/user.mapper.ts
import { User } from '../../domain/entities/user';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      salt: entity.salt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toEntity(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.id || '';
    entity.name = domain.name;
    entity.email = domain.email;
    if (domain.password) entity.password = domain.password;
    if (domain.salt) entity.salt = domain.salt;
    entity.createdAt = domain.createdAt || new Date();
    entity.updatedAt = domain.updatedAt || new Date();
    return entity;
  }
}
