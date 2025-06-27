import { Request, Response } from 'express';
import { User } from '../../models';
import * as profileController from '../../controllers/profile.controller';

// Mock the User model
jest.mock('../../models', () => ({
  User: {
    findByPk: jest.fn(),
  }
}));

describe('Profile Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
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

    // Setup mock request with user attached (simulating auth middleware)
    mockRequest = {
      user: mockUser
    };

    // Setup mock response with json and status methods
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe('getCurrentProfile', () => {
    it('should return user profile data if user is authenticated', async () => {
      // Call the controller
      await profileController.getCurrentProfile(
        mockRequest as Request, 
        mockResponse as Response
      );

      // Check response
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
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
      // Setup mock request without user (unauthenticated)
      mockRequest.user = undefined;

      // Call the controller
      await profileController.getCurrentProfile(
        mockRequest as Request, 
        mockResponse as Response
      );

      // Check response
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized'
      });
    });
  });

  describe('updateProfile', () => {
    it('should update user profile and return updated data', async () => {
      // Setup update data
      mockRequest.body = {
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '1992-05-15',
      };

      // Mock User.findByPk to return mockUser
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      // Call the controller
      await profileController.updateProfile(
        mockRequest as Request, 
        mockResponse as Response
      );

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
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
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

    it('should return 401 if user is not authenticated', async () => {
      // Setup mock request without user (unauthenticated)
      mockRequest.user = undefined;

      // Call the controller
      await profileController.updateProfile(
        mockRequest as Request, 
        mockResponse as Response
      );

      // Check response
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized'
      });
    });

    it('should return 404 if user is not found', async () => {
      // Mock User.findByPk to return null (user not found)
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      // Call the controller
      await profileController.updateProfile(
        mockRequest as Request, 
        mockResponse as Response
      );

      // Check response
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found'
      });
    });
  });

  describe('completeOnboarding', () => {
    it('should mark onboarding as completed', async () => {
      // Mock User.findByPk to return mockUser
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      // Call the controller
      await profileController.completeOnboarding(
        mockRequest as Request, 
        mockResponse as Response
      );

      // Check if User.findByPk was called with correct userId
      expect(User.findByPk).toHaveBeenCalledWith(mockUser.id);

      // Check if user.update was called with correct data
      expect(mockUser.update).toHaveBeenCalledWith({
        onboarding_completed: true,
        updated_at: expect.any(Date)
      });

      // Check response
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Onboarding completed successfully',
        data: { onboardingCompleted: true }
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      // Setup mock request without user (unauthenticated)
      mockRequest.user = undefined;

      // Call the controller
      await profileController.completeOnboarding(
        mockRequest as Request, 
        mockResponse as Response
      );

      // Check response
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized'
      });
    });

    it('should return 404 if user is not found', async () => {
      // Mock User.findByPk to return null (user not found)
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      // Call the controller
      await profileController.completeOnboarding(
        mockRequest as Request, 
        mockResponse as Response
      );

      // Check response
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found'
      });
    });
  });
});
