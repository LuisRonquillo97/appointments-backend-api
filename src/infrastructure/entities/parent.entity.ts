import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { States } from '../../domain/enums/states.enum';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Parent extends BaseEntity {
  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ length: 100, nullable: false })
  lastName: string;

  @Column({ length: 100, nullable: false })
  phoneNumber: string;

  @Column({ length: 250, nullable: false })
  email: string;

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

  @Column({ length: 100, nullable: false })
  city: string;

  @Column({
    type: 'enum',
    enum: States,
    nullable: false,
  })
  state: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
