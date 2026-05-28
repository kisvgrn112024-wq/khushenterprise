"use client";

import { Plus, Trash2, Eye, EyeOff, ShieldAlert, Sparkles, RefreshCw, BarChart2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getProducts, Product } from "@/lib/products";

interface Category {
  name: string;
  description: string;
  visible: boolean;
}

const DEFAULT_CATEGORIES: Category[] = [
  { name: "Physics Lab", description: "Precision physics lab apparatus and optics kits.", visible: true },
  { name: "Chemistry Lab", description: "Borosilicate glassware, heating apparatus, and reagents.", visible: true },
  { name: "Biology Lab", description: "Specimens, anatomical models, and biology glassware.", visible: true },
  { name: "Microscopes", description: "High-grade monocular and binocular compound microscopes.", visible: true },
  { name: "Surgical & Ortho Aids", description: "Orthopedic neck, back, knee braces and surgical accessories.", visible: true }
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newVisible, setNewVisible] = useState(true);
  const [isWiping, setIsWiping] = useState(false);
  const [newImage, setNewImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [catalogueDesc, setCatalogueDesc] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        try {
          const API_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
            ? `http://${window.location.hostname}:5000/api/upload` 
            : '/api/upload';

          const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image: base64String,
              name: file.name,
              type: file.type
            })
          });
          const data = await res.json();
          if (data.url) {
            setNewImage(data.url);
          } else {
            setNewImage(base64String);
          }
        } catch (err) {
          setNewImage(base64String);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Load categories and products on mount
  useEffect(() => {
    // Categories
    const savedCats = localStorage.getItem("ke_categories");
    if (savedCats) {
      setCategories(JSON.parse(savedCats));
    } else {
      setCategories(DEFAULT_CATEGORIES);
      localStorage.setItem("ke_categories", JSON.stringify(DEFAULT_CATEGORIES));
    }

    // Products
    setProducts(getProducts());

    const handleUpdate = () => {
      setProducts(getProducts());
    };
    window.addEventListener("products-updated", handleUpdate);
    return () => window.removeEventListener("products-updated", handleUpdate);
  }, []);

  const saveCats = (updated: Category[]) => {
    setCategories(updated);
    localStorage.setItem("ke_categories", JSON.stringify(updated));
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return alert("Category Name is required!");
    
    // Check duplication
    if (categories.some(c => c.name.toLowerCase() === newName.trim().toLowerCase())) {
      return alert("Category already exists!");
    }

    const updated = [
      ...categories,
      { name: newName.trim(), description: newDesc.trim(), visible: newVisible }
    ];
    saveCats(updated);

    // Create corresponding dynamic catalogue entry
    const savedCatalogues = localStorage.getItem("ke_catalogues");
    const cataloguesList = savedCatalogues ? JSON.parse(savedCatalogues) : [];
    const newCatEntry = {
      id: `cat_${Date.now()}`,
      title: newName.trim(),
      department: newName.trim(),
      description: catalogueDesc.trim() || newDesc.trim() || "Dynamic Catalogue for " + newName.trim(),
      image: newImage || "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600",
      version: "V1.0",
      autoSync: true,
      category: newName.trim(),
      selectedProductIds: [],
      stockCount: 150,
      fileName: `${newName.trim().toLowerCase().replace(/ /g, "-")}-guide.pdf`
    };
    localStorage.setItem("ke_catalogues", JSON.stringify([...cataloguesList, newCatEntry]));

    setNewName("");
    setNewDesc("");
    setCatalogueDesc("");
    setNewImage("");
    setNewVisible(true);
    alert("New category and dynamic catalogue registered successfully!");
  };

  const handleDeleteCategory = (name: string) => {
    if (confirm(`Are you sure you want to delete the category "${name}"?`)) {
      const updated = categories.filter(c => c.name !== name);
      saveCats(updated);
    }
  };

  const toggleVisibility = (index: number) => {
    const updated = [...categories];
    updated[index].visible = !updated[index].visible;
    saveCats(updated);
  };

  // Perform backend & frontend data purge of old placeholders
  const handleDataPurge = async () => {
    if (!confirm("CRITICAL WARNING: This will completely wipe all original dummy listings and placeholder items (including the 663 dummy inventory records) from both the local store and backend database. This action cannot be undone. Proceed?")) {
      return;
    }

    setIsWiping(true);
    try {
      const API_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
        ? `http://${window.location.hostname}:5000/api/products/purge-placeholders` 
        : '/api/products/purge-placeholders';
      await fetch(API_URL, { method: 'DELETE' });
    } catch (e) {
      console.log("Backend offline or unreachable, performing frontend purge");
    }

    // 2. Filter out original dummy placeholders from local storage
    // Products p1-p6 and wt1-wt6 are the original placeholders (where is_placeholder is true or they are not admin-edited)
    const currentProducts = getProducts();
    const cleanProducts = currentProducts.filter(p => p.edited_by_admin === true && !p.is_placeholder);
    
    localStorage.setItem('ke_products', JSON.stringify(cleanProducts));
    window.dispatchEvent(new Event('products-updated'));
    setProducts(cleanProducts);
    
    setIsWiping(false);
    alert("DATABASE PURGE COMPLETE: All original dummy records deleted. Inventory metrics refreshed!");
  };

  // Calculate live statistics
  // Count items associated with each category
  const activeProducts = products.filter(p => p.product_status === 'active' && p.edited_by_admin === true);
  const totalActiveCount = activeProducts.length;

  const categoryStats = categories.map(cat => {
    const count = activeProducts.filter(p => p.category?.toLowerCase() === cat.name.toLowerCase()).length;
    const percentage = totalActiveCount > 0 ? Math.round((count / totalActiveCount) * 100) : 0;
    return {
      name: cat.name,
      count,
      percentage
    };
  });

  return (
    <div className="max-w-6xl mx-auto pb-12 text-slate-300">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-theme/5">
        <div>
          <h1 className="text-3xl font-bold text-theme mb-1">Category & Purge Center</h1>
          <p className="text-theme text-sm">Configure laboratory collections, view dynamic inventory stats, and wipe dummy datasets.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Category List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-theme border border-theme/5 rounded-xl p-6">
            <h2 className="text-lg font-bold text-theme mb-6">Active Categories</h2>
            
            {categories.length === 0 ? (
              <div className="text-center py-10 text-theme">No categories defined yet.</div>
            ) : (
              <div className="space-y-4">
                {categories.map((cat, idx) => {
                  const stat = categoryStats.find(s => s.name === cat.name) || { count: 0, percentage: 0 };
                  return (
                    <div key={idx} className="bg-theme border border-theme/5 p-4 rounded-lg flex items-center justify-between hover:border-theme/10 transition-colors">
                      <div className="flex-1 pr-6">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-theme text-base">{cat.name}</span>
                          <span className="bg-theme border border-theme/5 text-[10px] text-theme font-bold px-2 py-0.5 rounded-full">
                            {stat.count} Live Items
                          </span>
                        </div>
                        <p className="text-theme text-xs mt-1 leading-relaxed">{cat.description || "No description provided."}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Visibility status */}
                        <button 
                          onClick={() => toggleVisibility(idx)}
                          className={`p-2 rounded hover:bg-theme/5 transition-colors ${cat.visible ? 'text-[#8bceff]' : 'text-theme'}`}
                          title={cat.visible ? "Visible on Customer Catalog" : "Hidden from Customer Catalog"}
                        >
                          {cat.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>

                        {/* Delete button */}
                        <button 
                          onClick={() => handleDeleteCategory(cat.name)}
                          className="p-2 text-theme hover:text-[#ff4d4d] hover:bg-theme/5 rounded transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Form, Purge, and Live Charts */}
        <div className="space-y-8">
          
          {/* Add Category Form */}
          <div className="bg-theme border border-theme/5 rounded-xl p-6">
            <h2 className="text-lg font-bold text-theme mb-6 flex items-center gap-2">
              <Plus size={18} className="text-[#8bceff]" /> Add New Category
            </h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-theme uppercase tracking-widest mb-1.5">Category Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Molecular Diagnostics"
                  className="w-full bg-theme border border-theme/5 rounded px-3 py-2 text-theme text-sm outline-none focus:border-theme transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-theme uppercase tracking-widest mb-1.5">Description (Internal Optional)</label>
                <textarea 
                  value={newDesc} 
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Summarize the products in this collection..."
                  className="w-full bg-theme border border-theme/5 rounded px-3 py-2 text-theme text-xs outline-none focus:border-theme h-12 resize-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-theme uppercase tracking-widest mb-1.5">Catalogue Description <span className="text-red-500">*</span></label>
                <textarea 
                  value={catalogueDesc} 
                  onChange={e => setCatalogueDesc(e.target.value)}
                  placeholder="Details for the public catalogue..."
                  className="w-full bg-theme border border-theme/5 rounded px-3 py-2 text-theme text-xs outline-none focus:border-theme h-16 resize-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-theme uppercase tracking-widest mb-1.5">Catalogue Cover Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full bg-theme border border-theme/5 rounded px-3 py-2 text-xs text-theme outline-none file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-theme/10 file:text-theme cursor-pointer" 
                />
                {isUploading && <p className="text-[10px] text-theme mt-1">Uploading...</p>}
                {newImage && <img src={newImage} alt="Preview" className="mt-2 w-16 h-16 object-cover rounded border border-theme/10" />}
              </div>

              <div className="flex items-center justify-between p-3 bg-theme rounded border border-theme/5">
                <div>
                  <span className="text-theme font-bold text-xs">Visible on Catalog</span>
                  <p className="text-[10px] text-theme">Show or hide on storefront</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNewVisible(!newVisible)}
                  className={`w-12 h-6 rounded-full border transition-all relative ${
                    newVisible ? "bg-theme border-theme/30" : "bg-theme border-theme/5"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full absolute top-1 transition-all ${
                    newVisible ? "right-1 bg-theme" : "left-1 bg-theme"
                  }`}></div>
                </button>
              </div>

              <button 
                type="submit"
                className="w-full bg-theme hover:bg-theme text-theme font-bold text-sm py-2 rounded transition-colors"
              >
                Create Category
              </button>
            </form>
          </div>

          {/* Dynamic Pie/Distribution Chart */}
          <div className="bg-theme border border-theme/5 rounded-xl p-6">
            <h2 className="text-lg font-bold text-theme mb-4 flex items-center gap-2">
              <BarChart2 size={18} className="text-[#8bceff]" /> Inventory Distribution
            </h2>
            
            <div className="flex items-center justify-center relative my-6">
              <div className="w-40 h-40 rounded-full border-4 border-theme bg-theme flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-electric-blue/10 to-transparent animate-pulse pointer-events-none"></div>
                <div className="text-3xl font-black text-theme z-10">{totalActiveCount}</div>
                <div className="text-[9px] font-bold text-theme uppercase tracking-widest z-10">Active Items</div>
              </div>
            </div>

            <div className="space-y-3.5">
              {categoryStats.map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-theme flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-sm ${
                        idx === 0 ? 'bg-theme' :
                        idx === 1 ? 'bg-theme' :
                        idx === 2 ? 'bg-theme' :
                        idx === 3 ? 'bg-theme' : 'bg-theme'
                      }`}></span>
                      {stat.name}
                    </span>
                    <span className="text-theme">{stat.percentage}% ({stat.count})</span>
                  </div>
                  <div className="w-full bg-theme h-1.5 rounded-full overflow-hidden border border-theme/5">
                    <div 
                      className={`h-full ${
                        idx === 0 ? 'bg-theme' :
                        idx === 1 ? 'bg-theme' :
                        idx === 2 ? 'bg-theme' :
                        idx === 3 ? 'bg-theme' : 'bg-theme'
                      }`}
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Database Purge Center */}
          <div className="bg-theme border border-red-500/10 rounded-xl p-6">
            <h2 className="text-md font-bold text-theme mb-2 flex items-center gap-2">
              <ShieldAlert size={18} className="text-[#ff4d4d]" /> Secure Purge Command
            </h2>
            <p className="text-xs text-theme leading-relaxed mb-4">
              Purges all initial placeholder items (original dummy stocks) from the local store and remote server database in a single sweep.
            </p>
            <button 
              onClick={handleDataPurge}
              disabled={isWiping}
              className="w-full bg-theme/10 hover:bg-theme/20 text-[#ff4d4d] border border-theme/20 font-bold text-xs py-2.5 rounded transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              {isWiping ? "Executing Purge..." : "Wipe Database Placeholders"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
