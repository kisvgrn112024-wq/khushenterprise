"use client";

import { useStore } from "@/context/StoreContext";
import { useProducts } from "@/hooks/useProducts";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { Package, Microscope, Scale, Pipette, Glasses, FlaskConical, Flame } from "lucide-react";

const IconMap: Record<string, React.ElementType> = {
  Microscope, Scale, Pipette, Glasses, FlaskConical, Flame,
};

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const allProducts = useProducts();

  const wishlistProducts = allProducts.filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-theme py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="w-10 h-10 rounded-full bg-theme flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-sm transition-colors border border-gray-100">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Heart className="text-red-500 fill-red-500" /> My Wishlist
          </h1>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="bg-theme rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-red-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Your wishlist is empty</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              You haven't saved any products yet. Browse our catalogue and click the heart icon to save items for later.
            </p>
            <Link href="/products" className="inline-flex items-center justify-center px-8 py-3 bg-slate-900 text-theme font-medium rounded-lg hover:bg-slate-800 transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map(product => {
              const IconComponent = IconMap[product.icon] || Package;
              return (
                <div key={product.id} className="bg-theme rounded-xl border border-gray-100 overflow-hidden flex flex-col group hover:shadow-lg transition-shadow">
                  {/* Image Area */}
                  <div className="relative bg-theme h-56 flex items-center justify-center overflow-hidden">
                    <button 
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-theme rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 shadow-sm transition-colors z-10"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <Link href={`/products/${product.id}`} className="w-full h-full p-4 flex items-center justify-center relative cursor-pointer">
                      <img 
                        src={`/design/images/${product.id}.jpeg`} 
                        alt={product.title} 
                        className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-500" 
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <IconComponent size={80} className="text-slate-300 transform group-hover:scale-105 transition-transform duration-500 hidden" strokeWidth={1} />
                    </Link>
                  </div>

                  {/* Content Area */}
                  <div className="p-5 flex flex-col flex-1 border-t border-gray-50">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      {product.category || 'LAB EQUIPMENT'}
                    </div>
                    <Link href={`/products/${product.id}`} className="text-slate-900 font-bold hover:text-electric-blue transition-colors mb-2 line-clamp-2 min-h-[40px]">
                      {product.title}
                    </Link>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <div className="font-bold text-lg text-slate-900">
                        ₹{product.price.toLocaleString()}
                      </div>
                      <button 
                        onClick={() => addToCart(product)}
                        className="w-10 h-10 bg-slate-900 text-theme rounded-lg flex items-center justify-center hover:bg-slate-800 transition-colors transform active:scale-95"
                        title="Add to cart"
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
