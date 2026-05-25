"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/products';
import { Filter, ChevronLeft, ChevronRight, ShoppingCart, Heart, Eye, ChevronDown } from 'lucide-react';
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

const INITIAL_VISIBLE = 8;
const LOAD_MORE_COUNT = 8;

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
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const router = useRouter();

  // Reset visible count when category changes
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [selectedCategory, filters]);

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + LOAD_MORE_COUNT, products.length));
  };

  return (
    <section className="py-16 container mx-auto px-4 lg:px-8">
      <div className={`flex gap-10 ${viewMode === 'mobile' ? 'flex-col' : 'flex-col lg:flex-row'}`}>
        
        {/* Mobile Filter Toggle */}
        <div className={`w-full flex items-center justify-between bg-theme/40 p-4 rounded-xl border border-theme/10 ${viewMode === 'mobile' ? 'block' : 'lg:hidden'}`}>
          <div className="font-bold text-theme flex items-center gap-2">
            <Filter size={18} /> Filters & Categories
          </div>
          <button onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)} className="text-xs bg-theme/20 px-3 py-1.5 rounded font-semibold border border-theme/10 text-theme hover:bg-theme/30">
            {isMobileFilterOpen ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* Sidebar */}
        <aside className={`w-full shrink-0 space-y-8 bg-theme/40 p-6 rounded-xl border border-theme/5 h-fit ${viewMode === 'mobile' ? (isMobileFilterOpen ? 'block' : 'hidden') : 'hidden lg:block lg:w-64'}`}>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-[#8bceff] mb-4 pb-2 border-b border-theme/5">Categories</h3>
            <div className="space-y-1.5">
              {categories.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left py-2 px-3 rounded text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#1A73E8]/10 text-[#1A73E8] font-bold border-l-2 border-[#1A73E8]'
                        : 'text-theme hover:text-theme hover:bg-theme/5'
                    }`}
                  >
                    <span>{category === 'All Products' ? 'All Equipment' : category}</span>
                    {isSelected && <span className="text-[#1A73E8] text-[10px]">●</span>}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="pt-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#8bceff] mb-4 pb-2 border-b border-theme/5">Filters</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer text-xs text-theme hover:text-theme transition-colors">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) => setFilters({ ...filters, inStockOnly: e.target.checked })}
                  className="w-4 h-4 rounded border-theme/10 bg-theme text-[#1A73E8] focus:ring-0 cursor-pointer"
                />
                <span>In Stock Only</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-xs text-theme hover:text-theme transition-colors">
                <input
                  type="checkbox"
                  checked={filters.aiManualEnabled}
                  onChange={(e) => setFilters({ ...filters, aiManualEnabled: e.target.checked })}
                  className="w-4 h-4 rounded border-theme/10 bg-theme text-[#1A73E8] focus:ring-0 cursor-pointer"
                />
                <span>AI Manuals Available</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-6 gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-theme uppercase">Catalogue / Precision Instruments</span>
              <h2 className="text-2xl font-black text-theme mt-1 uppercase tracking-wide">Industrial Showcase</h2>
              <p className="text-xs text-theme mt-1">{products.length} products found</p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 text-theme border border-theme/10 rounded-xl bg-theme/5">
              No products found. Try adjusting your filters.
            </div>
          ) : (
            <>
              {/* ─── PRODUCT CARDS ─── */}
              <div className={`grid ${viewMode === 'mobile' ? 'grid-cols-2 gap-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'}`}>
                {visibleProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group bg-theme border border-theme/10 rounded-xl overflow-hidden flex flex-col hover:border-[#1A73E8]/40 hover:shadow-[0_8px_30px_rgba(26,115,232,0.12)] transition-all duration-300 cursor-pointer"
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-theme/5">
                      <img
                        alt={product.title}
                        src={getImageUrl(product.images?.[0]) || `/design/images/${product.id}.jpeg`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          const t = e.currentTarget;
                          if (!t.src.includes('unsplash')) {
                            t.src = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400';
                          }
                        }}
                      />
                      {product.tag && (
                        <span className="absolute top-2 left-2 bg-[#1A73E8] text-white text-[8px] font-black px-2 py-0.5 rounded tracking-wider uppercase">
                          {product.tag}
                        </span>
                      )}
                      {product.discount && (
                        <span className="absolute top-2 right-2 bg-amber-400 text-black text-[8px] font-black px-2 py-0.5 rounded tracking-wider">
                          {product.discount}
                        </span>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                        <span className="text-white text-[10px] font-bold flex items-center gap-1.5">
                          <Eye size={12} /> View Details
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className={`flex flex-col flex-grow ${viewMode === 'mobile' ? 'p-2.5' : 'p-3.5'}`}>
                      <span className="text-[9px] font-bold text-[#1A73E8] uppercase tracking-widest mb-1">
                        {product.category || 'General'}
                      </span>
                      <h3 className={`font-semibold text-theme leading-tight line-clamp-2 group-hover:text-[#1A73E8] transition-colors flex-1 ${viewMode === 'mobile' ? 'text-[11px] mb-1' : 'text-xs mb-2'}`}>
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-theme/5">
                        <div>
                          <span className={`font-black text-theme ${viewMode === 'mobile' ? 'text-xs' : 'text-sm'}`}>
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-[9px] line-through text-theme ml-1">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* ─── VIEW MORE BUTTON ─── */}
              {hasMore && (
                <div className="flex flex-col items-center gap-2 pt-6">
                  <button
                    onClick={handleLoadMore}
                    className="group flex items-center gap-2 px-8 py-3.5 bg-theme border border-[#1A73E8]/30 hover:border-[#1A73E8] hover:bg-[#1A73E8]/5 text-theme hover:text-[#1A73E8] text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300"
                  >
                    <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
                    View More Products ({products.length - visibleCount} remaining)
                  </button>
                  <p className="text-[10px] text-theme">
                    Showing {visibleCount} of {products.length} products in{' '}
                    <span className="text-[#1A73E8] font-bold">{selectedCategory}</span>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
