// Express types not needed for Multer configuration
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Destination directory for uploads
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const ext = path.extname(originalName) || '.png';
    cb(null, `img_${timestamp}_${originalName}`);
  },
});

// File filter to accept only specific image types
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  if (allowedMimes.includes(file?.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PNG, JPEG, JPG, and WEBP are allowed.'), false);
  }
};

export const upload = multer({ storage, fileFilter });
