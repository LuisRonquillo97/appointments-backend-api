import { Email } from '../../../../src/domain/valueObjects/email';

describe('Email Value Object', () => {
  describe('constructor', () => {
    it('should create valid email', () => {
      const email = new Email('test@example.com');
      expect(email.toString()).toBe('test@example.com');
    });

    it('should throw error for invalid email', () => {
      expect(() => new Email('invalid-email')).toThrow();
    });

    it('should throw error for empty email', () => {
      expect(() => new Email('')).toThrow();
    });

    it('should throw error for null email', () => {
      expect(() => new Email(null as any)).toThrow();
    });
  });
});
