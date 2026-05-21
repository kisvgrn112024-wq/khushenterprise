"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, Heart, Globe, Truck, Headphones, Package, 
  Microscope, Scale, Pipette, Glasses, FlaskConical, Flame, 
  ChevronRight, Star, ChevronLeft, SlidersHorizontal, Search
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useStore } from "@/context/StoreContext";
import { useViewMode } from "@/context/ViewModeContext";

const IconMap: Record<string, React.ElementType> = {
  Microscope,
  Scale,
  Pipette,
  Glasses,
  FlaskConical,
  Flame,
};

const ITEMS_PER_PAGE = 4;

export default function Home() {
  const allProducts = useProducts();
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const { viewMode } = useViewMode();

  // Filter and Category state
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [sortBy, setSortBy] = useState("Relevance");
  const [filters, setFilters] = useState({
    inStockOnly: false,
    aiManualEnabled: false,
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Derive categories dynamically from database products
  const categoriesList = useMemo(() => {
    const rawCategories = allProducts
      .map(p => p.category)
      .filter(Boolean) as string[];
    // Get unique categories and normalize them
    const unique = Array.from(new Set(rawCategories));
    return ["All Products", ...unique];
  }, [allProducts]);

  // Filter products based on admin criteria + category + filters + sort
  const filteredProducts = useMemo(() => {
    // Only display active products listed by the admin
    let result = allProducts.filter(
      (p) => p.product_status === "active" && p.edited_by_admin === true
    );

    // Apply category filter
    if (selectedCategory && selectedCategory !== "All Products") {
      result = result.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply Stock filter
    if (filters.inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // Apply AI manual filter
    if (filters.aiManualEnabled) {
      result = result.filter((p) => p.aiManualEnabled === true);
    }

    // Apply Sorting
    if (sortBy === "Price: Low to High") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "Alphabetical") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [allProducts, selectedCategory, sortBy, filters]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <main className="min-h-screen bg-[#06070a] text-gray-300 overflow-x-hidden font-sans selection:bg-[#8bceff]/30">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full bg-[#0a0d14] py-16 lg:py-24 border-b border-white/5 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className={`container mx-auto px-4 lg:px-8 relative z-10 grid gap-12 items-center ${viewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'}`}>
          
          {/* Hero Left Content */}
          <div className={`${viewMode === 'mobile' ? 'space-y-6' : 'lg:col-span-6 space-y-6'}`}>
            <div className="inline-flex items-center gap-2 border border-[#8bceff]/20 bg-[#8bceff]/5 text-[#8bceff] text-[10px] font-black tracking-widest px-3.5 py-1.5 rounded-full uppercase">
              <span>★</span> LABORATORY EQUIPMENT
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-[1.1] tracking-tight">
              Precision for the <br />
              <span className="text-[#8bceff]">Modern Laboratory.</span>
            </h1>
            
            <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light max-w-xl">
              Empowering research centers, educational institutions, and healthcare providers across India with industry-leading scientific instrumentation and supplies. Built for accuracy, designed for reliability.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/products">
                <button className="bg-[#8bceff] hover:bg-[#72bde6] text-black px-8 py-3.5 rounded text-xs font-bold uppercase tracking-wider transition-all transform active:scale-95 shadow-[0_0_20px_rgba(139,206,255,0.2)] cursor-pointer">
                  Join My Products
                </button>
              </Link>
              <a href="/catalogue" className="inline-block">
                <button className="bg-transparent text-gray-300 hover:text-white px-8 py-3.5 rounded text-xs font-bold uppercase tracking-wider transition-all border border-white/10 hover:border-white/30 cursor-pointer">
                  ★ Template Equipment
                </button>
              </a>
            </div>
          </div>

          {/* Hero Right Image - Clean Cinematic Display */}
          <div className={`${viewMode === 'mobile' ? 'flex justify-center' : 'lg:col-span-6 flex justify-center lg:justify-end'}`}>
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#0d111a] p-1.5 group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
              <div className="absolute inset-0 bg-[#8bceff]/5 mix-blend-overlay z-10 rounded-2xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1200" 
                alt="Laboratory Flasks with blue fluid" 
                className="w-full h-full object-cover rounded-xl opacity-90 transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 2. DYNAMIC SIDEBAR & PRODUCT GRID SECTION */}
      <section className="py-16 container mx-auto px-4 lg:px-8">
        <div className={`flex gap-10 ${viewMode === 'mobile' ? 'flex-col' : 'flex-col lg:flex-row'}`}>
          
          {/* LEFT SIDEBAR: Categories & Filters */}
          <aside className={`w-full shrink-0 space-y-8 bg-[#0b0d14]/40 p-6 rounded-xl border border-white/5 h-fit ${viewMode === 'mobile' ? '' : 'lg:w-64'}`}>
            
            {/* CATEGORIES LIST */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-[#8bceff] mb-4 pb-2 border-b border-white/5">
                Categories
              </h3>
              <div className="space-y-1.5">
                {categoriesList.map((category) => {
                  const isSelected = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left py-2 px-3 rounded text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? "bg-[#8bceff]/10 text-white font-bold border-l-2 border-[#8bceff]" 
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>{category === "All Products" ? "All Equipment" : category}</span>
                      {isSelected && <span className="text-[#8bceff] text-[10px]">●</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FILTERS */}
            <div className="pt-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#8bceff] mb-4 pb-2 border-b border-white/5">
                Filters
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group text-xs text-gray-400 hover:text-white transition-colors">
                  <input 
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) => {
                      setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }));
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 rounded border-white/10 bg-[#111] text-[#8bceff] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>In Stock Only</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group text-xs text-gray-400 hover:text-white transition-colors">
                  <input 
                    type="checkbox"
                    checked={filters.aiManualEnabled}
                    onChange={(e) => {
                      setFilters(prev => ({ ...prev, aiManualEnabled: e.target.checked }));
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 rounded border-white/10 bg-[#111] text-[#8bceff] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>AI Manuals Available</span>
                </label>
              </div>
            </div>

          </aside>

          {/* RIGHT CONTENT: Product Grid & Top Bar */}
          <div className="flex-1 space-y-8">
            
            {/* Grid Header & Sort Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs text-[#8bceff] font-bold tracking-widest uppercase">LABORATORY</span>
                <h2 className="text-2xl font-bold text-white tracking-tight">Laboratory Equipment</h2>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 bg-[#0b0d14] border border-white/10 px-3 py-1.5 rounded-lg text-xs">
                <span className="text-gray-500 font-medium">Sort By:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-white font-bold border-none focus:outline-none focus:ring-0 cursor-pointer"
                >
                  <option className="bg-[#0b0d14] text-white" value="Relevance">Relevance</option>
                  <option className="bg-[#0b0d14] text-white" value="Price: Low to High">Price: Low to High</option>
                  <option className="bg-[#0b0d14] text-white" value="Price: High to Low">Price: High to Low</option>
                  <option className="bg-[#0b0d14] text-white" value="Alphabetical">Alphabetical</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className={`grid gap-6 ${viewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'}`}>
              <AnimatePresence mode="popLayout">
                {paginatedProducts.map((product, idx) => {
                  const IconComponent = IconMap[product.icon] || Package;
                  const isWishlisted = wishlist.includes(product.id);
                  const displayCategory = product.category || "General Lab";

                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      key={product.id} 
                      className="bg-[#0c0e14] border border-white/10 flex flex-col group relative p-4 hover:border-[#8bceff]/50 transition-colors rounded-xl shadow-xl"
                    >
                      {/* Product Image Area */}
                      <Link href={`/products/${product.id}`} className="bg-[#10131d] p-6 mb-4 flex items-center justify-center h-48 relative cursor-pointer overflow-hidden transition-all rounded-lg group-hover:bg-[#131724]">
                        
                        {/* Custom status tag if any */}
                        {product.tag && (
                          <div className="absolute top-2 left-2 z-10">
                            <span className="bg-[#8bceff] text-black text-[9px] font-black px-2.5 py-0.5 uppercase tracking-wider rounded shadow-md">
                              {product.tag}
                            </span>
                          </div>
                        )}

                        {/* Wishlist Button */}
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/85 flex items-center justify-center text-white border border-white/5 transition-colors cursor-pointer"
                        >
                          <Heart size={14} className={isWishlisted ? "fill-[#ff4d4d] text-[#ff4d4d]" : "text-gray-400"} />
                        </button>
                        
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

                      {/* Product Details */}
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-[10px] text-[#8bceff] font-bold tracking-widest uppercase">{displayCategory}</div>
                          <div className="text-[8px] font-black text-white/40 tracking-widest uppercase">KE Brand</div>
                        </div>
                        
                        <Link href={`/products/${product.id}`} className="text-white text-sm font-bold line-clamp-2 hover:text-[#8bceff] transition-colors mb-3 flex-1">
                          {product.title}
                        </Link>
                        
                        <p className="text-[11px] text-gray-500 line-clamp-2 mb-4">
                          {product.description || "Premium grade scientific equipment catalogued by Khushi Enterprises."}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                          <span className="text-base font-black text-white">₹{product.price.toLocaleString()}</span>

                          <button 
                            onClick={() => addToCart(product)}
                            className="w-8 h-8 bg-[#fcd34d] text-black flex items-center justify-center rounded hover:bg-[#fbbf24] transition-all transform active:scale-95 shadow-[0_0_10px_rgba(252,211,77,0.2)] cursor-pointer"
                            aria-label="Add to cart"
                          >
                            <ShoppingCart size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Dynamic Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center border border-white/10 text-gray-400 hover:text-white hover:border-white/30 rounded transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 flex items-center justify-center font-bold text-xs rounded transition-all cursor-pointer ${
                      currentPage === page 
                        ? "bg-[#8bceff] text-black shadow-md shadow-[#8bceff]/20" 
                        : "border border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center border border-white/10 text-gray-400 hover:text-white hover:border-white/30 rounded transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 3. FEATURED BRANDS SECTION */}
      <section className="bg-[#0a0c10] py-16 border-t border-white/5">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-white tracking-wider mb-2">Featured Brands</h2>
          <p className="text-gray-500 text-xs mb-8">Partnering with global locations in laboratory equipment representation.</p>
          
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {["ADVANTEC", "SYBRON", "PHARMA FORCE", "Mitutoyo", "SUGATOK MEDICOOM", "LIFE"].map((brand) => (
              <div 
                key={brand}
                className="px-6 py-3 border border-white/5 bg-[#10121a]/50 rounded-lg text-xs font-black text-gray-500 uppercase tracking-widest hover:text-gray-300 hover:border-white/15 transition-all duration-300"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRUST & INFORMATION BAR */}
      <section className="bg-[#07090f] py-12 border-y border-white/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-lg bg-[#8bceff]/5 flex items-center justify-center text-[#8bceff] border border-[#8bceff]/10 group-hover:bg-[#8bceff]/10 transition-colors">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">1000+</h3>
                <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Delivery Enterprises</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-lg bg-[#8bceff]/5 flex items-center justify-center text-[#8bceff] border border-[#8bceff]/10 group-hover:bg-[#8bceff]/10 transition-colors">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">26 m.m.</h3>
                <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Delivery Enterprises</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-lg bg-[#8bceff]/5 flex items-center justify-center text-[#8bceff] border border-[#8bceff]/10 group-hover:bg-[#8bceff]/10 transition-colors">
                <Truck size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Pan-India</h3>
                <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Pel Proibes/Erpy</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-lg bg-[#8bceff]/5 flex items-center justify-center text-[#8bceff] border border-[#8bceff]/10 group-hover:bg-[#8bceff]/10 transition-colors">
                <Headphones size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Esprm Suppon.</h3>
                <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">No Prous Entripises</p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
