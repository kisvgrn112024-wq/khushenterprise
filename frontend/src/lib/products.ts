export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviews: number;
  icon: string;
  tag?: string | null;
  discount?: string | null;
  stock: number;
  // Advanced fields
  images?: string[];
  images360?: string[];
  video?: string | null;
  category?: string;
  catalog?: string;
  catalog_id?: string;
  brand?: string;
  sku?: string;
  aiManualEnabled?: boolean;
  bulkPrice?: number;
  moq?: number;
  product_status?: string;
  edited_by_admin?: boolean;
  is_placeholder?: boolean;
  isB2BVisible?: boolean;
  b2bCategory?: string;
  createdAt?: string;
};

// Simulated Database
const productsDB: Product[] = [
  {
    id: "p1",
    title: "Professional Binocular Microscope",
    description: "High-precision compound microscope with dual eyepieces and multiple objective lenses. Ideal for cellular analysis.",
    price: 12500,
    originalPrice: 15000,
    rating: 4.9,
    reviews: 142,
    icon: "Microscope",
    tag: "BEST SELLER",
    discount: "16% OFF",
    stock: 24,
    bulkPrice: 10000,
    moq: 5,
    product_status: 'active',
    edited_by_admin: true,
  },
  {
    id: "p2",
    title: "Precision Analytical Balance",
    description: "Digital weighing scale enclosed in a glass draft shield for high-accuracy mass measurement.",
    price: 18000,
    originalPrice: null,
    rating: 4.8,
    reviews: 89,
    icon: "Scale",
    tag: "NEW",
    discount: null,
    stock: 15,
    product_status: 'active',
    edited_by_admin: true,
  },
  {
    id: "p3",
    title: "Adjustable Volume Pipettes",
    description: "Set of ergonomic micro-pipettes mounted on a carousel stand for precise liquid handling.",
    price: 4200,
    originalPrice: 5000,
    rating: 4.7,
    reviews: 210,
    icon: "Pipette",
    tag: null,
    discount: "16% OFF",
    stock: 50,
    product_status: 'active',
    edited_by_admin: true,
  },
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
    product_status: 'active',
    edited_by_admin: true,
  },
  {
    id: "p5",
    title: "Erlenmeyer Flask Set",
    description: "Assortment of borosilicate glass conical flasks, perfect for mixing and heating chemical solutions.",
    price: 850,
    originalPrice: null,
    rating: 4.8,
    reviews: 155,
    icon: "FlaskConical",
    tag: "BEST SELLER",
    discount: null,
    stock: 80,
    product_status: 'active',
    edited_by_admin: true,
  },
  {
    id: "p6",
    title: "Bunsen Burner System",
    description: "Heavy-duty gas burner with adjustable flame control and sturdy tripod base.",
    price: 1200,
    originalPrice: 1500,
    rating: 4.7,
    reviews: 98,
    icon: "Flame",
    tag: null,
    discount: "20% OFF",
    stock: 45,
    product_status: 'active',
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
    product_status: 'active',
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
    product_status: 'active',
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
    product_status: 'active',
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
    product_status: 'active',
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
    product_status: 'active',
    edited_by_admin: true,
  },
  {
    id: "wt6",
    title: "Welltrust Deluxe Folding Walker",
    description: "Lightweight, sturdy aluminum walking assistant featuring a simple one-button folding mechanism, comfortable hand grips, and durable gliding wheels.",
    price: 1850,
    originalPrice: 2400,
    rating: 4.9,
    reviews: 55,
    icon: "ShieldCheck",
    tag: "DELUXE",
    discount: "22% OFF",
    stock: 40,
    category: "Surgical & Ortho Aids",
    brand: "Welltrust",
    sku: "WT-DFW-06",
    moq: 1,
    product_status: 'active',
    edited_by_admin: true,
  }
];

export const getProducts = (): Product[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('ke_products');
    if (saved) {
      return JSON.parse(saved);
    }
  }
  return [...productsDB];
};

const saveProducts = (products: Product[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ke_products', JSON.stringify(products));
    window.dispatchEvent(new Event('products-updated'));
  }
};
export const getImageUrl = (path: string): string => {
  if (!path) return '';
  // Return absolute URLs or data URIs unchanged
  if (/^(https?:|data:)/i.test(path)) {
    return path;
  }
  // In development, prepend localhost backend URL
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return `http://localhost:5000${path}`;
  }
  return path;
};
export const updateProduct = (id: string, updates: Partial<Product>) => {
  const current = getProducts();
  const updated = current.map(p => p.id === id ? { ...p, ...updates } : p);
  saveProducts(updated);
};

export const addProduct = (product: Product) => {
  const current = getProducts();
  saveProducts([product, ...current]);
};

export const addProductsBulk = (products: Product[]) => {
  const current = getProducts();
  saveProducts([...products, ...current]);
};

// Initialize localStorage on first load
if (typeof window !== 'undefined' && !localStorage.getItem('ke_products')) {
  localStorage.setItem('ke_products', JSON.stringify(productsDB));
}
