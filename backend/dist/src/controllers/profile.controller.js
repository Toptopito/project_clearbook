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
exports.completeOnboarding = exports.updateProfile = exports.getCurrentProfile = void 0;
const models_1 = require("../models");
/**
 * Get current user profile
 * @route GET /api/profile
 */
const getCurrentProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // User is attached to request by auth middleware
        const user = req.user;
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }
        // Return only necessary profile information
        res.status(200).json({
            success: true,
            data: {
                profile: {
                    id: user.id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    dateOfBirth: user.date_of_birth,
                    gender: user.gender,
                    phone: user.phone,
                    onboardingCompleted: user.onboarding_completed
                }
            }
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving profile'
        });
    }
});
exports.getCurrentProfile = getCurrentProfile;
/**
 * Update user profile
 * @route PUT /api/profile
 */
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // User is attached to request by auth middleware
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }
        const { firstName, lastName, dateOfBirth, gender, phone } = req.body;
        // Find user by ID
        const user = yield models_1.User.findByPk(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        // Update user profile fields
        yield user.update({
            first_name: firstName !== undefined ? firstName : user.first_name,
            last_name: lastName !== undefined ? lastName : user.last_name,
            date_of_birth: dateOfBirth !== undefined ? dateOfBirth : user.date_of_birth,
            gender: gender !== undefined ? gender : user.gender,
            phone: phone !== undefined ? phone : user.phone,
            updated_at: new Date()
        });
        // Return updated profile
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                profile: {
                    id: user.id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    dateOfBirth: user.date_of_birth,
                    gender: user.gender,
                    phone: user.phone,
                    onboardingCompleted: user.onboarding_completed
                }
            }
        });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating profile'
        });
    }
});
exports.updateProfile = updateProfile;
/**
 * Complete onboarding
 * @route PUT /api/profile/onboarding
 */
const completeOnboarding = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // User is attached to request by auth middleware
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }
        // Find user by ID
        const user = yield models_1.User.findByPk(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        // Update onboarding status
        yield user.update({
            onboarding_completed: true,
            updated_at: new Date()
        });
        res.status(200).json({
            success: true,
            message: 'Onboarding completed successfully',
            data: { onboardingCompleted: true }
        });
    }
    catch (error) {
        console.error('Complete onboarding error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error completing onboarding'
        });
    }
});
exports.completeOnboarding = completeOnboarding;
exports.default = {
    getCurrentProfile: exports.getCurrentProfile,
    updateProfile: exports.updateProfile,
    completeOnboarding: exports.completeOnboarding
};
