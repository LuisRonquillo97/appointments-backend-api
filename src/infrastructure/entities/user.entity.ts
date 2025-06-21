import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as crypto from 'crypto';

/**
 * User entity from typeORM
 */
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  salt!: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  /**
   * If the user has a password, hashes it.
   * Runs before every insert and update.
   */
  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if (this.password) {
      // Generate a random salt if not exists
      if (!this.salt) {
        this.salt = crypto.randomBytes(16).toString('hex');
      }

      // Hash the password with the salt
      this.password = crypto
        .pbkdf2Sync(this.password, this.salt, 1000, 64, 'sha512')
        .toString('hex');
    }
  }

  /**
   * Validates if the password is correct.
   * @param password Password to validate.
   * @returns True if the password is correct.
   */
  validatePassword(password: string): boolean {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.password === hash;
  }
}
