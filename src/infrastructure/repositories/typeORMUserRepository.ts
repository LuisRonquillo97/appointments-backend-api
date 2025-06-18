import { Repository, DataSource } from 'typeorm';
import { User } from '../../domain/entities/user';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserEntity } from '../entities/user.entity'; // Updated path

export class TypeORMUserRepository implements UserRepository {
  private repository: Repository<UserEntity>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserEntity);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { id } });
    return user || null;
  }

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async create(user: User): Promise<User> {
    const newUser = this.repository.create({
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.repository.save(newUser);
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    await this.repository.update(id, {
      ...userData,
      updatedAt: new Date(),
    });

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
