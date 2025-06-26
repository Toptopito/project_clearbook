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
const labResult_controller_1 = require("../../controllers/labResult.controller");
const models_1 = require("../../models");
// Mock models
jest.mock('../../models', () => ({
    LabResult: {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        findByPk: jest.fn()
    },
    User: {
        findByPk: jest.fn()
    }
}));
describe('Lab Result Controller', () => {
    // Create mock request and response objects
    let mockRequest;
    let mockResponse;
    let responseObject = {};
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        // Set up response mock
        responseObject = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockImplementation(result => {
                responseObject = result;
                return mockResponse;
            })
        };
    });
    describe('createLabResult', () => {
        it('should create a lab result successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock data
            const userId = '12345678-1234-1234-1234-123456789012';
            const labResultData = {
                test_name: 'Glucose Test',
                test_date: '2025-01-01',
                result_value: 95,
                unit: 'mg/dL',
                is_abnormal: false
            };
            // Setup mock request
            mockRequest = {
                user: { userId, email: 'test@example.com' },
                body: labResultData
            };
            // Mock user findByPk to return a user
            models_1.User.findByPk.mockResolvedValue({ id: userId });
            // Mock lab result creation
            const createdLabResult = Object.assign(Object.assign({ id: '98765432-9876-9876-9876-987654321098', user_id: userId }, labResultData), { created_at: new Date(), updated_at: new Date() });
            models_1.LabResult.create.mockResolvedValue(createdLabResult);
            // Call controller function
            yield (0, labResult_controller_1.createLabResult)(mockRequest, mockResponse);
            // Assertions
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalled();
            expect(responseObject.success).toBe(true);
            expect(responseObject.data.labResult).toEqual(createdLabResult);
            expect(models_1.LabResult.create).toHaveBeenCalledWith(expect.objectContaining({
                user_id: userId,
                test_name: labResultData.test_name,
                unit: labResultData.unit
            }));
        }));
        it('should return 400 if required fields are missing', () => __awaiter(void 0, void 0, void 0, function* () {
            // Setup mock request with missing fields
            mockRequest = {
                user: { userId: '12345678-1234-1234-1234-123456789012', email: 'test@example.com' },
                body: {
                    test_name: 'Glucose Test',
                    // Missing test_date and other required fields
                }
            };
            // Call controller function
            yield (0, labResult_controller_1.createLabResult)(mockRequest, mockResponse);
            // Assertions
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(responseObject.success).toBe(false);
            expect(responseObject.message).toBe('Missing required fields');
        }));
    });
    describe('getLabResults', () => {
        it('should return all lab results for the user', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock data
            const userId = '12345678-1234-1234-1234-123456789012';
            // Setup mock request
            mockRequest = {
                user: { userId, email: 'test@example.com' }
            };
            // Mock lab results
            const labResults = [
                {
                    id: '98765432-9876-9876-9876-987654321098',
                    user_id: userId,
                    test_name: 'Glucose Test',
                    test_date: new Date(),
                    result_value: 95,
                    unit: 'mg/dL',
                    is_abnormal: false
                }
            ];
            models_1.LabResult.findAll.mockResolvedValue(labResults);
            // Call controller function
            yield (0, labResult_controller_1.getLabResults)(mockRequest, mockResponse);
            // Assertions
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(responseObject.success).toBe(true);
            expect(responseObject.data.labResults).toEqual(labResults);
            expect(models_1.LabResult.findAll).toHaveBeenCalledWith({
                where: { user_id: userId },
                order: [['test_date', 'DESC']]
            });
        }));
    });
    describe('getLabResultById', () => {
        it('should return a specific lab result by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock data
            const userId = '12345678-1234-1234-1234-123456789012';
            const labResultId = '98765432-9876-9876-9876-987654321098';
            // Setup mock request
            mockRequest = {
                user: { userId, email: 'test@example.com' },
                params: { id: labResultId }
            };
            // Mock lab result
            const labResult = {
                id: labResultId,
                user_id: userId,
                test_name: 'Glucose Test',
                test_date: new Date(),
                result_value: 95,
                unit: 'mg/dL',
                is_abnormal: false
            };
            models_1.LabResult.findOne.mockResolvedValue(labResult);
            // Call controller function
            yield (0, labResult_controller_1.getLabResultById)(mockRequest, mockResponse);
            // Assertions
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(responseObject.success).toBe(true);
            expect(responseObject.data.labResult).toEqual(labResult);
            expect(models_1.LabResult.findOne).toHaveBeenCalledWith({
                where: {
                    id: labResultId,
                    user_id: userId
                }
            });
        }));
        it('should return 404 if lab result is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock data
            const userId = '12345678-1234-1234-1234-123456789012';
            const labResultId = 'non-existent-id';
            // Setup mock request
            mockRequest = {
                user: { userId, email: 'test@example.com' },
                params: { id: labResultId }
            };
            // Mock lab result not found
            models_1.LabResult.findOne.mockResolvedValue(null);
            // Call controller function
            yield (0, labResult_controller_1.getLabResultById)(mockRequest, mockResponse);
            // Assertions
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(responseObject.success).toBe(false);
            expect(responseObject.message).toBe('Lab result not found');
        }));
    });
    describe('updateLabResult', () => {
        it('should update a lab result successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock data
            const userId = '12345678-1234-1234-1234-123456789012';
            const labResultId = '98765432-9876-9876-9876-987654321098';
            // Setup mock request
            mockRequest = {
                user: { userId, email: 'test@example.com' },
                params: { id: labResultId },
                body: {
                    test_name: 'Updated Test Name',
                    result_value: 100
                }
            };
            // Mock existing lab result
            const existingLabResult = {
                id: labResultId,
                user_id: userId,
                test_name: 'Original Test Name',
                test_date: new Date(),
                result_value: 95,
                unit: 'mg/dL',
                is_abnormal: false,
                update: jest.fn().mockResolvedValue(true)
            };
            models_1.LabResult.findOne.mockResolvedValue(existingLabResult);
            // Call controller function
            yield (0, labResult_controller_1.updateLabResult)(mockRequest, mockResponse);
            // Assertions
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(responseObject.success).toBe(true);
            expect(existingLabResult.update).toHaveBeenCalledWith(expect.objectContaining({
                test_name: 'Updated Test Name',
                result_value: 100,
                updated_at: expect.any(Date)
            }));
        }));
        it('should return 404 if lab result to update is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock data
            const userId = '12345678-1234-1234-1234-123456789012';
            const labResultId = 'non-existent-id';
            // Setup mock request
            mockRequest = {
                user: { userId, email: 'test@example.com' },
                params: { id: labResultId },
                body: {
                    test_name: 'Updated Test Name'
                }
            };
            // Mock lab result not found
            models_1.LabResult.findOne.mockResolvedValue(null);
            // Call controller function
            yield (0, labResult_controller_1.updateLabResult)(mockRequest, mockResponse);
            // Assertions
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(responseObject.success).toBe(false);
            expect(responseObject.message).toBe('Lab result not found or unauthorized');
        }));
    });
    describe('deleteLabResult', () => {
        it('should delete a lab result successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock data
            const userId = '12345678-1234-1234-1234-123456789012';
            const labResultId = '98765432-9876-9876-9876-987654321098';
            // Setup mock request
            mockRequest = {
                user: { userId, email: 'test@example.com' },
                params: { id: labResultId }
            };
            // Mock existing lab result
            const existingLabResult = {
                id: labResultId,
                user_id: userId,
                destroy: jest.fn().mockResolvedValue(true)
            };
            models_1.LabResult.findOne.mockResolvedValue(existingLabResult);
            // Call controller function
            yield (0, labResult_controller_1.deleteLabResult)(mockRequest, mockResponse);
            // Assertions
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(responseObject.success).toBe(true);
            expect(existingLabResult.destroy).toHaveBeenCalled();
        }));
        it('should return 404 if lab result to delete is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock data
            const userId = '12345678-1234-1234-1234-123456789012';
            const labResultId = 'non-existent-id';
            // Setup mock request
            mockRequest = {
                user: { userId, email: 'test@example.com' },
                params: { id: labResultId }
            };
            // Mock lab result not found
            models_1.LabResult.findOne.mockResolvedValue(null);
            // Call controller function
            yield (0, labResult_controller_1.deleteLabResult)(mockRequest, mockResponse);
            // Assertions
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(responseObject.success).toBe(false);
            expect(responseObject.message).toBe('Lab result not found or unauthorized');
        }));
    });
});
