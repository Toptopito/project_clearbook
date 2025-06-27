import request from 'supertest';
import express from 'express';
import { createTestDb, closeTestDb } from '../helpers/test-db';
import { User } from '../../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateToken } from '../../utils/jwt';

// Import routes
import userRoutes from '../../routes/user.routes';

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('Profile API Routes', () => {
  let testDb: any;
  let testUser: any;
  let authToken: string;

  beforeAll(async () => {
    testDb = await createTestDb();
    
    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    testUser = await User.create({
      email: 'profiletest@example.com',
      password: hashedPassword,
      first_name: 'Test',
      last_name: 'User',
      onboarding_completed: false,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    // Generate auth token for the test user
    authToken = generateToken(testUser);
  });

  afterAll(async () => {
    await User.destroy({ where: { email: 'profiletest@example.com' } });
    await closeTestDb(testDb);
  });

  describe('GET /api/users/profile', () => {
    it('should get the user profile when authenticated', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', testUser.id);
      expect(response.body).toHaveProperty('email', 'profiletest@example.com');
      expect(response.body).toHaveProperty('first_name', 'Test');
      expect(response.body).toHaveProperty('last_name', 'User');
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .get('/api/users/profile');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update the user profile when authenticated', async () => {
      const updatedProfile = {
        first_name: 'Updated',
        last_name: 'Profile',
        date_of_birth: '1990-01-01',
        gender: 'Female',
        phone: '123-456-7890'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedProfile);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'User profile updated successfully');
      
      // Verify the database was updated
      const updatedUser = await User.findByPk(testUser.id);
      expect(updatedUser?.first_name).toBe('Updated');
      expect(updatedUser?.last_name).toBe('Profile');
      expect(updatedUser?.date_of_birth).toBe('1990-01-01');
      expect(updatedUser?.gender).toBe('Female');
      expect(updatedUser?.phone).toBe('123-456-7890');
    });

    it('should return 401 if not authenticated', async () => {
      const updatedProfile = {
        first_name: 'Updated',
        last_name: 'Profile',
      };

      const response = await request(app)
        .put('/api/users/profile')
        .send(updatedProfile);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/users/onboarding', () => {
    it('should mark onboarding as completed when authenticated', async () => {
      const response = await request(app)
        .put('/api/users/onboarding')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Onboarding completed successfully');
      
      // Verify the database was updated
      const updatedUser = await User.findByPk(testUser.id);
      expect(updatedUser?.onboarding_completed).toBe(true);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .put('/api/users/onboarding');

      expect(response.status).toBe(401);
    });
  });
});
