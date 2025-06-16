import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserRole } from '../../domain/enums/user-role.enum';
import { Parent } from './parent.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class User extends BaseEntity {
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

  @OneToOne(() => Parent)
  @JoinColumn()
  parent: Parent;
}
