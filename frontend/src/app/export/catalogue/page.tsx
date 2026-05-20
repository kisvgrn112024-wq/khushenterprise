"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search, Download, Globe, LayoutDashboard, Package2,
  FileQuestion, Award, Star, FileText, RefreshCw,
  Microscope, FlaskConical, BookOpen, ChevronRight,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────
interface Catalogue {
  id: string;
  title: string;
  department: string;
  description: string;
  image: string;
  version: string;
  autoSync: boolean;
  category: string;
  selectedProductIds: string[];
  stockCount: number;
  fileName: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  category?: string;
  sku?: string;
}

// ── Sidebar ───────────────────────────────────────────
const SIDEBAR_LINKS = [
  { icon: LayoutDashboard, label: "Dashboard",      href: "/export" },
  { icon: Package2,        label: "Inventory",      href: "/export/products" },
  { icon: FileQuestion,    label: "Inquiries",      href: "/export/enquiry" },
  { icon: Award,           label: "Certifications", href: "/certifications" },
];

// ── Dept icon helper ──────────────────────────────────
function DeptIcon({ dept }: { dept: string }) {
  if (dept.toLowerCase().includes("optic") || dept.toLowerCase().includes("bio"))
    return <Microscope size={20} className="text-brand-yellow" />;
  if (dept.toLowerCase().includes("chem") || dept.toLowerCase().includes("flask"))
    return <FlaskConical size={20} className="text-brand-yellow" />;
  return <BookOpen size={20} className="text-brand-yellow" />;
}

// ── Page ──────────────────────────────────────────────
export default function ExportCataloguePage() {
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [products,   setProducts]   = useState<Product[]>([]);
  const [search,     setSearch]     = useState("");
  const [dept,       setDept]       = useState("All");
  const [loading,    setLoading]    = useState(true);
  const [depts,      setDepts]      = useState<string[]>(["All"]);
  const [expanded,   setExpanded]   = useState<string | null>(null);

  const load = useCallback(() => {
    try {
      // ── Load admin catalogues ──────────────────────
      const rawCats = localStorage.getItem("ke_catalogues");
      const allCats: Catalogue[] = rawCats ? JSON.parse(rawCats) : [];
      setCatalogues(allCats);

      // Build department filter list
      const deptSet = Array.from(
        new Set(allCats.map((c) => c.department).filter(Boolean))
      );
      setDepts(["All", ...deptSet]);

      // ── Load admin products (for curated lists) ───
      const rawProds = localStorage.getItem("ke_products");
      const allProds: Product[] = rawProds ? JSON.parse(rawProds) : [];
      setProducts(allProds);
    } catch {
      setCatalogues([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "ke_catalogues" || e.key === "ke_products") load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [load]);

  // Resolve products for a catalogue (auto-sync or curated list)
  const resolveProducts = (cat: Catalogue): Product[] => {
    if (cat.autoSync) {
      // All products in matching category
      return products.filter(
        (p) => p.category?.toLowerCase() === cat.category?.toLowerCase()
      );
    }
    // Manually selected products
    return products.filter((p) => cat.selectedProductIds?.includes(p.id));
  };

  const filtered = catalogues.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q);
    const matchDept = dept === "All" || c.department === dept;
    return matchSearch && matchDept;
  });

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
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-white hover:bg-white/5 transition-all"
            >
              <item.icon size={15} />
              {item.label}
            </Link>
          ))}

          {/* Active: Catalogue */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20">
            <FileText size={15} />
            Catalogue
          </div>
        </nav>

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
              <h1 className="text-2xl md:text-3xl font-black text-white">
                Export <span className="text-brand-yellow">Catalogues</span>
              </h1>
              <p className="text-gray-500 text-xs mt-1">
                Download and reference precision laboratory product matrices.
                All catalogues are curated or auto-synced by the KE admin team.
              </p>
            </div>
            <div className="flex items-center gap-3 self-start md:self-center">
              <button
                onClick={load}
                title="Refresh"
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white px-4 py-2.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all"
              >
                <RefreshCw size={12} /> Refresh
              </button>
              <Link href="/export/enquiry">
                <button className="flex items-center gap-2 bg-brand-yellow hover:bg-yellow-400 text-black px-5 py-2.5 rounded text-[10px] font-black uppercase tracking-wider transition-colors whitespace-nowrap">
                  <FileQuestion size={12} /> Send Enquiry
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-white/5 bg-[#0a0a0a] flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center">
          {/* Search */}
          <div className="relative min-w-[200px] max-w-sm flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search catalogues..."
              className="w-full bg-[#111] border border-white/10 rounded pl-8 pr-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-white/25 transition-colors"
            />
          </div>

          {/* Department pills */}
          <div className="flex flex-wrap gap-2">
            {depts.map((d) => (
              <button
                key={d}
                onClick={() => setDept(d)}
                className={`px-3 py-1.5 rounded border text-[10px] font-bold uppercase tracking-wider transition-all ${
                  dept === d
                    ? "bg-brand-yellow/15 border-brand-yellow/40 text-brand-yellow"
                    : "border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-6">

          {loading ? (
            <div className="flex items-center justify-center py-24 text-gray-600">
              <RefreshCw size={20} className="animate-spin mr-2" /> Loading catalogues...
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <FileText size={40} className="mx-auto mb-4 text-gray-700" />
              <p className="text-gray-600 font-bold text-sm mb-1">No catalogues available</p>
              <p className="text-gray-700 text-xs max-w-xs mx-auto">
                {catalogues.length === 0
                  ? "The admin hasn't published any catalogues yet. Check back soon or contact support."
                  : "No catalogues match your search. Try adjusting the filters."}
              </p>
              <Link href="/contact-us" className="inline-block mt-4 text-brand-yellow/80 text-xs hover:text-brand-yellow transition-colors underline underline-offset-4">
                Contact Support →
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((cat, i) => {
                const catProducts = resolveProducts(cat);
                const isOpen = expanded === cat.id;
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.06, 0.4), duration: 0.35 }}
                    className="group bg-[#111] border border-white/5 rounded-xl overflow-hidden hover:border-brand-yellow/25 transition-all hover:shadow-[0_0_24px_rgba(252,211,77,0.07)] flex flex-col"
                  >
                    {/* Cover image */}
                    <div className="relative h-48 bg-[#0d0d0d] overflow-hidden">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.title}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText size={40} className="text-gray-700" />
                        </div>
                      )}

                      {/* Version badge */}
                      <div className="absolute top-3 left-3">
                        <span className="text-[9px] font-black tracking-widest text-brand-yellow border border-brand-yellow/20 bg-black/80 px-2 py-0.5 rounded uppercase backdrop-blur-sm">
                          {cat.version}
                        </span>
                      </div>

                      {/* Sync type badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider backdrop-blur-sm border ${
                          cat.autoSync
                            ? "bg-green-950/80 border-green-500/20 text-green-400"
                            : "bg-purple-950/80 border-purple-500/20 text-purple-400"
                        }`}>
                          {cat.autoSync ? "Auto-Sync" : "Curated"}
                        </span>
                      </div>

                      {/* Dept icon */}
                      <div className="absolute bottom-3 right-3 bg-black/60 border border-white/10 backdrop-blur-md p-2 rounded-full">
                        <DeptIcon dept={cat.department} />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="text-brand-yellow text-[9px] font-black uppercase tracking-widest mb-1.5">
                        {cat.department}
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2 group-hover:text-brand-yellow transition-colors leading-snug line-clamp-2">
                        {cat.title}
                      </h3>
                      <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3">
                        {cat.description}
                      </p>

                      {/* Meta row */}
                      <div className="flex justify-between items-center text-[9px] font-mono text-gray-600 border-t border-white/5 pt-3 mb-4">
                        <span className="flex items-center gap-1"><FileText size={9} /> {cat.fileName}</span>
                        <span className="text-brand-yellow font-bold">{cat.stockCount} copies</span>
                      </div>

                      {/* Expandable product list */}
                      {catProducts.length > 0 && (
                        <div className="mb-4">
                          <button
                            onClick={() => setExpanded(isOpen ? null : cat.id)}
                            className="flex items-center justify-between w-full text-[10px] text-gray-500 hover:text-gray-300 transition-colors mb-2 font-bold uppercase tracking-wider"
                          >
                            <span>{catProducts.length} Products Included</span>
                            <ChevronRight
                              size={12}
                              className={`transition-transform ${isOpen ? "rotate-90" : ""}`}
                            />
                          </button>
                          {isOpen && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="space-y-1 max-h-36 overflow-y-auto pr-1"
                            >
                              {catProducts.map((p) => (
                                <li key={p.id} className="text-[10px] text-gray-500 border border-white/5 rounded px-2 py-1.5 flex justify-between bg-white/[0.02]">
                                  <span className="truncate mr-2">{p.title}</span>
                                  <span className="text-brand-yellow font-bold shrink-0">
                                    ₹{p.price?.toLocaleString("en-IN")}
                                  </span>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-auto flex gap-2">
                        <a
                          href={`/print?file=${encodeURIComponent(cat.fileName)}&catId=${cat.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-brand-yellow/10 hover:bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/20 text-[10px] font-black rounded uppercase tracking-widest transition-colors"
                        >
                          <Download size={11} /> Download PDF
                        </a>
                        <Link
                          href="/export/enquiry"
                          className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 text-[10px] font-bold rounded uppercase tracking-wider transition-colors"
                        >
                          Enquire
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Bottom CTA */}
          {!loading && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 bg-gradient-to-r from-brand-yellow/10 via-brand-yellow/5 to-transparent border border-brand-yellow/15 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
            >
              <div>
                <h4 className="text-white font-black text-base mb-1">Need a custom catalogue for your region?</h4>
                <p className="text-gray-500 text-xs">
                  Request custom packaging formats, regional pricing, or branded export documentation.
                </p>
              </div>
              <Link href="/export/enquiry">
                <button className="flex items-center gap-2 bg-brand-yellow hover:bg-yellow-400 text-black px-6 py-3 rounded text-[10px] font-black uppercase tracking-wider transition-colors whitespace-nowrap">
                  Create Custom Quote →
                </button>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Footer strip */}
        <div className="px-6 py-4 border-t border-white/5 text-[9px] text-gray-700 font-mono flex flex-wrap gap-4">
          <span>© 2024 Khush Enterprises. Managed by Ishan Malhotra &amp; Vikas Malhotra.</span>
          <Link href="/contact-us"    className="hover:text-gray-500 transition-colors">WhatsApp Contact</Link>
          <Link href="/certifications" className="hover:text-gray-500 transition-colors">Logistics Certifications</Link>
          <Link href="/about-us"      className="hover:text-gray-500 transition-colors">Terms of Export</Link>
        </div>
      </div>
    </div>
  );
}
