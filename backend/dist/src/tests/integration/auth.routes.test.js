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
const body_parser_1 = __importDefault(require("body-parser"));
const user_1 = __importDefault(require("../../models/user"));
const auth_routes_1 = __importDefault(require("../../routes/auth.routes"));
const password_1 = require("../../utils/password");
const setup_1 = require("../setup");
describe('Auth Routes Integration Tests', () => {
    let app;
    let sequelize;
    let testToken;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create test database
        sequelize = (0, setup_1.createTestDb)();
        // Initialize User model
        user_1.default.initialize(sequelize);
        // Sync database
        yield sequelize.sync({ force: true });
        // Setup Express app for testing
        app = (0, express_1.default)();
        app.use(body_parser_1.default.json());
        app.use('/api/auth', auth_routes_1.default);
        // Create a test user
        const passwordHash = yield (0, password_1.hashPassword)('TestPassword123!');
        yield user_1.default.create({
            id: '12345678-1234-1234-1234-123456789012',
            email: 'existing@example.com',
            password_hash: passwordHash,
            first_name: 'Existing',
            last_name: 'User',
            created_at: new Date(),
            updated_at: new Date(),
            onboarding_completed: false
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield sequelize.close();
    }));
    describe('POST /api/auth/register', () => {
        it('should register a new user', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send({
                email: 'newuser@example.com',
                password: 'NewPassword123!',
                firstName: 'New',
                lastName: 'User',
            });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data.user.email', 'newuser@example.com');
            expect(response.body).toHaveProperty('data.token');
            // Save token for later tests
            testToken = response.body.data.token;
        }));
        it('should not register a user with existing email', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send({
                email: 'existing@example.com',
                password: 'TestPassword123!',
                firstName: 'Duplicate',
                lastName: 'User',
            });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('message', 'Email is already registered');
        }));
        it('should not register a user with missing required fields', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .post('/api/auth/register')
                .send({
                email: 'incomplete@example.com',
                // Missing password
                firstName: 'Incomplete',
                lastName: 'User',
            });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('success', false);
        }));
    });
    describe('POST /api/auth/login', () => {
        it('should login with correct credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({
                email: 'existing@example.com',
                password: 'TestPassword123!',
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data.token');
            expect(response.body).toHaveProperty('data.user.email', 'existing@example.com');
        }));
        it('should not login with incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({
                email: 'existing@example.com',
                password: 'WrongPassword123!',
            });
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('success', false);
        }));
        it('should not login with non-existent email', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({
                email: 'nonexistent@example.com',
                password: 'TestPassword123!',
            });
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('success', false);
        }));
    });
    describe('GET /api/auth/me', () => {
        it('should return user profile with valid token', () => __awaiter(void 0, void 0, void 0, function* () {
            // First login to get a valid token
            const loginResponse = yield (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({
                email: 'existing@example.com',
                password: 'TestPassword123!',
            });
            const token = loginResponse.body.data.token;
            // Use token to access protected route
            const response = yield (0, supertest_1.default)(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data.user.email', 'existing@example.com');
        }));
        it('should reject request without token', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/api/auth/me');
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('success', false);
        }));
        it('should reject request with invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalid-token');
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('success', false);
        }));
    });
    describe('POST /api/auth/logout', () => {
        it('should successfully logout', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .post('/api/auth/logout');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('message', 'Logout successful');
        }));
    });
});
