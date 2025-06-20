import { InvalidUserDataError } from '../errors/userErrors';

export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new InvalidUserDataError('Invalid email format');
    }
    this.value = email;
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  equals(email?: Email): boolean {
    if (!email) {
      return false;
    }
    return this.value === email.value;
  }

  toString(): string {
    return this.value;
  }
}
