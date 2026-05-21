const fs = require('fs');
const path = require('path');

const listingRoot = path.join(__dirname, 'listing', 'online listing or ke');
const uploadsDir = path.join(__dirname, 'backend', 'public', 'uploads');
const productsFile = path.join(__dirname, 'backend', 'data', 'products.json');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Product definitions with pricing
const categoryPricing = {
  'BEAKER': {
    'BEAKER GLASS': { base: 250, multiplier: 'capacity' },
    'BEAKER PLASTIC': { base: 180, multiplier: 'capacity' }
  },
  'CONICAL FLASK': { base: 300, multiplier: 'capacity' },
  'CULTRE TUBE': { base: 80, multiplier: 'quantity' },
  'MC': { base: 150, multiplier: 'generic' },
  'RAGENT BOTTEL': { base: 120, multiplier: 'capacity' },
  'RB': { base: 200, multiplier: 'capacity' },
  'test tube': { base: 100, multiplier: 'quantity' },
  'VOLUMATRIC FLASK': { base: 400, multiplier: 'capacity' }
};

const capacityMultiplier = {
  '50': 1, '50ml': 1,
  '100': 1.2, '100ml': 1.2,
  '250': 1.5, '250ml': 1.5,
  '500': 2, '500ml': 2,
  '1000': 3, '1000ml': 3,
  '1000ml': 3
};

const quantityMultiplier = {
  '6': 0.8, 'set6': 0.8,
  '12': 1.2, 'set 12': 1.2,
  '10': 0.9, '10 75': 0.9,
  '15': 1.1, '15 125': 1.1,
  '18': 1.3, '18 150': 1.3,
  '25': 1.5, '25 150': 1.5
};

function calculatePrice(category, subcategory, size) {
  const pricing = categoryPricing[category];
  if (!pricing) return 500;

  let basePrice = pricing.base || 250;
  
  if (pricing.multiplier === 'capacity') {
    const key = Object.keys(capacityMultiplier).find(k => size.toLowerCase().includes(k.toLowerCase()));
    return Math.round(basePrice * (capacityMultiplier[key] || 1));
  } else if (pricing.multiplier === 'quantity') {
    const key = Object.keys(quantityMultiplier).find(k => size.toLowerCase().includes(k.toLowerCase()));
    return Math.round(basePrice * (quantityMultiplier[key] || 1));
  }
  
  return basePrice;
}

function generateTitle(category, subcategory, size, imageName) {
  const parts = [category];
  if (subcategory && subcategory !== category) {
    parts.push(subcategory);
  }
  if (size) {
    parts.push(size);
  }
  return parts.join(' - ');
}

function generateDescription(category, subcategory, size) {
  return `Premium quality ${category.toLowerCase()} for laboratory use. ${subcategory ? 'Type: ' + subcategory + '. ' : ''}${size ? 'Size: ' + size : ''}`;
}

function scanImages(dir, category, parentDir = '') {
  const products = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recursively scan subdirectories
      products.push(...scanImages(fullPath, category, file));
    } else if (file.endsWith('.png')) {
      const size = parentDir || '';
      const fileName = `${category}_${parentDir}_${file}`.replace(/[^a-zA-Z0-9._-]/g, '_');
      const destPath = path.join(uploadsDir, fileName);

      // Copy image if not already there
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(fullPath, destPath);
        console.log(`✓ Copied: ${fileName}`);
      }

      const price = calculatePrice(category, parentDir, size);
      const title = generateTitle(category, parentDir, size, file);
      const description = generateDescription(category, parentDir, size);

      products.push({
        id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: title,
        description: description,
        price: price,
        originalPrice: null,
        rating: 0,
        reviews: 0,
        icon: 'Image',
        tag: null,
        discount: null,
        stock: 100,
        product_status: 'active',
        edited_by_admin: false,
        category: 'glassware',
        imageUrl: `/uploads/${fileName}`
      });
    }
  }

  return products;
}

// Scan all categories
let allProducts = [];
const categories = fs.readdirSync(listingRoot);

for (const category of categories) {
  const categoryPath = path.join(listingRoot, category);
  if (fs.statSync(categoryPath).isDirectory()) {
    console.log(`\nProcessing: ${category}`);
    allProducts.push(...scanImages(categoryPath, category));
  }
}

// Update products.json
const existingProducts = [];
if (fs.existsSync(productsFile)) {
  try {
    const data = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
    // Keep non-glassware products
    existingProducts.push(...data.filter(p => p.category !== 'glassware'));
  } catch (e) {
    console.log('Note: Could not read existing products.json');
  }
}

const finalProducts = [...existingProducts, ...allProducts];

fs.writeFileSync(productsFile, JSON.stringify(finalProducts, null, 2));
console.log(`\n✓ Updated products.json with ${allProducts.length} glassware products`);
console.log(`✓ Total products in database: ${finalProducts.length}`);
