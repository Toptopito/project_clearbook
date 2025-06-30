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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const test_db_1 = require("../helpers/test-db");
const user_1 = require("../../models/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../../utils/jwt");
// Import routes
const user_routes_1 = __importDefault(require("../../routes/user.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/users', user_routes_1.default);
describe('Profile API Routes', () => {
    let testDb;
    let testUser;
    let authToken;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        testDb = yield (0, test_db_1.createTestDb)();
        // Create a test user
        const hashedPassword = yield bcryptjs_1.default.hash('password123', 10);
        testUser = yield user_1.User.create({
            email: 'profiletest@example.com',
            password: hashedPassword,
            first_name: 'Test',
            last_name: 'User',
            onboarding_completed: false,
            created_at: new Date(),
            updated_at: new Date()
        });
        // Generate auth token for the test user
        authToken = (0, jwt_1.generateToken)(testUser);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_1.User.destroy({ where: { email: 'profiletest@example.com' } });
        yield (0, test_db_1.closeTestDb)(testDb);
    }));
    describe('GET /api/users/profile', () => {
        it('should get the user profile when authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', testUser.id);
            expect(response.body).toHaveProperty('email', 'profiletest@example.com');
            expect(response.body).toHaveProperty('first_name', 'Test');
            expect(response.body).toHaveProperty('last_name', 'User');
        }));
        it('should return 401 if not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/api/users/profile');
            expect(response.status).toBe(401);
        }));
    });
    describe('PUT /api/users/profile', () => {
        it('should update the user profile when authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedProfile = {
                first_name: 'Updated',
                last_name: 'Profile',
                date_of_birth: '1990-01-01',
                gender: 'Female',
                phone: '123-456-7890'
            };
            const response = yield (0, supertest_1.default)(app)
                .put('/api/users/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .send(updatedProfile);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'User profile updated successfully');
            // Verify the database was updated
            const updatedUser = yield user_1.User.findByPk(testUser.id);
            expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.first_name).toBe('Updated');
            expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.last_name).toBe('Profile');
            expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.date_of_birth).toBe('1990-01-01');
            expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.gender).toBe('Female');
            expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.phone).toBe('123-456-7890');
        }));
        it('should return 401 if not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedProfile = {
                first_name: 'Updated',
                last_name: 'Profile',
            };
            const response = yield (0, supertest_1.default)(app)
                .put('/api/users/profile')
                .send(updatedProfile);
            expect(response.status).toBe(401);
        }));
    });
    describe('PUT /api/users/onboarding', () => {
        it('should mark onboarding as completed when authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .put('/api/users/onboarding')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Onboarding completed successfully');
            // Verify the database was updated
            const updatedUser = yield user_1.User.findByPk(testUser.id);
            expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.onboarding_completed).toBe(true);
        }));
        it('should return 401 if not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .put('/api/users/onboarding');
            expect(response.status).toBe(401);
        }));
    });
});
