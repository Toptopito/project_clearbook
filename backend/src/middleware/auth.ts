import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

/**
 * Express middleware to authenticate requests using JWT token
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    // Extract token from auth header
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication token missing'
      });
      return;
    }

    // Verify token and extract payload
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.userId) {
      res.status(401).json({
        success: false,
        message: 'Invalid authentication token'
      });
      return;
    }

    // Add user info to request object using type assertion
    (req as any).user = {
      userId: decoded.userId,
      email: decoded.email
    };

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// User type for request object
export interface AuthUser {
  userId: string;
  email: string;
}

// Use type assertion instead of declaration merging
// This avoids conflicts with other middleware files
