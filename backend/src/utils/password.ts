import bcrypt from 'bcrypt';

// Number of salt rounds for bcrypt
const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Verify a password against a hash
 * @param password Plain text password to check
 * @param hash Stored hash to compare against
 * @returns Boolean indicating if password matches
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate a random password reset token
 * @returns Random string token
 */
export const generateResetToken = (): string => {
  // Generate a random string of 32 characters
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export default {
  hashPassword,
  verifyPassword,
  generateResetToken,
};
