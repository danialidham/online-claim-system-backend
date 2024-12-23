import { Router } from 'express';
import {
  createClaim,
  updateClaim,
  cancelClaim,
  appealClaim,
  getClaims,
} from '../controllers/claimController';
import authMiddleware from '../middleware/authMiddleware';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

/**
 * @route   POST /claims
 * @desc    Submit a new claim
 * @access  Private
 */
router.post('/', authMiddleware, asyncHandler(createClaim));

/**
 * @route   PUT /claims/:id
 * @desc    Update a submitted claim
 * @access  Private
 */
router.put('/:id', authMiddleware, asyncHandler(updateClaim));

/**
 * @route   DELETE /claims/:id
 * @desc    Cancel a submitted claim
 * @access  Private
 */
router.delete('/:id', authMiddleware, asyncHandler(cancelClaim));

/**
 * @route   POST /claims/:id/appeal
 * @desc    Appeal a rejected claim
 * @access  Private
 */
router.post('/:id/appeal', authMiddleware, asyncHandler(appealClaim));

/**
 * @route   GET /claims
 * @desc    Get list of claims with filters
 * @access  Private
 */
router.get('/', authMiddleware, asyncHandler(getClaims));

export default router;
