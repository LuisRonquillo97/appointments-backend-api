import { ParentModel } from '../model/parent.model';
import { PaginatedResult, PaginationOptions } from '../interfaces/pagination.interface';

export interface IParentRepository {
  findById(id: number): Promise<ParentModel | null>;
  findByUserId(userId: number): Promise<ParentModel | null>;
  findAll(options?: PaginationOptions): Promise<PaginatedResult<ParentModel>>;
  create(parentData: Partial<ParentModel>): Promise<ParentModel>;
  update(id: number, parentData: Partial<ParentModel>): Promise<ParentModel | null>;
  softDelete(id: number, deletedById: number): Promise<boolean>;
  hardDeleteByUserId(userId: number): Promise<boolean>;
}
