"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Product } from "@/lib/products";
import { useProducts } from "@/hooks/useProducts";
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
    <div className="min-h-screen bg-[#111111] font-sans text-white pb-20">
      
      {/* Top Bar with Home > Products */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
            <span>&gt;</span>
            <span className="text-white">PRODUCTS</span>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Download Catalogue:</div>
             <button onClick={() => generateCatalogue('pdf')} className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest bg-[#161616] border border-white/10 px-3 py-1.5 rounded text-white hover:bg-white/5 transition-colors"><FilePdf size={12}/> PDF</button>
             <button onClick={() => generateCatalogue('csv')} className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest bg-[#161616] border border-white/10 px-3 py-1.5 rounded text-white hover:bg-white/5 transition-colors"><FileText size={12}/> CSV</button>
             <button onClick={() => generateCatalogue('excel')} className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest bg-[#161616] border border-white/10 px-3 py-1.5 rounded text-white hover:bg-white/5 transition-colors"><FileSpreadsheet size={12}/> EXCEL</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-brand-yellow pl-4">Equipment Categories</h1>

        {/* Categories Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {categories.map((cat, idx) => (
            <div key={idx} className="relative h-32 rounded-xl overflow-hidden group cursor-pointer border border-white/10">
              <img src={cat.img} alt={cat.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white font-bold text-lg">{cat.title}</h3>
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
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Price Range</h3>
              <input 
                type="range" 
                min="0" 
                max="100000" 
                step="1000"
                value={priceRange} 
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-white h-1 bg-[#222222] rounded-lg appearance-none cursor-pointer" 
              />
              <div className="flex justify-between items-center mt-3 text-xs font-bold text-white">
                <span>₹0</span>
                <span>₹{priceRange.toLocaleString()}+</span>
              </div>
            </div>

            {/* Brands */}
            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Brands</h3>
              <div className="space-y-3">
                {["Khush Enterprises (KE)"].map((brand, i) => (
                  <label key={i} className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" defaultChecked={i===0} className="w-4 h-4 rounded bg-[#161616] border-white/10 text-white focus:ring-0 focus:ring-offset-0 accent-white" />
                    {brand}
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Rating</h3>
              <div className="flex items-center gap-1 cursor-pointer group">
                <Star size={16} className="text-brand-yellow fill-brand-yellow" />
                <Star size={16} className="text-brand-yellow fill-brand-yellow" />
                <Star size={16} className="text-brand-yellow fill-brand-yellow" />
                <Star size={16} className="text-brand-yellow fill-brand-yellow" />
                <Star size={16} className="text-gray-600" />
                <span className="text-xs text-gray-400 ml-2 group-hover:text-white transition-colors">& Up</span>
              </div>
            </div>
            
            {/* Order History Link for Sidebar */}
            <div className="pt-6 border-t border-white/10">
               <Link href="/my-orders" className="block w-full bg-[#161616] border border-white/10 hover:bg-white/5 text-white text-center py-3 rounded-lg text-sm font-bold transition-colors">
                 View Order History
               </Link>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pb-4 border-b border-white/5">
              <div className="text-sm text-gray-400">
                Showing <strong className="text-white">{filteredProducts.length}</strong> results for Lab Equipment
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sort By</span>
                <select className="bg-[#161616] border border-white/10 text-white text-sm rounded px-4 py-2 outline-none">
                  <option>Newest Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
               <div className="bg-[#161616] rounded-xl p-16 text-center border border-white/5">
                 <h3 className="text-xl font-bold text-white mb-2">No Products Found</h3>
               </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-[#161616] border border-white/10 rounded-xl overflow-hidden flex flex-col group relative">
                    
                    {/* Tags */}
                    <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 items-end">
                      {product.tag && (
                        <span className="bg-[#1f1a11] text-brand-yellow border border-brand-yellow/20 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shadow-md">
                          {product.tag}
                        </span>
                      )}
                      <button onClick={() => generateAIManual(product.title)} title="Download AI Manual" className="bg-[#0c1825] text-[#8bceff] border border-[#8bceff]/20 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full hover:bg-[#8bceff] hover:text-black transition-colors flex items-center gap-1 mt-1 shadow-md">
                        <FileText size={10} /> AI Manual
                      </button>
                    </div>

                    {/* Image Area */}
                    <div className="h-48 bg-[#0a0a0a] flex items-center justify-center p-6 border-b border-white/5 relative overflow-hidden">
                       {product.images && product.images.length > 0 ? (
                         <img 
                           src={product.images[0]} 
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
                             return <IconComp size={48} className="text-gray-600 hidden absolute" />;
                           })()}
                         </>
                       )}
                    </div>

                    {/* Details */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{product.category}</div>
                        <div className="flex items-center gap-1 bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-white/5">
                          <span className="text-[8px] font-bold text-gray-400">Brand: </span>
                          <span className="text-[9px] font-black text-white tracking-widest">KE</span>
                        </div>
                      </div>
                      <h3 className="text-white font-bold text-sm mb-3 flex-1">{product.title}</h3>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold text-brand-yellow">₹{product.price.toLocaleString()}</span>
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-brand-yellow fill-brand-yellow" />
                          <span className="text-xs font-bold text-white">{product.rating}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        <button className="border border-white/20 hover:bg-white/5 text-white text-xs font-bold uppercase tracking-widest py-2.5 rounded transition-colors">
                          Details
                        </button>
                        <button className="bg-brand-yellow hover:bg-[#e6a800] text-black text-xs font-bold uppercase tracking-widest py-2.5 rounded transition-colors flex items-center justify-center gap-2">
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
                <button className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 bg-[#161616] transition-colors">&lt;</button>
                <button className="w-8 h-8 rounded text-black bg-white font-bold">1</button>
                <button className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 bg-[#161616] transition-colors">2</button>
                <button className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 bg-[#161616] transition-colors">3</button>
                <span className="text-gray-500 mx-1">...</span>
                <button className="w-8 h-8 rounded border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 bg-[#161616] transition-colors">&gt;</button>
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
    <Suspense fallback={<div className="text-white text-center py-20 bg-[#111111] min-h-screen">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  )
}
