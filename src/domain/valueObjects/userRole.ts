/**
 * User role enumeration.
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  EMPLEOYEE = 'empleoyee',
}

/**
 * User role value object.
 */
export class Role {
  private readonly value: UserRole;

  constructor(role: UserRole) {
    this.value = role;
  }

  static create(role: string): Role {
    const normalizedRole = role.toLowerCase() as UserRole;
    if (!Object.values(UserRole).includes(normalizedRole)) {
      throw new Error(`Invalid role: ${role}`);
    }
    return new Role(normalizedRole);
  }

  getValue(): UserRole {
    return this.value;
  }

  isAdmin(): boolean {
    return this.value === UserRole.ADMIN;
  }

  IsEmpleoyee(): boolean {
    return this.value === UserRole.EMPLEOYEE;
  }

  isUser(): boolean {
    return this.value === UserRole.USER;
  }

  toString(): string {
    return this.value;
  }

  equals(other: Role): boolean {
    return this.value === other.value;
  }
}
