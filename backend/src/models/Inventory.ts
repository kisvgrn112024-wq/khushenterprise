import mongoose, { Document, Schema } from 'mongoose';

export interface IInventory extends Document {
  product: mongoose.Types.ObjectId;
  stockLevel: number;
}

const inventorySchema = new Schema<IInventory>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, unique: true },
    stockLevel: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IInventory>('Inventory', inventorySchema);
