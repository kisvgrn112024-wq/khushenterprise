import ProductDetailClient from "./ProductDetailClient";
import { productsDB } from "@/lib/products";

// Required for Next.js static export (output: 'export')
// Pre-renders pages for all known product IDs at build time
export async function generateStaticParams() {
  const purgedIds = ['p1', 'p2', 'p3', 'p5', 'p6', 'wt6'];
  return productsDB
    .filter(p => !purgedIds.includes(p.id))
    .map((p) => ({ id: p.id }));
}

// Disable fallback — only pre-rendered IDs are valid
export const dynamicParams = false;

export default function ProductDetailPage() {
  return <ProductDetailClient />;
}
