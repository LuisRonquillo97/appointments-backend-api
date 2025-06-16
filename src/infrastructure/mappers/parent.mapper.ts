import { Parent } from '../entities/parent.entity';
import { ParentModel } from '../../domain/model/parent.model';
import { UserMapper } from './user.mapper';
import { BaseMapper } from './base.mapper';

export class ParentMapper extends BaseMapper<Parent, ParentModel> {
  userMapper: UserMapper = new UserMapper();
  toDomain(entity: Parent): ParentModel {
    const model = new ParentModel();

    // Map base properties
    this.mapBasePropertiesToDomain(entity, model);

    // Map specific properties
    model.name = entity.name;
    model.lastName = entity.lastName;
    model.addressLine1 = entity.addressLine1;
    model.addressLine2 = entity.addressLine2;
    model.houseNumber = entity.houseNumber;
    model.zipCode = entity.zipCode;
    model.neighborhood = entity.neighborhood;
    model.state = entity.state;

    if (entity.user) {
      model.user = this.userMapper.toDomain(entity.user);
    }

    return model;
  }

  toEntity(model: ParentModel): Parent {
    const entity = new Parent();

    // Map base properties
    this.mapBasePropertiesToEntity(model, entity);

    // Map specific properties
    entity.name = model.name;
    entity.lastName = model.lastName;
    entity.addressLine1 = model.addressLine1;
    entity.houseNumber = model.houseNumber;
    entity.zipCode = model.zipCode;
    entity.neighborhood = model.neighborhood;
    entity.state = model.state;

    if (model.user) {
      entity.user = this.userMapper.toEntity(model.user);
    }

    if (model.addressLine2) {
      entity.addressLine2 = model.addressLine2;
    }

    return entity;
  }
}
