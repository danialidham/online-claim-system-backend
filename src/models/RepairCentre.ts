import mongoose, { Schema, Document } from 'mongoose';

export interface IRepairCentre extends Document {
  name: string;
  address: string;
  contactNumber: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RepairCentreSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true },
    },
    description: { type: String },
  },
  { timestamps: true }
);

RepairCentreSchema.index({ location: '2dsphere' });

export default mongoose.model<IRepairCentre>(
  'RepairCentre',
  RepairCentreSchema
);
