import { User } from '../entities/user.entity';
import { UserModel } from '../../domain/model/user.model';
import { BaseMapper } from './base.mapper';

export class UserMapper extends BaseMapper<User, UserModel> {
  toDomain(entity: User): UserModel {
    const model = new UserModel();
    // Map base properties
    this.mapBasePropertiesToDomain(entity, model);

    // Map specific properties
    model.email = entity.email;
    model.password = entity.password;
    model.name = entity.name || ''; // Provide default value if undefined
    model.role = entity.role;
    return model;
  }
  toEntity(model: UserModel): User {
    const entity = new User();
    // Map base properties
    this.mapBasePropertiesToEntity(model, entity);

    // Map specific properties
    entity.email = model.email;
    entity.password = model.password;
    entity.name = model.name || '';
    entity.role = model.role;
    return entity;
  }
}
