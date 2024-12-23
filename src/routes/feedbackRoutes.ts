import { Router } from 'express';
import {
  submitFeedback,
  getFeedbacks,
} from '../controllers/feedbackController';
import authMiddleware from '../middleware/authMiddleware';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

/**
 * @route   POST /feedback
 * @desc    Submit feedback for a completed claim
 * @access  Private
 */
router.post('/', authMiddleware, asyncHandler(submitFeedback));

/**
 * @route   GET /feedback
 * @desc    Get feedbacks (admin or user-specific)
 * @access  Private
 */
router.get('/', authMiddleware, asyncHandler(getFeedbacks));

export default router;
