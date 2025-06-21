import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * Event entity from typeORM
 */
@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  eventName!: string;

  @Column({ nullable: true })
  aggregateId?: string;

  @Column('text')
  data!: string;

  @CreateDateColumn()
  occurredOn!: Date;
}
