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
import { getImageUrl } from "@/lib/products";
import { useStore } from "@/context/StoreContext";
import ProductShowcase from '@/components/home/ProductShowcase';
import BannerCarousel from "@/components/home/BannerCarousel";
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
    <main className="min-h-screen bg-theme text-theme overflow-x-hidden font-sans selection:bg-theme/30">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full bg-theme py-16 lg:py-24 border-b border-theme/5 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className={`container mx-auto px-4 lg:px-8 relative z-10 grid gap-12 items-center ${viewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'}`}>
          
          {/* Hero Left Content */}
          <div className={`${viewMode === 'mobile' ? 'space-y-6' : 'lg:col-span-6 space-y-6'}`}>
            <div className="inline-flex items-center gap-2 border border-theme/20 bg-theme/5 text-[#8bceff] text-[10px] font-black tracking-widest px-3.5 py-1.5 rounded-full uppercase">
              <span>★</span> LABORATORY EQUIPMENT
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-theme mb-4 leading-[1.1] tracking-tight">
              Precision for the <br />
              <span className="text-[#8bceff]">Modern Laboratory.</span>
            </h1>
            
            <p className="text-theme text-sm md:text-base leading-relaxed font-light max-w-xl">
              Empowering research centers, educational institutions, and healthcare providers across India with industry-leading scientific instrumentation and supplies. Built for accuracy, designed for reliability.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/products">
                <button className="bg-theme hover:bg-theme text-theme px-8 py-3.5 rounded text-xs font-bold uppercase tracking-wider transition-all transform active:scale-95 shadow-[0_0_20px_rgba(139,206,255,0.2)] cursor-pointer">
                  Join My Products
                </button>
              </Link>
              <a href="/catalogue" className="inline-block">
                <button className="bg-transparent text-theme hover:text-theme px-8 py-3.5 rounded text-xs font-bold uppercase tracking-wider transition-all border border-theme/10 hover:border-theme/30 cursor-pointer">
                  ★ Template Equipment
                </button>
              </a>
            </div>
          </div>

          {/* Hero Right Image - Clean Cinematic Display */}
          <div className={`${viewMode === 'mobile' ? 'flex justify-center' : 'lg:col-span-6 flex justify-center lg:justify-end'}`}>
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden border border-theme/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-theme p-1.5 group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
              <div className="absolute inset-0 bg-theme/5 mix-blend-overlay z-10 rounded-2xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1200" 
                alt="Laboratory Flasks with blue fluid" 
                className="w-full h-full object-cover rounded-xl opacity-90 transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Banner Carousel Section */}
      <BannerCarousel />

      {/* Product Showcase Section */}
      <ProductShowcase
        products={filteredProducts}
        categories={categoriesList}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        filters={filters}
        setFilters={setFilters}
        viewMode={viewMode}
      />

      {/* 3. FEATURED BRANDS SECTION */}
      <section className="bg-theme py-16 border-t border-theme/5">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-theme tracking-wider mb-2">Featured Brands</h2>
          <p className="text-theme text-xs mb-8">Partnering with global locations in laboratory equipment representation.</p>
          
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {["ADVANTEC", "SYBRON", "PHARMA FORCE", "Mitutoyo", "SUGATOK MEDICOOM", "LIFE"].map((brand) => (
              <div 
                key={brand}
                className="px-6 py-3 border border-theme/5 bg-theme/50 rounded-lg text-xs font-black text-theme uppercase tracking-widest hover:text-theme hover:border-theme/15 transition-all duration-300"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRUST & INFORMATION BAR */}
      <section className="bg-theme py-12 border-y border-theme/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-lg bg-theme/5 flex items-center justify-center text-[#8bceff] border border-theme/10 group-hover:bg-theme/10 transition-colors">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-theme">1000+</h3>
                <p className="text-[10px] text-theme font-bold tracking-widest uppercase">Delivery Enterprises</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-lg bg-theme/5 flex items-center justify-center text-[#8bceff] border border-theme/10 group-hover:bg-theme/10 transition-colors">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-theme">26 m.m.</h3>
                <p className="text-[10px] text-theme font-bold tracking-widest uppercase">Delivery Enterprises</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-lg bg-theme/5 flex items-center justify-center text-[#8bceff] border border-theme/10 group-hover:bg-theme/10 transition-colors">
                <Truck size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-theme">Pan-India</h3>
                <p className="text-[10px] text-theme font-bold tracking-widest uppercase">Pel Proibes/Erpy</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-lg bg-theme/5 flex items-center justify-center text-[#8bceff] border border-theme/10 group-hover:bg-theme/10 transition-colors">
                <Headphones size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-theme">Esprm Suppon.</h3>
                <p className="text-[10px] text-theme font-bold tracking-widest uppercase">No Prous Entripises</p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
