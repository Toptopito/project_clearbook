import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractToken } from '../utils/jwt';
import { User } from '../models';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Authentication middleware that verifies JWT tokens
 * and attaches the user to the request object
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const token = extractToken(req.headers.authorization);
    if (!token) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication token missing' 
      });
      return;
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
      return;
    }

    // Find user in database
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
      return;
    }

    // Attach user to request
    req.user = user;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
    return;
  }
};
// No default export, named export is already defined above
