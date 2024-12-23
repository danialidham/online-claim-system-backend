import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  userId: number;
  claimId: mongoose.Types.ObjectId;
  rating: number;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema(
  {
    userId: { type: Number, required: true },
    claimId: { type: Schema.Types.ObjectId, ref: 'Claim', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comments: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
