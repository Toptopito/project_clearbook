import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { Sequelize } from 'sequelize';
import User from '../../models/user';
import authRoutes from '../../routes/auth.routes';
import { hashPassword } from '../../utils/password';
import { createTestDb } from '../setup';

describe('Auth Routes Integration Tests', () => {
  let app: express.Application;
  let sequelize: Sequelize;
  let testToken: string;

  beforeAll(async () => {
    // Create test database
    sequelize = createTestDb();
    
    // Initialize User model
    User.initialize(sequelize);
    
    // Sync database
    await sequelize.sync({ force: true });
    
    // Setup Express app for testing
    app = express();
    app.use(bodyParser.json());
    app.use('/api/auth', authRoutes);
    
    // Create a test user
    const passwordHash = await hashPassword('TestPassword123!');
    await User.create({
      id: '12345678-1234-1234-1234-123456789012',
      email: 'existing@example.com',
      password_hash: passwordHash,
      first_name: 'Existing',
      last_name: 'User',
      created_at: new Date(),
      updated_at: new Date(),
      onboarding_completed: false
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'NewPassword123!',
          firstName: 'New',
          lastName: 'User',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data.user.email', 'newuser@example.com');
      expect(response.body).toHaveProperty('data.token');
      
      // Save token for later tests
      testToken = response.body.data.token;
    });

    it('should not register a user with existing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'TestPassword123!',
          firstName: 'Duplicate',
          lastName: 'User',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Email is already registered');
    });

    it('should not register a user with missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'incomplete@example.com',
          // Missing password
          firstName: 'Incomplete',
          lastName: 'User',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'existing@example.com',
          password: 'TestPassword123!',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data.token');
      expect(response.body).toHaveProperty('data.user.email', 'existing@example.com');
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'existing@example.com',
          password: 'WrongPassword123!',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'TestPassword123!',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user profile with valid token', async () => {
      // First login to get a valid token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'existing@example.com',
          password: 'TestPassword123!',
        });
      
      const token = loginResponse.body.data.token;
      
      // Use token to access protected route
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data.user.email', 'existing@example.com');
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should successfully logout', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Logout successful');
    });
  });
});
