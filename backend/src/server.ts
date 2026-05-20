import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
// @ts-ignore
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import connectDB from './config/db';
import productRoutes from './routes/productRoutes';

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded images static folder
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Image Upload Endpoint (handles base64 image saving)
app.post('/api/upload', (req: Request, res: Response) => {
  try {
    const { image, name, type } = req.body;
    if (!image) {
      res.status(400).json({ error: 'No image data provided' });
      return;
    }

    // Strip out base64 header if exists (e.g. "data:image/png;base64,")
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    // Create unique safe filename
    const safeName = (name || 'upload.png').replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const filename = `img_${Date.now()}_${safeName}`;
    const filePath = path.join(uploadsDir, filename);

    // Save file
    fs.writeFileSync(filePath, buffer);
    console.log(`Image saved to ${filePath}`);

    // Return the static asset URL
    res.json({ url: `/uploads/${filename}` });
  } catch (error: any) {
    console.error('Upload failed:', error);
    res.status(500).json({ error: 'Image upload failed', details: error.message });
  }
});

// API Routes
app.use('/api/products', productRoutes);

// --- Resolve Frontend Path ---
// Try multiple strategies to find the frontend build
function findFrontendPath(): string {
  const candidates = [
    // From environment variable (highest priority)
    process.env.FRONTEND_PATH,
    // Inside the backend itself (copied during build) - works on Hostinger
    path.resolve(__dirname, '..', 'public'),
    // Relative to __dirname (local dev: backend/dist -> ../../frontend/out)
    path.resolve(__dirname, '..', '..', 'frontend', 'out'),
    // Relative to CWD
    path.resolve(process.cwd(), 'public'),
    path.resolve(process.cwd(), 'frontend', 'out'),
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    const indexPath = path.join(candidate, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log(`Frontend build found at: ${candidate}`);
      return candidate;
    }
  }

  console.error('Frontend build NOT found in any location!');
  console.error('  CWD:', process.cwd());
  console.error('  __dirname:', __dirname);
  return candidates[1] || candidates[0] || '';
}

const frontendPath = findFrontendPath();

// Try to find design folder
const designCandidates = [
  path.resolve(__dirname, '..', 'public', 'design'),
  path.resolve(__dirname, '..', '..', 'design'),
  path.resolve(process.cwd(), 'design'),
];
for (const d of designCandidates) {
  if (fs.existsSync(d)) {
    app.use('/design', express.static(d));
    break;
  }
}

// Serve Next.js static files
const nextStaticPath = path.join(frontendPath, '_next');
if (fs.existsSync(nextStaticPath)) {
  app.use('/_next', express.static(nextStaticPath));
}

// Serve other static assets
app.use(express.static(frontendPath, { index: false }));

// Root route
app.get('/', (_req: Request, res: Response) => {
  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).send(
      `Frontend build not found. Expected at: ${indexPath}\n` +
      `Tip: Run the build script to generate and copy the frontend.`
    );
  }
});

// Handle all other routes
app.use((req: Request, res: Response) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'API route not found' });
    return;
  }

  const cleanPath = req.path.replace(/\/$/, '') || '/index';
  const candidates = [
    path.join(frontendPath, `${cleanPath}.html`),
    path.join(frontendPath, cleanPath, 'index.html'),
    path.join(frontendPath, '404.html'),
    path.join(frontendPath, 'index.html'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      res.sendFile(candidate);
      return;
    }
  }

  res.status(404).send('Page not found.');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
