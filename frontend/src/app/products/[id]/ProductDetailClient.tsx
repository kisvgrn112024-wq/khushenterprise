"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product, getImageUrl } from "@/lib/products";
import { useProducts } from "@/hooks/useProducts";
import { useStore } from "@/context/StoreContext";
import { Star, ShieldCheck, Truck, RotateCcw, Share2, Heart, ShoppingCart, Check, ChevronRight, Package, FileText, Bot } from "lucide-react";
import AIManualSystem from "@/components/shared/AIManualSystem";
import AiChatModal from "@/components/shared/AiChatModal";
import Link from "next/link";
import { Microscope, Scale, Pipette, Glasses, FlaskConical, Flame } from "lucide-react";

const IconMap: Record<string, React.ElementType> = {
  Microscope, Scale, Pipette, Glasses, FlaskConical, Flame,
};

export default function ProductDetailClient() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const allProducts = useProducts();
  
  // Find the current product by ID
  const product = allProducts.length > 0 ? (allProducts.find((p) => p.id === id) || allProducts[0]) : null;
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isChatOpen, setIsChatOpen] = useState(false);

  const router = useRouter();
  
  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-theme bg-theme">Loading product details...</div>;
  }

  const IconComponent = IconMap[product.icon] || Package;

  // Resolve main image URL with fallback to local design mocks
  const mainImageUrl = product.images && product.images.length > 0 
    ? getImageUrl(product.images[0]) 
    : `/design/images/${product.id}.jpeg`;

  // Resolve thumbnail images (either from product.images or fallback)
  const imagesToRender = product.images && product.images.length > 0 
    ? product.images.map(img => getImageUrl(img)) 
    : [`/design/images/${product.id}.jpeg`, `/design/images/${product.id}.jpeg`, `/design/images/${product.id}.jpeg`];

  return (
    <div className="min-h-screen bg-theme pb-24">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] text-theme uppercase tracking-wider mb-8">
          <Link href="/" className="hover:text-theme transition-colors">Home</Link> 
          <span>/</span>
          <Link href="/products" className="hover:text-theme transition-colors">Products</Link> 
          <span>/</span>
          <Link href="/products" className="hover:text-theme transition-colors">{product.category || "General Lab"}</Link>
          <span>/</span>
          <span className="text-theme truncate max-w-[200px] inline-block">{product.title}</span>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Left: Image Viewer */}
          <div className="flex flex-col gap-4">
            <div className="bg-theme rounded border border-theme/10 aspect-square flex items-center justify-center p-8 relative overflow-hidden">
              <img 
                src={mainImageUrl} 
                alt={product.title} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  // Attempt fallback to PNG if JPEG failed on original mock assets
                  if (target.src.endsWith('.jpeg')) {
                    target.src = `/design/images/${product.id}.png`;
                  } else {
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }
                }}
              />
              <IconComponent size={200} className="text-slate-300 hidden" strokeWidth={1} />
            </div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {imagesToRender.slice(0, 3).map((img, idx) => (
                <div key={idx} className="bg-theme rounded border border-theme/10 aspect-square flex items-center justify-center overflow-hidden hover:border-electric-blue transition-colors cursor-pointer">
                  <img 
                    src={img} 
                    className="w-full h-full object-cover opacity-80 hover:opacity-100" 
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src.endsWith('.jpeg')) {
                        target.src = `/design/images/${product.id}.png`;
                      }
                    }}
                  />
                </div>
              ))}
              <div className="bg-theme rounded border border-theme/10 aspect-square flex items-center justify-center text-xs text-theme hover:text-theme hover:border-theme/30 transition-colors cursor-pointer">
                +4 More
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-electric-blue/10 text-electric-blue text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                {product.category || "GENERAL LAB"}
              </span>
              <div className="flex items-center gap-2">
                <div className="flex text-brand-yellow">
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                </div>
                <span className="text-[10px] text-theme tracking-wider">({product.rating || "4.8"} / {product.reviews || "15"} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-theme mb-4">{product.title}</h1>
            
            <p className="text-theme text-sm leading-relaxed mb-6 whitespace-pre-line">
              {product.description}
            </p>

            <div className="mb-8">
              <div className="flex items-end gap-2 mb-1">
                <span className="text-4xl font-bold text-brand-yellow">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-sm text-theme line-through mb-1">₹{product.originalPrice.toLocaleString()}</span>
                )}
              </div>
              <div className="text-[10px] text-theme uppercase tracking-widest font-bold">INCLUSIVE OF ALL TAXES</div>
            </div>

            <div className="bg-theme border border-theme/10 rounded p-6 grid grid-cols-2 gap-4 mb-6">
              <div className="text-[10px] text-theme uppercase tracking-wider flex gap-2">
                SKU: <span className="text-theme">{product.sku || `KE-${product.id.slice(-6).toUpperCase()}`}</span>
              </div>
              <div className="text-[10px] text-theme uppercase tracking-wider flex gap-2">
                BRAND: <span className="text-theme font-black tracking-widest bg-theme/10 px-1 rounded">{product.brand || "KE"}</span>
              </div>
              <div className="text-[10px] text-theme uppercase tracking-wider flex gap-2 col-span-2">
                STATUS: <span className={product.stock > 0 ? "text-electric-blue" : "text-red-400"}>{product.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}</span>
              </div>
            </div>

            {product.discount && (
              <p className="text-sm text-brand-yellow font-bold italic mb-8">
                ★ Special Offer: {product.discount} active on this unit.
              </p>
            )}

            <div className="flex gap-4 mb-4">
              <div className="flex items-center bg-theme border border-theme/10 rounded px-2 w-32 justify-between">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-3 text-theme hover:text-theme transition-colors">-</button>
                <span className="text-theme text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-3 text-theme hover:text-theme transition-colors">+</button>
              </div>
              <button 
                onClick={() => addToCart(product, quantity)}
                className="flex-1 bg-theme hover:bg-blue-200 text-blue-900 rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingCart size={16} /> ADD TO CART
              </button>
            </div>
            
            <button 
              onClick={() => {
                addToCart(product, quantity);
                const user = localStorage.getItem("ke_user");
                if (user) {
                  router.push("/checkout");
                } else {
                  router.push("/account/login?redirect=/checkout");
                }
              }}
              className="w-full bg-brand-yellow hover:bg-yellow-400 text-theme py-4 rounded font-bold text-xs uppercase tracking-wider transition-colors mb-8"
            >
              BUY NOW
            </button>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-theme border border-theme/10 rounded p-4 flex flex-col items-center justify-center gap-2 text-center">
                <Truck size={18} className="text-electric-blue" />
                <span className="text-[10px] text-theme font-bold">Fast Delivery</span>
              </div>
              <div className="bg-theme border border-theme/10 rounded p-4 flex flex-col items-center justify-center gap-2 text-center">
                <ShieldCheck size={18} className="text-electric-blue" />
                <span className="text-[10px] text-theme font-bold">Secure Payment</span>
              </div>
              <div className="bg-theme border border-theme/10 rounded p-4 flex flex-col items-center justify-center gap-2 text-center">
                <RotateCcw size={18} className="text-electric-blue" />
                <span className="text-[10px] text-theme font-bold">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-16">
          <div className="flex overflow-x-auto border-b border-theme/10 mb-8">
            {['description', 'specifications', 'ai manual', `reviews (${product.reviews || 15})`, 'shipping'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab.split(' ')[0])}
                className={`px-8 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.split(' ')[0] ? 'border-theme text-theme' : 'border-transparent text-theme hover:text-theme'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="px-4">
            {activeTab === 'description' && (
              <div className="text-theme text-sm space-y-6 max-w-3xl">
                <p className="whitespace-pre-line leading-relaxed">
                  {product.description}
                </p>

                <div className="mt-12 pt-8 border-t border-theme/5">
                  <div className="text-[10px] font-bold text-theme uppercase tracking-widest mb-4">
                    DOWNLOAD AI GENERATED MANUAL:
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <button className="flex items-center gap-2 bg-theme border border-theme/10 px-4 py-2 rounded hover:bg-theme/5 transition-colors">
                      <FileText size={14} className="text-red-400" />
                      <span className="text-[10px] text-theme font-bold tracking-wider">PDF</span>
                    </button>
                    <button className="flex items-center gap-2 bg-theme border border-theme/10 px-4 py-2 rounded hover:bg-theme/5 transition-colors">
                      <FileText size={14} className="text-blue-400" />
                      <span className="text-[10px] text-theme font-bold tracking-wider">DOCX</span>
                    </button>
                    <button className="flex items-center gap-2 bg-theme border border-theme/10 px-4 py-2 rounded hover:bg-theme/5 transition-colors">
                      <Package size={14} className="text-yellow-400" />
                      <span className="text-[10px] text-theme font-bold tracking-wider">Image</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'ai' && (
               <div className="bg-theme border border-theme/10 rounded p-8">
                 <AIManualSystem sku={product.sku || `SKU-KE-${product.id}`} />
               </div>
            )}
            {(activeTab !== 'description' && activeTab !== 'ai') && (
              <div className="text-theme italic text-sm">Content for {activeTab} will be populated here...</div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div>
           <div className="flex justify-between items-end border-b border-theme/10 pb-4 mb-8">
             <h2 className="text-2xl font-bold text-theme">Related Laboratory Tools</h2>
             <Link href="/products" className="text-electric-blue text-[10px] font-bold uppercase tracking-wider hover:text-theme transition-colors">VIEW ALL</Link>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {allProducts.filter(p => p.id !== product.id).slice(0, 4).map(rp => {
                const rpImageUrl = rp.images && rp.images.length > 0 
                  ? rp.images[0] 
                  : `/design/images/${rp.id}.jpeg`;

                return (
                  <div key={rp.id} className="bg-theme border border-theme/10 group flex flex-col relative">
                    <div className="absolute top-4 right-4 z-10">
                      <Heart size={16} className="text-theme hover:text-theme cursor-pointer" />
                    </div>
                    <Link href={`/products/${rp.id}`} className="h-48 flex items-center justify-center p-4 bg-gradient-to-b from-[#1a1a1a] to-[#111111] relative overflow-hidden cursor-pointer">
                      <img 
                        src={getImageUrl(rpImageUrl)} 
                        alt={rp.title} 
                        className="max-w-full max-h-full object-contain mix-blend-screen opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500" 
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src.endsWith('.jpeg')) {
                            target.src = `/design/images/${rp.id}.png`;
                          }
                        }}
                      />
                    </Link>
                    <div className="p-6 border-t border-theme/5 flex flex-col flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-[10px] text-theme font-bold uppercase tracking-wider">{rp.category || "EQUIPMENT"}</div>
                        <div className="flex items-center gap-1 bg-theme px-1.5 py-0.5 rounded border border-theme/5">
                          <span className="text-[8px] font-bold text-theme">Brand: </span>
                          <span className="text-[9px] font-black text-theme tracking-widest">{rp.brand || "KE"}</span>
                        </div>
                      </div>
                      <Link href={`/products/${rp.id}`} className="text-theme text-sm font-bold leading-snug mb-4 line-clamp-2 flex-1 group-hover:text-electric-blue transition-colors cursor-pointer">
                        {rp.title}
                      </Link>
                      
                      <div className="flex items-center justify-between mb-6">
                        <div className="text-brand-yellow font-bold">₹{rp.price.toLocaleString()}</div>
                        <div className="flex items-center gap-1 text-[10px] text-theme font-bold">
                          <Star size={10} className="text-brand-yellow" fill="currentColor" /> {rp.rating}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => addToCart(rp, 1)}
                        className="w-full bg-theme border border-theme/10 hover:border-electric-blue hover:text-electric-blue text-theme text-[10px] font-bold py-3 uppercase tracking-wider transition-colors"
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                );
             })}
           </div>
        </div>
      </div>
      
      <AiChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        productName={product.title} 
      />
    </div>
  );
}
