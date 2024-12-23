// src/controllers/__tests__/feedbackController.test.ts

import { Request, Response, NextFunction } from 'express';
import { submitFeedback, getFeedbacks } from '../feedbackController';
import Feedback from '../../models/Feedback';

// Automatically use the mock implementations
jest.mock('../../models/Feedback');

describe('Feedback Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    // Clear mock histories before each test
    jest.clearAllMocks();
  });

  // Test Create Feedback
  describe('createFeedback', () => {
    it('should create a new feedback entry and return it', async () => {
      req.body = {
        userId: 'user-id-123',
        message: 'Great service!',
      };

      const mockFeedback = {
        id: 'feedback-id-123',
        userId: 'user-id-123',
        message: 'Great service!',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock Feedback.create to return the new feedback
      (Feedback.create as jest.Mock).mockResolvedValue(mockFeedback);

      await submitFeedback(req as Request, res as Response, next);

      expect(Feedback.create).toHaveBeenCalledWith({
        userId: 'user-id-123',
        message: 'Great service!',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ feedback: mockFeedback });
    });

    it('should handle errors and call next with the error', async () => {
      req.body = {
        userId: 'user-id-123',
        message: 'Great service!',
      };

      const error = new Error('Database error');

      // Mock Feedback.create to throw an error
      (Feedback.create as jest.Mock).mockRejectedValue(error);

      await submitFeedback(req as Request, res as Response, next);

      expect(Feedback.create).toHaveBeenCalledWith({
        userId: 'user-id-123',
        message: 'Great service!',
      });
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  // Test Get Feedbacks
  describe('getFeedbacks', () => {
    it('should retrieve all feedback entries', async () => {
      const mockFeedbacks = [
        {
          id: 'feedback-id-1',
          userId: 'user-id-1',
          message: 'Great service!',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'feedback-id-2',
          userId: 'user-id-2',
          message: 'Could be better.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Mock Feedback.find to return an array of feedbacks
      (Feedback.find as jest.Mock).mockResolvedValue(mockFeedbacks);

      await getFeedbacks(req as Request, res as Response, next);

      expect(Feedback.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ feedbacks: mockFeedbacks });
    });

    it('should handle errors and call next with the error', async () => {
      const error = new Error('Database error');

      // Mock Feedback.find to throw an error
      (Feedback.find as jest.Mock).mockRejectedValue(error);

      await getFeedbacks(req as Request, res as Response, next);

      expect(Feedback.find).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
