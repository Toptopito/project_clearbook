import request from 'supertest';
import express from 'express';
import { generateToken } from '../../utils/jwt';
import labResultRoutes from '../../routes/labResult.routes';
import { LabResult, User } from '../../models';
import { authenticate } from '../../middleware/auth';

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
  let app: express.Application;
  let testToken: string;
  const userId = '12345678-1234-1234-1234-123456789012';

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create Express application for testing
    app = express();
    app.use(express.json());
    app.use('/api/lab-results', labResultRoutes);

    // Mock authentication
    (authenticate as jest.Mock).mockImplementation((req, res, next) => {
      req.user = {
        userId,
        email: 'test@example.com'
      };
      next();
    });

    testToken = 'test-token';
    (generateToken as jest.Mock).mockReturnValue(testToken);
  });

  describe('POST /api/lab-results', () => {
    it('should create a new lab result', async () => {
      const newLabResult = {
        test_name: 'Glucose Test',
        test_date: '2025-01-01',
        result_value: 95,
        unit: 'mg/dL',
        is_abnormal: false
      };

      const createdLabResult = {
        id: '98765432-9876-9876-9876-987654321098',
        user_id: userId,
        ...newLabResult,
        created_at: new Date(),
        updated_at: new Date()
      };

      (User.findByPk as jest.Mock).mockResolvedValue({ id: userId });
      (LabResult.create as jest.Mock).mockResolvedValue(createdLabResult);

      const response = await request(app)
        .post('/api/lab-results')
        .send(newLabResult)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.labResult).toEqual(expect.objectContaining({
        id: createdLabResult.id,
        test_name: createdLabResult.test_name
      }));
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteLabResult = {
        // Missing required fields
        test_name: 'Glucose Test',
        // Missing test_date, result_value, unit
      };

      const response = await request(app)
        .post('/api/lab-results')
        .send(incompleteLabResult)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/lab-results', () => {
    it('should return all lab results for the user', async () => {
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

      (LabResult.findAll as jest.Mock).mockResolvedValue(mockLabResults);

      const response = await request(app)
        .get('/api/lab-results')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.labResults).toHaveLength(2);
      expect(LabResult.findAll).toHaveBeenCalledWith({
        where: { user_id: userId },
        order: [['test_date', 'DESC']]
      });
    });
  });

  describe('GET /api/lab-results/:id', () => {
    it('should return a specific lab result by ID', async () => {
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

      (LabResult.findOne as jest.Mock).mockResolvedValue(mockLabResult);

      const response = await request(app)
        .get(`/api/lab-results/${labResultId}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.labResult).toEqual(expect.objectContaining({
        id: labResultId,
        test_name: 'Glucose Test'
      }));
    });

    it('should return 404 if lab result is not found', async () => {
      const nonExistentId = 'non-existent-id';

      (LabResult.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/lab-results/${nonExistentId}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/lab-results/:id', () => {
    it('should update an existing lab result', async () => {
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

      (LabResult.findOne as jest.Mock).mockResolvedValue(mockLabResult);

      const response = await request(app)
        .put(`/api/lab-results/${labResultId}`)
        .send(updateData)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockLabResult.update).toHaveBeenCalled();
    });

    it('should return 404 if lab result to update is not found', async () => {
      const nonExistentId = 'non-existent-id';
      const updateData = { test_name: 'Updated Test Name' };

      (LabResult.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put(`/api/lab-results/${nonExistentId}`)
        .send(updateData)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/lab-results/:id', () => {
    it('should delete an existing lab result', async () => {
      const labResultId = '98765432-9876-9876-9876-987654321098';

      const mockLabResult = {
        id: labResultId,
        user_id: userId,
        destroy: jest.fn().mockResolvedValue(true)
      };

      (LabResult.findOne as jest.Mock).mockResolvedValue(mockLabResult);

      const response = await request(app)
        .delete(`/api/lab-results/${labResultId}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockLabResult.destroy).toHaveBeenCalled();
    });

    it('should return 404 if lab result to delete is not found', async () => {
      const nonExistentId = 'non-existent-id';

      (LabResult.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .delete(`/api/lab-results/${nonExistentId}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
