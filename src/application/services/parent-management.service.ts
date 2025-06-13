// src/application/services/parent-management.service.ts
import { ParentModel } from '../../domain/model/parent.model';
import { IParentRepository } from '../../domain/repositories/parent.repository.interface';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { PaginatedResult, PaginationOptions } from '../../domain/interfaces/pagination.interface';
import { ParentNotFoundError, UserNotFoundError } from '../../domain/errors/parent-errors';


export class ParentManagementService {
  constructor(
    private parentRepository: IParentRepository,
    private userRepository: IUserRepository
  ) {}

  async findParentById(id: number): Promise<ParentModel> {
    const parent = await this.parentRepository.findById(id);
    if (!parent) {
      throw new ParentNotFoundError();
    }
    return parent;
  }

  async findParentByUserId(userId: number): Promise<ParentModel> {
    const parent = await this.parentRepository.findByUserId(userId);
    if (!parent) {
      throw new ParentNotFoundError();
    }
    return parent;
  }

  async listParents(options?: PaginationOptions): Promise<PaginatedResult<ParentModel>> {
    return this.parentRepository.findAll(options);
  }

  async createParent(parentData: {
    name: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    houseNumber?: string;
    zipCode: string;
    neighborhood: string;
    state: string;
    isActive?: boolean;
    userId: number;
  }): Promise<ParentModel> {
    // Find the associated user
    const user = await this.userRepository.findById(parentData.userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    // Check if an active parent already exists for this user
    const existingActiveParent = await this.parentRepository.findByUserId(parentData.userId);
    if (existingActiveParent) {
      throw new Error('Parent already exists for this user');
    }

    // Hard delete any soft-deleted parents for this user to avoid unique constraint violation
    await this.parentRepository.hardDeleteByUserId(parentData.userId);

    // Create the parent
    const parent = await this.parentRepository.create({
      name: parentData.name,
      lastName: parentData.lastName,
      addressLine1: parentData.addressLine1,
      addressLine2: parentData.addressLine2,
      houseNumber: parentData.houseNumber,
      zipCode: parentData.zipCode,
      neighborhood: parentData.neighborhood,
      state: parentData.state,
      isActive: parentData.isActive !== undefined ? parentData.isActive : true,
      user: user,
    });

    return parent;
  }

  async updateParent(id: number, parentData: Partial<ParentModel>): Promise<ParentModel> {
    // Check if parent exists
    const existingParent = await this.parentRepository.findById(id);
    if (!existingParent) {
      throw new ParentNotFoundError();
    }

    // Update the parent
    const updatedParent = await this.parentRepository.update(id, parentData);
    if (!updatedParent) {
      throw new Error('Failed to update parent');
    }

    return updatedParent;
  }

  async deleteParent(id: number, deletedById: number): Promise<boolean> {
    // Check if parent exists
    const existingParent = await this.parentRepository.findById(id);
    if (!existingParent) {
      throw new ParentNotFoundError();
    }

    // Soft delete the parent
    return this.parentRepository.softDelete(id, deletedById);
  }
}
