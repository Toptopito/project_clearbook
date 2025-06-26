"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// JWT secret key - use a strong, randomly generated key in production
const JWT_SECRET = process.env.JWT_SECRET || 'clearbook-development-secret-key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '24h';
/**
 * Generate a JWT token for a user
 * @param payload User data to include in the token
 * @returns JWT token string
 */
const generateToken = (payload) => {
    try {
        // @ts-ignore - Bypass type checking for jwt.sign
        return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    }
    catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Failed to generate authentication token');
    }
};
exports.generateToken = generateToken;
/**
 * Verify and decode a JWT token
 * @param token JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
/**
 * Extract token from request header
 * @param authHeader Authorization header value
 * @returns Token string or null if invalid format
 */
const extractToken = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7); // Remove 'Bearer ' prefix
};
exports.extractToken = extractToken;
exports.default = {
    generateToken: exports.generateToken,
    verifyToken: exports.verifyToken,
    extractToken: exports.extractToken,
};
