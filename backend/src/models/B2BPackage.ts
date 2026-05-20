import mongoose, { Document, Schema } from 'mongoose';

export interface IB2BPackage extends Document {
  packageId: string;
  packageName: string;
  componentCount: number;
  basePrice: number;
  stockStatus: 'READY' | 'BACKORDER' | 'OUT OF STOCK';
  isActive: boolean;
  components: mongoose.Types.ObjectId[];
}

const b2bPackageSchema = new Schema<IB2BPackage>(
  {
    packageId: { type: String, required: true, unique: true },
    packageName: { type: String, required: true },
    componentCount: { type: Number, required: true, default: 0 },
    basePrice: { type: Number, required: true },
    stockStatus: {
      type: String,
      enum: ['READY', 'BACKORDER', 'OUT OF STOCK'],
      default: 'READY',
      required: true
    },
    isActive: { type: Boolean, default: true, required: true },
    components: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
  },
  { timestamps: true }
);

export default mongoose.model<IB2BPackage>('B2BPackage', b2bPackageSchema);
