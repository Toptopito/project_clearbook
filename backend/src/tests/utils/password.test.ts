import { hashPassword, verifyPassword, generateResetToken } from '../../utils/password';

describe('Password Utilities', () => {
  const testPassword = 'TestPassword123!';
  
  it('should hash a password', async () => {
    const hashedPassword = await hashPassword(testPassword);
    
    // Hash should be defined and a string
    expect(hashedPassword).toBeDefined();
    expect(typeof hashedPassword).toBe('string');
    
    // Hash should be different from original password
    expect(hashedPassword).not.toBe(testPassword);
    
    // BCrypt hashes start with $2b$ (algorithm identifier)
    expect(hashedPassword.startsWith('$2')).toBe(true);
  });

  it('should verify a correct password against its hash', async () => {
    const hashedPassword = await hashPassword(testPassword);
    const isValid = await verifyPassword(testPassword, hashedPassword);
    
    expect(isValid).toBe(true);
  });

  it('should reject an incorrect password', async () => {
    const hashedPassword = await hashPassword(testPassword);
    const isValid = await verifyPassword('WrongPassword123!', hashedPassword);
    
    expect(isValid).toBe(false);
  });

  it('should generate a reset token of sufficient length', () => {
    const resetToken = generateResetToken();
    
    expect(resetToken).toBeDefined();
    expect(typeof resetToken).toBe('string');
    expect(resetToken.length).toBeGreaterThan(20); // Should be reasonably long
  });

  it('should generate unique reset tokens', () => {
    const token1 = generateResetToken();
    const token2 = generateResetToken();
    
    expect(token1).not.toBe(token2);
  });
});
