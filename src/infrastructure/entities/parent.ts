import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { States } from '../../domain/enums/states.enum';
import { User } from './user';

@Entity()
export class Parent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ length: 100, nullable: false })
  lastName: string;

  @Column({ length: 100, nullable: false })
  addressLine1: string;

  @Column({ length: 100, nullable: true })
  addressLine2: string;

  @Column({ length: 100, nullable: false })
  houseNumber: string;

  @Column({ length: 100, nullable: false })
  zipCode: string;

  @Column({ length: 100, nullable: false })
  neighborhood: string;

  @Column({
    type: 'enum',
    enum: States,
    nullable: false,
  })
  state: string;

  @Column({ default: false })
  isActive: Boolean;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: true })
  deletedById: number;
}
