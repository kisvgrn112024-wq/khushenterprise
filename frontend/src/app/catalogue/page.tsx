"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, FlaskConical, Microscope, Settings2, FileSpreadsheet } from "lucide-react";

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

export default function CataloguePage() {
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");

  useEffect(() => {
    const saved = localStorage.getItem("ke_catalogues");
    if (saved) {
      setCatalogues(JSON.parse(saved));
    } else {
      setCatalogues(DEFAULT_CATALOGUES);
      localStorage.setItem("ke_catalogues", JSON.stringify(DEFAULT_CATALOGUES));
    }
  }, []);

  const filteredCatalogues = catalogues.filter((cat) => {
    const matchesSearch = cat.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cat.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDepartment === "All" || cat.department === filterDepartment;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-theme pb-24 text-slate-300">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 border-b border-theme/10 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-theme mb-3">Equipment Catalogues</h1>
            <p className="text-theme text-sm max-w-xl">
              Download and print precision laboratory reference matrices. Fully customized for B2B clinical procurement lines and scientific academic buyers.
            </p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme" size={16} />
              <input 
                type="text" 
                placeholder="Search dynamic booklets..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full md:w-80 bg-theme border border-theme/10 rounded px-10 py-3 text-theme text-sm outline-none focus:border-theme/30 transition-colors"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <select 
                  value={filterDepartment}
                  onChange={e => setFilterDepartment(e.target.value)}
                  className="w-full bg-theme border border-theme/10 rounded px-4 py-3 text-theme text-sm outline-none appearance-none focus:border-theme/30 transition-colors"
                >
                  <option value="All">All Departments</option>
                  <option value="Physics Apparatus">Physics Apparatus</option>
                  <option value="Chemical Supplies">Chemical Supplies</option>
                  <option value="Biological Optics">Biological Optics</option>
                  <option value="General Tech">General Tech</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-theme pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Departments Grid */}
        {filteredCatalogues.length === 0 ? (
          <div className="text-center py-20 bg-theme rounded-lg border border-theme/5 text-theme">
            No matching reference manuals found. Try adjusting search filters!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCatalogues.map((cat) => (
              <div key={cat.id} className="bg-theme border border-theme/10 rounded-lg overflow-hidden group hover:border-theme/50 transition-colors flex flex-col justify-between">
                <div className="h-48 relative overflow-hidden bg-theme">
                  <img src={cat.image} alt={cat.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-85 transition-all duration-300 grayscale group-hover:grayscale-0" />
                  <div className="absolute bottom-4 right-4 bg-theme/60 p-2 rounded-full border border-theme/10 backdrop-blur-md">
                    {cat.department.includes("Optic") ? <Microscope className="text-[#8bceff]" size={24} /> : <FlaskConical className="text-[#8bceff]" size={24} />}
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="text-[9px] font-black tracking-widest text-[#8bceff] border border-theme/20 bg-theme/90 px-2 py-0.5 rounded uppercase">
                      {cat.version}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[#8bceff] text-[10px] font-bold uppercase tracking-widest mb-1.5">{cat.department}</div>
                    <h3 className="text-xl font-bold text-theme mb-2 group-hover:text-theme transition-colors">{cat.title}</h3>
                    <p className="text-theme text-xs leading-relaxed mb-6 line-clamp-3">{cat.description}</p>
                  </div>

                  <div className="space-y-4 mt-auto">
                    <div className="flex justify-between items-center text-[10px] font-mono text-theme border-t border-theme/5 pt-4">
                      <span>DOC: {cat.fileName}</span>
                      <span className="text-brand-yellow font-bold">{cat.stockCount} printed copies</span>
                    </div>

                    <a 
                      href={`/print?file=${encodeURIComponent(cat.fileName)}&catId=${cat.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block text-center py-2.5 bg-theme/5 hover:bg-theme/10 text-theme hover:text-[#8bceff] text-xs font-bold rounded border border-theme/10 hover:border-theme/20 transition-all uppercase tracking-widest cursor-pointer"
                    >
                      Download PDF matrix
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 bg-theme/40 border border-theme/5 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-yellow/10 rounded-full flex items-center justify-center text-brand-yellow">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h4 className="text-theme font-bold text-sm">Need a Customized Bulk Excel Casing Quote?</h4>
              <p className="text-xs text-theme">Request custom packaging formats or custom branding on equipment prints.</p>
            </div>
          </div>
          <a href="/bulk-orders" className="bg-theme hover:bg-theme text-theme text-xs font-black uppercase tracking-widest py-3 px-6 rounded transition-all cursor-pointer">
            Create Custom Quote
          </a>
        </div>
      </div>
    </div>
  );
}
