import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Product from './src/models/Product';
import Inventory from './src/models/Inventory';
import dotenv from 'dotenv';

dotenv.config();

const LISTING_BASE_DIR = 'C:\\web\\listing\\online listing or ke\\BEAKER\\BEAKER GLASS';
const PUBLIC_UPLOADS_DIR = 'C:\\web\\backend\\public\\uploads';

// Define base sizes and prices
const SIZES = [
  { label: '50ML', name: '50 ml', basePrice: 60 },
  { label: '100ML', name: '100 ml', basePrice: 90 },
  { label: '250ML', name: '250 ml', basePrice: 140 },
  { label: '500ML', name: '500 ml', basePrice: 220 },
  { label: '1000ML', name: '1000 ml', basePrice: 350 }
];

const SETS = [
  { size: 1, label: 'Single Beaker', multiplier: 1.0 },
  { size: 2, label: 'Set of 2', multiplier: 1.8 },
  { size: 4, label: 'Set of 4', multiplier: 3.4 },
  { size: 6, label: 'Set of 6', multiplier: 4.8 }
];

async function run() {
  console.log('Starting Beaker Importer...');
  
  if (!fs.existsSync(PUBLIC_UPLOADS_DIR)) {
    fs.mkdirSync(PUBLIC_UPLOADS_DIR, { recursive: true });
  }

  const productsToImport: any[] = [];

  for (const sizeInfo of SIZES) {
    const sizeDir = path.join(LISTING_BASE_DIR, sizeInfo.label);
    if (!fs.existsSync(sizeDir)) {
      console.warn(`Directory not found: ${sizeDir}`);
      continue;
    }

    // Get all image files in this directory
    const files = fs.readdirSync(sizeDir).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ext === '.jpg' || ext === '.jpeg' || ext === '.png';
    });

    console.log(`Found ${files.length} images for size ${sizeInfo.label}`);

    // Copy images to public/uploads and get relative paths
    const copiedImageUrls: string[] = [];
    files.forEach(f => {
      const srcPath = path.join(sizeDir, f);
      const safeName = f.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const destFilename = `img_${sizeInfo.label.toLowerCase()}_${safeName}`;
      const destPath = path.join(PUBLIC_UPLOADS_DIR, destFilename);
      
      fs.copyFileSync(srcPath, destPath);
      copiedImageUrls.push(`/uploads/${destFilename}`);
    });

    // Create listings for each set variation
    for (const setInfo of SETS) {
      const id = `beaker_${sizeInfo.label.toLowerCase()}_set_${setInfo.size}`;
      const title = `${setInfo.label} - ${sizeInfo.name} Borosilicate High Quality Beaker`;
      const sku = `KE-BKR-${sizeInfo.label}-${setInfo.size}S`;
      
      // Calculate prices
      const price = Math.round(sizeInfo.basePrice * setInfo.multiplier);
      const originalPrice = Math.round(price * 1.25); // 25% original price markup

      // Description
      const description = `Premium Borosilicate glass beaker, ${setInfo.label} (${sizeInfo.name} capacity per unit). Features highly visible double-scale graduation markings, a robust pouring spout to prevent drips, and heavy-duty uniform wall thickness. Ideal for high-temperature applications, industrial chemistry laboratories, chemistry classes, and general research science. Exceptionally resistant to thermal shock and chemical corrosion.`;

      // Select images for this set
      // We can use a revolving selection or all copied images for that size
      const imagesForThisSet = copiedImageUrls.length > 0 
        ? [copiedImageUrls[setInfo.size % copiedImageUrls.length]] 
        : ['/uploads/placeholder.jpg'];
        
      if (copiedImageUrls.length > 1) {
        // Add secondary image if available
        imagesForThisSet.push(copiedImageUrls[(setInfo.size + 1) % copiedImageUrls.length]);
      }

      const product = {
        id,
        title,
        description,
        price,
        originalPrice,
        rating: parseFloat((4.5 + Math.random() * 0.4).toFixed(1)),
        reviews: Math.floor(Math.random() * 120 + 20),
        icon: 'FlaskConical',
        tag: setInfo.size > 2 ? 'BEST VALUE' : 'HIGH QUALITY',
        discount: '20% OFF',
        stock: 100,
        images: imagesForThisSet,
        category: 'Glassware',
        brand: 'Khush Enterprises',
        sku,
        aiManualEnabled: true,
        bulkPrice: Math.round(price * 0.85), // 15% bulk discount
        moq: setInfo.size === 1 ? 10 : 2,
        product_status: 'active',
        edited_by_admin: true,
        isB2BVisible: true,
        b2bCategory: 'Lab Glassware'
      };

      productsToImport.push(product);
    }
  }

  console.log(`Generated ${productsToImport.length} beaker listings.`);

  // Write to JSON file database (fileDb fallback)
  const PRODUCTS_JSON_FILE = path.join(process.cwd(), 'data', 'products.json');
  if (fs.existsSync(PRODUCTS_JSON_FILE)) {
    try {
      const fileData = fs.readFileSync(PRODUCTS_JSON_FILE, 'utf-8');
      const products = JSON.parse(fileData);
      
      // Upsert products to avoid duplicates
      productsToImport.forEach(newProd => {
        const idx = products.findIndex((p: any) => p.id === newProd.id);
        if (idx > -1) {
          products[idx] = { ...products[idx], ...newProd };
        } else {
          products.push(newProd);
        }
      });
      
      fs.writeFileSync(PRODUCTS_JSON_FILE, JSON.stringify(products, null, 2));
      console.log(`Successfully updated JSON file database: ${PRODUCTS_JSON_FILE}`);
    } catch (err) {
      console.error('Error writing to products.json:', err);
    }
  } else {
    // If folder doesn't exist, create it
    const dataDir = path.dirname(PRODUCTS_JSON_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
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
      
      // Update inventory as well
      const dbProd = await Product.findOne({ id: prod.id });
      if (dbProd) {
        await Inventory.findOneAndUpdate(
          { product: dbProd._id },
          { stockLevel: prod.stock || 0 },
          { upsert: true }
        );
      }
    }

    console.log('Successfully updated MongoDB database.');
  } catch (err) {
    console.log('MongoDB Connection failed during import. Skipping DB write (fallback JSON is saved).');
  } finally {
    await mongoose.disconnect();
  }

  console.log('Import finished successfully!');
}

run().catch(console.error);
