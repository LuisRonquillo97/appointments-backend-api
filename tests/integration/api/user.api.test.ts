import request from 'supertest';
import { createServer } from '../../../src/infrastructure/http/server';
import { testDatabase } from '../../helpers/testDatabase';

describe('User API Integration Tests', () => {
  let app: any;

  beforeAll(async () => {
    await testDatabase.connect();
    const container = testDatabase.getContainer();
    app = createServer(container);
  });

  afterAll(async () => {
    await testDatabase.disconnect();
  });

  beforeEach(async () => {
    await testDatabase.clear();
  });

  describe('POST /api/v2/users', () => {
    it('should create user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const response = await request(app).post('/api/v2/users').send(userData).expect(201);

      expect(response.body).toMatchObject({
        code: 'OK_201_CREATEUSER',
        success: true,
        data: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      });
    });

    it('should return validation error for invalid data', async () => {
      const response = await request(app).post('/api/v2/users').send({}).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          'Name is required',
          'Must be a valid email',
          'Password is required',
          'Password must be at least 6 characters long',
        ]),
      );
    });
  });
});
