import { Request, Response, NextFunction } from 'express';
import Claim from '../models/Claim';
import asyncHandler from '../utils/asyncHandler';

/**
 * @desc    Create a new claim
 * @route   POST /claims
 * @access  Authenticated Users
 */
export const createClaim = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized.' });
      return;
    }

    const { claimDetails } = req.body;

    const claim = await Claim.create({
      userId: req.user.id,
      claimDetails,
    });

    res.status(201).json({ claim });
  }
);

/**
 * @desc    Update an existing claim
 * @route   PUT /claims/:id
 * @access  Authenticated Users
 */
export const updateClaim = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized.' });
      return;
    }

    const { id } = req.params;
    const { claimDetails } = req.body;

    const claim = await Claim.findById(id);

    if (!claim) {
      res.status(404).json({ message: 'Claim not found.' });
      return;
    }

    if (claim.userId !== req.user.id) {
      res
        .status(403)
        .json({ message: 'Forbidden. You cannot update this claim.' });
      return;
    }

    claim.claimDetails = claimDetails;
    await claim.save();

    res.status(200).json({ claim });
  }
);

/**
 * @desc    Cancel a claim
 * @route   DELETE /claims/:id
 * @access  Authenticated Users
 */
export const cancelClaim = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized.' });
      return;
    }

    const { id } = req.params;

    const claim = await Claim.findById(id);

    if (!claim) {
      res.status(404).json({ message: 'Claim not found.' });
      return;
    }

    if (claim.userId !== req.user.id) {
      res
        .status(403)
        .json({ message: 'Forbidden. You cannot cancel this claim.' });
      return;
    }

    claim.status = 'cancelled';
    await claim.save();

    res.status(200).json({
      message: 'Claim has been cancelled.',
      claim,
    });
  }
);

/**
 * @desc    Appeal a rejected claim
 * @route   POST /claims/:id/appeal
 * @access  Authenticated Users
 */
export const appealClaim = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized.' });
      return;
    }

    const { id } = req.params;
    const { appealReason } = req.body;

    const claim = await Claim.findById(id);

    if (!claim) {
      res.status(404).json({ message: 'Claim not found.' });
      return;
    }

    if (claim.userId !== req.user.id) {
      res
        .status(403)
        .json({ message: 'Forbidden. You cannot appeal this claim.' });
      return;
    }

    if (claim.status !== 'rejected') {
      res
        .status(400)
        .json({ message: 'Only rejected claims can be appealed.' });
      return;
    }

    claim.status = 'appeal';
    claim.appealReason = appealReason;
    claim.appealDate = new Date();
    await claim.save();

    res.status(200).json({
      message: 'Claim has been appealed.',
      claim,
    });
  }
);

/**
 * @desc    Get claims for the authenticated user
 * @route   GET /claims
 * @access  Authenticated Users
 */
export const getClaims = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized.' });
      return;
    }

    const { status } = req.query;

    const query: any = { userId: req.user.id };
    if (status) {
      query.status = status;
    }

    const claims = await Claim.find(query);

    res.status(200).json({ claims });
  }
);
