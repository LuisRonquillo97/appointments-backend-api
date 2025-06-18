import { Repository, DataSource } from 'typeorm';
import { User } from '../../domain/entities/user';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { PaginationOptions, PaginatedResult } from '../../domain/types/pagination';
import { UserMapper } from '../mappers/user.mapper';

export class TypeORMUserRepository implements UserRepository {
  private repository: Repository<UserEntity>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserEntity);
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<User>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const [entities, total] = await this.repository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const totalPages = Math.ceil(total / limit);
    const data = entities.map((entity) => UserMapper.toDomain(entity));

    const paginatedResult: PaginatedResult<User> = {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };

    return paginatedResult;
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async create(user: User): Promise<User> {
    const entity = UserMapper.toEntity(user);
    const savedEntity = await this.repository.save(entity);
    return UserMapper.toDomain(savedEntity);
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    await this.repository.update(id, userData);
    const updated = await this.repository.findOne({ where: { id } });
    return updated ? UserMapper.toDomain(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
