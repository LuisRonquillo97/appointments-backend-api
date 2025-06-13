// src/infrastructure/mappers/parent.mapper.ts
import { Parent } from '../entities/parent';
import { ParentModel } from '../../domain/model/parent.model';
import { UserMapper } from './user.mapper';

export class ParentMapper {
  static toDomain(entity: Parent): ParentModel {
    const model = new ParentModel();
    model.id = entity.id;
    model.name = entity.name;
    model.lastName = entity.lastName;
    model.addressLine1 = entity.addressLine1;
    model.addressLine2 = entity.addressLine2;
    model.houseNumber = entity.houseNumber;
    model.zipCode = entity.zipCode;
    model.neighborhood = entity.neighborhood;
    model.state = entity.state;
    model.isActive = entity.isActive as boolean;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;

    if (entity.user) {
      model.user = UserMapper.toDomain(entity.user);
    }

    if (entity.deletedAt) {
      model.deletedAt = entity.deletedAt;
    }

    if (entity.deletedById) {
      model.deletedById = entity.deletedById;
    }

    return model;
  }

  static toEntity(model: ParentModel): Parent {
    const entity = new Parent();
    entity.id = model.id;
    entity.name = model.name;
    entity.lastName = model.lastName;
    entity.addressLine1 = model.addressLine1;
    entity.houseNumber = model.houseNumber;
    entity.zipCode = model.zipCode;
    entity.neighborhood = model.neighborhood;
    entity.state = model.state;
    entity.isActive = model.isActive;
    entity.createdAt = model.createdAt;
    entity.updatedAt = model.updatedAt;

    if (model.user) {
      entity.user = UserMapper.toEntity(model.user);
    }

    if (model.deletedAt) {
      entity.deletedAt = model.deletedAt;
    }

    if (model.deletedById) {
      entity.deletedById = model.deletedById;
    }

    if (model.addressLine2) {
      entity.addressLine2 = model.addressLine2;
    }

    return entity;
  }
}
