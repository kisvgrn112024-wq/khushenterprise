import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/khush-enterprises');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`\n⚠️  MongoDB Connection Failed!`);
    console.error(`Error: ${error.message}`);
    console.error(`\n⚠️  The server is still running, but database features will not work.`);
    console.error(`Please ensure MongoDB is running locally on port 27017, or update the MONGO_URI in your .env file to a cloud database (like MongoDB Atlas).\n`);
    // Removed process.exit(1) to prevent the server from crashing
  }
};

export default connectDB;
