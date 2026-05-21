import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';

const LISTING_ROOT = 'c:/web/listing/online listing or ke';
const UPLOADS_DIR = path.resolve('c:/web/backend/public/uploads');
const PRODUCTS_JSON = path.resolve('c:/web/backend/data/products.json');
const CATEGORY_NAME = 'glassware'; // you can change case if needed

/** Recursively collect image file paths from the listing folder. */
function collectImages(dir: string, acc: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectImages(full, acc);
    } else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

/** Convert any image to PNG and place it into the uploads folder. */
async function convertToPng(src: string): Promise<string> {
  const img = await Jimp.read(src);
  const base = path.basename(src, path.extname(src));
  const fileName = `img_${Date.now()}_${base}.png`;
  const dest = path.join(UPLOADS_DIR, fileName);
  await img.writeAsync(dest);
  return `/uploads/${fileName}`;
}

async function main() {
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  const imagePaths = collectImages(LISTING_ROOT);
  console.log(`Found ${imagePaths.length} image(s) in the listing folder.`);

  const products: any[] = [];
  for (const imgPath of imagePaths) {
    const url = await convertToPng(imgPath);
    const titleRaw = path.basename(imgPath, path.extname(imgPath));
    const title = titleRaw.replace(/[_-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const price = Math.floor(Math.random() * 4500) + 500; // 500‑5000 range
    const product = {
      id: `auto-${Date.now()}-${Math.random().toString(36).substr(2,5)}`,
      title,
      description: `Auto‑generated product for ${title}`,
      price,
      originalPrice: null,
      rating: 0,
      reviews: 0,
      icon: 'Image',
      tag: null,
      discount: null,
      stock: 100,
      product_status: 'active',
      edited_by_admin: true,
      category: CATEGORY_NAME,
      imageUrl: url,
    };
    products.push(product);
  }

  // Overwrite the products.json file with the new catalogue.
  fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(products, null, 2), 'utf-8');
  console.log(`Wrote ${products.length} products to ${PRODUCTS_JSON}`);
}

main().catch(err => console.error('Import error:', err));
