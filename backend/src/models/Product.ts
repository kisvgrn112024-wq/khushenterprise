import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  id: string; // Used for frontend mapping
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  icon: string;
  tag?: string;
  discount?: string;
  stock: number;
  images?: string[];
  images360?: string[];
  video?: string;
  category?: string;
  category_ref?: mongoose.Types.ObjectId;
  catalog?: string;
  catalog_id?: string;
  catalog_ref?: mongoose.Types.ObjectId;
  brand?: string;
  sku?: string;
  aiManualEnabled?: boolean;
  bulkPrice?: number;
  moq?: number;
  // Admin-storefront sync validation fields
  product_status?: string;
  edited_by_admin?: boolean;
  is_placeholder?: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    icon: { type: String, required: true },
    tag: { type: String },
    discount: { type: String },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String }],
    images360: [{ type: String }],
    video: { type: String },
    category: { type: String },
    category_ref: { type: Schema.Types.ObjectId, ref: 'Category' },
    catalog: { type: String, default: "" },
    catalog_id: { type: String, default: "" },
    catalog_ref: { type: Schema.Types.ObjectId, ref: 'Catalogue' },
    brand: { type: String },
    sku: { type: String },
    aiManualEnabled: { type: Boolean, default: false },
    bulkPrice: { type: Number },
    moq: { type: Number, default: 1 },
    product_status: { type: String, default: 'active' },
    edited_by_admin: { type: Boolean, default: false },
    is_placeholder: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
