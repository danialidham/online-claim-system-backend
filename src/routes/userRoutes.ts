import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from '../utils/asyncHandler';
import authMiddleware from '../middleware/authMiddleware';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}

const router = Router();

/**
 * @route   GET /users/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get(
  '/profile',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    res.status(200).json({ user });
  })
);

export default router;
