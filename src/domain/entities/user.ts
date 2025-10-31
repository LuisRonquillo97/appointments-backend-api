import { InvalidUserDataError } from '../errors/userErrors';
import { Email } from '../valueObjects/email';
import { Password } from '../valueObjects/password';
import { Role, UserRole } from '../valueObjects/userRole';

/**
 * Domain entity representing a user.
 */
export class User {
  id?: string;
  name: string;
  email: Email;
  password?: Password;
  role: Role;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: {
    id?: string;
    name: string;
    email: Email;
    password?: Password;
    role?: Role;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.isActive = props.isActive !== undefined ? props.isActive : true;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.role = props.role || new Role(UserRole.USER);
    this.validate();
  }

  /**
   * Validates if the user data is valid.
   * @throws InvalidUserDataError if the user data is invalid.
   */
  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new InvalidUserDataError('Name is required');
    }
  }

  /**
   * Updates the user's name.
   * @param name The new name for the user.
   * @throws InvalidUserDataError if the name is invalid.
   */
  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new InvalidUserDataError('Name is required');
    }
    this.name = name;
    this.updatedAt = new Date();
  }

  /**
   * Updates user's email.
   * @param email
   */
  updateEmail(email: Email): void {
    this.email = email;
    this.updatedAt = new Date();
  }

  /**
   * Updates user's password.
   * @param password
   */
  updatePassword(password: Password): void {
    this.password = password;
    this.updatedAt = new Date();
  }

  /**
   * Verifies if the provided plain password matches the user's password.
   * @param plainPassword The plain password to verify.
   * @returns True if the password matches, false otherwise.
   */
  verifyPassword(plainPassword: string): boolean {
    if (!this.password) {
      return false;
    }
    return this.password.verify(plainPassword);
  }

  /**
   * Deactivates the user.
   */
  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  /**
   * Activates the user.
   */
  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  /**
   * Updates user's role.
   * @param role New role
   */
  updateRole(role: Role): void {
    this.role = role;
    this.updatedAt = new Date();
  }

  /**
   * Checks if user has specific role.
   * @param role Role to check
   * @returns True if user has the role
   */
  hasRole(role: UserRole): boolean {
    return this.role.getValue() === role;
  }

  /**
   * Checks if user is admin.
   * @returns True if user is admin
   */
  isAdmin(): boolean {
    return this.role.isAdmin();
  }
}
