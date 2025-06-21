import * as crypto from 'crypto';
import { InvalidUserDataError } from '../errors/userErrors';

/**
 * Password value object.
 * Has functional methods from a password field.
 */
export class Password {
  /**
   * @private Password hashed value.
   */
  private readonly hashedValue: string;
  /**
   * @private Password salt.
   */
  private readonly salt: string;

  /**
   * @private Password constructor.
   * @param hashedValue Password hashed value.
   * @param salt Password salt.
   */
  private constructor(hashedValue: string, salt: string) {
    this.hashedValue = hashedValue;
    this.salt = salt;
  }

  /**
   * @static Creates a new password from a plain password.
   * @param plainPassword
   * @returns Password object with a hashed password.
   */
  static create(plainPassword: string): Password {
    if (!plainPassword || plainPassword.length < 6) {
      throw new InvalidUserDataError('Password must be at least 6 characters long');
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hashedValue = crypto.pbkdf2Sync(plainPassword, salt, 1000, 64, 'sha512').toString('hex');

    return new Password(hashedValue, salt);
  }

  /**
   * Gets Password object from hashed value and salt.
   * @param hashedValue
   * @param salt
   * @returns Password object.
   */
  static fromHash(hashedValue: string, salt: string): Password {
    return new Password(hashedValue, salt);
  }

  /**
   * Verifies if the plain password matches the hashed password.
   * @param plainPassword
   * @returns True if the plain password matches the hashed password.
   */
  verify(plainPassword: string): boolean {
    const hash = crypto.pbkdf2Sync(plainPassword, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hashedValue === hash;
  }

  /**
   * Returns the hashed password.
   * @returns The hashed password.
   */
  getHashedValue(): string {
    return this.hashedValue;
  }

  /**
   * Returns the salt.
   * @returns The salt.
   */
  getSalt(): string {
    return this.salt;
  }
}
