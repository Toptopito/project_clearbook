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
const profileController = __importStar(require("../../controllers/profile.controller"));
// Mock the User model
jest.mock('../../models', () => ({
    User: {
        findByPk: jest.fn(),
    }
}));
describe('Profile Controller', () => {
    let mockRequest;
    let mockResponse;
    let mockUser;
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        // Setup mock user
        mockUser = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: 'test@example.com',
            first_name: 'John',
            last_name: 'Doe',
            date_of_birth: '1990-01-01',
            gender: 'Male',
            phone: '+1234567890',
            onboarding_completed: false,
            update: jest.fn().mockResolvedValue(true)
        };
        // Setup mock request with user attached (simulating auth middleware)
        mockRequest = {
            user: mockUser
        };
        // Setup mock response with json and status methods
        mockResponse = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
        };
    });
    describe('getCurrentProfile', () => {
        it('should return user profile data if user is authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            // Call the controller
            yield profileController.getCurrentProfile(mockRequest, mockResponse);
            // Check response
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    profile: {
                        id: mockUser.id,
                        email: mockUser.email,
                        firstName: mockUser.first_name,
                        lastName: mockUser.last_name,
                        dateOfBirth: mockUser.date_of_birth,
                        gender: mockUser.gender,
                        phone: mockUser.phone,
                        onboardingCompleted: mockUser.onboarding_completed
                    }
                }
            });
        }));
        it('should return 401 if user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            // Setup mock request without user (unauthenticated)
            mockRequest.user = undefined;
            // Call the controller
            yield profileController.getCurrentProfile(mockRequest, mockResponse);
            // Check response
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: 'Unauthorized'
            });
        }));
    });
    describe('updateProfile', () => {
        it('should update user profile and return updated data', () => __awaiter(void 0, void 0, void 0, function* () {
            // Setup update data
            mockRequest.body = {
                firstName: 'Jane',
                lastName: 'Smith',
                dateOfBirth: '1992-05-15',
            };
            // Mock User.findByPk to return mockUser
            models_1.User.findByPk.mockResolvedValue(mockUser);
            // Call the controller
            yield profileController.updateProfile(mockRequest, mockResponse);
            // Check if User.findByPk was called with correct userId
            expect(models_1.User.findByPk).toHaveBeenCalledWith(mockUser.id);
            // Check if user.update was called with correct data
            expect(mockUser.update).toHaveBeenCalledWith({
                first_name: 'Jane',
                last_name: 'Smith',
                date_of_birth: '1992-05-15',
                gender: mockUser.gender,
                phone: mockUser.phone,
                updated_at: expect.any(Date)
            });
            // Check response
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: 'Profile updated successfully',
                data: {
                    profile: {
                        id: mockUser.id,
                        email: mockUser.email,
                        firstName: mockUser.first_name,
                        lastName: mockUser.last_name,
                        dateOfBirth: mockUser.date_of_birth,
                        gender: mockUser.gender,
                        phone: mockUser.phone,
                        onboardingCompleted: mockUser.onboarding_completed
                    }
                }
            });
        }));
        it('should return 401 if user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            // Setup mock request without user (unauthenticated)
            mockRequest.user = undefined;
            // Call the controller
            yield profileController.updateProfile(mockRequest, mockResponse);
            // Check response
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: 'Unauthorized'
            });
        }));
        it('should return 404 if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock User.findByPk to return null (user not found)
            models_1.User.findByPk.mockResolvedValue(null);
            // Call the controller
            yield profileController.updateProfile(mockRequest, mockResponse);
            // Check response
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: 'User not found'
            });
        }));
    });
    describe('completeOnboarding', () => {
        it('should mark onboarding as completed', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock User.findByPk to return mockUser
            models_1.User.findByPk.mockResolvedValue(mockUser);
            // Call the controller
            yield profileController.completeOnboarding(mockRequest, mockResponse);
            // Check if User.findByPk was called with correct userId
            expect(models_1.User.findByPk).toHaveBeenCalledWith(mockUser.id);
            // Check if user.update was called with correct data
            expect(mockUser.update).toHaveBeenCalledWith({
                onboarding_completed: true,
                updated_at: expect.any(Date)
            });
            // Check response
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: 'Onboarding completed successfully',
                data: { onboardingCompleted: true }
            });
        }));
        it('should return 401 if user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            // Setup mock request without user (unauthenticated)
            mockRequest.user = undefined;
            // Call the controller
            yield profileController.completeOnboarding(mockRequest, mockResponse);
            // Check response
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: 'Unauthorized'
            });
        }));
        it('should return 404 if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock User.findByPk to return null (user not found)
            models_1.User.findByPk.mockResolvedValue(null);
            // Call the controller
            yield profileController.completeOnboarding(mockRequest, mockResponse);
            // Check response
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: 'User not found'
            });
        }));
    });
});
