import { generateToken, verifyToken, extractToken } from '../../utils/jwt';

describe('JWT Utilities', () => {
  const testPayload = {
    userId: 'test-user-id',
    email: 'test@example.com',
  };

  it('should generate a valid JWT token', () => {
    const token = generateToken(testPayload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // JWT has 3 parts separated by dots
  });

  it('should verify and decode a valid token', () => {
    const token = generateToken(testPayload);
    const decoded = verifyToken(token);
    expect(decoded).toBeDefined();
    expect(decoded?.userId).toBe(testPayload.userId);
    expect(decoded?.email).toBe(testPayload.email);
  });

  it('should return null for invalid token', () => {
    const decoded = verifyToken('invalid.token.string');
    expect(decoded).toBeNull();
  });

  it('should extract token from authorization header', () => {
    const authHeader = 'Bearer test-token';
    const token = extractToken(authHeader);
    expect(token).toBe('test-token');
  });

  it('should return null if authorization header is missing', () => {
    const token = extractToken(undefined);
    expect(token).toBeNull();
  });

  it('should return null if authorization header does not start with "Bearer "', () => {
    const token = extractToken('Token test-token');
    expect(token).toBeNull();
  });
});
