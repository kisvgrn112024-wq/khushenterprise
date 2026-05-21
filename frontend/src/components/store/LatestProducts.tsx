"use client";

import { ShoppingCart, Heart, Package, Microscope, Scale, Pipette, Glasses, FlaskConical, Flame, ArrowRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useStore } from "@/context/StoreContext";
import Link from "next/link";

const IconMap: Record<string, React.ElementType> = {
  Microscope,
  Scale,
  Pipette,
  Glasses,
  FlaskConical,
  Flame,
};

export default function LatestProducts() {
  const allProducts = useProducts();
  const { addToCart, toggleWishlist, wishlist } = useStore();

  // Filter only active, admin-published equipment
  // AND Sort by created_at / createdAt DESC limit 8
  const latestProducts = allProducts
    .filter(p => p.product_status === 'active' && p.edited_by_admin === true)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 8);

  if (latestProducts.length === 0) {
    return null; // Return empty as per Section 6 clean-up rules if no admin listings exist yet
  }

  return (
    <div className="w-full bg-[#0a0a0a] pt-12 pb-6 border-b border-white/5">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pb-4 border-b border-white/10">
          <div>
            <span className="text-electric-blue text-xs font-bold tracking-widest uppercase block mb-1">NEW ARRIVALS</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Latest by Khush Enterprises</h2>
          </div>
          <p className="text-gray-400 text-xs md:text-sm max-w-md mt-2 md:mt-0">
            Recently catalogued high-fidelity research and diagnostic instruments freshly integrated into our inventory.
          </p>
        </div>

        {/* Horizontal Scroll Wrapper */}
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent -mx-4 px-4 md:mx-0 md:px-0">
          {latestProducts.map((product) => {
            const IconComponent = IconMap[product.icon] || Package;
            const isWishlisted = wishlist.includes(product.id);

            return (
              <div 
                key={product.id} 
                className="min-w-[280px] md:min-w-[320px] bg-[#111111] border border-white/10 flex flex-col group relative p-4 hover:border-electric-blue/50 transition-all duration-300 rounded-lg shadow-xl shrink-0"
              >
                {/* Glowing border glow effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-electric-blue/0 to-electric-blue/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-lg"></div>

                {/* Product Image Area */}
                <Link href={`/products/${product.id}`} className="bg-[#1a1a1a] p-4 mb-4 flex items-center justify-center h-44 relative cursor-pointer overflow-hidden rounded">
                  {/* Badges */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-electric-blue text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-wider rounded-sm shadow-[0_0_8px_rgba(37,99,235,0.4)]">
                      LATEST
                    </span>
                  </div>

                  {/* Wishlist Button */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 flex items-center justify-center text-white border border-white/10 transition-colors"
                  >
                    <Heart size={14} className={isWishlisted ? "fill-[#ff4d4d] text-[#ff4d4d]" : "text-gray-400"} />
                  </button>
                  
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={getImageUrl(product.images[0])} 
                      alt={product.title} 
                      className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500 opacity-95 mix-blend-screen" 
                    />
                  ) : (
                    <IconComponent size={50} className="text-gray-600 transform group-hover:scale-105 transition-transform duration-500" strokeWidth={1} />
                  )}
                </Link>

                {/* Product Details Area */}
                <div className="flex flex-col flex-1 relative z-10">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-[9px] text-electric-blue font-bold tracking-widest uppercase">{product.category || "GENERAL"}</div>
                    <span className="text-[9px] font-black text-white/50 tracking-widest">KE BRAND</span>
                  </div>
                  
                  <Link href={`/products/${product.id}`} className="text-white text-base font-bold line-clamp-2 hover:text-gray-300 transition-colors mb-4 flex-1">
                    {product.title}
                  </Link>
                  
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                    <div>
                      <span className="text-xs text-gray-500 block">Selling Price</span>
                      <span className="text-lg font-black text-white">₹{product.price.toLocaleString()}</span>
                    </div>

                    <button 
                      onClick={() => addToCart(product)}
                      className="w-9 h-9 bg-brand-yellow text-black flex items-center justify-center rounded hover:bg-yellow-500 transition-colors transform hover:scale-105 active:scale-95 shadow-[0_0_10px_rgba(252,211,77,0.2)]"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart size={16} />
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
