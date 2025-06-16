import { AppDataSource } from '../config/database';
import { Parent } from '../entities/parent.entity';
import { ParentModel } from '../../domain/model/parent.model';
import { IParentRepository } from '../../domain/repositories/parent.repository.interface';
import { ParentMapper } from '../mappers/parent.mapper';
import { UserMapper } from '../mappers/user.mapper';
import { PaginatedResult, PaginationOptions } from '../../domain/interfaces/pagination.interface';
import { IsNull, Not } from 'typeorm';

export class ParentRepository implements IParentRepository {
  private repository = AppDataSource.getRepository(Parent);
  private parentMapper: ParentMapper = new ParentMapper();
  private userMapper: UserMapper = new UserMapper();

  async findById(id: number): Promise<ParentModel | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['user'], // Include the related user
    });

    return entity ? this.parentMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: number, includeDeleted: boolean = false): Promise<ParentModel | null> {
    const queryOptions: any = {
      where: {
        user: { id: userId },
      },
      relations: ['user'],
    };

    if (!includeDeleted) {
      queryOptions.where.deletedAt = undefined; // Only non-deleted parents
    }

    const entity = await this.repository.findOne(queryOptions);

    return entity ? this.parentMapper.toDomain(entity) : null;
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<ParentModel>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    // Get paginated results
    const [entities, total] = await this.repository.findAndCount({
      relations: ['user'],
      skip,
      take: limit,
      order: {
        createdAt: 'DESC', // Order by creation date, newest first
      },
    });

    // Map entities to domain models
    const data = entities.map((entity) => this.parentMapper.toDomain(entity));

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async create(parentData: Partial<ParentModel>): Promise<ParentModel> {
    // Convert domain model to entity
    const parentEntity = new Parent();

    if (parentData.name) parentEntity.name = parentData.name;
    if (parentData.lastName) parentEntity.lastName = parentData.lastName;
    if (parentData.addressLine1) parentEntity.addressLine1 = parentData.addressLine1;
    if (parentData.addressLine2) parentEntity.addressLine2 = parentData.addressLine2;
    if (parentData.houseNumber) parentEntity.houseNumber = parentData.houseNumber;
    if (parentData.zipCode) parentEntity.zipCode = parentData.zipCode;
    if (parentData.neighborhood) parentEntity.neighborhood = parentData.neighborhood;
    if (parentData.state) parentEntity.state = parentData.state;
    if (parentData.isActive !== undefined) parentEntity.isActive = parentData.isActive;

    // Handle user relationship
    if (parentData.user) {
      // Use the UserMapper directly instead of going through ParentMapper
      const userEntity = parentData.user ? this.userMapper.toEntity(parentData.user) : null;
      if (userEntity) {
        parentEntity.user = userEntity;
      }
    }

    // Save the entity
    const savedEntity = await this.repository.save(parentEntity);

    // Convert back to domain model
    return this.parentMapper.toDomain(savedEntity);
  }

  async update(id: number, parentData: Partial<ParentModel>): Promise<ParentModel | null> {
    // Check if parent exists
    const existingParent = await this.repository.findOne({ where: { id } });
    if (!existingParent) {
      return null;
    }

    // Update fields
    if (parentData.name) existingParent.name = parentData.name;
    if (parentData.lastName) existingParent.lastName = parentData.lastName;
    if (parentData.addressLine1) existingParent.addressLine1 = parentData.addressLine1;
    if (parentData.addressLine2 !== undefined)
      existingParent.addressLine2 = parentData.addressLine2;
    if (parentData.houseNumber !== undefined) existingParent.houseNumber = parentData.houseNumber;
    if (parentData.zipCode) existingParent.zipCode = parentData.zipCode;
    if (parentData.neighborhood) existingParent.neighborhood = parentData.neighborhood;
    if (parentData.state) existingParent.state = parentData.state;
    if (parentData.isActive !== undefined) existingParent.isActive = parentData.isActive;

    // Save the updated entity
    const updatedEntity = await this.repository.save(existingParent);

    // Convert back to domain model
    return this.parentMapper.toDomain(updatedEntity);
  }

  async softDelete(id: number, deletedById: number): Promise<boolean> {
    // First update the deletedById field
    await this.repository.update(id, { deletedById });

    // Then perform the soft delete
    const result = await this.repository.softDelete(id);

    return result.affected !== undefined && (result.affected ?? 0) > 0;
  }

  // Add this method to ParentRepository
  async hardDeleteByUserId(userId: number): Promise<boolean> {
    // Find soft-deleted parent for this user
    const softDeletedParent = await this.repository.findOne({
      where: {
        user: { id: userId },
        deletedAt: Not(IsNull()), // Only find soft-deleted parents
      },
      withDeleted: true, // Include soft-deleted entities
      relations: ['user'], // Include the related user
    });

    if (softDeletedParent) {
      // Hard delete the parent
      const result = await this.repository.delete(softDeletedParent.id);
      return result.affected !== undefined && (result.affected ?? 0) > 0;
    }

    return false;
  }
}
