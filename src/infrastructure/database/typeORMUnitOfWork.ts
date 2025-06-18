import { DataSource, QueryRunner } from 'typeorm';
import { UnitOfWork } from '../../domain/repositories/unitOfWork';

export class TypeORMUnitOfWork implements UnitOfWork {
  private queryRunner?: QueryRunner;

  constructor(private dataSource: DataSource) {}

  async startTransaction(): Promise<void> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  async commitTransaction(): Promise<void> {
    if (!this.queryRunner) {
      throw new Error('No active transaction');
    }
    await this.queryRunner.commitTransaction();
    await this.queryRunner.release();
    this.queryRunner = undefined;
  }

  async rollbackTransaction(): Promise<void> {
    if (!this.queryRunner) {
      throw new Error('No active transaction');
    }
    await this.queryRunner.rollbackTransaction();
    await this.queryRunner.release();
    this.queryRunner = undefined;
  }

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

  getQueryRunner(): QueryRunner | undefined {
    return this.queryRunner;
  }
}
