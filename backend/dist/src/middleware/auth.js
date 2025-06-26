"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
/**
 * Express middleware to authenticate requests using JWT token
 */
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded || !decoded.userId) {
            res.status(401).json({
                success: false,
                message: 'Invalid authentication token'
            });
            return;
        }
        // Add user info to request object using type assertion
        req.user = {
            userId: decoded.userId,
            email: decoded.email
        };
        // Continue to the next middleware or route handler
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }
});
exports.authenticate = authenticate;
// Use type assertion instead of declaration merging
// This avoids conflicts with other middleware files
