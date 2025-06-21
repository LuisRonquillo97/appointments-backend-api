import { Repository, DataSource } from 'typeorm';
import { User } from '../../domain/entities/user';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { PaginationOptions, PaginatedResult } from '../../domain/types/pagination';
import { UserMapper } from '../mappers/user.mapper';
import { UserAlreadyDeletedError } from '../../domain/errors/userErrors';
import { UserNotFoundError } from '../../application/errors/userAppErrors';

/**
 * User repository implementation.
 * @implements UseRepository.
 */
export class UserRepositoryImpl implements UserRepository {
  private repository: Repository<UserEntity>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(UserEntity);
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<User>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const [entities, total] = await this.repository.findAndCount({
      where: { isActive: true },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const totalPages = Math.ceil(total / limit);
    const data = entities.map((entity) => UserMapper.toDomain(entity));

    const paginatedResult: PaginatedResult<User> = {
      records: data,
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
    const entity = await this.repository.findOne({ where: { id, isActive: true } });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async create(user: User): Promise<User> {
    const entity = UserMapper.toEntity(user);
    const savedEntity = await this.repository.save(entity);
    return UserMapper.toDomain(savedEntity);
  }

  async update(id: string, userData: User): Promise<User> {
    // Get the user
    const currentEntity = await this.repository.findOne({ where: { id } });
    if (!currentEntity) {
      throw new UserNotFoundError(id);
    }

    // Convertir el usuario de dominio a entidad
    const entityToUpdate = UserMapper.toEntity(userData);

    // Asegurarse de que el ID sea el correcto
    entityToUpdate.id = id;

    // Guardar la entidad actualizada
    const savedEntity = await this.repository.save(entityToUpdate);

    return UserMapper.toDomain(savedEntity);
  }

  async delete(id: string, softDelete: boolean = true): Promise<boolean> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      throw new UserNotFoundError(id);
    }
    if (!user.isActive) {
      throw new UserAlreadyDeletedError(id);
    }
    if (softDelete) {
      user.isActive = false;
      user.updatedAt = new Date();
      await this.repository.save(user);
      return true;
    } else {
      // Hard delete
      const result = await this.repository.delete(id);
      return (result.affected ?? 0) > 0;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email: email } });
    return entity ? UserMapper.toDomain(entity) : null;
  }
}
