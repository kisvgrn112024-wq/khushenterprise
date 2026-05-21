import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
import Jimp from 'jimp';
type Product = any; // simplified product type for migration

// Helper to ensure upload directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const glassKeywords = ['beaker', 'flask', 'glassware', 'cylinder', 'ml', 'set', 'glass'];

const isGlassProduct = (product: Product): boolean => {
  const searchable = `${product.title || ''} ${product.category || ''} ${product.description || ''} ${product.sku || ''}`.toLowerCase();
  return glassKeywords.some(k => searchable.includes(k));
};

const downloadAndProcessImage = async (url: string, id: string, idx: number): Promise<string> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to download ${url}`);
    const buffer = await response.buffer();
    const image = await Jimp.read(buffer);
    // Convert to PNG
    image.cover(800, 800); // resize to max 800x800 preserving aspect
    const filename = `img_${Date.now()}_${id}_${idx}.png`;
    const filePath = path.join(uploadsDir, filename);
    await image.writeAsync(filePath);
    // Generate thumbnail
    const thumb = image.clone();
    thumb.cover(200, 200);
    const thumbName = `thumb_${filename}`;
    const thumbPath = path.join(uploadsDir, thumbName);
    await thumb.writeAsync(thumbPath);
    // Return the relative path used in the app
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Image processing error:', err);
    return '';
  }
};

const migrate = async () => {
  const rawData = fs.readFileSync(path.join(process.cwd(),'data','products.json'),'utf-8');
  const products: Product[] = JSON.parse(rawData);
  const updatedProducts: Product[] = [];
  for (const product of products) {
    // Assign category if glass
    if (isGlassProduct(product)) {
      product.category = 'chemistry Glass wear';
    }
    if (product.images && product.images.length) {
      const newImages: string[] = [];
      for (let i = 0; i < product.images.length; i++) {
        const imgUrl = product.images[i];
        if (imgUrl.startsWith('http') && !imgUrl.startsWith('/uploads')) {
          const localPath = await downloadAndProcessImage(imgUrl, product.id, i);
          if (localPath) newImages.push(localPath);
        } else {
          newImages.push(imgUrl);
        }
      }
      product.images = newImages;
    }
    updatedProducts.push(product);
  }
   const outPath = path.join(process.cwd(),'data','products.json');
   fs.writeFileSync(outPath, JSON.stringify(updatedProducts, null, 2));
   console.log('Migration completed. Updated', updatedProducts.length, 'products.');
};

migrate().catch(err => console.error('Migration failed:', err));
