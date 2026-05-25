"use client";

import { Plus, Calendar, Clock, Edit2, Trash2, Image as ImageIcon, PenLine, X, Loader2, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { getImageUrl } from "@/lib/products";

interface Banner {
  id: string;
  title: string;
  link: string;
  startDate: string;
  endDate: string;
  image: string;
  status: "active" | "draft" | "scheduled";
  placement: string;
}

const DEFAULT_BANNERS: Banner[] = [
  {
    id: "b1",
    title: "Q4 Analytical Instruments Promo",
    link: "/products",
    startDate: "2024-10-01",
    endDate: "2024-12-31",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800",
    status: "active",
    placement: "Homepage Hero"
  },
  {
    id: "b2",
    title: "Essential Glassware Restock",
    link: "/products",
    startDate: "2024-11-15",
    endDate: "2025-01-15",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400",
    status: "scheduled",
    placement: "Featured Row"
  }
];

export default function BannersMarketing() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editId, setEditId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState<"active" | "draft" | "scheduled">("active");
  const [placement, setPlacement] = useState("Homepage Hero");
  const [isUploading, setIsUploading] = useState(false);

  // Load banners
  useEffect(() => {
    const saved = localStorage.getItem("ke_banners");
    if (saved) {
      setBanners(JSON.parse(saved));
    } else {
      setBanners(DEFAULT_BANNERS);
      localStorage.setItem("ke_banners", JSON.stringify(DEFAULT_BANNERS));
    }
  }, []);

  const saveBanners = (updated: Banner[]) => {
    setBanners(updated);
    localStorage.setItem("ke_banners", JSON.stringify(updated));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file extension/MIME
      const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      if (!allowed.includes(file.type)) {
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
            setImage(base64String); // fallback to raw base64
          }
        } catch (err) {
          console.log("Saving base64 directly");
          setImage(base64String);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setModalMode("add");
    setEditId(null);
    setTitle("");
    setLink("");
    setStartDate("");
    setEndDate("");
    setImage("");
    setStatus("active");
    setPlacement("Homepage Hero");
    setIsModalOpen(true);
  };

  const openEditModal = (b: Banner) => {
    setModalMode("edit");
    setEditId(b.id);
    setTitle(b.title);
    setLink(b.link);
    setStartDate(b.startDate);
    setEndDate(b.endDate);
    setImage(b.image);
    setStatus(b.status);
    setPlacement(b.placement);
    setIsModalOpen(true);
  };

  const handleSaveBanner = () => {
    if (!title.trim() || !image) {
      alert("Banner Title and Image Asset are required!");
      return;
    }

    if (modalMode === "add") {
      const newBanner: Banner = {
        id: `b_${Date.now()}`,
        title,
        link: link || "/products",
        startDate: startDate || new Date().toISOString().split("T")[0],
        endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        image,
        status,
        placement
      };
      saveBanners([...banners, newBanner]);
      alert("New marketing banner published successfully!");
    } else if (modalMode === "edit" && editId) {
      const updated = banners.map(b => b.id === editId ? {
        ...b,
        title,
        link,
        startDate,
        endDate,
        image,
        status,
        placement
      } : b);
      saveBanners(updated);
      alert("Banner campaign updated successfully!");
    }

    setIsModalOpen(false);
  };

  const handleDeleteBanner = (id: string) => {
    if (confirm("Are you sure you want to delete this promotional banner campaign?")) {
      const updated = banners.filter(b => b.id !== id);
      saveBanners(updated);
    }
  };

  const toggleBannerStatus = (id: string) => {
    const updated = banners.map(b => {
      if (b.id === id) {
        const nextStatus: "active" | "draft" | "scheduled" = b.status === "active" ? "draft" : "active";
        return { ...b, status: nextStatus };
      }
      return b;
    });
    saveBanners(updated);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 relative text-slate-300">
      
      {/* Banner Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-theme/80 flex items-center justify-center z-50">
          <div className="bg-theme border border-theme/10 rounded-xl p-6 w-[550px] shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-theme">
                {modalMode === "add" ? "Create New Banner Campaign" : "Edit Campaign Placement"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-theme hover:text-theme"><X size={20} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-theme uppercase tracking-widest mb-1.5">Banner Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Q4 Chemistry Glassware Restock Offer"
                  className="w-full bg-theme border border-theme/5 rounded px-3 py-2.5 text-theme text-sm outline-none focus:border-theme" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-theme uppercase tracking-widest mb-1.5">Target link URL</label>
                  <input 
                    type="text" 
                    value={link}
                    onChange={e => setLink(e.target.value)}
                    placeholder="e.g. /products"
                    className="w-full bg-theme border border-theme/5 rounded px-3 py-2.5 text-theme text-sm outline-none focus:border-theme" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-theme uppercase tracking-widest mb-1.5">Placement Row</label>
                  <select 
                    value={placement}
                    onChange={e => setPlacement(e.target.value)}
                    className="w-full bg-theme border border-theme/5 rounded px-3 py-2.5 text-theme text-sm outline-none focus:border-theme appearance-none" 
                  >
                    <option value="Homepage Hero">Homepage Hero</option>
                    <option value="Featured Row">Featured Row</option>
                    <option value="Category Spotlight">Category Spotlight</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-theme uppercase tracking-widest mb-1.5">Start Date</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-theme border border-theme/5 rounded px-3 py-2.5 text-theme text-sm outline-none focus:border-theme [color-scheme:dark]" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-theme uppercase tracking-widest mb-1.5">End Date</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-theme border border-theme/5 rounded px-3 py-2.5 text-theme text-sm outline-none focus:border-theme [color-scheme:dark]" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-theme uppercase tracking-widest mb-1.5">Default Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full bg-theme border border-theme/5 rounded px-3 py-2.5 text-theme text-sm outline-none focus:border-theme"
                  >
                    <option value="active">Active (Visible Now)</option>
                    <option value="scheduled">Scheduled (Future Activation)</option>
                    <option value="draft">Draft (Offline)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-theme uppercase tracking-widest mb-1.5">Banner Asset (PNG / JPEG) <span className="text-red-500">*</span></label>
                <div 
                  className="border-2 border-dashed border-theme/10 rounded-lg p-6 flex flex-col items-center justify-center text-theme hover:border-theme/50 hover:text-[#8bceff] transition-colors cursor-pointer bg-theme relative overflow-hidden h-40"
                  onClick={() => document.getElementById("banner-upload")?.click()}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="animate-spin text-[#8bceff] mb-2" size={24} />
                      <span className="text-xs text-theme font-bold">Uploading file payload...</span>
                    </div>
                  ) : image ? (
                    <img src={getImageUrl(image)} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon size={24} className="mb-2" />
                      <span className="text-xs font-bold text-center">Click to upload 1920x1080 image<br/><span className="text-[10px] mt-1 text-theme">Supports PNG and JPG</span></span>
                    </>
                  )}
                  <input 
                    type="file" 
                    id="banner-upload" 
                    className="hidden" 
                    accept="image/png, image/jpeg, image/jpg" 
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-theme/5">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-theme hover:text-theme transition-colors">Cancel</button>
              <button onClick={handleSaveBanner} className="px-6 py-2 bg-theme hover:bg-theme text-theme font-bold text-sm rounded transition-colors flex items-center gap-2">
                <Save size={16} /> Save & Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-theme/5">
        <div>
          <h1 className="text-3xl font-bold text-theme mb-1">Banners & Marketing</h1>
          <p className="text-theme text-sm">Deploy high-impact homepage slideshows, seasonal restock deals, and category highlights.</p>
        </div>
        <button onClick={openAddModal} className="bg-theme hover:bg-theme text-theme font-bold px-4 py-2.5 rounded text-sm flex items-center gap-2 transition-colors cursor-pointer">
          <Plus size={16} strokeWidth={2.5} /> Deploy New Banner
        </button>
      </div>

      {banners.length === 0 ? (
        <div className="text-center py-20 bg-theme border border-theme/5 rounded-xl text-theme">
          No banners active. Click "Deploy New Banner" to begin!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((b) => (
            <div key={b.id} className="bg-theme border border-theme/5 rounded-xl overflow-hidden flex flex-col hover:border-theme/10 transition-colors">
              <div className="relative h-48 bg-theme">
                <img src={getImageUrl(b.image)} alt={b.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className={`flex items-center gap-1.5 text-[10px] font-bold tracking-widest px-3 py-1 rounded-full text-theme backdrop-blur-md ${
                    b.status === "active" ? "bg-theme border border-theme/20 text-[#8bceff]" :
                    b.status === "scheduled" ? "bg-theme border border-brand-yellow/20 text-brand-yellow" :
                    "bg-theme/60 border border-theme/20 text-theme"
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      b.status === "active" ? "bg-theme" :
                      b.status === "scheduled" ? "bg-brand-yellow" :
                      "bg-theme"
                    }`}></div>
                    {b.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-theme mb-1.5">{b.title}</h2>
                  <p className="text-xs text-theme mb-4 font-mono">Row: {b.placement} | URL: {b.link}</p>
                </div>
                <div className="pt-4 border-t border-theme/5 flex justify-between items-center mt-auto">
                  <div className="flex items-center gap-2 text-xs text-theme">
                    <Calendar size={13} /> {b.startDate} to {b.endDate}
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Live publish toggles */}
                    <button 
                      onClick={() => toggleBannerStatus(b.id)}
                      className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                        b.status === 'active' 
                          ? 'bg-theme/10 text-[#8bceff] border-theme/20 hover:bg-theme/20' 
                          : 'bg-theme/5 text-theme border-theme/10 hover:bg-theme/10'
                      }`}
                      title="Toggle Active/Draft Status"
                    >
                      {b.status === 'active' ? 'Disable' : 'Publish Live'}
                    </button>
                    <button onClick={() => openEditModal(b)} className="text-theme hover:text-theme transition-colors" title="Edit Campaign"><Edit2 size={15} /></button>
                    <button onClick={() => handleDeleteBanner(b.id)} className="text-theme hover:text-[#ff4d4d] transition-colors" title="Delete Campaign"><Trash2 size={15} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
