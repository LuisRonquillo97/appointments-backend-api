import { AppDataSource } from '../config/database';
import { User } from '../entities/user.entity';
import { UserModel } from '../../domain/model/user.model';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserMapper } from '../mappers/user.mapper';

export class UserRepository implements IUserRepository {
  private repository = AppDataSource.getRepository(User);
  private userMapper: UserMapper = new UserMapper();

  async findByEmail(email: string): Promise<UserModel | null> {
    const entity = await this.repository.findOne({
      where: {
        email,
      },
    });
    return entity ? this.userMapper.toDomain(entity) : null;
  }

  async findById(id: number): Promise<UserModel | null> {
    const entity = await this.repository.findOne({
      where: {
        id,
      },
    });
    return entity ? this.userMapper.toDomain(entity) : null;
  }

  async create(userData: Partial<UserModel>): Promise<UserModel> {
    const entity = this.repository.create(this.userMapper.toEntity(userData as UserModel));
    const savedEntity = await this.repository.save(entity);
    return this.userMapper.toDomain(savedEntity);
  }

  async update(id: number, userData: Partial<UserModel>): Promise<UserModel | null> {
    await this.repository.update(id, userData);
    return this.findById(id);
  }

  async softDelete(id: number, deletedById: number): Promise<boolean> {
    await this.repository.update(id, { deletedById, isActive: false });
    const result = await this.repository.softDelete(id);
    return result.affected !== undefined && (result.affected ?? 0) > 0;
  }
}
