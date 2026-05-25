"use client";

import { Plus, Search, Filter, Download, Trash2, FlaskConical, Microscope, Scale, Pipette, Glasses, Flame, Package, Image as ImageIcon, Edit2, FileSpreadsheet } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getProducts, Product, getImageUrl } from "@/lib/products";
import { useDownload } from "@/components/admin/DownloadToast";

const IconMap: Record<string, React.ElementType> = {
  Microscope,
  Scale,
  Pipette,
  Glasses,
  FlaskConical,
  Flame,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [stockFilter, setStockFilter] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);
  const { startDownload } = useDownload();

  const loadAndSetProducts = (prods: Product[]) => {
    setProducts(prods);
    const uniqueCats = Array.from(new Set(prods.map(p => p.category).filter(Boolean))) as string[];
    setCategories(uniqueCats);
  };

  useEffect(() => {
    // STEP 1: Always immediately load ALL products from localStorage/productsDB
    // This ensures every product listed on the customer site is visible in admin
    const localProducts = getProducts();
    loadAndSetProducts(localProducts);

    // STEP 2: Try to fetch from backend API and merge any server-only products
    const mergeFromAPI = async () => {
      try {
        const API_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
          ? `http://${window.location.hostname}:5000/api/products`
          : '/api/products';

        const res = await fetch(API_URL, { signal: AbortSignal.timeout(3000) });
        if (!res.ok) return;
        const apiData = await res.json();

        if (Array.isArray(apiData) && apiData.length > 0) {
          // Merge API products with local products (local takes priority for edits)
          const localProds = getProducts();
          const localIds = new Set(localProds.map((p: Product) => p.id));
          const serverOnlyProds = apiData.filter((p: Product) => !localIds.has(p.id));
          if (serverOnlyProds.length > 0) {
            const merged = [...localProds, ...serverOnlyProds];
            loadAndSetProducts(merged);
          }
        }
      } catch {
        // API offline or timed out â€” local data already displayed, nothing to do
      }
    };
    mergeFromAPI();

    // STEP 3: Listen for real-time local updates (e.g. product added/edited)
    const handleLocalUpdate = () => {
      const updated = getProducts();
      loadAndSetProducts(updated);
    };
    window.addEventListener('products-updated', handleLocalUpdate);
    return () => window.removeEventListener('products-updated', handleLocalUpdate);
  }, []);

  const handleDownload = () => {
    startDownload("Product_Inventory_Export.csv", "4.2 MB", "CSV File");
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this product from the e-commerce inventory?")) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem("ke_products", JSON.stringify(updated));
      window.dispatchEvent(new Event("products-updated"));
      // Sync delete with backend
      const BASE_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
        ? `http://${window.location.hostname}:5000` 
        : '';
      fetch(`${BASE_URL}/api/products/${id}`, { method: 'DELETE' }).catch(err => console.log("Offline mode: deleted locally"));
    }
  };

  // Filter logic
  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prod.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All Categories" || prod.category === categoryFilter;
    
    let matchesStock = true;
    if (stockFilter === "In") {
      matchesStock = (prod.stock || 0) > 0;
    } else if (stockFilter === "Out") {
      matchesStock = (prod.stock || 0) === 0;
    } else if (stockFilter === "Low") {
      matchesStock = (prod.stock || 0) > 0 && (prod.stock || 0) < 10;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="max-w-6xl mx-auto pb-12 text-slate-300">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-theme/5">
        <div>
          <h1 className="text-3xl font-bold text-theme mb-1">Products Inventory</h1>
          <p className="text-theme text-sm">Review wholesale pricing grids, catalog mappings, and live stock tracking tables.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search SKU, Product Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-theme border border-theme/10 focus:border-theme/50 text-xs text-theme pl-8 pr-4 py-2.5 rounded w-64 outline-none transition-colors" 
            />
          </div>
          <Link href="/admin-secret-khush/products/bulk" className="bg-theme hover:bg-theme text-theme border border-theme/10 font-bold px-5 py-2.5 rounded text-sm flex items-center gap-2 transition-colors uppercase tracking-wider cursor-pointer">
            <FileSpreadsheet size={16} /> Bulk Listing
          </Link>
          <Link href="/admin-secret-khush/products/add" className="bg-brand-yellow hover:bg-theme text-theme font-bold px-5 py-2.5 rounded text-sm flex items-center gap-2 transition-colors uppercase tracking-wider cursor-pointer">
            <Plus size={16} strokeWidth={2.5} /> Add Product
          </Link>
        </div>
      </div>

      {/* Inventory Table Container */}
      <div className="bg-theme border border-theme/5 rounded-xl overflow-hidden shadow-2xl">
        
        {/* Controls Row */}
        <div className="p-4 border-b border-theme/5 flex justify-between items-center bg-theme flex-wrap gap-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme pointer-events-none" />
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-theme border border-theme/5 hover:bg-theme/5 text-theme text-xs pl-8 pr-8 py-2 rounded transition-colors appearance-none outline-none cursor-pointer"
              >
                <option value="All Categories">All Categories</option>
                {categories.map((c, idx) => (
                  <option key={idx} value={c}>{c}</option>
                ))}
              </select>
            </div>
            
            <select 
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="bg-theme border border-theme/5 hover:bg-theme/5 text-theme text-xs px-4 py-2 rounded transition-colors appearance-none outline-none cursor-pointer"
            >
              <option value="All">All Stock Levels</option>
              <option value="In">In Stock (&gt; 0)</option>
              <option value="Low">Low Stock (&lt; 10)</option>
              <option value="Out">Out of Stock</option>
            </select>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs text-theme font-mono">{filteredProducts.length} items catalogued</span>
            <button onClick={handleDownload} className="text-[#8bceff] hover:text-[#6ab3f0] transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" title="Download Excel List">
              <Download size={15} /> Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-theme text-[10px] font-bold text-theme uppercase tracking-widest border-b border-theme/5">
              <tr>
                <th className="p-4 w-10 text-center"><input type="checkbox" className="accent-[#8bceff] rounded border-theme/10 bg-transparent focus:ring-0" /></th>
                <th className="p-4">Product Info</th>
                <th className="p-4">SKU / Model</th>
                <th className="p-4">Assigned Category</th>
                <th className="p-4">Assigned PDF Catalog</th>
                <th className="p-4 text-right">Contract Price</th>
                <th className="p-4 text-center">Stock Level</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-theme text-xs">
                    No active product inventories match your filter queries.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const IconComp = IconMap[prod.icon || ""] || Package;
                  const isOutOfStock = (prod.stock || 0) === 0;
                  const isLowStock = (prod.stock || 0) > 0 && (prod.stock || 0) < 10;
                  const displayImg = prod.imageUrl || (prod.images && prod.images[0]) || "";

                  return (
                    <tr key={prod.id} className="hover:bg-theme/[0.01] transition-colors">
                      <td className="p-4 text-center"><input type="checkbox" className="accent-[#8bceff] rounded border-theme/10 bg-transparent focus:ring-0" /></td>
                      <td className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-theme border border-theme/5 flex items-center justify-center shrink-0 overflow-hidden">
                          {displayImg ? (
                            <img src={getImageUrl(displayImg)} alt={prod.title} className="w-full h-full object-cover opacity-80" />
                          ) : (
                            <IconComp size={20} className="text-[#8bceff]" />
                          )}
                        </div>
                        <div>
                          <div className="text-theme font-bold text-sm mb-0.5 leading-snug">{prod.title}</div>
                          <div className="text-[10px] text-theme font-mono">Brand: {prod.brand || "Khush Enterprises"}</div>
                        </div>
                      </td>
                      <td className="p-4 text-theme text-xs font-mono">{prod.sku || `KE-${prod.id.slice(-4).toUpperCase()}`}</td>
                      <td className="p-4 text-theme text-xs">{prod.category || "General Lab"}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded bg-theme border border-theme/20 text-[#8bceff] text-[10px] font-mono uppercase">
                          {prod.catalog || "Lab Essentials Guide"}
                        </span>
                      </td>
                      <td className="p-4 text-right text-theme font-extrabold font-mono text-xs">
                        â‚¹{prod.price?.toLocaleString("en-IN") || "0"}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full ${
                          isOutOfStock ? "bg-red-950/60 border border-red-500/20 text-red-400" :
                          isLowStock ? "bg-yellow-950/60 border border-yellow-500/20 text-yellow-400" :
                          "bg-green-950/60 border border-green-500/20 text-green-400"
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            isOutOfStock ? "bg-red-400" : isLowStock ? "bg-yellow-400" : "bg-green-400"
                          }`}></div>
                          {isOutOfStock ? "Out of Stock" : isLowStock ? `Low Stock (${prod.stock})` : `In Stock (${prod.stock})`}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <Link href={`/admin-secret-khush/products/add?id=${prod.id}`} className="text-theme hover:text-theme transition-colors" title="Edit Profile">
                            <Edit2 size={15} />
                          </Link>
                          <button onClick={() => handleDeleteProduct(prod.id)} className="text-theme hover:text-red-400 transition-colors" title="Delete Product">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="p-4 border-t border-theme/5 flex justify-between items-center text-xs text-theme bg-theme">
          <div>Showing 1 to {filteredProducts.length} entries</div>
          <div className="flex gap-2">
            <button className="px-2 py-1 rounded border border-theme/5 bg-theme text-[#8bceff] text-[10px] font-bold">1</button>
          </div>
        </div>

      </div>
    </div>
  );
}
