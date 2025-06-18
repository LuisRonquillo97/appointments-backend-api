import { User } from '../entities/user';
import { PaginationOptions, PaginatedResult } from '../types/pagination';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findAll(options?: PaginationOptions): Promise<PaginatedResult<User>>;
  create(user: User): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
