import { User } from '../entities/user';
import { UserModel } from '../../domain/model/user.model';

export class UserMapper {
  static toDomain(entity: User): UserModel {
    const model = new UserModel();
    model.id = entity.id;
    model.email = entity.email;
    model.password = entity.password;
    model.name = entity.name || ''; // Provide default value if undefined
    model.role = entity.role;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;

    // Handle nullable fields
    if (entity.deletedAt) {
      model.deletedAt = entity.deletedAt;
    }

    if (entity.deletedById) {
      model.deletedById = entity.deletedById;
    }
    if (entity.updatedById) {
      model.updatedById = entity.updatedById;
    }

    return model;
  }

  static toEntity(model: UserModel): User {
    const entity = new User();
    entity.id = model.id;
    entity.email = model.email;
    entity.password = model.password;
    entity.name = model.name || '';
    entity.role = model.role;
    entity.createdAt = model.createdAt;
    entity.updatedAt = model.updatedAt;

    if (model.deletedAt) {
      entity.deletedAt = model.deletedAt;
    }

    if (model.deletedById) {
      entity.deletedById = model.deletedById;
    }

    if (model.updatedById) {
      entity.updatedById = model.updatedById;
    }

    return entity;
  }
}
