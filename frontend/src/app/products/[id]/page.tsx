import ProductDetailClient from "./ProductDetailClient";

// Required for Next.js static export (output: 'export')
// Pre-renders pages for all known product IDs at build time
export function generateStaticParams() {
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
