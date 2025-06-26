import { Password } from '../../../../src/domain/valueObjects/password';

describe('Password Value Object', () => {
  describe('create', () => {
    it('should create password with valid input', () => {
      const password = Password.create('password123');
      expect(password).toBeInstanceOf(Password);
    });

    it('should throw error for short password', () => {
      expect(() => Password.create('123')).toThrow();
    });

    it('should throw error for empty password', () => {
      expect(() => Password.create('')).toThrow();
    });
  });

  describe('verify', () => {
    it('should verify correct password', () => {
      const password = Password.create('password123');
      expect(password.verify('password123')).toBe(true);
    });

    it('should reject incorrect password', () => {
      const password = Password.create('password123');
      expect(password.verify('wrongpassword')).toBe(false);
    });
  });
});
