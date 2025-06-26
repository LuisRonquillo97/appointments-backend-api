// tests/unit/domain/entities/user.test.ts
import { User } from '../../../../src/domain/entities/user';
import { Email } from '../../../../src/domain/valueObjects/email';
import { Password } from '../../../../src/domain/valueObjects/password';
import { InvalidUserDataError } from '../../../../src/domain/errors/userErrors';

describe('User Entity', () => {
  describe('constructor', () => {
    it('should create user with valid data', () => {
      const userData = {
        id: '123',
        name: 'John Doe',
        email: new Email('john@example.com'),
        password: Password.create('password123'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const user = new User(userData);

      expect(user.id).toBe('123');
      expect(user.name).toBe('John Doe');
      expect(user.email.toString()).toBe('john@example.com');
      expect(user.isActive).toBe(true);
    });

    it('should set isActive to true by default', () => {
      const userData = {
        name: 'John Doe',
        email: new Email('john@example.com'),
        password: Password.create('password123'),
      };

      const user = new User(userData);

      expect(user.isActive).toBe(true);
    });

    it('should throw error for empty name', () => {
      const userData = {
        name: '',
        email: new Email('john@example.com'),
        password: Password.create('password123'),
      };

      expect(() => new User(userData)).toThrow(InvalidUserDataError);
    });

    it('should throw error for whitespace-only name', () => {
      const userData = {
        name: '   ',
        email: new Email('john@example.com'),
        password: Password.create('password123'),
      };

      expect(() => new User(userData)).toThrow(InvalidUserDataError);
    });
  });

  describe('updateName', () => {
    let user: User;

    beforeEach(() => {
      user = new User({
        name: 'John Doe',
        email: new Email('john@example.com'),
        password: Password.create('password123'),
      });
    });

    it('should update name successfully', () => {
      const newName = 'Jane Doe';
      user.updateName(newName);

      expect(user.name).toBe(newName);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw error for empty name', () => {
      expect(() => user.updateName('')).toThrow(InvalidUserDataError);
    });
  });

  describe('updateEmail', () => {
    let user: User;

    beforeEach(() => {
      user = new User({
        name: 'John Doe',
        email: new Email('john@example.com'),
        password: Password.create('password123'),
      });
    });

    it('should update email successfully', () => {
      const newEmail = new Email('jane@example.com');
      user.updateEmail(newEmail);

      expect(user.email.toString()).toBe('jane@example.com');
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('activate/deactivate', () => {
    let user: User;

    beforeEach(() => {
      user = new User({
        name: 'John Doe',
        email: new Email('john@example.com'),
        password: Password.create('password123'),
      });
    });

    it('should deactivate user', () => {
      user.deactivate();

      expect(user.isActive).toBe(false);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should activate user', () => {
      user.deactivate();
      user.activate();

      expect(user.isActive).toBe(true);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('verifyPassword', () => {
    let user: User;

    beforeEach(() => {
      user = new User({
        name: 'John Doe',
        email: new Email('john@example.com'),
        password: Password.create('password123'),
      });
    });

    it('should verify correct password', () => {
      expect(user.verifyPassword('password123')).toBe(true);
    });

    it('should reject incorrect password', () => {
      expect(user.verifyPassword('wrongpassword')).toBe(false);
    });

    it('should return false when no password is set', () => {
      const userWithoutPassword = new User({
        name: 'John Doe',
        email: new Email('john@example.com'),
      });

      expect(userWithoutPassword.verifyPassword('anypassword')).toBe(false);
    });
  });
});
