// src/domain/entities/user.ts
export interface User {
  id?: string;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}
