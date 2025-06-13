// src/infrastructure/entities/user.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { UserRole } from '../../domain/enums/user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @Column({ default: false })
  isActive: Boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  updatedById: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: true })
  deletedById: number;
}
