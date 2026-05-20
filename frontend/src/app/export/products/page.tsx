"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search, Filter, Download, Globe, LayoutDashboard,
  Package2, FileQuestion, Award, Star, ChevronDown,
  Plane, Ship, RefreshCw,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────
interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number | null;
  stock?: number;
  category?: string;
  sku?: string;
  images?: string[];
  tag?: string | null;
  brand?: string;
  product_status?: string;
}

// ── Sidebar ───────────────────────────────────────────
const SIDEBAR_LINKS = [
  { icon: LayoutDashboard, label: "Dashboard",      href: "/export" },
  { icon: Package2,        label: "Inventory",      href: "/export/products", active: true },
  { icon: FileQuestion,    label: "Inquiries",      href: "/export/enquiry" },
  { icon: Award,           label: "Certifications", href: "/certifications" },
];

const LOGISTICS = ["Air Freight", "Sea Freight", "Road", "Express"];

// ── Page ──────────────────────────────────────────────
export default function ExportProductsPage() {
  const [products,   setProducts]   = useState<Product[]>([]);
  const [search,     setSearch]     = useState("");
  const [category,   setCategory]   = useState("All");
  const [logistics,  setLogistics]  = useState("Sea Freight");
  const [enquiry,    setEnquiry]    = useState<string[]>([]);
  const [flashId,    setFlashId]    = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading,    setLoading]    = useState(true);

  // Load products from admin localStorage
  const loadProducts = useCallback(() => {
    try {
      const raw = localStorage.getItem("ke_products");
      const all: Product[] = raw ? JSON.parse(raw) : [];
      // Only show active products added/approved by admin
      const active = all.filter(
        (p) => !p.product_status || p.product_status === "active"
      );
      setProducts(active);

      // Build dynamic category list
      const cats = Array.from(
        new Set(active.map((p) => p.category).filter(Boolean) as string[])
      );
      setCategories(["All", ...cats]);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    // Re-load when admin updates products in another tab
    const onStorage = (e: StorageEvent) => {
      if (e.key === "ke_products") loadProducts();
    };
    const onUpdate = () => loadProducts();
    window.addEventListener("storage", onStorage);
    window.addEventListener("products-updated", onUpdate);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("products-updated", onUpdate);
    };
  }, [loadProducts]);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      p.title?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q);
    const matchCat = category === "All" || p.category === category;
    return matchSearch && matchCat;
  });

  const addToEnquiry = (id: string) => {
    setEnquiry((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setFlashId(id);
    setTimeout(() => setFlashId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">

      {/* ── Sidebar ─────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-56 bg-[#0d0d0d] border-r border-white/5 sticky top-[73px] h-[calc(100vh-73px)] pt-6 pb-10 px-3 overflow-y-auto">
        <div className="mb-8 px-3">
          <div className="text-brand-yellow text-[10px] font-black tracking-widest uppercase">Export Hub</div>
          <div className="text-gray-600 text-[9px] tracking-wider mt-0.5">Khush Global Logistics</div>
        </div>

        <nav className="flex-1 space-y-1">
          {SIDEBAR_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                item.active
                  ? "bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={15} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Enquiry draft badge */}
        {enquiry.length > 0 && (
          <Link href="/export/enquiry" className="mx-2 mt-4">
            <div className="bg-brand-yellow/10 border border-brand-yellow/30 rounded-lg p-3 hover:bg-brand-yellow/15 transition-colors">
              <div className="text-brand-yellow text-[10px] font-black uppercase tracking-widest mb-1">Enquiry Draft</div>
              <div className="text-white font-bold text-lg">
                {enquiry.length}{" "}
                <span className="text-gray-400 text-xs font-normal">items</span>
              </div>
              <div className="mt-2 text-[9px] text-brand-yellow/80 uppercase tracking-widest">→ Send Enquiry</div>
            </div>
          </Link>
        )}

        <div className="mt-6 px-3 space-y-2">
          <div className="text-gray-600 text-[9px] uppercase tracking-widest font-bold mb-2">Quick Links</div>
          <Link href="/reviews"    className="flex items-center gap-2 text-gray-600 hover:text-gray-400 text-[10px] transition-colors"><Star size={10} /> Ratings</Link>
          <Link href="/contact-us" className="flex items-center gap-2 text-gray-600 hover:text-gray-400 text-[10px] transition-colors"><Globe size={10} /> Support</Link>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Page header */}
        <div className="border-b border-white/5 bg-[#0d0d0d] px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Export Hub</div>
              <h1 className="text-2xl md:text-3xl font-black text-white">Export Products</h1>
              <p className="text-gray-500 text-xs mt-1">
                Precision-engineered goods cleared for international freight.
                All listed items comply with G2G logistics standards.
              </p>
            </div>
            <div className="flex items-center gap-3 self-start md:self-center">
              <button
                onClick={loadProducts}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white px-4 py-2.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all"
                title="Refresh from admin"
              >
                <RefreshCw size={12} /> Refresh
              </button>
              <Link href="/export/catalogue">
                <button className="flex items-center gap-2 bg-brand-yellow hover:bg-yellow-400 text-black px-5 py-2.5 rounded text-[10px] font-black uppercase tracking-wider transition-colors whitespace-nowrap">
                  <Download size={12} /> Download KE Catalogue
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filters bar */}
        <div className="px-6 py-4 border-b border-white/5 bg-[#0a0a0a] flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest flex-shrink-0">
            <Filter size={12} /> Parameter Filters
          </div>

          {/* Search */}
          <div className="relative min-w-[180px] max-w-xs flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, SKU..."
              className="w-full bg-[#111] border border-white/10 rounded pl-8 pr-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-white/25 transition-colors"
            />
          </div>

          {/* Industry Sector pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded border text-[10px] font-bold uppercase tracking-wider transition-all ${
                  category === c
                    ? "bg-brand-yellow/15 border-brand-yellow/40 text-brand-yellow"
                    : "border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Logistics vector selector */}
          <div className="relative ml-auto flex-shrink-0">
            <select
              value={logistics}
              onChange={(e) => setLogistics(e.target.value)}
              className="bg-[#111] border border-white/10 rounded px-3 py-2 text-[10px] text-gray-400 outline-none appearance-none pr-7 focus:border-white/25"
            >
              {LOGISTICS.map((l) => <option key={l}>{l}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Products grid */}
        <div className="flex-1 px-6 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-gray-600">
              <RefreshCw size={20} className="animate-spin mr-2" /> Loading products...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-600">
              <Package2 size={36} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm font-bold text-gray-700 mb-1">No products found</p>
              <p className="text-xs text-gray-600">
                {products.length === 0
                  ? "No admin-added products yet. Ask the admin to add products from the Admin Portal."
                  : "Try adjusting your search or category filter."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.3 }}
                  className="group bg-[#111] border border-white/5 rounded-xl overflow-hidden hover:border-brand-yellow/30 transition-all hover:shadow-[0_0_20px_rgba(252,211,77,0.06)] flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-44 bg-[#0d0d0d] overflow-hidden">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package2 size={36} className="text-gray-700" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                      <span className="bg-brand-yellow/90 text-black text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                        Export Ready
                      </span>
                      {product.tag && (
                        <span className="bg-black/70 text-brand-yellow text-[9px] font-bold px-2 py-0.5 rounded uppercase border border-brand-yellow/20">
                          {product.tag}
                        </span>
                      )}
                    </div>
                    {/* Logistics badge */}
                    <div className="absolute bottom-2 right-2 bg-black/60 border border-white/10 backdrop-blur-sm rounded px-2 py-1 flex items-center gap-1">
                      {logistics === "Air Freight"
                        ? <Plane size={10} className="text-brand-yellow" />
                        : <Ship size={10} className="text-electric-blue" />}
                      <span className="text-[8px] text-gray-300 font-bold">{logistics}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="text-gray-600 text-[9px] font-bold uppercase tracking-widest mb-1">
                      {product.category || "General"}
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1 line-clamp-2 group-hover:text-brand-yellow transition-colors leading-snug">
                      {product.title}
                    </h3>
                    {product.sku && (
                      <div className="text-gray-600 text-[9px] font-mono mb-2">SKU: {product.sku}</div>
                    )}

                    <div className="mt-auto pt-3 border-t border-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-[9px] text-gray-600 uppercase font-bold">Export Price</div>
                          <div className="text-brand-yellow font-black text-base leading-none mt-0.5">
                            ₹{product.price?.toLocaleString("en-IN") ?? "—"}
                          </div>
                          {product.originalPrice && (
                            <div className="text-gray-600 text-[9px] line-through mt-0.5">
                              ₹{product.originalPrice.toLocaleString("en-IN")}
                            </div>
                          )}
                        </div>
                        {product.stock !== undefined && (
                          <div className="text-right">
                            <div className="text-[9px] text-gray-600 uppercase font-bold">Stock</div>
                            <div className={`font-bold text-sm ${product.stock === 0 ? "text-red-400" : product.stock < 10 ? "text-yellow-400" : "text-white"}`}>
                              {product.stock}
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => addToEnquiry(product.id)}
                        className={`w-full py-2 rounded text-[10px] font-black uppercase tracking-wider transition-all border ${
                          flashId === product.id
                            ? "bg-green-500/10 border-green-500/40 text-green-400"
                            : enquiry.includes(product.id)
                            ? "bg-white/5 border-white/10 text-gray-500 cursor-default"
                            : "bg-brand-yellow hover:bg-yellow-400 border-transparent text-black hover:scale-[1.01]"
                        }`}
                      >
                        {flashId === product.id
                          ? "✓ Added to Enquiry"
                          : enquiry.includes(product.id)
                          ? "In Enquiry Draft"
                          : "Add to Enquiry"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Logistics Notice */}
          {!loading && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 bg-[#111] border border-white/5 rounded-xl p-5"
            >
              <div className="text-brand-yellow text-[10px] font-black uppercase tracking-widest mb-2">
                Logistics Notice
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">
                All prices listed are FOR (Free on Road) India prices. Freight forwarding, customs duty, insurance costs,
                and local destination taxes are <strong className="text-white">NOT</strong> included. Est. Air Freight:{" "}
                <strong className="text-white">08–35 days</strong> · Sea Freight:{" "}
                <strong className="text-white">24+ days</strong> to EU/GCC region.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
