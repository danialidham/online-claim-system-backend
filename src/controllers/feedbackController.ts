import { Request, Response, NextFunction } from 'express';
import Feedback, { IFeedback } from '../models/Feedback';
import Claim from '../models/Claim';

export const submitFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const { claimId, rating, comments } = req.body;

  if (!user) {
    res.status(401).json({ message: 'Unauthorized.' });
    return;
  }

  try {
    const claim = await Claim.findById(claimId);
    if (!claim) {
      res.status(404).json({ message: 'Claim not found.' });
      return;
    }

    if (claim.userId !== user.id) {
      res.status(403).json({
        message: 'Forbidden. You cannot provide feedback for this claim.',
      });
      return;
    }

    if (claim.status !== 'completed') {
      res.status(400).json({
        message: 'Feedback can only be provided for completed claims.',
      });
      return;
    }

    const feedback: IFeedback = await Feedback.create({
      userId: user.id,
      claimId,
      rating,
      comments,
    });

    res.status(201).json({ feedback });
  } catch (error) {
    next(error);
  }
};

export const getFeedbacks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const { userId } = req.query;

  if (!user) {
    res.status(401).json({ message: 'Unauthorized.' });
    return;
  }

  try {
    let filter: any = {};
    if (userId) {
      filter.userId = Number(userId);
    } else {
      filter.userId = user.id;
    }

    const feedbacks = await Feedback.find(filter).populate('claimId');

    res.status(200).json({ feedbacks });
  } catch (error) {
    next(error);
  }
};
