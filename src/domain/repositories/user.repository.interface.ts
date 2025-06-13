// src/domain/repositories/user.repository.interface.ts
import { UserModel } from '../model/user.model';

export interface IUserRepository {
  findByEmail(email: string): Promise<UserModel | null>;
  findById(id: number): Promise<UserModel | null>;
  create(userData: Partial<UserModel>): Promise<UserModel>;
  update(id: number, userData: Partial<UserModel>): Promise<UserModel | null>;
  softDelete(id: number, deletedById: number): Promise<boolean>;
}
