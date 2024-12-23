import mongoose, { Schema, Document } from 'mongoose';

export interface IClaim extends Document {
  userId: number;
  status: 'active' | 'rejected' | 'appeal' | 'cancelled' | 'completed';
  appealReason?: string;
  cancellationReason?: string;
  appealDate?: Date;
  cancellationDate?: Date;
  claimDetails: any;
}

const ClaimSchema: Schema = new Schema(
  {
    userId: { type: Number, required: true },
    status: {
      type: String,
      enum: ['active', 'rejected', 'appeal', 'cancelled', 'completed'],
      default: 'active',
    },
    appealReason: { type: String },
    cancellationReason: { type: String },
    appealDate: { type: Date },
    cancellationDate: { type: Date },
    claimDetails: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IClaim>('Claim', ClaimSchema);
