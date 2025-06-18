// src/domain/repositories/unitOfWork.ts
export interface UnitOfWork {
  startTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;
  runInTransaction<T>(work: () => Promise<T>): Promise<T>;
}
