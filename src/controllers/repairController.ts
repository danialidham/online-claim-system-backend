import { Request, Response, NextFunction } from 'express';
import RepairCentre, { IRepairCentre } from '../models/RepairCentre';
import mongoose from 'mongoose';

export const createRepairCentre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, address, contactNumber, latitude, longitude, description } =
    req.body;

  try {
    const repairCentre: IRepairCentre = await RepairCentre.create({
      name,
      address,
      contactNumber,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      description,
    });

    res.status(201).json({ repairCentre });
  } catch (error) {
    next(error);
  }
};

export const getNearbyRepairCentres = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { latitude, longitude, radius } = req.query;

  if (!latitude || !longitude) {
    res.status(400).json({ message: 'Latitude and longitude are required.' });
    return;
  }

  const searchRadius = Number(radius) || 5000;

  try {
    const centres = await RepairCentre.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(longitude), Number(latitude)],
          },
          $maxDistance: searchRadius,
        },
      },
    });

    res.status(200).json({ centres });
  } catch (error) {
    next(error);
  }
};

export const getRepairCentreDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const centreId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(centreId)) {
    res.status(400).json({ message: 'Invalid repair centre ID.' });
    return;
  }

  try {
    const centre = await RepairCentre.findById(centreId);
    if (!centre) {
      res.status(404).json({ message: 'Repair centre not found.' });
      return;
    }

    res.status(200).json({ centre });
  } catch (error) {
    next(error);
  }
};
