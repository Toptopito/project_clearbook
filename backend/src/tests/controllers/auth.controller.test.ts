import { Request, Response } from 'express';
import { User } from '../../models';
import * as passwordUtils from '../../utils/password';
import * as jwtUtils from '../../utils/jwt';
import { register, login, getCurrentUser, logout } from '../../controllers/auth.controller';

// Mock dependencies
jest.mock('../../models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('../../utils/password', () => ({
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
}));

jest.mock('../../utils/jwt', () => ({
  generateToken: jest.fn(),
}));

describe('Auth Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mock response
    responseObject = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
        return mockResponse;
      }),
    };
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Setup mocks
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        save: jest.fn().mockResolvedValue(true),
      };
      
      // Mock findOne to return no existing user
      (User.findOne as jest.Mock).mockResolvedValue(null);
      
      // Mock hashPassword
      (passwordUtils.hashPassword as jest.Mock).mockResolvedValue('hashed_password');
      
      // Mock create to return a new user
      (User.create as jest.Mock).mockResolvedValue(mockUser);
      
      // Mock generateToken
      (jwtUtils.generateToken as jest.Mock).mockReturnValue('test-token');

      // Setup request
      mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'Password123!',
          firstName: 'Test',
          lastName: 'User',
        },
      };

      // Call function
      await register(mockRequest as Request, mockResponse as Response);

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(passwordUtils.hashPassword).toHaveBeenCalledWith('Password123!');
      expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
        email: 'test@example.com',
        password_hash: 'hashed_password',
        first_name: 'Test',
        last_name: 'User',
        date_of_birth: null,
        gender: null,
        phone: null,
        onboarding_completed: false
      }));
      expect(jwtUtils.generateToken).toHaveBeenCalledWith({
        userId: 'test-id',
        email: 'test@example.com',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject).toHaveProperty('success', true);
      expect(responseObject).toHaveProperty('data.token', 'test-token');
    });

    it('should return 400 if required fields are missing', async () => {
      // Setup request with missing fields
      mockRequest = {
        body: {
          email: 'test@example.com',
          // password missing
          firstName: 'Test',
          lastName: 'User',
        },
      };

      // Call function
      await register(mockRequest as Request, mockResponse as Response);

      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toHaveProperty('success', false);
      expect(responseObject).toHaveProperty('message', 'Missing required fields');
    });

    it('should return 400 if email is already registered', async () => {
      // Mock findOne to return an existing user
      (User.findOne as jest.Mock).mockResolvedValue({
        id: 'existing-id',
        email: 'test@example.com',
      });

      // Setup request
      mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'Password123!',
          firstName: 'Test',
          lastName: 'User',
        },
      };

      // Call function
      await register(mockRequest as Request, mockResponse as Response);

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toHaveProperty('success', false);
      expect(responseObject).toHaveProperty('message', 'Email is already registered');
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      // Setup mocks
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        password_hash: 'hashed_password',
        onboarding_completed: true,
        save: jest.fn().mockResolvedValue(true),
      };
      
      // Mock findOne to return a user
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      
      // Mock verifyPassword to return true
      (passwordUtils.verifyPassword as jest.Mock).mockResolvedValue(true);
      
      // Mock generateToken
      (jwtUtils.generateToken as jest.Mock).mockReturnValue('test-token');

      // Setup request
      mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'Password123!',
        },
      };

      // Call function
      await login(mockRequest as Request, mockResponse as Response);

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(passwordUtils.verifyPassword).toHaveBeenCalledWith('Password123!', 'hashed_password');
      expect(jwtUtils.generateToken).toHaveBeenCalledWith({
        userId: 'test-id',
        email: 'test@example.com',
      });
      expect(mockUser.save).toHaveBeenCalled(); // Should update last_login
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toHaveProperty('success', true);
      expect(responseObject).toHaveProperty('data.token', 'test-token');
    });

    it('should return 401 if email is not found', async () => {
      // Mock findOne to return null (no user found)
      (User.findOne as jest.Mock).mockResolvedValue(null);

      // Setup request
      mockRequest = {
        body: {
          email: 'nonexistent@example.com',
          password: 'Password123!',
        },
      };

      // Call function
      await login(mockRequest as Request, mockResponse as Response);

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(responseObject).toHaveProperty('success', false);
      expect(responseObject).toHaveProperty('message', 'Invalid email or password');
    });

    it('should return 401 if password is incorrect', async () => {
      // Setup mocks
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        password_hash: 'hashed_password',
      };
      
      // Mock findOne to return a user
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      
      // Mock verifyPassword to return false (incorrect password)
      (passwordUtils.verifyPassword as jest.Mock).mockResolvedValue(false);

      // Setup request
      mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'WrongPassword123!',
        },
      };

      // Call function
      await login(mockRequest as Request, mockResponse as Response);

      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(passwordUtils.verifyPassword).toHaveBeenCalledWith('WrongPassword123!', 'hashed_password');
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(responseObject).toHaveProperty('success', false);
      expect(responseObject).toHaveProperty('message', 'Invalid email or password');
    });
  });

  describe('getCurrentUser', () => {
    it('should return the current user profile', async () => {
      // Setup mock user in request (added by auth middleware)
      mockRequest = {
        user: {
          id: 'test-id',
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          date_of_birth: '1990-01-01',
          gender: 'Other',
          phone: '123-456-7890',
          onboarding_completed: true,
          last_login: new Date(),
        },
      };

      // Call function
      await getCurrentUser(mockRequest as Request, mockResponse as Response);

      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toHaveProperty('success', true);
      expect(responseObject).toHaveProperty('data.user.id', 'test-id');
      expect(responseObject).toHaveProperty('data.user.email', 'test@example.com');
      expect(responseObject).toHaveProperty('data.user.firstName', 'Test');
    });
  });

  describe('logout', () => {
    it('should return success message on logout', () => {
      // Call function
      logout({} as Request, mockResponse as Response);

      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toHaveProperty('success', true);
      expect(responseObject).toHaveProperty('message', 'Logout successful');
    });
  });
});
