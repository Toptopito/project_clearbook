import express from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/reset-password', authController.resetPassword);

// Protected routes (authentication required)
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
