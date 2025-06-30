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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const models_1 = require("../../models");
const profile_routes_1 = __importDefault(require("../../routes/profile.routes"));
const authMiddleware = __importStar(require("../../middlewares/auth.middleware"));
// Mock the auth middleware
jest.mock('../../middlewares/auth.middleware', () => ({
    authenticate: jest.fn((req, res, next) => next())
}));
// Mock the User model
jest.mock('../../models', () => ({
    User: {
        findByPk: jest.fn()
    }
}));
describe('Profile Routes', () => {
    let app;
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
        // Setup Express app
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use('/api/profile', profile_routes_1.default);
        // Configure auth middleware to attach mock user to request
        authMiddleware.authenticate.mockImplementation((req, res, next) => {
            req.user = mockUser;
            next();
        });
    });
    describe('GET /api/profile', () => {
        it('should return the user profile', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/api/profile')
                .expect('Content-Type', /json/)
                .expect(200);
            expect(response.body).toEqual({
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
            // Configure auth middleware to simulate unauthenticated request
            authMiddleware.authenticate.mockImplementation((req, res, next) => {
                req.user = undefined;
                next();
            });
            const response = yield (0, supertest_1.default)(app)
                .get('/api/profile')
                .expect('Content-Type', /json/)
                .expect(401);
            expect(response.body).toEqual({
                success: false,
                message: 'Unauthorized'
            });
        }));
    });
    describe('PUT /api/profile', () => {
        it('should update user profile', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock User.findByPk to return mockUser
            models_1.User.findByPk.mockResolvedValue(mockUser);
            const updateData = {
                firstName: 'Jane',
                lastName: 'Smith',
                dateOfBirth: '1992-05-15'
            };
            const response = yield (0, supertest_1.default)(app)
                .put('/api/profile')
                .send(updateData)
                .expect('Content-Type', /json/)
                .expect(200);
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
            expect(response.body).toEqual({
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
        it('should return 404 if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock User.findByPk to return null (user not found)
            models_1.User.findByPk.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app)
                .put('/api/profile')
                .send({ firstName: 'Jane' })
                .expect('Content-Type', /json/)
                .expect(404);
            expect(response.body).toEqual({
                success: false,
                message: 'User not found'
            });
        }));
    });
    describe('PUT /api/profile/onboarding', () => {
        it('should mark onboarding as completed', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock User.findByPk to return mockUser
            models_1.User.findByPk.mockResolvedValue(mockUser);
            const response = yield (0, supertest_1.default)(app)
                .put('/api/profile/onboarding')
                .expect('Content-Type', /json/)
                .expect(200);
            // Check if User.findByPk was called with correct userId
            expect(models_1.User.findByPk).toHaveBeenCalledWith(mockUser.id);
            // Check if user.update was called with correct data
            expect(mockUser.update).toHaveBeenCalledWith({
                onboarding_completed: true,
                updated_at: expect.any(Date)
            });
            // Check response
            expect(response.body).toEqual({
                success: true,
                message: 'Onboarding completed successfully',
                data: { onboardingCompleted: true }
            });
        }));
        it('should return 404 if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock User.findByPk to return null (user not found)
            models_1.User.findByPk.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app)
                .put('/api/profile/onboarding')
                .expect('Content-Type', /json/)
                .expect(404);
            expect(response.body).toEqual({
                success: false,
                message: 'User not found'
            });
        }));
    });
});
