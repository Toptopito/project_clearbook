"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../../utils/jwt");
describe('JWT Utilities', () => {
    const testPayload = {
        userId: 'test-user-id',
        email: 'test@example.com',
    };
    it('should generate a valid JWT token', () => {
        const token = (0, jwt_1.generateToken)(testPayload);
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        expect(token.split('.')).toHaveLength(3); // JWT has 3 parts separated by dots
    });
    it('should verify and decode a valid token', () => {
        const token = (0, jwt_1.generateToken)(testPayload);
        const decoded = (0, jwt_1.verifyToken)(token);
        expect(decoded).toBeDefined();
        expect(decoded === null || decoded === void 0 ? void 0 : decoded.userId).toBe(testPayload.userId);
        expect(decoded === null || decoded === void 0 ? void 0 : decoded.email).toBe(testPayload.email);
    });
    it('should return null for invalid token', () => {
        const decoded = (0, jwt_1.verifyToken)('invalid.token.string');
        expect(decoded).toBeNull();
    });
    it('should extract token from authorization header', () => {
        const authHeader = 'Bearer test-token';
        const token = (0, jwt_1.extractToken)(authHeader);
        expect(token).toBe('test-token');
    });
    it('should return null if authorization header is missing', () => {
        const token = (0, jwt_1.extractToken)(undefined);
        expect(token).toBeNull();
    });
    it('should return null if authorization header does not start with "Bearer "', () => {
        const token = (0, jwt_1.extractToken)('Token test-token');
        expect(token).toBeNull();
    });
});
