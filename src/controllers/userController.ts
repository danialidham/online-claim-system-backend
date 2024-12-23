import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import asyncHandler from '../utils/asyncHandler';

/**
 * @desc    Get current user's profile
 * @route   GET /users/profile
 * @access  Private
 */
export const getProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: 'Unauthorized.' });
      return;
    }

    const foundUser = await User.findOne({ where: { id: user.id } });

    if (!foundUser) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    res.status(200).json({ user: foundUser });
  }
);

/**
 * @desc    Update current user's profile
 * @route   PUT /users/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { name, email, password } = req.body;

    if (!user) {
      res.status(401).json({ message: 'Unauthorized.' });
      return;
    }

    const foundUser = await User.findOne({ where: { id: user.id } });

    if (!foundUser) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    if (name) foundUser.name = name;
    if (email) foundUser.email = email;
    if (password) foundUser.password = password;

    await foundUser.save();

    res.status(200).json({ user: foundUser });
  }
);
