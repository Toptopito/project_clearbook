"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const labResult_controller_1 = require("../controllers/labResult.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     LabResult:
 *       type: object
 *       required:
 *         - test_name
 *         - test_date
 *         - result_value
 *         - unit
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the lab result
 *           example: 98765432-9876-9876-9876-987654321098
 *         user_id:
 *           type: string
 *           description: ID of the user who owns this lab result
 *           example: 12345678-1234-1234-1234-123456789012
 *         test_name:
 *           type: string
 *           description: Name of the test
 *           example: Glucose Test
 *         test_date:
 *           type: string
 *           format: date
 *           description: Date when the test was performed
 *           example: 2025-01-01
 *         result_value:
 *           type: number
 *           description: Numeric value of the test result
 *           example: 95
 *         unit:
 *           type: string
 *           description: Unit of measurement for the result
 *           example: mg/dL
 *         reference_range_low:
 *           type: number
 *           nullable: true
 *           description: Lower limit of the normal reference range
 *           example: 70
 *         reference_range_high:
 *           type: number
 *           nullable: true
 *           description: Upper limit of the normal reference range
 *           example: 99
 *         lab_name:
 *           type: string
 *           nullable: true
 *           description: Name of the laboratory that performed the test
 *           example: City Medical Labs
 *         ordering_doctor:
 *           type: string
 *           nullable: true
 *           description: Name of the doctor who ordered the test
 *           example: Dr. Jane Smith
 *         notes:
 *           type: string
 *           nullable: true
 *           description: Additional notes about the test
 *           example: Fasting blood test
 *         is_abnormal:
 *           type: boolean
 *           description: Whether the result is outside normal reference range
 *           example: false
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the record was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the record was last updated
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error message
 */
// All lab result routes require authentication
router.use(auth_1.authenticate);
/**
 * @swagger
 * /lab-results:
 *   post:
 *     summary: Create a new lab result
 *     tags: [Lab Results]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - test_name
 *               - test_date
 *               - result_value
 *               - unit
 *             properties:
 *               test_name:
 *                 type: string
 *                 example: Glucose Test
 *               test_date:
 *                 type: string
 *                 format: date
 *                 example: 2025-01-01
 *               result_value:
 *                 type: number
 *                 example: 95
 *               unit:
 *                 type: string
 *                 example: mg/dL
 *               reference_range_low:
 *                 type: number
 *                 example: 70
 *               reference_range_high:
 *                 type: number
 *                 example: 99
 *               lab_name:
 *                 type: string
 *                 example: City Medical Labs
 *               ordering_doctor:
 *                 type: string
 *                 example: Dr. Jane Smith
 *               notes:
 *                 type: string
 *                 example: Fasting blood test
 *               is_abnormal:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Lab result created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lab result created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     labResult:
 *                       $ref: '#/components/schemas/LabResult'
 *       400:
 *         description: Bad request, missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized, invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', labResult_controller_1.createLabResult);
/**
 * @swagger
 * /lab-results:
 *   get:
 *     summary: Get all lab results for authenticated user
 *     tags: [Lab Results]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of lab results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     labResults:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/LabResult'
 *       401:
 *         description: Unauthorized, invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', labResult_controller_1.getLabResults);
/**
 * @swagger
 * /lab-results/{id}:
 *   get:
 *     summary: Get a specific lab result by ID
 *     tags: [Lab Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID of the lab result
 *         example: 98765432-9876-9876-9876-987654321098
 *     responses:
 *       200:
 *         description: Lab result retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     labResult:
 *                       $ref: '#/components/schemas/LabResult'
 *       401:
 *         description: Unauthorized, invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Lab result not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', labResult_controller_1.getLabResultById);
/**
 * @swagger
 * /lab-results/{id}:
 *   put:
 *     summary: Update a lab result
 *     tags: [Lab Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID of the lab result
 *         example: 98765432-9876-9876-9876-987654321098
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               test_name:
 *                 type: string
 *                 example: Updated Glucose Test
 *               test_date:
 *                 type: string
 *                 format: date
 *                 example: 2025-01-02
 *               result_value:
 *                 type: number
 *                 example: 100
 *               unit:
 *                 type: string
 *                 example: mg/dL
 *               reference_range_low:
 *                 type: number
 *                 example: 70
 *               reference_range_high:
 *                 type: number
 *                 example: 99
 *               lab_name:
 *                 type: string
 *                 example: Updated City Medical Labs
 *               ordering_doctor:
 *                 type: string
 *                 example: Dr. John Smith
 *               notes:
 *                 type: string
 *                 example: Updated notes
 *               is_abnormal:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Lab result updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lab result updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     labResult:
 *                       $ref: '#/components/schemas/LabResult'
 *       401:
 *         description: Unauthorized, invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Lab result not found or unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', labResult_controller_1.updateLabResult);
/**
 * @swagger
 * /lab-results/{id}:
 *   delete:
 *     summary: Delete a lab result
 *     tags: [Lab Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID of the lab result
 *         example: 98765432-9876-9876-9876-987654321098
 *     responses:
 *       200:
 *         description: Lab result deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lab result deleted successfully
 *       401:
 *         description: Unauthorized, invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Lab result not found or unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', labResult_controller_1.deleteLabResult);
exports.default = router;
