import request from 'supertest';
import express from 'express';
import { User } from '../../models';
import profileRoutes from '../../routes/profile.routes';
import * as authMiddleware from '../../middlewares/auth.middleware';

// Mock the auth middleware
jest.mock('../../middlewares/auth.middleware', () => ({
  authenticate: jest.fn((req, res, next) => next())
}));

// Mock the User model
jest.mock('../../models', () => ({
  User: {
    findByPk: jest.fn()
  }
}));

describe('Profile Routes', () => {
  let app: express.Application;
  let mockUser: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup mock user
    mockUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      date_of_birth: '1990-01-01',
      gender: 'Male',
      phone: '+1234567890',
      onboarding_completed: false,
      update: jest.fn().mockResolvedValue(true)
    };

    // Setup Express app
    app = express();
    app.use(express.json());
    app.use('/api/profile', profileRoutes);

    // Configure auth middleware to attach mock user to request
    (authMiddleware.authenticate as jest.Mock).mockImplementation((req, res, next) => {
      req.user = mockUser;
      next();
    });
  });

  describe('GET /api/profile', () => {
    it('should return the user profile', async () => {
      const response = await request(app)
        .get('/api/profile')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: {
          profile: {
            id: mockUser.id,
            email: mockUser.email,
            firstName: mockUser.first_name,
            lastName: mockUser.last_name,
            dateOfBirth: mockUser.date_of_birth,
            gender: mockUser.gender,
            phone: mockUser.phone,
            onboardingCompleted: mockUser.onboarding_completed
          }
        }
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      // Configure auth middleware to simulate unauthenticated request
      (authMiddleware.authenticate as jest.Mock).mockImplementation((req, res, next) => {
        req.user = undefined;
        next();
      });

      const response = await request(app)
        .get('/api/profile')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toEqual({
        success: false,
        message: 'Unauthorized'
      });
    });
  });

  describe('PUT /api/profile', () => {
    it('should update user profile', async () => {
      // Mock User.findByPk to return mockUser
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '1992-05-15'
      };

      const response = await request(app)
        .put('/api/profile')
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);

      // Check if User.findByPk was called with correct userId
      expect(User.findByPk).toHaveBeenCalledWith(mockUser.id);

      // Check if user.update was called with correct data
      expect(mockUser.update).toHaveBeenCalledWith({
        first_name: 'Jane',
        last_name: 'Smith',
        date_of_birth: '1992-05-15',
        gender: mockUser.gender,
        phone: mockUser.phone,
        updated_at: expect.any(Date)
      });

      // Check response
      expect(response.body).toEqual({
        success: true,
        message: 'Profile updated successfully',
        data: {
          profile: {
            id: mockUser.id,
            email: mockUser.email,
            firstName: mockUser.first_name,
            lastName: mockUser.last_name,
            dateOfBirth: mockUser.date_of_birth,
            gender: mockUser.gender,
            phone: mockUser.phone,
            onboardingCompleted: mockUser.onboarding_completed
          }
        }
      });
    });

    it('should return 404 if user is not found', async () => {
      // Mock User.findByPk to return null (user not found)
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/api/profile')
        .send({ firstName: 'Jane' })
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        message: 'User not found'
      });
    });
  });

  describe('PUT /api/profile/onboarding', () => {
    it('should mark onboarding as completed', async () => {
      // Mock User.findByPk to return mockUser
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .put('/api/profile/onboarding')
        .expect('Content-Type', /json/)
        .expect(200);

      // Check if User.findByPk was called with correct userId
      expect(User.findByPk).toHaveBeenCalledWith(mockUser.id);

      // Check if user.update was called with correct data
      expect(mockUser.update).toHaveBeenCalledWith({
        onboarding_completed: true,
        updated_at: expect.any(Date)
      });

      // Check response
      expect(response.body).toEqual({
        success: true,
        message: 'Onboarding completed successfully',
        data: { onboardingCompleted: true }
      });
    });

    it('should return 404 if user is not found', async () => {
      // Mock User.findByPk to return null (user not found)
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/api/profile/onboarding')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        message: 'User not found'
      });
    });
  });
});
