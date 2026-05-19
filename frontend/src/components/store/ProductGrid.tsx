"use client";

import { Star, ShoppingCart, Heart, Package, Microscope, Scale, Pipette, Glasses, FlaskConical, Flame, ChevronRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useStore } from "@/context/StoreContext";
import Link from "next/link";
import Image from "next/image";

const IconMap: Record<string, React.ElementType> = {
  Microscope,
  Scale,
  Pipette,
  Glasses,
  FlaskConical,
  Flame,
};

export default function ProductGrid() {
  const allProducts = useProducts();
  const products = allProducts
    .filter(p => p.product_status === 'active' && p.edited_by_admin === true)
    .slice(0, 4); // Show only 4 for the best sellers row
  const { addToCart, toggleWishlist, wishlist } = useStore();

  return (
    <div className="w-full bg-[#0a0a0a] py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col mb-10 pb-4 border-b border-white/10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Featured Equipment</h2>
          <p className="text-gray-400 text-sm md:text-base">Precision engineered solutions most trusted by our institutional partners.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => {
            const IconComponent = IconMap[product.icon] || Package;

            // Mock categories and titles for visual fidelity if needed
            const displayCategory = product.category?.toUpperCase() || (idx === 0 ? "GLASSWARE" : idx === 1 ? "ELECTRONICS" : idx === 2 ? "BIOLOGY" : "PHYSICS");
            const displayTitle = product.title || (idx === 0 ? "Borosilicate Beaker Set" : idx === 1 ? "Industrial Multimeter XT" : idx === 2 ? "Advanced Compound Microscope" : "Precision Triple Beam Balance");

            return (
              <div key={product.id} className="bg-[#111111] border border-white/10 flex flex-col group relative p-4 hover:border-electric-blue/50 transition-colors">
                {/* Product Image Area */}
                <Link href={`/products/${product.id}`} className="bg-[#1a1a1a] p-6 mb-4 flex items-center justify-center h-48 relative cursor-pointer overflow-hidden transition-colors rounded">
                  {/* Badges */}
                  <div className="absolute top-3 left-3 z-10 flex gap-2">
                    {idx === 0 && <span className="bg-electric-blue/20 text-electric-blue text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-sm">IN STOCK</span>}
                    {idx === 1 && <span className="bg-brand-yellow/20 text-brand-yellow text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-sm">BEST SELLER</span>}
                    {idx === 2 && <span className="bg-electric-blue/20 text-electric-blue text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-sm">NEW</span>}
                  </div>
                  
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.title} 
                      className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500 opacity-90 mix-blend-screen" 
                    />
                  ) : (
                    <img 
                      src={`/design/images/${product.id}.jpeg`} 
                      alt={product.title} 
                      className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500 opacity-90 mix-blend-screen" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  )}
                  <IconComponent size={60} className="text-gray-600 transform group-hover:scale-105 transition-transform duration-500 hidden" strokeWidth={1} />
                </Link>

                {/* Product Details Area */}
                <div className="flex flex-col flex-1 relative">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-[10px] text-electric-blue font-bold tracking-widest uppercase">{displayCategory}</div>
                    <div className="flex items-center gap-1 bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-white/5">
                      <span className="text-[8px] font-bold text-gray-400">Brand: </span>
                      <span className="text-[9px] font-black text-white tracking-widest">KE</span>
                    </div>
                  </div>
                  
                  <Link href={`/products/${product.id}`} className="text-white text-lg font-bold line-clamp-2 hover:text-gray-300 transition-colors mb-6">
                    {displayTitle}
                  </Link>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-white">₹{product.price.toLocaleString()}</span>
                    </div>

                    <button 
                      onClick={() => addToCart(product)}
                      className="w-10 h-10 bg-brand-yellow text-black flex items-center justify-center rounded hover:bg-yellow-500 transition-colors transform hover:scale-105 active:scale-95 shadow-[0_0_10px_rgba(252,211,77,0.2)]"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
