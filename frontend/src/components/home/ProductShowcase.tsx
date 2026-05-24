import React, { useState } from 'react';
import Link from 'next/link';
import { getImageUrl } from '@/lib/products';
import { Filter, X } from 'lucide-react';

interface ProductShowcaseProps {
  products: any[];
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  filters: { inStockOnly: boolean; aiManualEnabled: boolean };
  setFilters: (f: any) => void;
  viewMode: string;
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
              <span className="font-label-caps text-label-caps text-on-surface-variant">CATALOGUE / PRECISION INSTRUMENTS</span>
              <h2 className="font-headline-lg text-headline-md sm:text-headline-lg mt-2 uppercase">Industrial Showcase</h2>
            </div>
            <div className="flex items-center gap-4 bg-surface-container-low p-2 rounded border border-outline-variant">
              <button className="material-symbols-outlined p-1 text-warning-amber">grid_view</button>
              <button className="material-symbols-outlined p-1 text-on-surface-variant hover:text-on-surface">view_list</button>
            </div>
          </div>
          <div className={`grid ${viewMode === 'mobile' ? 'grid-cols-3 gap-1.5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
            {products.map((product) => (
              <div key={product.id} className="bg-cargo-slate border border-outline-variant hover:border-warning-amber transition-all group overflow-hidden flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-black">
                  <img
                    alt={product.title}
                    src={getImageUrl(product.images?.[0]) || `/design/images/${product.id}.jpeg`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 mobile:object-contain"
                  />
                  {product.tag && (
                    <span className={`absolute top-2 left-2 sm:top-4 sm:left-4 bg-industry-red text-white font-data-display tracking-tighter ${viewMode === 'mobile' ? 'text-[8px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5'}`}>
                      {product.tag}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className={`flex flex-col flex-grow ${viewMode === 'mobile' ? 'p-1.5' : 'p-5'}`}>
                  <span className={`font-label-caps text-on-surface-variant mb-0.5 ${viewMode === 'mobile' ? 'text-[6px]' : 'text-[10px]'}`}>{product.category?.toUpperCase() || 'GENERAL'}</span>
                  <h3 className={`font-headline-md group-hover:text-warning-amber transition-colors line-clamp-2 ${viewMode === 'mobile' ? 'text-[8px] mb-0.5 leading-tight' : 'text-lg mb-2'}`}>{product.title}</h3>
                  <div className={`flex items-baseline gap-1 sm:gap-2 ${viewMode === 'mobile' ? 'mb-1.5 mt-auto' : 'mb-6 mt-1'}`}>
                    <span className={`font-data-display text-on-surface ${viewMode === 'mobile' ? 'text-[9px]' : 'text-lg'}`}>₹{product.price.toLocaleString()}</span>
                    <span className={`text-on-surface-variant uppercase ${viewMode === 'mobile' ? 'text-[5px]' : 'text-[10px]'}`}>/UNIT</span>
                  </div>
                  <div className={`mt-auto grid grid-cols-2 ${viewMode === 'mobile' ? 'gap-0.5' : 'gap-2'}`}>
                    <button className={`bg-warning-amber text-harbor-navy font-label-caps clipped-corner hover:bg-white transition-colors ${viewMode === 'mobile' ? 'py-1 text-[5px]' : 'py-3 text-[11px]'}`}>ADD</button>
                    <button className={`border border-outline-variant hover:border-on-surface text-on-surface font-label-caps clipped-corner transition-colors ${viewMode === 'mobile' ? 'py-1 text-[5px]' : 'py-3 text-[11px]'}`}>QUOTE</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
