import ProductDetailClient from "./ProductDetailClient";
import fs from "fs";
import path from "path";

// Required for Next.js static export (output: 'export')
// Pre-renders pages for all known product IDs at build time
export function generateStaticParams() {
  try {
    const filePath = path.join(process.cwd(), "../backend/data/products.json");
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      const products = JSON.parse(content);
      if (Array.isArray(products) && products.length > 0) {
        return products.map((p) => ({ id: String(p.id) }));
      }
    }
  } catch (error) {
    console.error("Failed to load products for static generation:", error);
  }

  // Fallback to original hardcoded list if file read fails
  return [
    { id: 'p1' },
    { id: 'p2' },
    { id: 'p3' },
    { id: 'p4' },
    { id: 'p5' },
    { id: 'p6' },
    { id: 'wt1' },
    { id: 'wt2' },
    { id: 'wt3' },
    { id: 'wt4' },
    { id: 'wt5' },
    { id: 'wt6' },
  ];
}

export default function ProductDetailPage() {
  return <ProductDetailClient />;
}
