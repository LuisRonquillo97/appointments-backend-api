import { UserRole } from '../enums/user-role.enum';
import { BaseModel } from './base.model';

export class UserModel extends BaseModel {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  // Business logic methods
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }
}
