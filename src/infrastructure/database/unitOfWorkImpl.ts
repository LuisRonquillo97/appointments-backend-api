import { DataSource, QueryRunner } from 'typeorm';
import { UnitOfWork } from '../../domain/repositories/unitOfWork';

/**
 * Unit of work implementation.
 * @param dataSource
 * @param unitOfWork
 */
export class unitOfWorkImpl implements UnitOfWork {
  private queryRunner?: QueryRunner;

  constructor(private dataSource: DataSource) {}

  /**
   * Starts a transaction.
   * @throws Error if there is an active transaction
   */
  async startTransaction(): Promise<void> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  /**
   * Commits the current transaction.
   * @throws Error if there is no active transaction
   */
  async commitTransaction(): Promise<void> {
    if (!this.queryRunner) {
      throw new Error('No active transaction');
    }
    await this.queryRunner.commitTransaction();
    await this.queryRunner.release();
    this.queryRunner = undefined;
  }

  /**
   * Rolls back the current transaction.
   * @throws Error if there is no active transaction
   */
  async rollbackTransaction(): Promise<void> {
    if (!this.queryRunner) {
      throw new Error('No active transaction');
    }
    await this.queryRunner.rollbackTransaction();
    await this.queryRunner.release();
    this.queryRunner = undefined;
  }

  /**
   * Runs a function within the context of a transaction.
   * @param work The function to run within the transaction
   * @returns A promise that resolves with the result of the function
   */
  async runInTransaction<T>(work: () => Promise<T>): Promise<T> {
    await this.startTransaction();
    try {
      const result = await work();
      await this.commitTransaction();
      return result;
    } catch (error) {
      await this.rollbackTransaction();
      throw error;
    }
  }

  /**
   * Gets the current query runner.
   * @returns The current query runner, or undefined if there is no active transaction
   */
  getQueryRunner(): QueryRunner | undefined {
    return this.queryRunner;
  }
}
