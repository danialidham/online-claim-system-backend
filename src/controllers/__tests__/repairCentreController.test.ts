import { Request, Response, NextFunction } from 'express';
import {
  createRepairCentre,
  getNearbyRepairCentres,
  getRepairCentreDetails,
} from '../repairController';
import RepairCentre from '../../models/RepairCentre';
import mongoose from 'mongoose';

jest.mock('../../models/RepairCentre');

describe('Repair Centre Controller', () => {
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

  describe('createRepairCentre', () => {
    it('should create a new repair centre successfully', async () => {
      req.user = { id: 1, email: 'admin@example.com' };
      req.body = {
        name: 'Repair Centre 1',
        address: '123 Street, City',
        contactNumber: '123-456-7890',
        latitude: 40.7128,
        longitude: -74.006,
        description: 'Best repair centre in town.',
      };

      const mockRepairCentre = {
        id: 'repair-centre-id',
        name: 'Repair Centre 1',
        address: '123 Street, City',
        contactNumber: '123-456-7890',
        location: {
          type: 'Point',
          coordinates: [-74.006, 40.7128],
        },
        description: 'Best repair centre in town.',
        save: jest.fn(),
      };
      (RepairCentre.create as jest.Mock).mockResolvedValue(mockRepairCentre);

      await createRepairCentre(req as Request, res as Response, next);

      expect(RepairCentre.create).toHaveBeenCalledWith({
        name: 'Repair Centre 1',
        address: '123 Street, City',
        contactNumber: '123-456-7890',
        location: {
          type: 'Point',
          coordinates: [-74.006, 40.7128],
        },
        description: 'Best repair centre in town.',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ repairCentre: mockRepairCentre });
    });

    it('should handle errors and call next with the error', async () => {
      req.user = { id: 1, email: 'admin@example.com' };
      req.body = {
        name: 'Repair Centre 1',
        address: '123 Street, City',
        contactNumber: '123-456-7890',
        latitude: 40.7128,
        longitude: -74.006,
        description: 'Best repair centre in town.',
      };

      const error = new Error('Database error');
      (RepairCentre.create as jest.Mock).mockRejectedValue(error);

      await createRepairCentre(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getNearbyRepairCentres', () => {
    it('should retrieve nearby repair centres based on location and radius', async () => {
      req.query = {
        latitude: '40.7128',
        longitude: '-74.0060',
        radius: '5000',
      };

      const mockCentres = [
        {
          id: 'centre-1',
          name: 'Repair Centre 1',
          address: '123 Street, City',
          contactNumber: '123-456-7890',
          location: {
            type: 'Point',
            coordinates: [-74.006, 40.7128],
          },
          description: 'Best repair centre in town.',
        },
      ];
      (RepairCentre.find as jest.Mock).mockResolvedValue(mockCentres);

      await getNearbyRepairCentres(req as Request, res as Response, next);

      expect(RepairCentre.find).toHaveBeenCalledWith({
        location: {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates: [-74.006, 40.7128],
            },
            $maxDistance: 5000,
          },
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ centres: mockCentres });
    });

    it('should use default radius if not provided', async () => {
      req.query = {
        latitude: '40.7128',
        longitude: '-74.0060',
      };

      const mockCentres = [
        {
          id: 'centre-1',
          name: 'Repair Centre 1',
          address: '123 Street, City',
          contactNumber: '123-456-7890',
          location: {
            type: 'Point',
            coordinates: [-74.006, 40.7128],
          },
          description: 'Best repair centre in town.',
        },
      ];
      (RepairCentre.find as jest.Mock).mockResolvedValue(mockCentres);

      await getNearbyRepairCentres(req as Request, res as Response, next);

      expect(RepairCentre.find).toHaveBeenCalledWith({
        location: {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates: [-74.006, 40.7128],
            },
            $maxDistance: 5000,
          },
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ centres: mockCentres });
    });

    it('should return 400 if latitude or longitude is missing', async () => {
      req.query = {
        latitude: '40.7128',

        radius: '5000',
      };

      await getNearbyRepairCentres(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Latitude and longitude are required.',
      });
      expect(RepairCentre.find).not.toHaveBeenCalled();
    });

    it('should handle errors and call next with the error', async () => {
      req.query = {
        latitude: '40.7128',
        longitude: '-74.0060',
        radius: '5000',
      };

      const error = new Error('Database error');
      (RepairCentre.find as jest.Mock).mockRejectedValue(error);

      await getNearbyRepairCentres(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getRepairCentreDetails', () => {
    it('should return 400 if repair centre ID is invalid', async () => {
      req.params = { id: 'invalid-id' };
      jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(false);

      await getRepairCentreDetails(req as Request, res as Response, next);

      expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(
        'invalid-id'
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid repair centre ID.',
      });
      expect(RepairCentre.findById).not.toHaveBeenCalled();
    });

    it('should return 404 if repair centre is not found', async () => {
      req.params = { id: 'nonexistent-id' };
      jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
      (RepairCentre.findById as jest.Mock).mockResolvedValue(null);

      await getRepairCentreDetails(req as Request, res as Response, next);

      expect(RepairCentre.findById).toHaveBeenCalledWith('nonexistent-id');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Repair centre not found.',
      });
    });

    it('should handle errors and call next with the error', async () => {
      req.params = { id: 'repair-centre-id' };
      jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);

      const error = new Error('Database error');
      (RepairCentre.findById as jest.Mock).mockRejectedValue(error);

      await getRepairCentreDetails(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
