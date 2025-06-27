import express from 'express';
import * as profileController from '../controllers/profile.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// All profile routes require authentication
router.use(authenticate);

// Get current user profile
router.get('/', profileController.getCurrentProfile);

// Update user profile
router.put('/', profileController.updateProfile);

// Complete onboarding
router.put('/onboarding', profileController.completeOnboarding);

export default router;
