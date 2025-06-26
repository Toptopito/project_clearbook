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
exports.deleteLabResult = exports.updateLabResult = exports.getLabResultById = exports.getLabResults = exports.createLabResult = void 0;
const models_1 = require("../models");
const uuid_1 = require("uuid");
/**
 * Create a new lab result
 * @route POST /api/lab-results
 */
const createLabResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { test_name, test_date, result_value, unit, reference_range_low, reference_range_high, lab_name, ordering_doctor, notes, is_abnormal } = req.body;
        // Get user_id from authenticated user
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        // Validate required fields
        if (!test_name || !test_date || result_value === undefined || !unit) {
            res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
            return;
        }
        // Validate user exists
        const user = yield models_1.User.findByPk(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        // Create the lab result
        const labResult = yield models_1.LabResult.create({
            id: (0, uuid_1.v4)(),
            user_id: userId,
            test_name,
            test_date: new Date(test_date),
            result_value: parseFloat(result_value),
            unit,
            reference_range_low: reference_range_low ? parseFloat(reference_range_low) : null,
            reference_range_high: reference_range_high ? parseFloat(reference_range_high) : null,
            lab_name: lab_name || null,
            ordering_doctor: ordering_doctor || null,
            notes: notes || null,
            is_abnormal: is_abnormal || false,
            created_at: new Date(),
            updated_at: new Date()
        });
        res.status(201).json({
            success: true,
            message: 'Lab result created successfully',
            data: {
                labResult
            }
        });
    }
    catch (error) {
        console.error('Error creating lab result:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during lab result creation'
        });
    }
});
exports.createLabResult = createLabResult;
/**
 * Get all lab results for the authenticated user
 * @route GET /api/lab-results
 */
const getLabResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const labResults = yield models_1.LabResult.findAll({
            where: { user_id: userId },
            order: [['test_date', 'DESC']]
        });
        res.status(200).json({
            success: true,
            data: {
                labResults
            }
        });
    }
    catch (error) {
        console.error('Error fetching lab results:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching lab results'
        });
    }
});
exports.getLabResults = getLabResults;
/**
 * Get a specific lab result by ID
 * @route GET /api/lab-results/:id
 */
const getLabResultById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const labResult = yield models_1.LabResult.findOne({
            where: {
                id,
                user_id: userId // Ensure user can only access their own lab results
            }
        });
        if (!labResult) {
            res.status(404).json({
                success: false,
                message: 'Lab result not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: {
                labResult
            }
        });
    }
    catch (error) {
        console.error('Error fetching lab result:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching lab result'
        });
    }
});
exports.getLabResultById = getLabResultById;
/**
 * Update a lab result
 * @route PUT /api/lab-results/:id
 */
const updateLabResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { test_name, test_date, result_value, unit, reference_range_low, reference_range_high, lab_name, ordering_doctor, notes, is_abnormal } = req.body;
        // Find the lab result and ensure it belongs to the user
        const labResult = yield models_1.LabResult.findOne({
            where: {
                id,
                user_id: userId
            }
        });
        if (!labResult) {
            res.status(404).json({
                success: false,
                message: 'Lab result not found or unauthorized'
            });
            return;
        }
        // Update the lab result
        yield labResult.update(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (test_name && { test_name })), (test_date && { test_date: new Date(test_date) })), (result_value !== undefined && { result_value: parseFloat(result_value) })), (unit && { unit })), ({ reference_range_low: reference_range_low ? parseFloat(reference_range_low) : null })), ({ reference_range_high: reference_range_high ? parseFloat(reference_range_high) : null })), ({ lab_name: lab_name || null })), ({ ordering_doctor: ordering_doctor || null })), ({ notes: notes || null })), (is_abnormal !== undefined && { is_abnormal })), { updated_at: new Date() }));
        res.status(200).json({
            success: true,
            message: 'Lab result updated successfully',
            data: {
                labResult
            }
        });
    }
    catch (error) {
        console.error('Error updating lab result:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during lab result update'
        });
    }
});
exports.updateLabResult = updateLabResult;
/**
 * Delete a lab result
 * @route DELETE /api/lab-results/:id
 */
const deleteLabResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        // Find the lab result and ensure it belongs to the user
        const labResult = yield models_1.LabResult.findOne({
            where: {
                id,
                user_id: userId
            }
        });
        if (!labResult) {
            res.status(404).json({
                success: false,
                message: 'Lab result not found or unauthorized'
            });
            return;
        }
        // Delete the lab result
        yield labResult.destroy();
        res.status(200).json({
            success: true,
            message: 'Lab result deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting lab result:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during lab result deletion'
        });
    }
});
exports.deleteLabResult = deleteLabResult;
