"use client";

import { Plus, Filter, Download, MoreVertical, FileText, CheckCircle2, Save, X, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useDownload } from "@/components/admin/DownloadToast";
import { getProducts, getImageUrl } from "@/lib/products";

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

const DEFAULT_CATALOGUES: Catalogue[] = [
  {
    id: "cat1",
    title: "Lab Essentials Guide",
    department: "Physics Apparatus",
    description: "Mechanics, optics, thermodynamics, and electromagnetism instruments for accurate physical measurements.",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600",
    version: "V4.2",
    autoSync: true,
    category: "Physics Apparatus",
    selectedProductIds: [],
    stockCount: 342,
    fileName: "lab-essentials-24.pdf"
  },
  {
    id: "cat2",
    title: "Precision Instruments",
    department: "Biological Optics",
    description: "Advanced microscopy, incubators, centrifuges, and sterile handling equipment.",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600",
    version: "V2.1",
    autoSync: false,
    category: "",
    selectedProductIds: ["p1", "p2", "p3"],
    stockCount: 180,
    fileName: "precision-v2.pdf"
  }
];

export default function CatalogueManagement() {
  const { startDownload } = useDownload();
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Modal open
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editId, setEditId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [autoSync, setAutoSync] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [stockCount, setStockCount] = useState(150);

  // Additional states for search and uploads
  const [isUploading, setIsUploading] = useState(false);
  const [prodSearch, setProdSearch] = useState("");

  useEffect(() => {
    // Load products
    const savedProducts = localStorage.getItem("ke_products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      const defaultProducts = getProducts();
      setProducts(defaultProducts);
      localStorage.setItem("ke_products", JSON.stringify(defaultProducts));
    }

    // Load categories
    const savedCats = localStorage.getItem("ke_categories");
    if (savedCats) {
      const parsed = JSON.parse(savedCats);
      setCategories(parsed.map((c: any) => typeof c === 'string' ? c : c.name));
    } else {
      setCategories(["Physics Apparatus", "Chemical Supplies", "Biological Optics", "General Tech"]);
    }

    // Load catalogues
    const savedCatalogues = localStorage.getItem("ke_catalogues");
    if (savedCatalogues) {
      setCatalogues(JSON.parse(savedCatalogues));
    } else {
      setCatalogues(DEFAULT_CATALOGUES);
      localStorage.setItem("ke_catalogues", JSON.stringify(DEFAULT_CATALOGUES));
    }
  }, []);

  const saveCatalogues = (updated: Catalogue[]) => {
    setCatalogues(updated);
    localStorage.setItem("ke_catalogues", JSON.stringify(updated));
  };

  const handleOpenAdd = () => {
    setModalMode("add");
    setEditId(null);
    setTitle("");
    setDepartment("Physics Apparatus");
    setDescription("");
    setImage("");
    setAutoSync(true);
    setSelectedCategory("Physics Apparatus");
    setSelectedProductIds([]);
    setStockCount(120);
    setProdSearch("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Catalogue) => {
    setModalMode("edit");
    setEditId(c.id);
    setTitle(c.title);
    setDepartment(c.department);
    setDescription(c.description);
    setImage(c.image);
    setAutoSync(c.autoSync);
    setSelectedCategory(c.category || "Physics Apparatus");
    setSelectedProductIds(c.selectedProductIds || []);
    setStockCount(c.stockCount);
    setProdSearch("");
    setIsModalOpen(true);
  };

  const handleProductCheckbox = (prodId: string) => {
    if (selectedProductIds.includes(prodId)) {
      setSelectedProductIds(selectedProductIds.filter(id => id !== prodId));
    } else {
      setSelectedProductIds([...selectedProductIds, prodId]);
    }
  };

  const handleSaveCatalogue = () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill in the Title and Description!");
      return;
    }

    const defaultImg = image || "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=600";
    
    if (modalMode === "add") {
      const newCat: Catalogue = {
        id: `cat_${Date.now()}`,
        title,
        department: autoSync ? selectedCategory : "Custom Curation",
        description,
        image: defaultImg,
        version: "V1.0",
        autoSync,
        category: selectedCategory,
        selectedProductIds: autoSync ? [] : selectedProductIds,
        stockCount,
        fileName: `${title.toLowerCase().replace(/ /g, "-")}-v1.pdf`
      };
      saveCatalogues([...catalogues, newCat]);
      alert("New Dynamic Catalogue deployed successfully!");
    } else if (modalMode === "edit" && editId) {
      const updated = catalogues.map(c => c.id === editId ? {
        ...c,
        title,
        department: autoSync ? selectedCategory : "Custom Curation",
        description,
        image: defaultImg,
        autoSync,
        category: selectedCategory,
        selectedProductIds: autoSync ? [] : selectedProductIds,
        stockCount
      } : c);
      saveCatalogues(updated);
      alert("Catalogue details updated successfully!");
    }
    setIsModalOpen(false);
  };

  const handleDeleteCatalogue = (id: string) => {
    if (confirm("Are you sure you want to delete this catalogue? Customers will lose access to print reports for it.")) {
      const updated = catalogues.filter(c => c.id !== id);
      saveCatalogues(updated);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert("Unsupported file format! Please upload PNG, JPG, or WEBP.");
        return;
      }

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
            setImage(data.url);
          } else {
            setImage(base64String); // fallback
          }
        } catch (err) {
          console.warn("API upload failed. Saving base64 directly.");
          setImage(base64String);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredCurationProducts = products.filter(p => 
    p.title.toLowerCase().includes(prodSearch.toLowerCase()) || 
    (p.sku && p.sku.toLowerCase().includes(prodSearch.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto pb-12 relative text-slate-300">
      
      {/* Modal Layout */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-theme/80 flex items-center justify-center z-50 p-4">
          <div className="bg-theme border border-theme/10 rounded-xl p-6 w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-theme">
                {modalMode === "add" ? "Create Dynamic Catalogue" : "Modify Catalogue Setup"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-theme hover:text-theme"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-theme uppercase tracking-widest mb-1.5">Catalogue Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Premium Chemistry Ware Guide"
                  className="w-full bg-theme border border-theme/5 rounded px-3 py-2.5 text-theme text-sm outline-none focus:border-theme" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-theme uppercase tracking-widest mb-1.5">Catalogue Brief Description <span className="text-red-500">*</span></label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Summarize the inventory contents for clinical purchasing managers..."
                  className="w-full bg-theme border border-theme/5 rounded px-3 py-2.5 text-theme text-xs outline-none focus:border-theme resize-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-theme uppercase tracking-widest mb-1.5">Stock Count (Physical Booklets)</label>
                  <input 
                    type="number" 
                    value={stockCount}
                    onChange={e => setStockCount(parseInt(e.target.value) || 0)}
                    className="w-full bg-theme border border-theme/5 rounded px-3 py-2.5 text-theme text-sm outline-none focus:border-theme" 
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-theme uppercase tracking-widest mb-1.5">Cover Image</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full bg-theme border border-theme/5 rounded px-3 py-2 text-xs text-theme outline-none file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-theme/10 file:text-theme cursor-pointer" 
                    />
                  </div>
                  <div className="w-16 h-16 rounded border border-theme/10 overflow-hidden flex-shrink-0 bg-theme/5 relative mt-4">
                    {isUploading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40"><span className="text-[8px] animate-pulse">Uploading...</span></div>
                    ) : image ? (
                      <img src={getImageUrl(image)} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-600">No Cover</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Manual vs Auto Sync Selection Toggle */}
              <div className="bg-theme border border-theme/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xs font-bold text-theme">Enable Auto-Sync by Category</h3>
                    <p className="text-[10px] text-theme">Automatically aggregates products under matching category lines.</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setAutoSync(!autoSync)} 
                    className="text-[#8bceff] hover:text-[#6ab3f0] transition-colors"
                  >
                    {autoSync ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-theme" />}
                  </button>
                </div>

                {autoSync ? (
                  <div>
                    <label className="block text-[9px] font-bold text-theme uppercase tracking-widest mb-1">Target Sync Category</label>
                    <select 
                      value={selectedCategory} 
                      onChange={e => setSelectedCategory(e.target.value)}
                      className="w-full bg-theme border border-theme/5 rounded px-2.5 py-2 text-theme text-xs outline-none"
                    >
                      {categories.map((c, idx) => (
                        <option key={idx} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-[9px] font-bold text-theme uppercase tracking-widest">Manual Items Curation</label>
                      <span className="bg-[#8bceff]/10 text-[#8bceff] border border-[#8bceff]/20 text-[9px] px-1.5 py-0.5 rounded font-black">{selectedProductIds.length} Selected</span>
                    </div>
                    
                    <div className="mb-2">
                      <input 
                        type="text" 
                        placeholder="Search products by title or SKU..." 
                        value={prodSearch}
                        onChange={e => setProdSearch(e.target.value)}
                        className="w-full bg-theme border border-theme/5 rounded px-2 py-1 text-xs text-theme outline-none focus:border-theme" 
                      />
                    </div>

                    <div className="max-h-40 overflow-y-auto space-y-1.5 border border-theme/5 p-2 rounded bg-theme">
                      {filteredCurationProducts.map((p) => (
                        <label key={p.id} className="flex items-center gap-2.5 text-[11px] text-theme hover:text-theme cursor-pointer p-1 rounded hover:bg-theme/5 transition-colors">
                          <input 
                            type="checkbox" 
                            checked={selectedProductIds.includes(p.id)}
                            onChange={() => handleProductCheckbox(p.id)}
                            className="rounded border-theme/10 text-[#8bceff] focus:ring-0 bg-transparent"
                          />
                          <div className="w-8 h-8 rounded bg-theme/10 overflow-hidden flex items-center justify-center border border-theme/10 shrink-0">
                            {(p.imageUrl || (p.images && p.images[0])) ? (
                              <img src={getImageUrl(p.imageUrl || (p.images && p.images[0]))} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[8px] font-bold text-slate-500">N/A</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-theme font-medium truncate text-xs">{p.title}</div>
                            <div className="text-[9px] text-slate-400 font-mono">{p.sku || p.id}</div>
                          </div>
                        </label>
                      ))}
                      {filteredCurationProducts.length === 0 && (
                        <div className="text-center py-4 text-xs text-slate-500">No products found.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-theme/5">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-theme hover:text-theme">Cancel</button>
              <button onClick={handleSaveCatalogue} className="px-6 py-2 bg-theme hover:bg-theme text-theme font-bold text-sm rounded flex items-center gap-2">
                <Save size={16} /> Deploy Dynamic Catalogue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-theme/5">
        <div>
          <h1 className="text-3xl font-bold text-theme mb-1">Dynamic Catalogue Engine</h1>
          <p className="text-theme text-sm">Deploy automated category-linked booklets or manually curated PDF matrix guides for clinical buyers.</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-brand-yellow hover:bg-theme text-theme font-bold px-6 py-2.5 rounded text-sm flex items-center gap-2 transition-colors uppercase tracking-widest cursor-pointer">
          <Plus size={16} strokeWidth={2.5} /> Deploy New Catalogue
        </button>
      </div>

      {/* Catalogues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {catalogues.map((cat) => (
          <div key={cat.id} className="bg-theme border border-theme/5 rounded-xl overflow-hidden flex flex-col hover:border-theme/10 transition-colors">
            <div className="relative h-48 bg-theme">
              <img src={getImageUrl(cat.image)} alt={cat.title} className="w-full h-full object-cover opacity-80" />
              <div className="absolute top-4 right-4 flex gap-1.5">
                <span className="text-[9px] font-extrabold tracking-widest bg-theme border border-theme/20 px-2 py-0.5 rounded text-[#8bceff] backdrop-blur-md uppercase">
                  {cat.version}
                </span>
                <span className={`text-[9px] font-extrabold tracking-widest px-2 py-0.5 rounded text-theme backdrop-blur-md uppercase ${
                  cat.autoSync ? "bg-green-950/80 border border-green-500/20 text-green-400" : "bg-purple-950/80 border border-purple-500/20 text-purple-400"
                }`}>
                  {cat.autoSync ? "Auto-Sync" : "Curated"}
                </span>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold text-[#8bceff] tracking-widest uppercase mb-1.5">{cat.department}</div>
                <h2 className="text-xl font-bold text-theme mb-2 leading-snug">{cat.title}</h2>
                <p className="text-xs text-theme mb-4 line-clamp-2 leading-relaxed">{cat.description}</p>
              </div>

              <div className="space-y-2 border-t border-theme/5 pt-4">
                <div className="flex items-center justify-between text-xs text-theme">
                  <div className="flex items-center gap-1.5"><FileText size={13} /> {cat.fileName}</div>
                  <span className="font-bold text-brand-yellow">{cat.stockCount} Printed</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-6">
                <a 
                  href={`/print?file=${encodeURIComponent(cat.fileName)}&catId=${cat.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-2 bg-theme/10 hover:bg-theme/20 text-[#8bceff] border border-theme/20 text-[10px] font-bold uppercase tracking-widest py-2 rounded text-center transition-colors"
                >
                  Print PDF
                </a>
                <button 
                  onClick={() => handleOpenEdit(cat)}
                  className="bg-theme hover:bg-theme/5 text-theme border border-theme/5 text-[10px] font-bold uppercase tracking-widest py-2 rounded transition-colors"
                >
                  Edit
                </button>
              </div>
              <button 
                onClick={() => handleDeleteCatalogue(cat.id)}
                className="mt-3 text-[9px] text-theme hover:text-red-400 uppercase tracking-widest text-center transition-all flex items-center justify-center gap-1"
              >
                <Trash2 size={10} /> Delete Catalogue
              </button>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}
