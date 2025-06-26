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
const jwt_1 = require("../../utils/jwt");
const labResult_routes_1 = __importDefault(require("../../routes/labResult.routes"));
const models_1 = require("../../models");
const auth_1 = require("../../middleware/auth");
// Mock the authentication middleware
jest.mock('../../middleware/auth', () => ({
    authenticate: jest.fn((req, res, next) => next())
}));
// Mock models
jest.mock('../../models', () => ({
    LabResult: {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        destroy: jest.fn()
    },
    User: {
        findByPk: jest.fn()
    }
}));
// Mock JWT util
jest.mock('../../utils/jwt', () => ({
    generateToken: jest.fn(),
    verifyToken: jest.fn()
}));
describe('Lab Result Routes', () => {
    let app;
    let testToken;
    const userId = '12345678-1234-1234-1234-123456789012';
    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        // Create Express application for testing
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use('/api/lab-results', labResult_routes_1.default);
        // Mock authentication
        auth_1.authenticate.mockImplementation((req, res, next) => {
            req.user = {
                userId,
                email: 'test@example.com'
            };
            next();
        });
        testToken = 'test-token';
        jwt_1.generateToken.mockReturnValue(testToken);
    });
    describe('POST /api/lab-results', () => {
        it('should create a new lab result', () => __awaiter(void 0, void 0, void 0, function* () {
            const newLabResult = {
                test_name: 'Glucose Test',
                test_date: '2025-01-01',
                result_value: 95,
                unit: 'mg/dL',
                is_abnormal: false
            };
            const createdLabResult = Object.assign(Object.assign({ id: '98765432-9876-9876-9876-987654321098', user_id: userId }, newLabResult), { created_at: new Date(), updated_at: new Date() });
            models_1.User.findByPk.mockResolvedValue({ id: userId });
            models_1.LabResult.create.mockResolvedValue(createdLabResult);
            const response = yield (0, supertest_1.default)(app)
                .post('/api/lab-results')
                .send(newLabResult)
                .set('Authorization', `Bearer ${testToken}`);
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.labResult).toEqual(expect.objectContaining({
                id: createdLabResult.id,
                test_name: createdLabResult.test_name
            }));
        }));
        it('should return 400 for missing required fields', () => __awaiter(void 0, void 0, void 0, function* () {
            const incompleteLabResult = {
                // Missing required fields
                test_name: 'Glucose Test',
                // Missing test_date, result_value, unit
            };
            const response = yield (0, supertest_1.default)(app)
                .post('/api/lab-results')
                .send(incompleteLabResult)
                .set('Authorization', `Bearer ${testToken}`);
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        }));
    });
    describe('GET /api/lab-results', () => {
        it('should return all lab results for the user', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockLabResults = [
                {
                    id: '98765432-9876-9876-9876-987654321098',
                    user_id: userId,
                    test_name: 'Glucose Test',
                    test_date: new Date(),
                    result_value: 95,
                    unit: 'mg/dL',
                    is_abnormal: false
                },
                {
                    id: '87654321-8765-8765-8765-876543210987',
                    user_id: userId,
                    test_name: 'Cholesterol Test',
                    test_date: new Date(),
                    result_value: 180,
                    unit: 'mg/dL',
                    is_abnormal: false
                }
            ];
            models_1.LabResult.findAll.mockResolvedValue(mockLabResults);
            const response = yield (0, supertest_1.default)(app)
                .get('/api/lab-results')
                .set('Authorization', `Bearer ${testToken}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.labResults).toHaveLength(2);
            expect(models_1.LabResult.findAll).toHaveBeenCalledWith({
                where: { user_id: userId },
                order: [['test_date', 'DESC']]
            });
        }));
    });
    describe('GET /api/lab-results/:id', () => {
        it('should return a specific lab result by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const labResultId = '98765432-9876-9876-9876-987654321098';
            const mockLabResult = {
                id: labResultId,
                user_id: userId,
                test_name: 'Glucose Test',
                test_date: new Date(),
                result_value: 95,
                unit: 'mg/dL',
                is_abnormal: false
            };
            models_1.LabResult.findOne.mockResolvedValue(mockLabResult);
            const response = yield (0, supertest_1.default)(app)
                .get(`/api/lab-results/${labResultId}`)
                .set('Authorization', `Bearer ${testToken}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.labResult).toEqual(expect.objectContaining({
                id: labResultId,
                test_name: 'Glucose Test'
            }));
        }));
        it('should return 404 if lab result is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const nonExistentId = 'non-existent-id';
            models_1.LabResult.findOne.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app)
                .get(`/api/lab-results/${nonExistentId}`)
                .set('Authorization', `Bearer ${testToken}`);
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        }));
    });
    describe('PUT /api/lab-results/:id', () => {
        it('should update an existing lab result', () => __awaiter(void 0, void 0, void 0, function* () {
            const labResultId = '98765432-9876-9876-9876-987654321098';
            const updateData = {
                test_name: 'Updated Test Name',
                result_value: 100
            };
            const mockLabResult = {
                id: labResultId,
                user_id: userId,
                test_name: 'Original Test Name',
                test_date: new Date(),
                result_value: 95,
                unit: 'mg/dL',
                is_abnormal: false,
                update: jest.fn().mockResolvedValue(true)
            };
            models_1.LabResult.findOne.mockResolvedValue(mockLabResult);
            const response = yield (0, supertest_1.default)(app)
                .put(`/api/lab-results/${labResultId}`)
                .send(updateData)
                .set('Authorization', `Bearer ${testToken}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(mockLabResult.update).toHaveBeenCalled();
        }));
        it('should return 404 if lab result to update is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const nonExistentId = 'non-existent-id';
            const updateData = { test_name: 'Updated Test Name' };
            models_1.LabResult.findOne.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app)
                .put(`/api/lab-results/${nonExistentId}`)
                .send(updateData)
                .set('Authorization', `Bearer ${testToken}`);
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        }));
    });
    describe('DELETE /api/lab-results/:id', () => {
        it('should delete an existing lab result', () => __awaiter(void 0, void 0, void 0, function* () {
            const labResultId = '98765432-9876-9876-9876-987654321098';
            const mockLabResult = {
                id: labResultId,
                user_id: userId,
                destroy: jest.fn().mockResolvedValue(true)
            };
            models_1.LabResult.findOne.mockResolvedValue(mockLabResult);
            const response = yield (0, supertest_1.default)(app)
                .delete(`/api/lab-results/${labResultId}`)
                .set('Authorization', `Bearer ${testToken}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(mockLabResult.destroy).toHaveBeenCalled();
        }));
        it('should return 404 if lab result to delete is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const nonExistentId = 'non-existent-id';
            models_1.LabResult.findOne.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app)
                .delete(`/api/lab-results/${nonExistentId}`)
                .set('Authorization', `Bearer ${testToken}`);
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        }));
    });
});
