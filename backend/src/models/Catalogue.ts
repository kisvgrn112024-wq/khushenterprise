import mongoose, { Document, Schema } from 'mongoose';

export interface ICatalogue extends Document {
  title: string;
  pdfUrl?: string;
}

const catalogueSchema = new Schema<ICatalogue>(
  {
    title: { type: String, required: true, unique: true },
    pdfUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ICatalogue>('Catalogue', catalogueSchema);
