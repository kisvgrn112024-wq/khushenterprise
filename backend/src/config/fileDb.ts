import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

// Default initial products matching productsDB in frontend
export const defaultProducts = [
  {
    id: "p4",
    title: "Safety Goggles",
    description: "Wrap-around clear protective eyewear designed to shield against chemical splashes.",
    price: 450,
    originalPrice: 600,
    rating: 4.6,
    reviews: 320,
    icon: "Glasses",
    tag: null,
    discount: "25% OFF",
    stock: 120,
    bulkPrice: 350,
    moq: 20,
    category: "General Lab",
    brand: "Khush Enterprises",
    sku: "KE-GOG-04",
    product_status: "active",
    edited_by_admin: true,
  },
  {
    id: "wt1",
    title: "Welltrust Cervical Collar (Hard with Chin Support)",
    description: "High-grade orthopedic cervical support designed for extreme neck immobilization, recovery from cervical spondylosis, and post-surgery rehabilitation.",
    price: 380,
    originalPrice: 450,
    rating: 4.8,
    reviews: 64,
    icon: "ShieldCheck",
    tag: "POPULAR",
    discount: "15% OFF",
    stock: 120,
    category: "Surgical & Ortho Aids",
    brand: "Welltrust",
    sku: "WT-CC-01",
    moq: 5,
    product_status: "active",
    edited_by_admin: true,
  },
  {
    id: "wt2",
    title: "Welltrust Lumbar Sacral (L.S.) Belt",
    description: "Orthopedic lower back support brace with flexible back splints to provide exceptional compression, relieve backaches, and correct posture.",
    price: 850,
    originalPrice: 1100,
    rating: 4.9,
    reviews: 118,
    icon: "ShieldCheck",
    tag: "BEST SELLER",
    discount: "22% OFF",
    stock: 95,
    category: "Surgical & Ortho Aids",
    brand: "Welltrust",
    sku: "WT-LSB-02",
    moq: 3,
    product_status: "active",
    edited_by_admin: true,
  },
  {
    id: "wt3",
    title: "Welltrust Functional Knee Support (Neoprene)",
    description: "Designed with open patella and dual lateral stabilisers to relieve joint pressure, support ligaments, and assist in athletic performance and arthritis therapy.",
    price: 620,
    originalPrice: 750,
    rating: 4.7,
    reviews: 82,
    icon: "ShieldCheck",
    tag: "NEW",
    discount: "17% OFF",
    stock: 150,
    category: "Surgical & Ortho Aids",
    brand: "Welltrust",
    sku: "WT-KS-03",
    moq: 10,
    product_status: "active",
    edited_by_admin: true,
  },
  {
    id: "wt4",
    title: "Welltrust Premium Ankle Binder",
    description: "Elastic ankle wrap designed with dual compression straps to support weak ankles, limit range of motion during sprain recovery, and fit comfortably in any shoe.",
    price: 290,
    originalPrice: 350,
    rating: 4.6,
    reviews: 43,
    icon: "ShieldCheck",
    tag: null,
    discount: "17% OFF",
    stock: 200,
    category: "Surgical & Ortho Aids",
    brand: "Welltrust",
    sku: "WT-AB-04",
    moq: 10,
    product_status: "active",
    edited_by_admin: true,
  },
  {
    id: "wt5",
    title: "Welltrust Adjustable Elbow Crutches (Pair)",
    description: "Anodized aluminum mobility aids featuring ergonomic underarm grips, adjustable heights, and slip-resistant rubber suction tips for premium stability.",
    price: 950,
    originalPrice: 1200,
    rating: 4.8,
    reviews: 37,
    icon: "ShieldCheck",
    tag: "HIGH QUALITY",
    discount: "20% OFF",
    stock: 60,
    category: "Surgical & Ortho Aids",
    brand: "Welltrust",
    sku: "WT-EC-05",
    moq: 2,
    product_status: "active",
    edited_by_admin: true,
  }
];

export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export function initFileDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(defaultProducts, null, 2));
  }
}

export function readProductsFromFile(): any[] {
  initFileDb();
  try {
    const content = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading products from file:', err);
    return defaultProducts;
  }
}

export function writeProductsToFile(products: any[]) {
  initFileDb();
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  } catch (err) {
    console.error('Error writing products to file:', err);
  }
}

const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

export function initOrdersFileDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
  }
}

export function readOrdersFromFile(): any[] {
  initOrdersFileDb();
  try {
    const content = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading orders from file:', err);
    return [];
  }
}

export function writeOrdersToFile(orders: any[]) {
  initOrdersFileDb();
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error('Error writing orders to file:', err);
  }
}

