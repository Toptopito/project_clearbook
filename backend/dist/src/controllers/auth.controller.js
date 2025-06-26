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
exports.logout = exports.getCurrentUser = exports.login = exports.register = void 0;
const models_1 = require("../models");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
/**
 * Register a new user
 * @route POST /api/auth/register
 */
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, firstName, lastName, dateOfBirth, gender, phone } = req.body;
        // Validate required fields
        if (!email || !password || !firstName || !lastName) {
            res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
            return;
        }
        // Check if user already exists
        const existingUser = yield models_1.User.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'Email is already registered'
            });
            return;
        }
        // Hash password
        const passwordHash = yield (0, password_1.hashPassword)(password);
        // Create user
        const user = yield models_1.User.create({
            email,
            password_hash: passwordHash,
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth || null,
            gender: gender || null,
            phone: phone || null,
            onboarding_completed: false,
            created_at: new Date(),
            updated_at: new Date()
        });
        // Generate JWT token
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            email: user.email
        });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name
                },
                token
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});
exports.register = register;
/**
 * Login a user
 * @route POST /api/auth/login
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validate required fields
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
            return;
        }
        // Find user by email
        const user = yield models_1.User.findOne({ where: { email } });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
            return;
        }
        // Verify password
        const isPasswordValid = yield (0, password_1.verifyPassword)(password, user.password_hash);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
            return;
        }
        // Update last login timestamp
        user.last_login = new Date();
        yield user.save();
        // Generate JWT token
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            email: user.email
        });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    onboardingCompleted: user.onboarding_completed
                },
                token
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});
exports.login = login;
/**
 * Get the current user's profile
 * @route GET /api/auth/me
 */
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // User is attached to request by auth middleware
        const user = req.user;
        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    dateOfBirth: user.date_of_birth,
                    gender: user.gender,
                    phone: user.phone,
                    onboardingCompleted: user.onboarding_completed,
                    lastLogin: user.last_login
                }
            }
        });
    }
    catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});
exports.getCurrentUser = getCurrentUser;
/**
 * Logout user (client-side only)
 * @route POST /api/auth/logout
 */
const logout = (req, res) => {
    // JWT is stateless, so logout is handled on the client side
    // This endpoint is for completeness and could be used for audit logs
    res.status(200).json({
        success: true,
        message: 'Logout successful'
    });
};
exports.logout = logout;
exports.default = {
    register: exports.register,
    login: exports.login,
    getCurrentUser: exports.getCurrentUser,
    logout: exports.logout
};
