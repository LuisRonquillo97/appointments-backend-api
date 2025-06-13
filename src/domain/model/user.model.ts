import { UserRole } from '../enums/user-role.enum';

export class UserModel {
  id: number;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  isActive: Boolean;
  createdAt: Date;
  updatedById: number;
  updatedAt: Date;
  deletedAt?: Date;
  deletedById?: number;
  // Business logic methods
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }
}
