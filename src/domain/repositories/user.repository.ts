import { User } from '../entities/user';
import { PaginationOptions, PaginatedResult } from '../types/pagination';

/**
 * User repository interface.
 */
export interface UserRepository {
  /**
   * Find a user by id.
   * @param id UUID to find.
   * @returns User if found, null otherwise.
   */
  findById(id: string): Promise<User | null>;
  /**
   * Find all users.
   * @param options Pagination options.
   * @returns Paginated list of users.
   */
  findAll(options?: PaginationOptions): Promise<PaginatedResult<User>>;
  /**
   * Creates a new user.
   * @param user User to create.
   * @returns Created user.
   */
  create(user: User): Promise<User>;
  /**
   * Updates a user.
   * @param id UUID to update.
   * @param user User to update.
   * @returns Updated user.
   */
  update(id: string, user: Partial<User>): Promise<User>;
  /**
   * Deletes a user.
   * @param id UUID to delete.
   * @param softDelete If true, the user will be soft deleted.
   * @returns True if the user was deleted.
   */
  delete(id: string, softDelete?: boolean): Promise<boolean>;
  /**
   * Find a user by email.
   * @param email Email to find.
   * @returns User if found, null otherwise.
   */
  findByEmail(email: string): Promise<User | null>;
}
