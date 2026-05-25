"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { getImageUrl } from '@/lib/products';
import { Filter, X, Package } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface ProductShowcaseProps {
  products: any[];
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  filters: { inStockOnly: boolean; aiManualEnabled: boolean };
  setFilters: (f: any) => void;
  viewMode: string;
}

function ProductCard({ product, viewMode, addToCart }: { product: any; viewMode: string; addToCart: any }) {
  return (
    <div className="bg-cargo-slate border border-outline-variant hover:border-warning-amber transition-all group overflow-hidden flex flex-col rounded-xl">
      <Link href={`/products/${product.id}`} className="cursor-pointer flex flex-col flex-1">
        <div className="relative h-24 sm:h-36 w-full overflow-hidden bg-black">
          <img
            alt={product.title}
            src={getImageUrl(product.images?.[0]) || `/design/images/${product.id}.jpeg`}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 mobile:object-contain"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src.endsWith('.jpeg')) {
                target.src = `/design/images/${product.id}.png`;
              }
            }}
          />
          {product.tag && (
            <span className={`absolute top-2 left-2 sm:top-3 sm:left-3 bg-industry-red text-white font-data-display tracking-tighter ${viewMode === 'mobile' ? 'text-[8px] px-1.5 py-0.5' : 'text-[8px] sm:text-[9px] px-1.5 py-0.5'}`}>
              {product.tag}
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        
        <div className="p-1.5 sm:p-3 flex flex-col flex-1">
          <span className="font-label-caps text-on-surface-variant mb-0.5 text-[6px] sm:text-[8px]">{product.category?.toUpperCase() || 'GENERAL'}</span>
          <h3 className="font-headline-md group-hover:text-warning-amber transition-colors line-clamp-2 text-[8px] sm:text-xs mb-0.5 sm:mb-1 leading-tight font-bold">{product.title}</h3>
          <div className="flex items-baseline gap-1 sm:gap-2 mb-1 mt-auto sm:mt-1">
            <span className="font-data-display text-on-surface text-[9px] sm:text-sm font-black text-theme">₹{product.price.toLocaleString()}</span>
            <span className="text-on-surface-variant uppercase text-[5px] sm:text-[8px]">/UNIT</span>
          </div>
        </div>
      </Link>

      <div className="p-1.5 sm:p-3 pt-0 mt-auto grid grid-cols-2 gap-0.5 sm:gap-1.5">
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product, 1); }}
          className="bg-warning-amber text-harbor-navy font-label-caps clipped-corner hover:bg-white transition-colors py-1 text-[5px] sm:text-[10px] font-bold cursor-pointer"
        >
          ADD
        </button>
        <Link 
          href="/contact-us"
          className="border border-outline-variant hover:border-on-surface text-on-surface font-label-caps clipped-corner transition-colors py-1 text-[5px] sm:text-[10px] text-center font-bold cursor-pointer"
        >
          QUOTE
        </Link>
      </div>
    </div>
  );
}

export default function ProductShowcase({
  products,
  categories,
  selectedCategory,
  setSelectedCategory,
  filters,
  setFilters,
  viewMode,
}: ProductShowcaseProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const { addToCart } = useStore();

  // Group products by category when selectedCategory is "All Products"
  const groupedProducts = useMemo(() => {
    const groups: Record<string, any[]> = {};
    products.forEach((p) => {
      const cat = p.category || "General Lab";
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(p);
    });
    return groups;
  }, [products]);

  return (
    <section className="py-16 container mx-auto px-4 lg:px-8">
      <div className={`flex gap-10 ${viewMode === 'mobile' ? 'flex-col' : 'flex-col lg:flex-row'}`}>
        
        {/* Mobile Filter Toggle Button */}
        <div className={`w-full flex items-center justify-between bg-theme/40 p-4 rounded-xl border border-theme/10 ${viewMode === 'mobile' ? 'block' : 'lg:hidden'}`}>
          <div className="font-bold text-theme flex items-center gap-2">
            <Filter size={18} /> Filters & Categories
          </div>
          <button onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)} className="text-xs bg-theme/20 px-3 py-1.5 rounded font-semibold border border-theme/10 text-theme hover:bg-theme/30">
            {isMobileFilterOpen ? "Hide" : "Show"}
          </button>
        </div>

        {/* Sidebar */}
        <aside className={`w-full shrink-0 space-y-8 bg-theme/40 p-6 rounded-xl border border-theme/5 h-fit ${viewMode === 'mobile' ? (isMobileFilterOpen ? 'block' : 'hidden') : 'hidden lg:block lg:w-64'}`}>
          {/* Categories */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-[#8bceff] mb-4 pb-2 border-b border-theme/5">Categories</h3>
            <div className="space-y-1.5">
              {categories.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left py-2 px-3 rounded text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-theme/10 text-theme font-bold border-l-2 border-theme'
                        : 'text-theme hover:text-theme hover:bg-theme/5'
                    }`}
                  >
                    <span>{category === 'All Products' ? 'All Equipment' : category}</span>
                    {isSelected && <span className="text-[#8bceff] text-[10px]">●</span>}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Filters */}
          <div className="pt-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#8bceff] mb-4 pb-2 border-b border-theme/5">Filters</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group text-xs text-theme hover:text-theme transition-colors">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) => setFilters({ ...filters, inStockOnly: e.target.checked })}
                  className="w-4 h-4 rounded border-theme/10 bg-theme text-[#8bceff] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>In Stock Only</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group text-xs text-theme hover:text-theme transition-colors">
                <input
                  type="checkbox"
                  checked={filters.aiManualEnabled}
                  onChange={(e) => setFilters({ ...filters, aiManualEnabled: e.target.checked })}
                  className="w-4 h-4 rounded border-theme/10 bg-theme text-[#8bceff] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>AI Manuals Available</span>
              </label>
            </div>
          </div>
        </aside>
        
        {/* Product Grid */}
        <div className="flex-1 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-4">
            <div>
              <span className="font-label-caps text-on-surface-variant text-xs font-semibold tracking-wider text-slate-500 uppercase">CATALOGUE / PRECISION INSTRUMENTS</span>
              <h2 className="text-3xl font-black text-theme uppercase tracking-tight mt-1">Industrial Showcase</h2>
            </div>
          </div>

          {selectedCategory === 'All Products' ? (
            <div className="space-y-12">
              {Object.entries(groupedProducts).map(([catName, catProducts]) => {
                if (catProducts.length === 0) return null;
                return (
                  <div key={catName} className="space-y-4">
                    <div className="flex items-center justify-between border-b border-theme/5 pb-2">
                      <h3 className="text-sm sm:text-base font-bold text-theme uppercase tracking-wider">{catName}</h3>
                      <Link 
                        href={`/products?category=${encodeURIComponent(catName)}`}
                        className="text-[10px] font-bold text-[#8bceff] hover:underline uppercase tracking-wider"
                      >
                        View More &rarr;
                      </Link>
                    </div>
                    <div className={`grid ${viewMode === 'mobile' ? 'grid-cols-3 gap-1.5' : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-4'}`}>
                      {catProducts.slice(0, 8).map((product) => (
                        <ProductCard key={product.id} product={product} viewMode={viewMode} addToCart={addToCart} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={`grid ${viewMode === 'mobile' ? 'grid-cols-3 gap-1.5' : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-4'}`}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} addToCart={addToCart} />
              ))}
            </div>
          )}

          {products.length === 0 && (
            <div className="text-center py-16 text-theme text-sm border border-dashed border-theme/10 rounded-xl bg-theme/5">
              No products found matching active filters.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
