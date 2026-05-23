import React from 'react';
import Link from 'next/link';
import { getImageUrl } from '@/lib/products';

interface ProductShowcaseProps {
  products: any[]; // product objects from useProducts
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
  return (
    <section className="py-16 container mx-auto px-4 lg:px-8">
      <div className={`flex gap-10 ${viewMode === 'mobile' ? 'flex-col' : 'flex-col lg:flex-row'}`}>
        {/* Sidebar */}
        <aside className={`w-full shrink-0 space-y-8 bg-theme/40 p-6 rounded-xl border border-theme/5 h-fit ${viewMode === 'mobile' ? '' : 'lg:w-64'}`}>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-cargo-slate border border-outline-variant hover:border-warning-amber transition-all group overflow-hidden flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-black">
                  <img
                    alt={product.title}
                    src={getImageUrl(product.images?.[0]) || `/design/images/${product.id}.jpeg`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                  {product.tag && (
                    <span className="absolute top-4 left-4 bg-industry-red text-white text-[10px] font-data-display px-2 py-0.5 tracking-tighter">
                      {product.tag}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <span className="font-label-caps text-[10px] text-on-surface-variant mb-1">{product.category?.toUpperCase() || 'GENERAL'}</span>
                  <h3 className="font-headline-md text-lg mb-2 group-hover:text-warning-amber transition-colors">{product.title}</h3>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="font-data-display text-lg text-on-surface">₹{product.price.toLocaleString()}</span>
                    <span className="text-[10px] text-on-surface-variant uppercase">INR / UNIT</span>
                  </div>
                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <button className="bg-warning-amber text-harbor-navy font-label-caps text-[11px] py-3 clipped-corner hover:bg-white transition-colors">ADD TO CART</button>
                    <button className="border border-outline-variant hover:border-on-surface text-on-surface font-label-caps text-[11px] py-3 clipped-corner transition-colors">QUOTE REQ</button>
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
