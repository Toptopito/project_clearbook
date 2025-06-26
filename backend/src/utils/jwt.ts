import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// JWT secret key - use a strong, randomly generated key in production
const JWT_SECRET = process.env.JWT_SECRET || 'clearbook-development-secret-key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '24h';

// Types
interface TokenPayload {
  userId: string;
  email: string;
}

/**
 * Generate a JWT token for a user
 * @param payload User data to include in the token
 * @returns JWT token string
 */
export const generateToken = (payload: TokenPayload): string => {
  try {
    // @ts-ignore - Bypass type checking for jwt.sign
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate authentication token');
  }
};

/**
 * Verify and decode a JWT token
 * @param token JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Extract token from request header
 * @param authHeader Authorization header value
 * @returns Token string or null if invalid format
 */
export const extractToken = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};

export default {
  generateToken,
  verifyToken,
  extractToken,
};
