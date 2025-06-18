// src/domain/entities/user.ts
import { InvalidUserDataError } from '../errors/userErrors';
import { Email } from '../valueObjects/email';
import { Password } from '../valueObjects/password';

export class User {
  id?: string;
  name: string;
  email: Email;
  password?: Password;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: {
    id?: string;
    name: string;
    email: Email;
    password?: Password;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;

    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new InvalidUserDataError('Name is required');
    }
  }

  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new InvalidUserDataError('Name is required');
    }
    this.name = name;
    this.updatedAt = new Date();
  }

  updateEmail(email: Email): void {
    this.email = email;
    this.updatedAt = new Date();
  }

  verifyPassword(plainPassword: string): boolean {
    if (!this.password) {
      return false;
    }
    return this.password.verify(plainPassword);
  }
}
