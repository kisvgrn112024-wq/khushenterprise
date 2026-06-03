"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProducts } from "@/lib/products";

export default function AddProductPage() {
  const router = useRouter();
  
  const [categories, setCategories] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [bulkPrice, setBulkPrice] = useState("");
  const [moq, setMoq] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    const savedCats = localStorage.getItem("ke_categories");
    if (savedCats) {
      const parsed = JSON.parse(savedCats);
      const catNames = parsed.map((c: any) => typeof c === 'string' ? c : c.name);
      setCategories(catNames);
      if (catNames.length > 0) setCategory(catNames[0]);
    } else {
      const defaultCats = ["Physics Lab", "Chemistry Lab", "Biology Lab", "Microscopes"];
      setCategories(defaultCats);
      setCategory(defaultCats[0]);
    }
  }, []);

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
            setImageUrl(data.url);
          } else {
            setImageUrl(base64String);
          }
        } catch (err) {
          setImageUrl(base64String);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploadingVideo(true);
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
              image: base64String, // The backend handles base64 uniformly
              name: file.name,
              type: file.type
            })
          });
          const data = await res.json();
          if (data.url) {
            setVideoUrl(data.url);
          } else {
            setVideoUrl(base64String);
          }
        } catch (err) {
          setVideoUrl(base64String);
        } finally {
          setIsUploadingVideo(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAIDescription = () => {
    if (!title) {
      alert("Please enter a product name first!");
      return;
    }
    setIsGeneratingAI(true);
    // Simulate AI generation process locally
    setTimeout(() => {
      const catText = category ? category.toLowerCase() : "laboratory";
      const generated = `The ${title} is a premium-grade laboratory instrument designed specifically for advanced ${catText} applications. Featuring robust construction, superior reliability, and industry-leading precision, it is the ideal choice for modern research facilities and educational institutions. This product guarantees exceptional performance and long-lasting durability under rigorous conditions.`;
      setDescription(generated);
      setIsGeneratingAI(false);
    }, 800);
  };


  const handleSaveProduct = async () => {
    if (!title || !price || !category) {
      alert("Please fill in the required fields (Title, Price, Category).");
      return;
    }

    const newProduct = {
      id: `p_${Date.now()}`,
      title,
      price: parseFloat(price) || 0,
      category,
      description,
      sku: sku || `KE-${Date.now().toString().slice(-4)}`,
      brand: brand || "Khush Enterprises",
      stock: parseInt(stock) || 0,
      bulkPrice: bulkPrice ? parseFloat(bulkPrice) : undefined,
      moq: moq ? parseInt(moq) : undefined,
      imageUrl: imageUrl,
      images: imageUrl ? [imageUrl] : [],
      video: videoUrl || null,
      is_placeholder: false,
      edited_by_admin: true,
      product_status: "active",
      catalog: category // Auto-assign to catalogue with same name as category
    };

    // Save to local storage
    const currentProducts = getProducts();
    const updatedProducts = [...currentProducts, newProduct];
    localStorage.setItem("ke_products", JSON.stringify(updatedProducts));
    window.dispatchEvent(new Event("products-updated"));

    // Try saving to backend
    try {
      const API_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
        ? `http://${window.location.hostname}:5000/api/products` 
        : '/api/products';
        
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct)
      });
    } catch (e) {
      console.log("Backend sync failed, saved locally");
    }

    alert("Product added successfully!");
    router.push("/admin-portal-ke/products");
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 text-slate-300">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-theme/5">
        <div className="flex items-center gap-4">
          <Link href="/admin-portal-ke/products" className="p-2 bg-theme hover:bg-theme/10 rounded-lg transition-colors border border-theme/5">
            <ArrowLeft size={20} className="text-theme" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-theme mb-1">Add New Product</h1>
            <p className="text-sm text-theme">Configure product details and upload images.</p>
          </div>
        </div>
      </div>

      <div className="bg-theme border border-theme/10 rounded-xl p-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-theme mb-2">Product Name *</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter product name"
                className="w-full bg-theme border border-theme/10 rounded-lg px-4 py-3 text-theme outline-none focus:border-theme"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-theme mb-2">Price *</label>
              <input 
                type="number" 
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="Enter selling price"
                className="w-full bg-theme border border-theme/10 rounded-lg px-4 py-3 text-theme outline-none focus:border-theme"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-theme mb-2">Category *</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-theme border border-theme/10 rounded-lg px-4 py-3 text-theme outline-none focus:border-theme"
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-theme mb-2">Stock Level</label>
              <input 
                type="number" 
                value={stock}
                onChange={e => setStock(e.target.value)}
                placeholder="Initial stock count"
                className="w-full bg-theme border border-theme/10 rounded-lg px-4 py-3 text-theme outline-none focus:border-theme"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-theme mb-2">Bulk Price (Optional)</label>
              <input 
                type="number" 
                value={bulkPrice}
                onChange={e => setBulkPrice(e.target.value)}
                placeholder="Wholesale price per unit"
                className="w-full bg-theme border border-theme/10 rounded-lg px-4 py-3 text-theme outline-none focus:border-theme"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-theme mb-2">Bulk Quantity (MOQ)</label>
              <input 
                type="number" 
                value={moq}
                onChange={e => setMoq(e.target.value)}
                placeholder="Minimum order quantity"
                className="w-full bg-theme border border-theme/10 rounded-lg px-4 py-3 text-theme outline-none focus:border-theme"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-theme mb-2">SKU / Model Number</label>
              <input 
                type="text" 
                value={sku}
                onChange={e => setSku(e.target.value)}
                placeholder="Leave blank to auto-generate"
                className="w-full bg-theme border border-theme/10 rounded-lg px-4 py-3 text-theme outline-none focus:border-theme"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-theme mb-2">Brand</label>
              <input 
                type="text" 
                value={brand}
                onChange={e => setBrand(e.target.value)}
                placeholder="Khush Enterprises"
                className="w-full bg-theme border border-theme/10 rounded-lg px-4 py-3 text-theme outline-none focus:border-theme"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-theme">Description</label>
              <button 
                onClick={generateAIDescription}
                disabled={isGeneratingAI || !title}
                className="flex items-center gap-1.5 text-xs font-bold bg-[#8bceff]/20 text-[#6ab3f0] hover:bg-[#8bceff]/30 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
              >
                <span>✨</span> {isGeneratingAI ? "Generating..." : "Auto-Generate with AI"}
              </button>
            </div>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows={4}
              className="w-full bg-theme border border-theme/10 rounded-lg px-4 py-3 text-theme outline-none focus:border-theme"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-theme mb-2">Product Image (PNG Only)</label>
              <input 
                type="file" 
                accept="image/png"
                onChange={handleImageUpload}
                className="w-full bg-theme border border-theme/10 rounded-lg px-4 py-3 text-theme outline-none file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-theme/10 file:text-theme cursor-pointer" 
              />
              {isUploading && <p className="text-sm text-theme mt-2">Uploading...</p>}
              {imageUrl && <img src={imageUrl} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded border border-theme/10" />}
            </div>
            <div>
              <label className="block text-sm font-bold text-theme mb-2">Product Video (Optional)</label>
              <input 
                type="file" 
                accept="video/*"
                onChange={handleVideoUpload}
                className="w-full bg-theme border border-theme/10 rounded-lg px-4 py-3 text-theme outline-none file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-theme/10 file:text-theme cursor-pointer" 
              />
              {isUploadingVideo && <p className="text-sm text-theme mt-2">Uploading video...</p>}
              {videoUrl && <div className="mt-4 text-xs text-green-500 bg-green-500/10 px-3 py-2 rounded">Video attached successfully!</div>}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Link href="/admin-portal-ke/products" className="px-6 py-2.5 rounded text-sm font-bold bg-theme border border-theme/10 hover:bg-theme/5 text-theme transition-colors">
              Cancel
            </Link>
            <button onClick={handleSaveProduct} className="px-6 py-2.5 rounded text-sm font-bold bg-[#8bceff] text-black hover:bg-[#6ab3f0] transition-colors">
              Save Product & Add to Catalogue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
