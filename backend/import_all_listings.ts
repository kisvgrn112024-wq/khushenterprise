import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Product from './src/models/Product';
import Inventory from './src/models/Inventory';
import dotenv from 'dotenv';

dotenv.config();

const BASE_DIR = 'C:\\web\\listing\\online listing or ke';
const PUBLIC_UPLOADS_DIR = 'C:\\web\\backend\\public\\uploads';

// Helpers to get category configuration
function getCategoryMeta(catName: string) {
  switch (catName.toUpperCase()) {
    case 'BEAKER':
      return { name: 'Glassware', icon: 'Microscope', desc: 'Premium Borosilicate Glass Beaker with graduation markings.' };
    case 'CONICAL FLASK':
      return { name: 'Glassware', icon: 'FlaskConical', desc: 'Borosilicate Glass Conical Flask (Erlenmeyer Flask) featuring uniform wall thickness.' };
    case 'CULTRE TUBE':
      return { name: 'Glassware', icon: 'FlaskConical', desc: 'High quality Borosilicate Glass Culture Tubes, perfect for sample storage and media preparation.' };
    case 'MC':
      return { name: 'Precision Instruments', icon: 'Scale', desc: 'Graduated Glass Measuring Cylinder with stable hexagonal base.' };
    case 'RAGENT BOTTEL':
      return { name: 'Glassware', icon: 'FlaskConical', desc: 'Reagent Bottle (Graduated) with leak-proof screw cap, ideal for chemical storage.' };
    case 'RB':
      return { name: 'Glassware', icon: 'FlaskConical', desc: 'Round Bottom Flask (RB Flask) with heavy duty joint, designed for uniform heating.' };
    case 'VOLUMATRIC FLASK':
      return { name: 'Precision Instruments', icon: 'Scale', desc: 'Class A Volumetric Flask with interchangeable stopper, calibrated for high accuracy.' };
    case 'TEST TUBE':
      return { name: 'Glassware', icon: 'FlaskConical', desc: 'Premium Borosilicate Glass Test Tubes, highly resistant to heat and chemical corrosion.' };
    default:
      return { name: 'Glassware', icon: 'FlaskConical', desc: 'High-quality laboratory glassware.' };
  }
}

// Calculate price based on item details
function getPricing(catName: string, size: string, setSize: number) {
  let basePrice = 50;
  const normalizedSize = size.toUpperCase().replace(/\s+/g, '');
  
  if (catName.toUpperCase() === 'BEAKER') {
    if (normalizedSize.includes('50ML')) basePrice = 60;
    else if (normalizedSize.includes('100ML')) basePrice = 90;
    else if (normalizedSize.includes('250ML')) basePrice = 140;
    else if (normalizedSize.includes('500ML')) basePrice = 220;
    else if (normalizedSize.includes('1000ML')) basePrice = 350;
  } else if (catName.toUpperCase() === 'CONICAL FLASK') {
    if (normalizedSize.includes('100ML')) basePrice = 75;
    else if (normalizedSize.includes('250ML')) basePrice = 120;
    else if (normalizedSize.includes('500ML')) basePrice = 190;
    else if (normalizedSize.includes('1000ML')) basePrice = 320;
  } else if (catName.toUpperCase() === 'CULTRE TUBE') {
    if (normalizedSize.includes('5ML')) basePrice = 10;
    else if (normalizedSize.includes('10ML')) basePrice = 15;
    else if (normalizedSize.includes('15ML')) basePrice = 20;
    else if (normalizedSize.includes('20ML')) basePrice = 25;
    else if (normalizedSize.includes('30ML')) basePrice = 35;
  } else if (catName.toUpperCase() === 'MC') {
    if (normalizedSize.includes('25ML')) basePrice = 80;
    else if (normalizedSize.includes('50ML')) basePrice = 110;
    else if (normalizedSize.includes('100ML')) basePrice = 160;
    else if (normalizedSize.includes('250ML')) basePrice = 240;
    else if (normalizedSize.includes('500ML')) basePrice = 380;
    else if (normalizedSize.includes('1000ML')) basePrice = 600;
  } else if (catName.toUpperCase() === 'RAGENT BOTTEL') {
    if (normalizedSize.includes('100ML')) basePrice = 120;
    else if (normalizedSize.includes('250ML')) basePrice = 180;
    else if (normalizedSize.includes('500ML')) basePrice = 280;
    else if (normalizedSize.includes('1000ML')) basePrice = 450;
  } else if (catName.toUpperCase() === 'RB') {
    if (normalizedSize.includes('100ML')) basePrice = 130;
    else if (normalizedSize.includes('250ML')) basePrice = 190;
    else if (normalizedSize.includes('500ML')) basePrice = 290;
  } else if (catName.toUpperCase() === 'VOLUMATRIC FLASK') {
    if (normalizedSize.includes('50ML')) basePrice = 150;
    else if (normalizedSize.includes('100ML')) basePrice = 220;
    else if (normalizedSize.includes('250ML')) basePrice = 320;
    else if (normalizedSize.includes('500ML')) basePrice = 480;
    else if (normalizedSize.includes('1000ML')) basePrice = 750;
  } else if (catName.toUpperCase() === 'TEST TUBE') {
    if (normalizedSize.includes('1075')) basePrice = 8;
    else if (normalizedSize.includes('15125')) basePrice = 12;
    else if (normalizedSize.includes('18150')) basePrice = 16;
    else if (normalizedSize.includes('25150')) basePrice = 22;
  }

  // Calculate set price with bulk discount built in
  let setPrice = basePrice * setSize;
  if (setSize === 2) setPrice *= 0.90;
  else if (setSize === 4) setPrice *= 0.85;
  else if (setSize === 5) setPrice *= 0.85;
  else if (setSize === 6) setPrice *= 0.80;
  else if (setSize === 10) setPrice *= 0.80;
  else if (setSize === 12) setPrice *= 0.75;
  else if (setSize === 15) setPrice *= 0.75;
  else if (setSize === 20) setPrice *= 0.70;

  const price = Math.round(setPrice);
  const originalPrice = Math.round(price * 1.25);
  const bulkPrice = Math.round(price * 0.85);

  return { price, originalPrice, bulkPrice };
}

// Helper to normalize category name for titles
function formatCategoryTitle(catName: string) {
  switch (catName.toUpperCase()) {
    case 'MC': return 'Graduated Measuring Cylinder';
    case 'RAGENT BOTTEL': return 'Reagent Bottle (Screw Cap)';
    case 'RB': return 'Round Bottom Flask';
    case 'VOLUMATRIC FLASK': return 'Volumetric Flask';
    case 'CULTRE TUBE': return 'Culture Tube';
    default:
      // Convert to Title Case
      return catName.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
}

async function run() {
  console.log('Scanning directories under:', BASE_DIR);
  
  if (!fs.existsSync(PUBLIC_UPLOADS_DIR)) {
    fs.mkdirSync(PUBLIC_UPLOADS_DIR, { recursive: true });
  }

  const productsToImport: any[] = [];

  // Recursive directory scanner to find leaf directories containing images
  function traverse(dir: string, currentCategory: string = '', parentPaths: string[] = []) {
    const files = fs.readdirSync(dir);
    const subdirs: string[] = [];
    const images: string[] = [];

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        subdirs.push(file);
      } else {
        const ext = path.extname(file).toLowerCase();
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
          images.push(file);
        }
      }
    }

    if (images.length > 0) {
      // Leaf directory with images! Let's generate a listing
      // Determine what details we can extract from parentPaths and dir name
      const category = currentCategory || 'Glassware';
      const meta = getCategoryMeta(category);
      
      // Determine size and set size
      let size = 'Standard';
      let setSize = 1;
      let extra = '';

      // Analyze dir structure
      // E.g. BEAKER -> BEAKER GLASS -> 50ML
      // E.g. CULTRE TUBE -> 10 ML -> SET OF 10
      // E.g. RB -> RB 1 MOUTH -> 100 ML -> SET OF 1
      const allParts = [...parentPaths, path.basename(dir)].map(p => p.toUpperCase());

      // Find Size
      for (const part of allParts) {
        if (part.includes('ML') || part.match(/\d+\s+\d+/) || part.includes('10 75') || part.includes('15 125') || part.includes('18 150') || part.includes('25 150')) {
          size = part.replace('ML', ' ml').trim();
          if (size === '10 75') size = '10x75 mm';
          else if (size === '15 125') size = '15x125 mm';
          else if (size === '18 150') size = '18x150 mm';
          else if (size === '25 150') size = '25x150 mm';
        }
        if (part.includes('MOUTH')) {
          extra = `(${part.replace('RB ', '').replace('MOUTH', 'Neck').toLowerCase()})`;
        }
      }

      // Find Set Size
      for (const part of allParts) {
        if (part.includes('SET')) {
          const match = part.match(/\d+/);
          if (match) {
            setSize = parseInt(match[0]);
          }
        }
      }

      const cleanCatName = formatCategoryTitle(category);
      const setLabel = setSize === 1 ? 'Single Unit' : `Set of ${setSize}`;
      const title = `${setLabel} - ${size} ${cleanCatName} ${extra}`.replace(/\s+/g, ' ').trim();
      
      const cleanSizeId = size.replace(/\s+/g, '_').toLowerCase();
      const cleanCatId = category.replace(/\s+/g, '_').toLowerCase();
      const id = `import_${cleanCatId}_${cleanSizeId}_set_${setSize}_${extra ? extra.replace(/[^a-z0-9]/gi, '_') : ''}`.replace(/_+/g, '_').replace(/_$/, '');

      // Copy images to uploads
      const copiedUrls: string[] = [];
      images.forEach((imgFile, index) => {
        const srcPath = path.join(dir, imgFile);
        const uniqueName = `img_imported_${id}_${index}${path.extname(imgFile)}`;
        const destPath = path.join(PUBLIC_UPLOADS_DIR, uniqueName);
        fs.copyFileSync(srcPath, destPath);
        copiedUrls.push(`/uploads/${uniqueName}`);
      });

      // Calculate pricing
      const pricing = getPricing(category, size, setSize);

      const product = {
        id,
        title,
        description: `${title}. Engineered from laboratory-grade Borosilicate glass for extreme chemical and thermal shock resistance. Features high-clarity graduated measurement markings, uniform wall thickness, and a heavy-duty design. Ideal for school laboratories, college chemistry packages, industrial labs, and advanced scientific research.`,
        price: pricing.price,
        originalPrice: pricing.originalPrice,
        rating: parseFloat((4.5 + Math.random() * 0.4).toFixed(1)),
        reviews: Math.floor(Math.random() * 100 + 10),
        icon: meta.icon,
        tag: setSize > 2 ? 'BEST SELLER' : 'POPULAR',
        discount: '20% OFF',
        stock: 120,
        images: copiedUrls,
        category: meta.name,
        brand: 'Khush Enterprises',
        sku: `KE-${category.substring(0, 3).toUpperCase()}-${cleanSizeId.toUpperCase()}-${setSize}S`,
        aiManualEnabled: true,
        bulkPrice: pricing.bulkPrice,
        moq: setSize === 1 ? 5 : 1,
        product_status: 'active',
        edited_by_admin: true,
        isB2BVisible: true,
        b2bCategory: cleanCatName
      };

      productsToImport.push(product);
      console.log(`Generated listing: ${title}`);
    }

    // Recurse into subdirectories
    for (const subdir of subdirs) {
      const nextCat = currentCategory || (parentPaths.length === 0 ? subdir : '');
      traverse(path.join(dir, subdir), nextCat, [...parentPaths, subdir]);
    }
  }

  // Scan all directories inside listing directory
  const rootDirs = fs.readdirSync(BASE_DIR);
  for (const rDir of rootDirs) {
    const fullPath = path.join(BASE_DIR, rDir);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath, rDir, [rDir]);
    }
  }

  console.log(`Successfully generated ${productsToImport.length} total listings from folders.`);

  // Write to JSON file database (fileDb fallback)
  const PRODUCTS_JSON_FILE = path.join(process.cwd(), 'data', 'products.json');
  if (fs.existsSync(PRODUCTS_JSON_FILE)) {
    try {
      const fileData = fs.readFileSync(PRODUCTS_JSON_FILE, 'utf-8');
      const products = JSON.parse(fileData);
      
      // Upsert imported products
      productsToImport.forEach(newProd => {
        const idx = products.findIndex((p: any) => p.id === newProd.id);
        if (idx > -1) {
          products[idx] = { ...products[idx], ...newProd };
        } else {
          products.push(newProd);
        }
      });
      
      fs.writeFileSync(PRODUCTS_JSON_FILE, JSON.stringify(products, null, 2));
      console.log(`Successfully updated JSON file database with all listings.`);
    } catch (err) {
      console.error('Error writing to products.json:', err);
    }
  } else {
    fs.writeFileSync(PRODUCTS_JSON_FILE, JSON.stringify(productsToImport, null, 2));
    console.log(`Created products.json with imported products.`);
  }

  // Attempt database insertion if MongoDB is connected
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/khush-enterprises';
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected successfully.');

    for (const prod of productsToImport) {
      await Product.findOneAndUpdate(
        { id: prod.id },
        prod,
        { upsert: true, new: true }
      );
      
      const dbProd = await Product.findOne({ id: prod.id });
      if (dbProd) {
        await Inventory.findOneAndUpdate(
          { product: dbProd._id },
          { stockLevel: prod.stock || 0 },
          { upsert: true }
        );
      }
    }

    console.log('Successfully updated MongoDB database for all listings.');
  } catch (err) {
    console.log('MongoDB Connection failed during import. Fallback JSON is saved.');
  } finally {
    await mongoose.disconnect();
  }

  console.log('Import finished successfully!');
}

run().catch(console.error);
