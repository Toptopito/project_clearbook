import { Request, Response } from 'express';
import { User } from '../models';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

/**
 * Register a new user
 * @route POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, dateOfBirth, gender, phone } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Email is already registered'
      });
      return;
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await User.create({
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth || null,
      gender: gender || null,
      phone: phone || null,
      onboarding_completed: false,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

/**
 * Login a user
 * @route POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
      return;
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    // Update last login timestamp
    user.last_login = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          onboardingCompleted: user.onboarding_completed
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

/**
 * Get the current user's profile
 * @route GET /api/auth/me
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // User is attached to request by auth middleware
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          dateOfBirth: user.date_of_birth,
          gender: user.gender,
          phone: user.phone,
          onboardingCompleted: user.onboarding_completed,
          lastLogin: user.last_login
        }
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Logout user (client-side only)
 * @route POST /api/auth/logout
 */
export const logout = (req: Request, res: Response): void => {
  // JWT is stateless, so logout is handled on the client side
  // This endpoint is for completeness and could be used for audit logs
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
};

/**
 * Request password reset
 * @route POST /api/auth/reset-password
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Validate required fields
    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required'
      });
      return;
    }

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // For security reasons, don't reveal that the email doesn't exist
      // Just return success response as if reset email was sent
      res.status(200).json({
        success: true,
        message: 'If your email is registered, you will receive reset instructions'
      });
      return;
    }

    // In a real implementation, generate a token and send email
    // For this MVP, just acknowledge the request
    
    // Optional: Update user record with reset token and expiry
    // user.reset_token = generatedToken;
    // user.reset_token_expires = new Date(Date.now() + 3600000); // 1 hour
    // await user.save();

    res.status(200).json({
      success: true,
      message: 'If your email is registered, you will receive reset instructions'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset request'
    });
  }
};

export default {
  register,
  login,
  getCurrentUser,
  logout,
  resetPassword
};
