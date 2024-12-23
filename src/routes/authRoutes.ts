import { Router } from 'express';
import { register, login, resetPassword } from '../controllers/authController';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', asyncHandler(register));

/**
 * @route   POST /auth/login
 * @desc    Login user and return JWT
 * @access  Public
 */
router.post('/login', asyncHandler(login));

/**
 * @route   POST /auth/reset-password
 * @desc    Reset user password
 * @access  Public
 */
router.post('/reset-password', asyncHandler(resetPassword));

export default router;
