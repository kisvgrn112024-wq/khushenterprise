"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { Plus, Image as ImageIcon, UploadCloud, Video, Wand2, ArrowLeft, Save, Loader2, CheckCircle2, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getProducts, addProduct, updateProduct, Product } from "@/lib/products";

function AddEditProductForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("id");

  const [catalogues, setCatalogues] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("ke_catalogues");
    if (saved) {
      setCatalogues(JSON.parse(saved));
    } else {
      setCatalogues([
        { id: "cat1", title: "Lab Essentials Guide" },
        { id: "cat2", title: "Precision Instruments" }
      ]);
    }
  }, []);

  const [formData, setFormData] = useState({
    title: "", category: "Physics Lab", brand: "Khush Enterprises", sku: "",
    price: "", originalPrice: "", stock: "50", description: "",
    aiManualEnabled: false, video: "", bulkPrice: "", moq: "",
    catalog: "Lab Essentials Guide", catalog_id: "cat1"
  });

  const [localImages, setLocalImages] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [aiStatus, setAiStatus] = useState<"idle" | "analyzing" | "generating" | "done">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load product if editing
  useEffect(() => {
    if (editId) {
      const fetchProduct = async () => {
        try {
          const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
            ? `http://localhost:5000/api/products/${editId}` 
            : `/api/products/${editId}`;
            
          const res = await fetch(API_URL);
          if (res.ok) {
            const match = await res.json();
            populateForm(match);
          } else {
            loadFallback();
          }
        } catch (err) {
          loadFallback();
        }
      };

      const loadFallback = () => {
        const all = getProducts();
        const match = all.find(p => p.id === editId);
        if (match) populateForm(match);
      };

      const populateForm = (match: any) => {
        setFormData({
          title: match.title || "",
          category: match.category || "Physics Lab",
          brand: match.brand || "Khush Enterprises",
          sku: match.sku || "",
          price: match.price?.toString() || "",
          originalPrice: match.originalPrice?.toString() || "",
          stock: match.stock?.toString() || "50",
          description: match.description || "",
          aiManualEnabled: !!match.aiManualEnabled,
          video: match.video || "",
          bulkPrice: match.bulkPrice?.toString() || "",
          moq: match.moq?.toString() || "",
          catalog: match.catalog || "Lab Essentials Guide",
          catalog_id: match.catalog_id || "cat1"
        });
        if (match.images) {
          setLocalImages(match.images);
        }
      };

      fetchProduct();
    }
  }, [editId, catalogues]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
  const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  Array.from(files).forEach(file => {
    if (!allowed.includes(file.type)) {
      alert(`Invalid file type: ${file.type}. Allowed: PNG, JPEG, JPG, WEBP.`);
      return;
    }
    // Create preview URL for immediate display
    const preview = URL.createObjectURL(file);
    setLocalImages(prev => [...prev, preview].slice(0, 10));

    // Determine API endpoint based on environment
    const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:5000/api/upload'
      : '/api/upload';
    const formData = new FormData();
    formData.append('image', file);
    fetch(API_URL, { method: 'POST', body: formData })
      .then(res => res.json())
      .then(data => {
        if (data.url) {
          // Replace preview with the uploaded image URL
          setLocalImages(prev => prev.map(img => img === preview ? data.url : img));
        }
      })
      .catch(() => {
        console.log('Upload failed, retaining preview.');
      });
  });
};
    // Read files as base64 to allow correct server/local storage representation and avoid blob issues
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          const base64String = reader.result;
          setLocalImages(prev => [...prev, base64String].slice(0, 10));

          try {
            const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
              ? 'http://localhost:5000/api/upload' 
              : '/api/upload';

            const res = await fetch(API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                image: base64String,
                name: file.name,
                type: file.type
              })
            });
            const data = await res.json();
            if (data.url) {
              setLocalImages(prev => prev.map(img => img === base64String ? data.url : img));
            }
          } catch (e) {
            console.log("Offline mode: retaining base64 data");
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGenerateAI = () => {
    if (!formData.title) return alert("Please enter a Product Name first.");
    if (localImages.length === 0) return alert("Please upload or drag at least one image for the AI to analyze.");
    
    setAiStatus("analyzing");
    setTimeout(() => {
      setAiStatus("generating");
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          description: `The ${prev.title} is a premium, high-precision laboratory instrument designed for rigorous scientific applications. Manufactured from durable, chemical-resistant materials, it ensures longevity and reliability in demanding environments. Ideal for educational institutions, research facilities, and industrial laboratories. Features advanced calibration options for accurate readings.`
        }));
        setAiStatus("done");
        setTimeout(() => setAiStatus("idle"), 3000);
      }, 2000);
    }, 1500);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.price) {
      alert("Product Name and Selling Price are required!");
      return;
    }

    const priceNum = Number(formData.price) || 0;
    const origPriceNum = formData.originalPrice ? Number(formData.originalPrice) : priceNum * 1.25;

    const productPayload: Product = {
      id: editId || `p_admin_${Date.now()}`,
      title: formData.title,
      description: formData.description || `High quality scientific equipment from Khush Enterprises.`,
      price: priceNum,
      originalPrice: origPriceNum,
      rating: 4.8,
      reviews: 12,
      icon: formData.category === "Physics Lab" ? "Scale" : formData.category === "Chemistry Lab" ? "FlaskConical" : "Microscope",
      tag: "NEW",
      discount: `${Math.round(((origPriceNum - priceNum) / origPriceNum) * 100)}% OFF`,
      stock: Number(formData.stock) || 50,
      images: localImages.length > 0 ? localImages : ["https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=400"],
      category: formData.category,
      catalog: formData.catalog,
      catalog_id: formData.catalog_id,
      brand: formData.brand || "Khush Enterprises",
      sku: formData.sku || `KE-${Math.floor(Math.random() * 9000 + 1000)}`,
      aiManualEnabled: formData.aiManualEnabled,
      bulkPrice: formData.bulkPrice ? Number(formData.bulkPrice) : undefined,
      moq: formData.moq ? Number(formData.moq) : undefined,
      // Storefront active visibility tags
      product_status: "active",
      edited_by_admin: true,
      createdAt: new Date().toISOString()
    };

    // Try posting to backend API first
    try {
      const BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
        ? 'http://localhost:5000' 
        : '';
      const url = editId ? `${BASE_URL}/api/products/${editId}` : `${BASE_URL}/api/products`;
      const method = editId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload)
      });
    } catch (e) {
      console.log("Offline mode: saved to browser state");
    }

    if (editId) {
      updateProduct(editId, productPayload);
      alert("Product details updated and published successfully!");
    } else {
      addProduct(productPayload);
      alert("New product published live onto the storefront!");
    }

    router.push("/admin-portal-ke/products");
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 text-slate-300">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <Link href="/admin-portal-ke/products" className="p-2 bg-[#111111] hover:bg-white/10 rounded-lg transition-colors border border-white/5">
            <ArrowLeft size={20} className="text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{editId ? "Edit Equipment Profile" : "Add New Product"}</h1>
            <p className="text-sm text-gray-400">Configure visual media and specifications to showcase on the B2B storefront.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin-portal-ke/products" className="px-6 py-2.5 rounded text-sm font-bold border border-white/5 bg-[#111111] hover:bg-white/5 text-gray-300 transition-colors">
            Cancel
          </Link>
          <button onClick={handleSave} className="bg-[#8bceff] hover:bg-[#6ab3f0] text-black px-6 py-2.5 rounded text-sm font-bold transition-colors flex items-center gap-2">
            <Save size={16} /> Save & Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Fields */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#161616] p-8 rounded-lg border border-white/5">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#8bceff]/20 text-[#8bceff] flex items-center justify-center text-xs">1</span>
              Basic Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Product Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-white text-sm outline-none focus:border-[#8bceff] transition-colors" 
                  placeholder="e.g. Binocular Compound Microscope" 
                />
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Assign to Category <span className="text-red-500">*</span></label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-white text-sm outline-none focus:border-[#8bceff] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="Physics Lab">Physics Lab</option>
                    <option value="Chemistry Lab">Chemistry Lab</option>
                    <option value="Biology Lab">Biology Lab</option>
                    <option value="Commercial Lab">Commercial Lab</option>
                    <option value="Student/Kid Kits">Student/Kid Kits</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Assign to PDF Catalog <span className="text-red-500">*</span></label>
                  <select 
                    value={formData.catalog_id} 
                    onChange={e => {
                      const selectedCat = catalogues.find(c => c.id === e.target.value);
                      setFormData({
                        ...formData, 
                        catalog_id: e.target.value,
                        catalog: selectedCat ? selectedCat.title : ""
                      });
                    }}
                    className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-white text-sm outline-none focus:border-[#8bceff] transition-colors appearance-none cursor-pointer"
                  >
                    {catalogues.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Brand</label>
                  <input 
                    type="text" 
                    value={formData.brand} 
                    onChange={e => setFormData({...formData, brand: e.target.value})}
                    className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-white text-sm outline-none focus:border-[#8bceff] transition-colors" 
                    placeholder="e.g. Khush Enterprises"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#161616] p-8 rounded-lg border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[80px] -z-10 rounded-full"></div>
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs">2</span>
                Content & AI Copywriting
              </h2>
              
              <button 
                onClick={handleGenerateAI}
                disabled={aiStatus !== "idle"}
                className={`px-4 py-2 rounded text-xs font-bold transition-all flex items-center gap-2 ${
                  aiStatus === "done" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                  "bg-purple-600 hover:bg-purple-500 text-white"
                }`}
              >
                {aiStatus === "idle" && <><Wand2 size={14} /> Auto-Generate with AI</>}
                {aiStatus === "analyzing" && <><Loader2 size={14} className="animate-spin" /> Analyzing Image...</>}
                {aiStatus === "generating" && <><Loader2 size={14} className="animate-spin" /> Writing Copy...</>}
                {aiStatus === "done" && <><CheckCircle2 size={14} /> Content Generated</>}
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Detailed Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-[#111111] border border-white/5 rounded px-4 py-4 text-white text-sm outline-none focus:border-purple-500 h-48 resize-none transition-colors leading-relaxed" 
                  placeholder="Enter detailed product description or click Auto-Generate..." 
                ></textarea>
              </div>
              
              <label className="flex items-center justify-between p-4 border border-white/5 rounded cursor-pointer hover:bg-white/5 transition-colors bg-[#111111]">
                <div>
                  <div className="text-white font-bold text-sm mb-1">AI Generated Manuals</div>
                  <div className="text-xs text-gray-500 max-w-md">Automatically generate downloadable PDF manuals and setup guides for this product using AI.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.aiManualEnabled} 
                  onChange={e => setFormData({...formData, aiManualEnabled: e.target.checked})}
                  className="w-4 h-4 accent-[#8bceff] rounded" 
                />
              </label>
            </div>
          </div>
        </div>

        {/* Sidebar Form Fields */}
        <div className="space-y-8">
          {/* Media Upload */}
          <div className="bg-[#161616] p-8 rounded-lg border border-white/5">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-yellow/20 text-brand-yellow flex items-center justify-center text-xs">3</span>
              Media
            </h2>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Product Images</label>
              <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded p-8 text-center cursor-pointer transition-all ${
                  dragActive ? "border-[#8bceff] bg-[#8bceff]/5" : "border-white/10 bg-[#111111] hover:border-white/20 hover:bg-white/5"
                }`}
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleChange} 
                  className="hidden" 
                />
                <UploadCloud size={32} className={`mx-auto mb-3 ${dragActive ? "text-[#8bceff]" : "text-gray-500"}`} />
                <div className="text-sm font-bold text-white mb-1">Drag & Drop images here</div>
                <div className="text-xs text-gray-500">or click to browse</div>
              </div>

              {localImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {localImages.map((src, idx) => (
                    <div key={idx} className="aspect-square bg-[#111111] rounded overflow-hidden relative border border-white/5">
                      {/* Fixed: replaced Next.js <Image> with standard <img /> to avoid Blob URL crashes */}
                      <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocalImages(prev => prev.filter((_, i) => i !== idx));
                        }}
                        className="absolute top-1 right-1 bg-black/80 text-white rounded p-1 hover:text-[#ff4d4d]"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Demo Video URL</label>
              <div className="relative">
                <Video size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  value={formData.video} 
                  onChange={e => setFormData({...formData, video: e.target.value})}
                  placeholder="YouTube / MP4 URL"
                  className="w-full bg-[#111111] border border-white/5 rounded pl-9 pr-3 py-3 text-white text-sm outline-none focus:border-[#8bceff] transition-colors" 
                />
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-[#161616] p-8 rounded-lg border border-white/5">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs">4</span>
              Pricing & Stock
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Discounted Selling Price (₹) <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  className="w-full bg-[#111111] border border-[#8bceff]/30 rounded px-4 py-3 text-[#8bceff] outline-none focus:border-[#8bceff] text-xl font-bold transition-colors" 
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Base Price (MRP) (₹)</label>
                <input 
                  type="number" 
                  value={formData.originalPrice} 
                  onChange={e => setFormData({...formData, originalPrice: e.target.value})}
                  className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-white text-sm outline-none focus:border-[#8bceff] transition-colors" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">SKU</label>
                  <input 
                    type="text" 
                    value={formData.sku} 
                    onChange={e => setFormData({...formData, sku: e.target.value})}
                    className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-white text-sm outline-none focus:border-[#8bceff] transition-colors uppercase" 
                    placeholder="KE-XXX"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Stock Qty</label>
                  <input 
                    type="number" 
                    value={formData.stock} 
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                    className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-white text-sm outline-none focus:border-[#8bceff] transition-colors" 
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Bulk Pricing Tier */}
              <div className="p-4 rounded bg-[#0c1825] border border-[#8bceff]/20 mt-4">
                <h3 className="text-xs font-bold text-[#8bceff] uppercase tracking-widest mb-3">B2B / Bulk Pricing Tier</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Bulk Price (₹)</label>
                    <input 
                      type="number" 
                      value={formData.bulkPrice} 
                      onChange={e => setFormData({...formData, bulkPrice: e.target.value})}
                      className="w-full bg-[#111111] border border-[#8bceff]/30 rounded px-3 py-2 text-[#8bceff] outline-none focus:border-[#8bceff] transition-colors text-xs font-bold" 
                      placeholder="Discounted"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Minimum Qty</label>
                    <input 
                      type="number" 
                      value={formData.moq} 
                      onChange={e => setFormData({...formData, moq: e.target.value})}
                      className="w-full bg-[#111111] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#8bceff] transition-colors text-xs" 
                      placeholder="e.g. 10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AddProductPage() {
  return (
    <Suspense fallback={<div className="text-white text-center py-20 bg-[#111111] min-h-screen">Loading form...</div>}>
      <AddEditProductForm />
    </Suspense>
  );
}
