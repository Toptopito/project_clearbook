"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const models_1 = require("../../models");
const passwordUtils = __importStar(require("../../utils/password"));
const jwtUtils = __importStar(require("../../utils/jwt"));
const auth_controller_1 = require("../../controllers/auth.controller");
// Mock dependencies
jest.mock('../../models', () => ({
    User: {
        findOne: jest.fn(),
        create: jest.fn(),
    },
}));
jest.mock('../../utils/password', () => ({
    hashPassword: jest.fn(),
    verifyPassword: jest.fn(),
}));
jest.mock('../../utils/jwt', () => ({
    generateToken: jest.fn(),
}));
describe('Auth Controller', () => {
    let mockRequest;
    let mockResponse;
    let responseObject;
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        // Setup mock response
        responseObject = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockImplementation((result) => {
                responseObject = result;
                return mockResponse;
            }),
        };
    });
    describe('register', () => {
        it('should register a new user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Setup mocks
            const mockUser = {
                id: 'test-id',
                email: 'test@example.com',
                first_name: 'Test',
                last_name: 'User',
                save: jest.fn().mockResolvedValue(true),
            };
            // Mock findOne to return no existing user
            models_1.User.findOne.mockResolvedValue(null);
            // Mock hashPassword
            passwordUtils.hashPassword.mockResolvedValue('hashed_password');
            // Mock create to return a new user
            models_1.User.create.mockResolvedValue(mockUser);
            // Mock generateToken
            jwtUtils.generateToken.mockReturnValue('test-token');
            // Setup request
            mockRequest = {
                body: {
                    email: 'test@example.com',
                    password: 'Password123!',
                    firstName: 'Test',
                    lastName: 'User',
                },
            };
            // Call function
            yield (0, auth_controller_1.register)(mockRequest, mockResponse);
            // Assertions
            expect(models_1.User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
            expect(passwordUtils.hashPassword).toHaveBeenCalledWith('Password123!');
            expect(models_1.User.create).toHaveBeenCalledWith(expect.objectContaining({
                email: 'test@example.com',
                password_hash: 'hashed_password',
                first_name: 'Test',
                last_name: 'User',
                date_of_birth: null,
                gender: null,
                phone: null,
                onboarding_completed: false
            }));
            expect(jwtUtils.generateToken).toHaveBeenCalledWith({
                userId: 'test-id',
                email: 'test@example.com',
            });
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(responseObject).toHaveProperty('success', true);
            expect(responseObject).toHaveProperty('data.token', 'test-token');
        }));
        it('should return 400 if required fields are missing', () => __awaiter(void 0, void 0, void 0, function* () {
            // Setup request with missing fields
            mockRequest = {
                body: {
                    email: 'test@example.com',
                    // password missing
                    firstName: 'Test',
                    lastName: 'User',
                },
            };
            // Call function
            yield (0, auth_controller_1.register)(mockRequest, mockResponse);
            // Assertions
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(responseObject).toHaveProperty('success', false);
            expect(responseObject).toHaveProperty('message', 'Missing required fields');
        }));
        it('should return 400 if email is already registered', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock findOne to return an existing user
            models_1.User.findOne.mockResolvedValue({
                id: 'existing-id',
                email: 'test@example.com',
            });
            // Setup request
            mockRequest = {
                body: {
                    email: 'test@example.com',
                    password: 'Password123!',
                    firstName: 'Test',
                    lastName: 'User',
                },
            };
            // Call function
            yield (0, auth_controller_1.register)(mockRequest, mockResponse);
            // Assertions
            expect(models_1.User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(responseObject).toHaveProperty('success', false);
            expect(responseObject).toHaveProperty('message', 'Email is already registered');
        }));
    });
    describe('login', () => {
        it('should login a user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Setup mocks
            const mockUser = {
                id: 'test-id',
                email: 'test@example.com',
                first_name: 'Test',
                last_name: 'User',
                password_hash: 'hashed_password',
                onboarding_completed: true,
                save: jest.fn().mockResolvedValue(true),
            };
            // Mock findOne to return a user
            models_1.User.findOne.mockResolvedValue(mockUser);
            // Mock verifyPassword to return true
            passwordUtils.verifyPassword.mockResolvedValue(true);
            // Mock generateToken
            jwtUtils.generateToken.mockReturnValue('test-token');
            // Setup request
            mockRequest = {
                body: {
                    email: 'test@example.com',
                    password: 'Password123!',
                },
            };
            // Call function
            yield (0, auth_controller_1.login)(mockRequest, mockResponse);
            // Assertions
            expect(models_1.User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
            expect(passwordUtils.verifyPassword).toHaveBeenCalledWith('Password123!', 'hashed_password');
            expect(jwtUtils.generateToken).toHaveBeenCalledWith({
                userId: 'test-id',
                email: 'test@example.com',
            });
            expect(mockUser.save).toHaveBeenCalled(); // Should update last_login
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(responseObject).toHaveProperty('success', true);
            expect(responseObject).toHaveProperty('data.token', 'test-token');
        }));
        it('should return 401 if email is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock findOne to return null (no user found)
            models_1.User.findOne.mockResolvedValue(null);
            // Setup request
            mockRequest = {
                body: {
                    email: 'nonexistent@example.com',
                    password: 'Password123!',
                },
            };
            // Call function
            yield (0, auth_controller_1.login)(mockRequest, mockResponse);
            // Assertions
            expect(models_1.User.findOne).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(responseObject).toHaveProperty('success', false);
            expect(responseObject).toHaveProperty('message', 'Invalid email or password');
        }));
        it('should return 401 if password is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
            // Setup mocks
            const mockUser = {
                id: 'test-id',
                email: 'test@example.com',
                password_hash: 'hashed_password',
            };
            // Mock findOne to return a user
            models_1.User.findOne.mockResolvedValue(mockUser);
            // Mock verifyPassword to return false (incorrect password)
            passwordUtils.verifyPassword.mockResolvedValue(false);
            // Setup request
            mockRequest = {
                body: {
                    email: 'test@example.com',
                    password: 'WrongPassword123!',
                },
            };
            // Call function
            yield (0, auth_controller_1.login)(mockRequest, mockResponse);
            // Assertions
            expect(models_1.User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
            expect(passwordUtils.verifyPassword).toHaveBeenCalledWith('WrongPassword123!', 'hashed_password');
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(responseObject).toHaveProperty('success', false);
            expect(responseObject).toHaveProperty('message', 'Invalid email or password');
        }));
    });
    describe('getCurrentUser', () => {
        it('should return the current user profile', () => __awaiter(void 0, void 0, void 0, function* () {
            // Setup mock user in request (added by auth middleware)
            mockRequest = {
                user: {
                    id: 'test-id',
                    email: 'test@example.com',
                    first_name: 'Test',
                    last_name: 'User',
                    date_of_birth: '1990-01-01',
                    gender: 'Other',
                    phone: '123-456-7890',
                    onboarding_completed: true,
                    last_login: new Date(),
                },
            };
            // Call function
            yield (0, auth_controller_1.getCurrentUser)(mockRequest, mockResponse);
            // Assertions
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(responseObject).toHaveProperty('success', true);
            expect(responseObject).toHaveProperty('data.user.id', 'test-id');
            expect(responseObject).toHaveProperty('data.user.email', 'test@example.com');
            expect(responseObject).toHaveProperty('data.user.firstName', 'Test');
        }));
    });
    describe('logout', () => {
        it('should return success message on logout', () => {
            // Call function
            (0, auth_controller_1.logout)({}, mockResponse);
            // Assertions
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(responseObject).toHaveProperty('success', true);
            expect(responseObject).toHaveProperty('message', 'Logout successful');
        });
    });
});
