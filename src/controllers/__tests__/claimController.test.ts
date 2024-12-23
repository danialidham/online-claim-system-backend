import { Request, Response, NextFunction } from 'express';
import {
  createClaim,
  updateClaim,
  cancelClaim,
  appealClaim,
  getClaims,
} from '../claimController';
import Claim from '../../models/Claim';

jest.mock('../../models/Claim');

describe('Claim Controller', () => {
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

    jest.clearAllMocks();
  });

  describe('createClaim', () => {
    it('should create a new claim successfully', async () => {
      req.user = { id: 1234, email: 'john@example.com' };
      req.body = { claimDetails: { description: 'Test claim', amount: 1000 } };

      const mockClaim = {
        id: 'claim-id-123',
        userId: 1234,
        status: 'active',
        claimDetails: { description: 'Test claim', amount: 1000 },
        save: jest.fn(),
      };

      (Claim.create as jest.Mock).mockResolvedValue(mockClaim);

      await createClaim(req as Request, res as Response, next);

      expect(Claim.create).toHaveBeenCalledWith({
        userId: 1234,
        claimDetails: { description: 'Test claim', amount: 1000 },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ claim: mockClaim });
    });

    it('should return 401 if user is not authenticated', async () => {
      req.body = { claimDetails: { description: 'Test claim', amount: 1000 } };
      await createClaim(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized.' });
      expect(Claim.create).not.toHaveBeenCalled();
    });

    it('should handle errors and call next with the error', async () => {
      req.user = { id: 1234, email: 'john@example.com' };
      req.body = { claimDetails: { description: 'Test claim', amount: 1000 } };

      const error = new Error('Database error');
      (Claim.create as jest.Mock).mockRejectedValue(error);

      await createClaim(req as Request, res as Response, next);

      expect(Claim.create).toHaveBeenCalledWith({
        userId: 1234,
        claimDetails: { description: 'Test claim', amount: 1000 },
      });
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('updateClaim', () => {
    it('should update an existing claim successfully', async () => {
      req.user = { id: 1234, email: 'john@example.com' };
      req.params = { id: 'claim-id-123' };
      req.body = {
        claimDetails: { description: 'Updated claim', amount: 1500 },
      };

      const mockClaim = {
        userId: 1234,
        id: 'claim-id-123',
        status: 'active',
        claimDetails: { description: 'Old claim', amount: 1000 },
        save: jest.fn(),
      };

      (Claim.findById as jest.Mock).mockResolvedValue(mockClaim);

      await updateClaim(req as Request, res as Response, next);

      expect(Claim.findById).toHaveBeenCalledWith('claim-id-123');
      expect(mockClaim.claimDetails).toEqual({
        description: 'Updated claim',
        amount: 1500,
      });
      expect(mockClaim.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ claim: mockClaim });
    });

    it('should return 401 if user is not authenticated', async () => {
      req.params = { id: 'claim-id-123' };
      req.body = {
        claimDetails: { description: 'Updated claim', amount: 1500 },
      };

      await updateClaim(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized.' });
      expect(Claim.findById).not.toHaveBeenCalled();
    });

    it('should return 404 if claim is not found', async () => {
      req.user = { id: 1234, email: 'john@example.com' };
      req.params = { id: 'nonexistent-claim-id' };
      req.body = {
        claimDetails: { description: 'Updated claim', amount: 1500 },
      };

      (Claim.findById as jest.Mock).mockResolvedValue(null);

      await updateClaim(req as Request, res as Response, next);

      expect(Claim.findById).toHaveBeenCalledWith('nonexistent-claim-id');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Claim not found.' });
    });

    it('should return 403 if user does not own the claim', async () => {
      req.user = { id: 456, email: 'jane@example.com' };
      req.params = { id: 'claim-id-123' };
      req.body = {
        claimDetails: { description: 'Updated claim', amount: 1500 },
      };

      const mockClaim = {
        userId: 1234,
        id: 'claim-id-123',
        status: 'active',
        claimDetails: { description: 'Old claim', amount: 1000 },
        save: jest.fn(),
      };

      (Claim.findById as jest.Mock).mockResolvedValue(mockClaim);

      await updateClaim(req as Request, res as Response, next);

      expect(Claim.findById).toHaveBeenCalledWith('claim-id-123');
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Forbidden. You cannot update this claim.',
      });
      expect(mockClaim.save).not.toHaveBeenCalled();
    });

    it('should handle errors and call next with the error', async () => {
      req.user = { id: 1234, email: 'john@example.com' };
      req.params = { id: 'claim-id-123' };
      req.body = {
        claimDetails: { description: 'Updated claim', amount: 1500 },
      };

      const error = new Error('Database error');
      (Claim.findById as jest.Mock).mockRejectedValue(error);

      await updateClaim(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('cancelClaim', () => {
    it('should cancel a claim successfully', async () => {
      req.user = { id: 1234, email: 'john@example.com' };
      req.params = { id: 'claim-id-123' };

      const mockClaim = {
        userId: 1234,
        id: 'claim-id-123',
        status: 'active',
        save: jest.fn(),
      };

      (Claim.findById as jest.Mock).mockResolvedValue(mockClaim);

      await cancelClaim(req as Request, res as Response, next);

      expect(Claim.findById).toHaveBeenCalledWith('claim-id-123');
      expect(mockClaim.status).toBe('cancelled');
      expect(mockClaim.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Claim has been cancelled.',
        claim: mockClaim,
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      req.params = { id: 'claim-id-123' };

      await cancelClaim(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized.' });
      expect(Claim.findById).not.toHaveBeenCalled();
    });

    it('should return 404 if claim is not found', async () => {
      req.user = { id: 1234, email: 'john@example.com' };
      req.params = { id: 'nonexistent-claim-id' };

      (Claim.findById as jest.Mock).mockResolvedValue(null);

      await cancelClaim(req as Request, res as Response, next);

      expect(Claim.findById).toHaveBeenCalledWith('nonexistent-claim-id');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Claim not found.' });
    });

    it('should return 403 if user does not own the claim', async () => {
      req.user = { id: 456, email: 'jane@example.com' };
      req.params = { id: 'claim-id-123' };

      const mockClaim = {
        userId: 1234,
        id: 'claim-id-123',
        status: 'active',
        save: jest.fn(),
      };

      (Claim.findById as jest.Mock).mockResolvedValue(mockClaim);

      await cancelClaim(req as Request, res as Response, next);

      expect(Claim.findById).toHaveBeenCalledWith('claim-id-123');
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Forbidden. You cannot cancel this claim.',
      });
      expect(mockClaim.save).not.toHaveBeenCalled();
    });
  });

  describe('appealClaim', () => {
    it('should appeal a rejected claim successfully', async () => {
      req.user = { id: 1234, email: 'john@example.com' };
      req.params = { id: 'claim-id-123' };
      req.body = { appealReason: 'I disagree with the decision.' };

      const mockClaim = {
        userId: 1234,
        id: 'claim-id-123',
        status: 'rejected',
        appealReason: '',
        appealDate: null,
        save: jest.fn(),
      };

      (Claim.findById as jest.Mock).mockResolvedValue(mockClaim);

      await appealClaim(req as Request, res as Response, next);

      expect(Claim.findById).toHaveBeenCalledWith('claim-id-123');
      expect(mockClaim.status).toBe('appeal');
      expect(mockClaim.appealReason).toBe('I disagree with the decision.');
      expect(mockClaim.appealDate).toBeInstanceOf(Date);
      expect(mockClaim.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Claim has been appealed.',
        claim: mockClaim,
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      req.params = { id: 'claim-id-123' };
      req.body = { appealReason: 'I disagree with the decision.' };

      await appealClaim(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized.' });
      expect(Claim.findById).not.toHaveBeenCalled();
    });

    it('should return 404 if claim is not found', async () => {
      req.user = { id: 1234, email: 'john@example.com' };
      req.params = { id: 'nonexistent-claim-id' };
      req.body = { appealReason: 'I disagree with the decision.' };

      (Claim.findById as jest.Mock).mockResolvedValue(null);

      await appealClaim(req as Request, res as Response, next);

      expect(Claim.findById).toHaveBeenCalledWith('nonexistent-claim-id');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Claim not found.' });
    });

    it('should return 403 if user does not own the claim', async () => {
      req.user = { id: 456, email: 'jane@example.com' };
      req.params = { id: 'claim-id-123' };
      req.body = { appealReason: 'I disagree with the decision.' };

      const mockClaim = {
        userId: 1234,
        id: 'claim-id-123',
        status: 'rejected',
        appealReason: '',
        appealDate: null,
        save: jest.fn(),
      };

      (Claim.findById as jest.Mock).mockResolvedValue(mockClaim);

      await appealClaim(req as Request, res as Response, next);

      expect(Claim.findById).toHaveBeenCalledWith('claim-id-123');
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Forbidden. You cannot appeal this claim.',
      });
      expect(mockClaim.save).not.toHaveBeenCalled();
    });

    it('should return 400 if claim status is not rejected', async () => {
      req.user = { id: 1234, email: 'john@example.com' };
      req.params = { id: 'claim-id-123' };
      req.body = { appealReason: 'I disagree with the decision.' };

      const mockClaim = {
        userId: 1234,
        id: 'claim-id-123',
        status: 'active',
        appealReason: '',
        appealDate: null,
        save: jest.fn(),
      };

      (Claim.findById as jest.Mock).mockResolvedValue(mockClaim);

      await appealClaim(req as Request, res as Response, next);

      expect(Claim.findById).toHaveBeenCalledWith('claim-id-123');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Only rejected claims can be appealed.',
      });
      expect(mockClaim.save).not.toHaveBeenCalled();
    });

    it('should handle errors and call next with the error', async () => {
      req.user = { id: 1234, email: 'john@example.com' };
      req.params = { id: 'claim-id-123' };
      req.body = { appealReason: 'I disagree with the decision.' };

      const error = new Error('Database error');
      (Claim.findById as jest.Mock).mockRejectedValue(error);

      await appealClaim(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getClaims', () => {
    it('should retrieve claims for the authenticated user with status filter', async () => {
      req.user = { id: 1234, email: 'john@example.com' };
      req.query = { status: 'active' };

      const mockClaims = [
        { id: 'claim-1', userId: 1234, status: 'active' },
        { id: 'claim-2', userId: 1234, status: 'active' },
      ];

      (Claim.find as jest.Mock).mockResolvedValue(mockClaims);

      await getClaims(req as Request, res as Response, next);

      expect(Claim.find).toHaveBeenCalledWith({
        userId: 1234,
        status: 'active',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ claims: mockClaims });
    });

    it('should retrieve all claims for the authenticated user if no status filter is provided', async () => {
      req.user = { id: 1234, email: 'john@example.com' };

      const mockClaims = [
        { id: 'claim-1', userId: 1234, status: 'active' },
        { id: 'claim-2', userId: 1234, status: 'rejected' },
      ];

      (Claim.find as jest.Mock).mockResolvedValue(mockClaims);

      await getClaims(req as Request, res as Response, next);

      expect(Claim.find).toHaveBeenCalledWith({ userId: 1234 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ claims: mockClaims });
    });

    it('should return 401 if user is not authenticated', async () => {
      req.query = { status: 'active' };
      await getClaims(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized.' });
      expect(Claim.find).not.toHaveBeenCalled();
    });

    it('should handle errors and call next with the error', async () => {
      req.user = { id: 1234, email: 'john@example.com' };
      req.query = { status: 'active' };

      const error = new Error('Database error');
      (Claim.find as jest.Mock).mockRejectedValue(error);

      await getClaims(req as Request, res as Response, next);

      expect(Claim.find).toHaveBeenCalledWith({
        userId: 1234,
        status: 'active',
      });
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
