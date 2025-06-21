import { InvalidUserDataError } from '../errors/userErrors';

/**
 * Email value object.
 * Has functional methods from an email field.
 */
export class Email {
  /**
   * The email value.
   */
  private readonly value: string;

  /**
   * Email constructor.
   * @param email Email value.
   * @throws InvalidUserDataError if the email is not valid.
   */
  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new InvalidUserDataError('Invalid email format');
    }
    this.value = email;
  }

  /**
   * Checks if the email is valid.
   * @param email Email to check.
   * @returns True if the email is valid, false otherwise.
   */
  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Gets the email value.
   * @returns The email value.
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Compares the email value with another email.
   * @param email Email to compare.
   * @returns True if the emails are equal, false otherwise.
   */
  equals(email?: Email): boolean {
    if (!email) {
      return false;
    }
    return this.value === email.value;
  }

  /**
   * Returns the email value as a string.
   * @returns The email value.
   */
  toString(): string {
    return this.value;
  }
}
