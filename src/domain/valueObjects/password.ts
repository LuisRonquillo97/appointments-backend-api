import * as crypto from 'crypto';
import { InvalidUserDataError } from '../errors/userErrors';

export class Password {
  private readonly hashedValue: string;
  private readonly salt: string;

  private constructor(hashedValue: string, salt: string) {
    this.hashedValue = hashedValue;
    this.salt = salt;
  }

  static create(plainPassword: string): Password {
    if (!plainPassword || plainPassword.length < 6) {
      throw new InvalidUserDataError('Password must be at least 6 characters long');
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hashedValue = crypto.pbkdf2Sync(plainPassword, salt, 1000, 64, 'sha512').toString('hex');

    return new Password(hashedValue, salt);
  }

  static fromHash(hashedValue: string, salt: string): Password {
    return new Password(hashedValue, salt);
  }

  verify(plainPassword: string): boolean {
    const hash = crypto.pbkdf2Sync(plainPassword, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hashedValue === hash;
  }

  getHashedValue(): string {
    return this.hashedValue;
  }

  getSalt(): string {
    return this.salt;
  }
}
