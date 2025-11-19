import express from 'express';
const router = express.Router();
import * as authController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/me', authMiddleware, authController.me); //

export default router;
