import mongoose, { Document, Schema } from 'mongoose';

export interface IB2BInquiry extends Document {
  inquiryId: string;
  clientName: string;
  location: string;
  category: string;
  targetDelivery: string;
  quantity: string;
  value: number;
  originalText: string;
  status: 'Pending' | 'Under Review' | 'Closed';
  notes?: string;
  clientTier: string;
}

const b2bInquirySchema = new Schema<IB2BInquiry>(
  {
    inquiryId: { type: String, required: true, unique: true },
    clientName: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    targetDelivery: { type: String, required: true },
    quantity: { type: String, required: true },
    value: { type: Number, required: true },
    originalText: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['Pending', 'Under Review', 'Closed'], 
      default: 'Pending', 
      required: true 
    },
    notes: { type: String, default: '' },
    clientTier: { type: String, default: 'Tier 3 Client', required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IB2BInquiry>('B2BInquiry', b2bInquirySchema);
