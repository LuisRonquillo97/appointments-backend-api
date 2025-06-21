/**
 *  UnitOfWork interface
 *
 * This interface defines the contract for a Unit of Work pattern.
 * It provides methods to start, commit, rollback, and run a transaction.
 */
export interface UnitOfWork {
  /**
   * Starts a new transaction.
   * @returns A promise that resolves when the transaction is started
   */
  startTransaction(): Promise<void>;
  /**
   * Commits the current transaction.
   * @returns A promise that resolves when the transaction is committed
   */
  commitTransaction(): Promise<void>;
  /**
   * Rolls back the current transaction.
   * @returns A promise that resolves when the transaction is rolled back
   */
  rollbackTransaction(): Promise<void>;
  /**
   * Runs a function within the context of a transaction.
   * @param work The function to run within the transaction
   * @returns A promise that resolves with the result of the function
   */
  runInTransaction<T>(work: () => Promise<T>): Promise<T>;
}
