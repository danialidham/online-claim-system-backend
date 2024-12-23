import { Router } from 'express';
import {
  createRepairCentre,
  getNearbyRepairCentres,
  getRepairCentreDetails,
} from '../controllers/repairController';
import authMiddleware from '../middleware/authMiddleware';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

/**
 * @route   POST /repair-centres
 * @desc    Add a new repair centre
 * @access  Private
 */
router.post('/', authMiddleware, asyncHandler(createRepairCentre));

/**
 * @route   GET /repair-centres/nearby
 * @desc    Get nearby repair centres based on user's location
 * @access  Public
 */
router.get('/nearby', asyncHandler(getNearbyRepairCentres));

/**
 * @route   GET /repair-centres/:id
 * @desc    Get details of a specific repair centre
 * @access  Public
 */
router.get('/:id', asyncHandler(getRepairCentreDetails));

export default router;
