"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Product, getImageUrl } from "@/lib/products";
import { useProducts } from "@/hooks/useProducts";
import { useStore } from "@/context/StoreContext";
import { Star, ShoppingCart, Heart, Search, FileText, Download, FileSpreadsheet, File as FilePdf, Microscope, Scale, Pipette, Glasses, FlaskConical, Flame, ShieldCheck, Package } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";

const IconMap: Record<string, React.ElementType> = {
  Microscope, Scale, Pipette, Glasses, FlaskConical, Flame, ShieldCheck
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const allProducts = useProducts();
  const { addToCart } = useStore();
  
  const [priceRange, setPriceRange] = useState(50000);

  const categories = [
    { title: "Physics Lab", count: 124, img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=400" },
    { title: "Chemistry Lab", count: 89, img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400" },
    { title: "Glassware", count: 340, img: "https://images.unsplash.com/photo-1603531481659-1bc1c2cc7eb0?auto=format&fit=crop&q=80&w=400" },
    { title: "Precision", count: 56, img: "https://images.unsplash.com/photo-1574689211272-bc15e64d0089?auto=format&fit=crop&q=80&w=400" },
  ];

  const filteredProducts = allProducts.filter(p => {
    if (p.product_status !== 'active' || p.edited_by_admin !== true) return false;
    if (query && !p.title.toLowerCase().includes(query.toLowerCase())) return false;
    if (p.price > priceRange) return false;
    return true;
  });

  const generateCatalogue = (format: 'pdf' | 'csv' | 'excel') => {
    window.open(`/print?file=${encodeURIComponent('Khush_Products_Catalogue.' + format)}`, '_blank');
  };

  const generateAIManual = (productName: string) => {
    window.open(`/print?file=${encodeURIComponent('AI_Generated_Manual_' + productName.replace(/\s+/g, '_') + '.pdf')}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-theme font-sans text-theme pb-20">
      
      {/* Top Bar with Home > Products */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-bold text-theme uppercase tracking-widest flex items-center gap-2">
            <Link href="/" className="hover:text-theme transition-colors">HOME</Link>
            <span>&gt;</span>
            <span className="text-theme">PRODUCTS</span>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="text-[10px] font-bold text-theme uppercase tracking-widest">Download Catalogue:</div>
             <button onClick={() => generateCatalogue('pdf')} className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest bg-theme border border-theme/10 px-3 py-1.5 rounded text-theme hover:bg-theme/5 transition-colors"><FilePdf size={12}/> PDF</button>
             <button onClick={() => generateCatalogue('csv')} className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest bg-theme border border-theme/10 px-3 py-1.5 rounded text-theme hover:bg-theme/5 transition-colors"><FileText size={12}/> CSV</button>
             <button onClick={() => generateCatalogue('excel')} className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest bg-theme border border-theme/10 px-3 py-1.5 rounded text-theme hover:bg-theme/5 transition-colors"><FileSpreadsheet size={12}/> EXCEL</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-theme mb-8 border-l-4 border-brand-yellow pl-4">Equipment Categories</h1>

        {/* Categories Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {categories.map((cat, idx) => (
            <div key={idx} className="relative h-32 rounded-xl overflow-hidden group cursor-pointer border border-theme/10">
              <img src={cat.img} alt={cat.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-theme font-bold text-lg">{cat.title}</h3>
                <p className="text-[#8bceff] text-[10px] font-bold tracking-widest uppercase">{cat.count} ITEMS</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col md:flex-row gap-10 items-start">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0 space-y-10">
            {/* Price Range */}
            <div>
              <h3 className="text-[10px] font-bold text-theme uppercase tracking-widest mb-6">Price Range</h3>
              <input 
                type="range" 
                min="0" 
                max="100000" 
                step="1000"
                value={priceRange} 
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-white h-1 bg-theme rounded-lg appearance-none cursor-pointer" 
              />
              <div className="flex justify-between items-center mt-3 text-xs font-bold text-theme">
                <span>₹0</span>
                <span>₹{priceRange.toLocaleString()}+</span>
              </div>
            </div>

            {/* Brands */}
            <div>
              <h3 className="text-[10px] font-bold text-theme uppercase tracking-widest mb-4">Brands</h3>
              <div className="space-y-3">
                {["Khush Enterprises (KE)"].map((brand, i) => (
                  <label key={i} className="flex items-center gap-3 text-sm text-theme cursor-pointer hover:text-theme">
                    <input type="checkbox" defaultChecked={i===0} className="w-4 h-4 rounded bg-theme border-theme/10 text-theme focus:ring-0 focus:ring-offset-0 accent-white" />
                    {brand}
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="text-[10px] font-bold text-theme uppercase tracking-widest mb-4">Rating</h3>
              <div className="flex items-center gap-1 cursor-pointer group">
                <Star size={16} className="text-brand-yellow fill-brand-yellow" />
                <Star size={16} className="text-brand-yellow fill-brand-yellow" />
                <Star size={16} className="text-brand-yellow fill-brand-yellow" />
                <Star size={16} className="text-brand-yellow fill-brand-yellow" />
                <Star size={16} className="text-theme" />
                <span className="text-xs text-theme ml-2 group-hover:text-theme transition-colors">& Up</span>
              </div>
            </div>
            
            {/* Order History Link for Sidebar */}
            <div className="pt-6 border-t border-theme/10">
               <Link href="/my-orders" className="block w-full bg-theme border border-theme/10 hover:bg-theme/5 text-theme text-center py-3 rounded-lg text-sm font-bold transition-colors">
                 View Order History
               </Link>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pb-4 border-b border-theme/5">
              <div className="text-sm text-theme">
                Showing <strong className="text-theme">{filteredProducts.length}</strong> results for Lab Equipment
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-theme uppercase tracking-widest">Sort By</span>
                <select className="bg-theme border border-theme/10 text-theme text-sm rounded px-4 py-2 outline-none">
                  <option>Newest Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
               <div className="bg-theme rounded-xl p-16 text-center border border-theme/5">
                 <h3 className="text-xl font-bold text-theme mb-2">No Products Found</h3>
               </div>
            ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredProducts.map((product) => (
                   <div key={product.id} className="bg-theme border border-theme/10 rounded-xl overflow-hidden flex flex-col group relative">
                     
                     {/* Tags */}
                     <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 items-end">
                       {product.tag && (
                         <span className="bg-theme text-brand-yellow border border-brand-yellow/20 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shadow-md">
                           {product.tag}
                         </span>
                       )}
                       <button onClick={() => generateAIManual(product.title)} title="Download AI Manual" className="bg-theme text-[#8bceff] border border-theme/20 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full hover:bg-theme hover:text-theme transition-colors flex items-center gap-1 mt-1 shadow-md">
                         <FileText size={10} /> AI Manual
                       </button>
                     </div>

                     {/* Image Area */}
                     <Link href={`/products/${product.id}`} className="h-48 bg-theme flex items-center justify-center p-6 border-b border-theme/5 relative overflow-hidden cursor-pointer">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={getImageUrl(product.images[0])} 
                            alt={product.title} 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 absolute" 
                          />
                        ) : (
                          <>
                            <img 
                              src={`/design/images/${product.id}.jpeg`} 
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 absolute" 
                              alt={product.title} 
                              onError={(e) => {
                                const target = e.currentTarget;
                                if (target.src.endsWith('.jpeg')) {
                                  target.src = `/design/images/${product.id}.png`;
                                } else {
                                  target.style.display = 'none';
                                  target.nextElementSibling?.classList.remove('hidden');
                                }
                              }}
                            />
                            {(() => {
                              const IconComp = IconMap[product.icon] || Package;
                              return <IconComp size={48} className="text-theme hidden absolute" />;
                            })()}
                          </>
                        )}
                     </Link>

                     {/* Details */}
                     <div className="p-5 flex-1 flex flex-col">
                       <div className="flex justify-between items-center mb-1">
                         <div className="text-[10px] font-bold text-theme uppercase tracking-widest">{product.category || "GENERAL LAB"}</div>
                         <div className="flex items-center gap-1 bg-theme px-1.5 py-0.5 rounded border border-theme/5">
                           <span className="text-[8px] font-bold text-theme">Brand: </span>
                           <span className="text-[9px] font-black text-theme tracking-widest">{product.brand || "KE"}</span>
                         </div>
                       </div>
                       <Link href={`/products/${product.id}`} className="text-theme font-bold text-sm mb-3 flex-1 hover:text-electric-blue transition-colors cursor-pointer">
                         {product.title}
                       </Link>
                       
                       <div className="flex items-center justify-between mb-4">
                         <span className="text-lg font-bold text-brand-yellow">₹{product.price.toLocaleString()}</span>
                         <div className="flex items-center gap-1">
                           <Star size={12} className="text-brand-yellow fill-brand-yellow" />
                           <span className="text-xs font-bold text-theme">{product.rating || "4.8"}</span>
                         </div>
                       </div>

                       <div className="grid grid-cols-2 gap-2 mt-auto">
                         <Link href={`/products/${product.id}`} className="border border-theme/20 hover:bg-theme/5 text-theme text-xs font-bold uppercase tracking-widest py-2.5 rounded transition-colors text-center cursor-pointer">
                           Details
                         </Link>
                         <button 
                           onClick={() => addToCart(product, 1)}
                           className="bg-brand-yellow hover:bg-theme text-theme text-xs font-bold uppercase tracking-widest py-2.5 rounded transition-colors flex items-center justify-center gap-2 cursor-pointer"
                         >
                           <ShoppingCart size={14} /> Add
                         </button>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            )}

            {/* Pagination Placeholder */}
            {filteredProducts.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button className="w-8 h-8 rounded border border-theme/10 flex items-center justify-center text-theme hover:text-theme hover:bg-theme/5 bg-theme transition-colors">&lt;</button>
                <button className="w-8 h-8 rounded text-theme bg-theme font-bold">1</button>
                <button className="w-8 h-8 rounded border border-theme/10 flex items-center justify-center text-theme hover:text-theme hover:bg-theme/5 bg-theme transition-colors">2</button>
                <button className="w-8 h-8 rounded border border-theme/10 flex items-center justify-center text-theme hover:text-theme hover:bg-theme/5 bg-theme transition-colors">3</button>
                <span className="text-theme mx-1">...</span>
                <button className="w-8 h-8 rounded border border-theme/10 flex items-center justify-center text-theme hover:text-theme hover:bg-theme/5 bg-theme transition-colors">&gt;</button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-theme text-center py-20 bg-theme min-h-screen">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  )
}
