import { BaseEntity } from '../entities/base.entity';

export abstract class BaseMapper<TEntity extends BaseEntity, TModel> {
  protected mapBasePropertiesToDomain(entity: TEntity, model: TModel): void {
    // Cast to any to avoid TypeScript errors when accessing properties
    const anyModel = model as any;
    const anyEntity = entity as any;

    anyModel.id = anyEntity.id;
    anyModel.isActive = anyEntity.isActive as boolean;
    anyModel.createdAt = anyEntity.createdAt;
    anyModel.updatedAt = anyEntity.updatedAt;

    if (anyEntity.deletedAt) {
      anyModel.deletedAt = anyEntity.deletedAt;
    }

    if (anyEntity.deletedById) {
      anyModel.deletedById = anyEntity.deletedById;
    }
  }

  protected mapBasePropertiesToEntity(model: TModel, entity: TEntity): void {
    // Cast to any to avoid TypeScript errors when accessing properties
    const anyModel = model as any;
    const anyEntity = entity as any;

    anyEntity.id = anyModel.id;
    anyEntity.isActive = anyModel.isActive;
    anyEntity.createdAt = anyModel.createdAt;
    anyEntity.updatedAt = anyModel.updatedAt;

    if (anyModel.deletedAt) {
      anyEntity.deletedAt = anyModel.deletedAt;
    }

    if (anyModel.deletedById) {
      anyEntity.deletedById = anyModel.deletedById;
    }
  }

  abstract toDomain(entity: TEntity): TModel;
  abstract toEntity(model: TModel): TEntity;
}
