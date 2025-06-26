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
const models_1 = require("../models");
/**
 * Authentication middleware that verifies JWT tokens
 * and attaches the user to the request object
 */
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get token from Authorization header
        const token = (0, jwt_1.extractToken)(req.headers.authorization);
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Authentication token missing'
            });
            return;
        }
        // Verify token
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
            return;
        }
        // Find user in database
        const user = yield models_1.User.findByPk(decoded.userId);
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
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
        return;
    }
});
exports.authenticate = authenticate;
// No default export, named export is already defined above
