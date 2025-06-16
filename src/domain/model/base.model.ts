export abstract class BaseModel {
  id: number = 0;

  isActive: Boolean = false;

  createdAt: Date = new Date();

  updatedById: number = 0;

  updatedAt: Date = new Date();

  deletedAt?: Date;

  deletedById?: number;
}
