import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';
import { defaultProducts } from '../config/fileDb';

const LISTING_ROOT = 'c:/web/listing/online listing or ke';
const UPLOADS_DIR = path.resolve('c:/web/backend/public/uploads');
const PRODUCTS_JSON = path.resolve('c:/web/backend/data/products.json');
const CATEGORY_NAME = 'glassware';

// Helper to normalize relative paths and construct clean titles
function generateProductTitle(relativeImgPath: string): string {
  // e.g. "BEAKER\BEAKER GLASS\100ML\uuid.jpg"
  const parts = relativeImgPath.split(path.sep);
  const dirParts = parts.slice(0, -1);
  const fileName = path.basename(parts[parts.length - 1], path.extname(parts[parts.length - 1]));

  // Clean directory names
  const cleanedParts = dirParts.map(part => {
    let p = part.replace(/[_-]+/g, ' ').trim();
    // Capitalize words
    p = p.replace(/\b\w/g, c => c.toUpperCase());
    return p;
  });

  const words: string[] = [];
  for (const part of cleanedParts) {
    const partWords = part.split(/\s+/);
    for (const word of partWords) {
      if (!words.includes(word)) {
        words.push(word);
      }
    }
  }

  // Check if filename is NOT a UUID or random gemini string
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(fileName);
  const isGemini = /gemini/i.test(fileName);
  if (!isUUID && !isGemini && fileName.toLowerCase() !== 'image') {
    const cleanedFile = fileName.replace(/[_-]+/g, ' ').trim().replace(/\b\w/g, c => c.toUpperCase());
    const fileWords = cleanedFile.split(/\s+/);
    for (const word of fileWords) {
      if (!words.includes(word)) {
        words.push(word);
      }
    }
  }

  let title = words.join(' ');

  // Clean abbreviations/acronyms/typos
  title = title.replace(/\bMc\b/gi, 'Measuring Cylinder');
  title = title.replace(/\bRb\b/gi, 'Round Bottom Flask');
  title = title.replace(/\bRagent\b/gi, 'Reagent');
  title = title.replace(/\bBottel\b/gi, 'Bottle');
  title = title.replace(/\bVolumatric\b/gi, 'Volumetric');
  title = title.replace(/\bCultre\b/gi, 'Culture');

  // Let's tidy multiple spaces
  title = title.replace(/\s+/g, ' ').trim();

  return title;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '_')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

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

async function convertToPng(src: string, destFileName: string): Promise<string> {
  const destPath = path.join(UPLOADS_DIR, destFileName);
  if (fs.existsSync(destPath)) {
    return `/uploads/${destFileName}`;
  }

  try {
    const img = await Jimp.read(src);
    await img.writeAsync(destPath);
    console.log(`Converted & saved: ${destFileName}`);
  } catch (err) {
    console.error(`Error converting ${src} to PNG:`, err);
    throw err;
  }
  return `/uploads/${destFileName}`;
}

async function main() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  const imagePaths = collectImages(LISTING_ROOT);
  console.log(`Found ${imagePaths.length} image(s) in listing root: ${LISTING_ROOT}`);

  const products: any[] = [...defaultProducts];
  const titleCounts: Record<string, number> = {};

  for (const imgPath of imagePaths) {
    const relativePath = path.relative(LISTING_ROOT, imgPath);
    const baseTitle = generateProductTitle(relativePath);

    // Compute final unique title and slug/ID
    let finalTitle = baseTitle;
    let index = 1;
    if (titleCounts[baseTitle]) {
      titleCounts[baseTitle]++;
      index = titleCounts[baseTitle];
      finalTitle = `${baseTitle} #${index}`;
    } else {
      titleCounts[baseTitle] = 1;
    }

    const slug = slugify(finalTitle);
    const id = `glassware_${slug}`;
    const destFileName = `${id}.png`;

    try {
      const url = await convertToPng(imgPath, destFileName);
      
      const price = Math.floor(Math.random() * 1800) + 200; // 200 - 2000 range
      const originalPrice = Math.floor(price * (1.1 + Math.random() * 0.2));
      const rating = parseFloat((4.0 + Math.random() * 0.9).toFixed(1));
      const reviews = Math.floor(Math.random() * 45) + 5;
      
      const tags = ['BEST SELLER', 'NEW', 'POPULAR', null];
      const tag = tags[Math.floor(Math.random() * tags.length)];
      const discount = tag ? `${Math.floor(((originalPrice - price) / originalPrice) * 100)}% OFF` : null;

      const product = {
        id,
        title: finalTitle,
        description: `High-quality laboratory ${baseTitle.toLowerCase()} designed for precise scientific applications and durable laboratory use.`,
        price,
        originalPrice,
        rating,
        reviews,
        icon: 'FlaskConical',
        tag,
        discount,
        stock: Math.floor(Math.random() * 80) + 20,
        product_status: 'active',
        edited_by_admin: true,
        category: CATEGORY_NAME,
        imageUrl: url,
        images: [url],
        brand: 'Khush Enterprises',
        sku: `KE-GW-${slug.substring(0, 8).toUpperCase()}-${index}`
      };
      products.push(product);
    } catch (e) {
      console.error(`Skipping image ${imgPath} due to conversion error.`);
    }
  }

  fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(products, null, 2), 'utf-8');
  console.log(`Successfully wrote ${products.length} products (including ${defaultProducts.length} default products) to ${PRODUCTS_JSON}`);
}

main().catch(err => console.error('Import error:', err));
