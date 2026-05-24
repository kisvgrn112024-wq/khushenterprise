import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  id: string; // generated order ID (e.g. KE-ORD-88741 or KE-ORD-xxxxxx)
  customer: string; // name
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  amount: string; // formatted total (e.g. ₹14,500.00 or $4,250.00)
  total: number; // numerical sum
  payment: string; // "Prepaid UPI" or "Cash on Delivery (COD)"
  status: string; // "Placed" | "Confirmed" | "Packed" | "Dispatched" | "Delivered" | "Cancelled"
  date: string;
  time: string;
  expectedDate: string;
  courier: string;
  tracking: string;
  itemsCount: number;
  items: IOrderItem[];
  progress: number; // 0 to 4
  weight: string;
  dimensions: string;
  hsnCode: string;
  packingDesc: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  title: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const orderSchema = new Schema<IOrder>(
  {
    id: { type: String, required: true, unique: true },
    customer: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    amount: { type: String, required: true },
    total: { type: Number, required: true },
    payment: { type: String, required: true },
    status: { type: String, required: true, default: 'Placed' },
    date: { type: String, required: true },
    time: { type: String, required: true },
    expectedDate: { type: String, default: 'Under verification' },
    courier: { type: String, default: 'TBD' },
    tracking: { type: String, default: 'TBD' },
    itemsCount: { type: Number, required: true },
    items: [orderItemSchema],
    progress: { type: Number, default: 0 },
    weight: { type: String, default: 'TBD' },
    dimensions: { type: String, default: 'TBD' },
    hsnCode: { type: String, default: 'HSN 9011 - Optical Instrument' },
    packingDesc: { type: String, default: 'TBD' }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export default Order;
