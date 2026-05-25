"use client";

import React, { useState, useMemo } from "react";
import { 
  FileText, Shield, Globe, Truck, Settings, LogOut, Plus, Search, 
  Download, Filter, ArrowRight, Check, X, ShieldAlert, BadgePercent, 
  TrendingUp, Activity, HelpCircle, FileSpreadsheet, ChevronRight, RefreshCw, Send
} from "lucide-react";

// Mock types
interface Inquiry {
  id: string;
  referenceId: string;
  clientEntity: string;
  region: string;
  estVolume: string;
  statusCode: "PENDING REVIEW" | "CLEARED" | "COMPLIANCE HOLD" | "PENDING QUOTE";
  classification: string;
  forwarding: "Air Freight" | "Sea Freight";
  weight: string;
}

interface ExportProduct {
  sku: string;
  name: string;
  sector: string;
  fobPrice: number;
  paidStatus: string;
  techSpecs: string;
  quantity: number;
}

interface PdfVersion {
  id: string;
  name: string;
  generated: string;
  size: string;
  region: string;
  status: "LATEST" | "NORMAL" | "RECALLED";
}

export default function ExportControllerPage() {
  // Navigation State
  const [activeSubTab, setActiveSubTab] = useState<"inquiries" | "catalog" | "logistics" | "settings">("inquiries");
  const [inquiriesView, setInquiriesView] = useState<"overview" | "cards">("overview");

  // Inquiries State
  const [inquiries, setInquiries] = useState<Inquiry[]>([
    {
      id: "inq-1",
      referenceId: "INQ-8821-E",
      clientEntity: "Stellar Dynamics Corp",
      region: "EU-Central",
      estVolume: "4x 40ft HQ",
      statusCode: "PENDING REVIEW",
      classification: "Bluechips",
      forwarding: "Air Freight",
      weight: "1,200 KG",
    },
    {
      id: "inq-2",
      referenceId: "INQ-8820-I",
      clientEntity: "Nippon Heavy Industries",
      region: "APAC-East",
      estVolume: "12x 20ft STD",
      statusCode: "CLEARED",
      classification: "Ind. Parts",
      forwarding: "Sea Freight",
      weight: "48,000 KG",
    },
    {
      id: "inq-3",
      referenceId: "INQ-8819-A",
      clientEntity: "Apex Minerals Ltd",
      region: "AF-South",
      estVolume: "Bulk LCL (45 CBM)",
      statusCode: "COMPLIANCE HOLD",
      classification: "Acta Parts",
      forwarding: "Air Freight",
      weight: "9,800 KG",
    },
    {
      id: "inq-4",
      referenceId: "INQ-8818-B",
      clientEntity: "Berenberg Trading Co",
      region: "LATAM-East",
      estVolume: "3x 40ft REEF",
      statusCode: "PENDING QUOTE",
      classification: "Bluechips",
      forwarding: "Sea Freight",
      weight: "15,000 KG",
    },
  ]);

  // Export Catalog State
  const [exportProducts, setExportProducts] = useState<ExportProduct[]>([
    {
      sku: "EX-CEN-9080-A",
      name: "KD-9080 Centrifuge Unit",
      sector: "MINING",
      fobPrice: 42500,
      paidStatus: "PAID",
      techSpecs: "380V / 415V (3-Phase) | 50Hz / 60Hz Variant Avail.",
      quantity: 100,
    },
    {
      sku: "EX-MEY-C02-X",
      name: "Automated Conveyor Module S2",
      sector: "AUTOMATION",
      fobPrice: 18200,
      paidStatus: "PAID",
      techSpecs: "220V / 240V | 50Hz Standard",
      quantity: 48,
    },
    {
      sku: "EX-PWR-G50-000",
      name: "Genset PowerStation Pro 500kVA",
      sector: "POWER GEN",
      fobPrice: 65000,
      paidStatus: "PAID",
      techSpecs: "400V / 230V | Dual Freq 50/60Hz Switchable",
      quantity: 120,
    },
  ]);

  // PDF Compilation History State
  const [pdfHistory, setPdfHistory] = useState<PdfVersion[]>([
    { id: "v1", name: "CNT-2025-Q4-V2.pdf", generated: "Today, 08:41 AM", size: "24.2 MB", region: "Global (All Regions)", status: "LATEST" },
    { id: "v2", name: "CNT-2025-Q4-V1.pdf", generated: "Oct 02, 04:30 PM", size: "11.8 MB", region: "Global (All Regions)", status: "NORMAL" },
    { id: "v3", name: "CNT-2025-Q3-FINAL.pdf", generated: "Jul 15, 09:00 AM", size: "32.5 MB", region: "N/A Region", status: "NORMAL" },
    { id: "v4", name: "CNT-2025-Q2-ERR.pdf", generated: "Apr 01, 11:30 AM", size: "11.9 MB", region: "EU Region", status: "RECALLED" },
  ]);

  // Catalog search / filter state
  const [catalogSearch, setCatalogSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [selectedLeadTime, setSelectedLeadTime] = useState("Any Lead Time");

  // PDF Compiler state
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Heavy Machinery", "Electronic Components"]);
  const [skuOverrides, setSkuOverrides] = useState<string[]>(["SKU-8842-A", "SKU-1829-B", "SKU-5530-X"]);
  const [overrideInput, setOverrideInput] = useState("");
  const [compilationRegion, setCompilationRegion] = useState("Global (All Regions)");
  const [pricingTier, setPricingTier] = useState("Standard Wholesale");
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);

  // Modals state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isNewShipmentOpen, setIsNewShipmentOpen] = useState(false);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    sku: "",
    name: "",
    sector: "MINING",
    fobPrice: "",
    techSpecs: "",
    quantity: "",
  });

  // New Shipment / Inquiry form state
  const [newInquiry, setNewInquiry] = useState({
    clientEntity: "",
    region: "EU-Central",
    estVolume: "",
    classification: "Bluechips",
    forwarding: "Air Freight",
    weight: "",
  });

  // Summary Metrics calculation
  const metrics = useMemo(() => {
    const pendingReview = inquiries.filter(i => i.statusCode === "PENDING REVIEW").length;
    const pendingQuote = inquiries.filter(i => i.statusCode === "PENDING QUOTE").length;
    const complianceHold = inquiries.filter(i => i.statusCode === "COMPLIANCE HOLD").length;
    
    return {
      pendingReview: pendingReview + 20, // offset to match the mockup (24)
      urgent: complianceHold + 4, // offset to match mockup (7)
      quotedToday: 18,
    };
  }, [inquiries]);

  // Filtered Export Catalog
  const filteredCatalog = useMemo(() => {
    return exportProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(catalogSearch.toLowerCase()) || 
                            p.sku.toLowerCase().includes(catalogSearch.toLowerCase());
      const matchesSector = selectedSector === "All Sectors" || p.sector.toUpperCase() === selectedSector.toUpperCase();
      return matchesSearch && matchesSector;
    });
  }, [exportProducts, catalogSearch, selectedSector]);

  // Handle Add Product submit
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.sku || !newProduct.name || !newProduct.fobPrice) return;

    const productToAdd: ExportProduct = {
      sku: newProduct.sku,
      name: newProduct.name,
      sector: newProduct.sector,
      fobPrice: parseFloat(newProduct.fobPrice) || 0,
      paidStatus: "PAID",
      techSpecs: newProduct.techSpecs || "N/A Specs",
      quantity: parseInt(newProduct.quantity) || 10,
    };

    setExportProducts(prev => [...prev, productToAdd]);
    setIsAddProductOpen(false);
    setNewProduct({ sku: "", name: "", sector: "MINING", fobPrice: "", techSpecs: "", quantity: "" });
  };

  // Handle New Shipment submit
  const handleAddInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInquiry.clientEntity || !newInquiry.estVolume) return;

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const inquiryToAdd: Inquiry = {
      id: `inq-${Date.now()}`,
      referenceId: `INQ-${randomId}-E`,
      clientEntity: newInquiry.clientEntity,
      region: newInquiry.region,
      estVolume: newInquiry.estVolume,
      statusCode: "PENDING REVIEW",
      classification: newInquiry.classification,
      forwarding: newInquiry.forwarding as "Air Freight" | "Sea Freight",
      weight: newInquiry.weight || "N/A KG",
    };

    setInquiries(prev => [inquiryToAdd, ...prev]);
    setIsNewShipmentOpen(false);
    setNewInquiry({ clientEntity: "", region: "EU-Central", estVolume: "", classification: "Bluechips", forwarding: "Air Freight", weight: "" });
  };

  // Status badge style helper
  const getStatusBadge = (status: Inquiry["statusCode"]) => {
    switch (status) {
      case "CLEARED":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "COMPLIANCE HOLD":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      case "PENDING REVIEW":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "PENDING QUOTE":
        return "bg-theme/10 text-[#8bceff] border border-theme/20";
    }
  };

  // Export CSV function
  const handleExportCsv = () => {
    const headers = "SKU,Product Name,Sector,FOB Price,Tech Specs,Status\n";
    const rows = exportProducts.map(p => `"${p.sku}","${p.name}","${p.sector}",$${p.fobPrice},"${p.techSpecs}","${p.quantity}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `Export_Catalog_${Date.now()}.csv`);
    a.click();
  };

  // Add SKU override tag
  const handleAddOverride = () => {
    if (overrideInput.trim() && !skuOverrides.includes(overrideInput.trim())) {
      setSkuOverrides([...skuOverrides, overrideInput.trim().toUpperCase()]);
      setOverrideInput("");
    }
  };

  // Remove SKU override tag
  const handleRemoveOverride = (sku: string) => {
    setSkuOverrides(skuOverrides.filter(s => s !== sku));
  };

  // Compile PDF Simulation
  const triggerPdfCompilation = () => {
    setIsCompiling(true);
    setCompileProgress(10);
    
    const interval = setInterval(() => {
      setCompileProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsCompiling(false);
            // Append compiled PDF to history list
            const newVer: PdfVersion = {
              id: `v-${Date.now()}`,
              name: `CNT-${new Date().getFullYear()}-Q4-V${pdfHistory.length + 1}.pdf`,
              generated: "Just Now",
              size: `${(Math.random() * 20 + 10).toFixed(1)} MB`,
              region: compilationRegion,
              status: "LATEST"
            };
            // Set old latest to normal
            setPdfHistory(prevHistory => 
              [newVer, ...prevHistory.map(h => h.status === "LATEST" ? { ...h, status: "NORMAL" as const } : h)]
            );
          }, 500);
          return 100;
        }
        return prev + 15;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-theme text-theme font-mono relative overflow-hidden select-none bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px]">
      
      {/* Glow ambient background highlights */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* SUB SIDEBAR: Global Export Control specific menu */}
        <aside className="w-full xl:w-72 shrink-0 bg-theme border border-theme/10 rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Control brand header */}
            <div className="flex items-center gap-3 pb-4 border-b border-theme/10">
              <div className="w-8 h-8 rounded bg-amber-500/10 flex items-center justify-center border border-amber-500/30 text-amber-400">
                <Globe size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-theme uppercase tracking-wider">Khush Admin</h2>
                <p className="text-[10px] text-theme tracking-wider">Global Export Control</p>
              </div>
            </div>

            {/* "+ NEW SHIPMENT" button */}
            <button 
              onClick={() => setIsNewShipmentOpen(true)}
              className="w-full py-3 bg-theme hover:bg-theme text-theme text-xs font-black uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.15)]"
            >
              <Plus size={14} strokeWidth={3} />
              <span>+ New Shipment</span>
            </button>

            {/* Navigation links */}
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveSubTab("inquiries")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded text-xs uppercase tracking-widest font-bold transition-all border cursor-pointer ${
                  activeSubTab === "inquiries" 
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/25" 
                    : "text-theme border-transparent hover:text-theme hover:bg-theme/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText size={16} />
                  <span>Inquiries</span>
                </div>
                {activeSubTab === "inquiries" && <span className="text-[10px]">▶</span>}
              </button>

              <button 
                onClick={() => setActiveSubTab("catalog")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded text-xs uppercase tracking-widest font-bold transition-all border cursor-pointer ${
                  activeSubTab === "catalog" 
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/25" 
                    : "text-theme border-transparent hover:text-theme hover:bg-theme/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Globe size={16} />
                  <span>Export Catalog</span>
                </div>
                {activeSubTab === "catalog" && <span className="text-[10px]">▶</span>}
              </button>

              <button 
                onClick={() => setActiveSubTab("logistics")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded text-xs uppercase tracking-widest font-bold transition-all border cursor-pointer ${
                  activeSubTab === "logistics" 
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/25" 
                    : "text-theme border-transparent hover:text-theme hover:bg-theme/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Truck size={16} />
                  <span>Logistics Management</span>
                </div>
                {activeSubTab === "logistics" && <span className="text-[10px]">▶</span>}
              </button>

              <button 
                onClick={() => setActiveSubTab("settings")}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded text-xs uppercase tracking-widest font-bold transition-all border cursor-pointer ${
                  activeSubTab === "settings" 
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/25" 
                    : "text-theme border-transparent hover:text-theme hover:bg-theme/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings size={16} />
                  <span>Settings</span>
                </div>
                {activeSubTab === "settings" && <span className="text-[10px]">▶</span>}
              </button>
            </nav>

          </div>

          <div className="pt-6 mt-6 border-t border-theme/5 text-[10px] text-theme space-y-4">
            <div className="flex items-center justify-between">
              <span>System Node</span>
              <span className="text-emerald-500 font-bold">ONLINE</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Logistics Api</span>
              <span className="text-emerald-500 font-bold">NOMINAL</span>
            </div>
          </div>
        </aside>

        {/* MAIN DISPLAY VIEWPORT */}
        <div className="flex-1 bg-theme/40 border border-theme/10 rounded-xl p-6 min-h-[600px] flex flex-col">
          
          {/* TAB 1: INQUIRIES VIEW */}
          {activeSubTab === "inquiries" && (
            <div className="space-y-6 flex-1 flex flex-col">
              
              {/* Header section with toggle between Overview (Image 2) and Card details (Image 4) */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-theme/10">
                <div>
                  <span className="text-[10px] text-amber-400 uppercase tracking-widest block mb-1">Global Inventory Management</span>
                  <h1 className="text-2xl font-bold text-theme uppercase tracking-tight">Global Command Center</h1>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setInquiriesView("overview")}
                    className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase transition-all cursor-pointer border ${
                      inquiriesView === "overview" 
                        ? "bg-amber-500 text-theme border-amber-500" 
                        : "border-theme/10 hover:bg-theme/5"
                    }`}
                  >
                    Overview Panel
                  </button>
                  <button 
                    onClick={() => setInquiriesView("cards")}
                    className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase transition-all cursor-pointer border ${
                      inquiriesView === "cards" 
                        ? "bg-amber-500 text-theme border-amber-500" 
                        : "border-theme/10 hover:bg-theme/5"
                    }`}
                  >
                    Inquiry Cards
                  </button>
                </div>
              </div>

              {/* OVERVIEW PANEL VIEW (Image 2 representation) */}
              {inquiriesView === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Active Global Inquiries Table */}
                  <div className="lg:col-span-8 bg-theme border border-theme/10 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-theme/5 pb-3">
                      <div className="flex items-center gap-2 text-theme font-bold text-xs uppercase">
                        <FileText size={16} className="text-amber-400" />
                        <span>Active Global Inquiries</span>
                      </div>
                      <button 
                        onClick={() => setInquiriesView("cards")}
                        className="text-[10px] text-amber-400 hover:underline uppercase"
                      >
                        Review All →
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-theme/10 text-theme font-bold">
                            <th className="py-2.5">REF ID</th>
                            <th className="py-2.5">CLIENT ENTITY</th>
                            <th className="py-2.5">REGION</th>
                            <th className="py-2.5">EST. VOLUME</th>
                            <th className="py-2.5">STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inquiries.map((inq) => (
                            <tr key={inq.id} className="border-b border-theme/5 hover:bg-theme/5 transition-colors">
                              <td className="py-3 font-bold text-theme">{inq.referenceId}</td>
                              <td className="py-3 text-theme">{inq.clientEntity}</td>
                              <td className="py-3">{inq.region}</td>
                              <td className="py-3 text-amber-400 font-bold">{inq.estVolume}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded-[3px] text-[9px] font-black uppercase tracking-wider ${getStatusBadge(inq.statusCode)}`}>
                                  {inq.statusCode}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Column: Health and Dispatches Widgets */}
                  <div className="lg:col-span-4 space-y-6">
                    
                    {/* Catalog Health */}
                    <div className="bg-theme border border-theme/10 rounded-xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-theme uppercase font-black">Catalog Health</span>
                        <span className="text-emerald-500 font-bold text-xs uppercase">Nominal</span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-theme font-bold">98.4%</span>
                            <span className="text-emerald-400 text-[10px] font-bold">▲ +0.2%</span>
                          </div>
                          <div className="h-1 bg-theme/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: "98.4%" }}></div>
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-2">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-theme">HS Code Verification</span>
                            <span className="text-emerald-400 font-bold">100%</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-theme">Pricing Parity (Global)</span>
                            <span className="text-amber-400 font-bold">92%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Dispatches */}
                    <div className="bg-theme border border-theme/10 rounded-xl p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-theme/5 pb-2">
                        <span className="text-[10px] text-theme uppercase font-black">Recent Dispatches</span>
                        <Activity size={14} className="text-amber-400" />
                      </div>
                      <div className="space-y-3 text-[11px]">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            <span className="text-theme font-bold">SHP-996-GLB</span>
                          </div>
                          <span className="text-theme">1h ago</span>
                        </div>
                        <p className="text-theme pl-3.5 leading-tight">Departed Port of Rotterdam</p>

                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                            <span className="text-theme font-bold">ARR-772-FRA</span>
                          </div>
                          <span className="text-theme">3h ago</span>
                        </div>
                        <p className="text-theme pl-3.5 leading-tight">In transit to Frankfurt</p>

                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <span className="text-theme font-bold">SHP-888-DXB</span>
                          </div>
                          <span className="text-theme">1d ago</span>
                        </div>
                        <p className="text-theme pl-3.5 leading-tight">Delivered Jebel Ali, UAE</p>
                      </div>
                    </div>

                  </div>

                  {/* World Node Graphic Banner */}
                  <div className="lg:col-span-12 bg-theme border border-theme/10 rounded-xl p-5 space-y-3">
                    <div className="h-28 bg-theme rounded-lg overflow-hidden border border-theme/5 relative flex items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.08),transparent)]">
                      <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center"></div>
                      <span className="text-theme/25 text-[10px] uppercase font-bold tracking-[8px]">LOGISTICS NETWORK VISUALIZER</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-theme">
                      <span className="text-amber-400">●</span>
                      <span className="font-bold text-theme">GLOBAL NODE STATUS: NOMINAL.</span>
                      <span>Tracking 1.18k active physical transport assets.</span>
                    </div>
                  </div>

                </div>
              )}

              {/* CARD DETAILS PANEL VIEW (Image 4 representation) */}
              {inquiriesView === "cards" && (
                <div className="space-y-6">
                  
                  {/* Top quick stats cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-theme border border-theme/10 p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-theme uppercase font-black">PENDING REVIEW</span>
                        <h4 className="text-2xl font-bold text-theme mt-1">{metrics.pendingReview}</h4>
                        <span className="text-[9px] text-emerald-400 font-bold">+2 since last shift</span>
                      </div>
                      <Shield size={24} className="text-amber-400 opacity-30" />
                    </div>

                    <div className="bg-theme border border-theme/10 p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-theme uppercase font-black">PRIORITY / URGENT</span>
                        <h4 className="text-2xl font-bold text-theme mt-1">{metrics.urgent}</h4>
                        <span className="text-[9px] text-rose-400 font-bold">Requires immediate quote</span>
                      </div>
                      <ShieldAlert size={24} className="text-rose-500 opacity-30" />
                    </div>

                    <div className="bg-theme border border-theme/10 p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-theme uppercase font-black">QUOTED TODAY</span>
                        <h4 className="text-2xl font-bold text-theme mt-1">{metrics.quotedToday}</h4>
                        <span className="text-[9px] text-emerald-400 font-bold">Conversion rate 68%</span>
                      </div>
                      <BadgePercent size={24} className="text-emerald-500 opacity-30" />
                    </div>
                  </div>

                  {/* Filter Sub-links */}
                  <div className="flex border-b border-theme/10 pb-1 text-xs gap-6 font-bold">
                    <button className="text-amber-400 border-b border-amber-400 pb-2.5">ALL INQUIRIES</button>
                    <button className="text-theme hover:text-theme pb-2.5 transition-colors">AIR FREIGHT</button>
                    <button className="text-theme hover:text-theme pb-2.5 transition-colors">SEA FREIGHT</button>
                  </div>

                  {/* Three detailed cards list */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {inquiries.map((inq) => (
                      <div key={inq.id} className="bg-theme border border-theme/10 p-5 rounded-xl space-y-4 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] text-theme font-black">{inq.referenceId}</span>
                            <span className={`px-2 py-0.5 rounded-[3px] text-[8px] font-black uppercase ${getStatusBadge(inq.statusCode)}`}>
                              {inq.statusCode}
                            </span>
                          </div>

                          <h3 className="text-theme font-bold text-sm line-clamp-1">{inq.clientEntity}</h3>
                          <p className="text-[10px] text-theme flex items-center gap-1.5">
                            <Globe size={10} />
                            <span>{inq.region}</span>
                          </p>
                        </div>

                        <div className="bg-theme p-3 rounded border border-theme/5 space-y-2 text-[10px]">
                          <div className="flex justify-between">
                            <span className="text-theme">CLASSIFICATION:</span>
                            <span className="text-theme font-bold uppercase">{inq.classification}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-theme">FORWARDING:</span>
                            <span className="text-amber-400 font-bold uppercase">{inq.forwarding}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-theme">EST. VOLUME:</span>
                            <span className="text-theme font-bold">{inq.estVolume}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-theme">EST. WEIGHT:</span>
                            <span className="text-theme font-bold">{inq.weight}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          {inq.statusCode === "PENDING REVIEW" && (
                            <button 
                              onClick={() => {
                                setInquiries(prev => prev.map(i => i.id === inq.id ? { ...i, statusCode: "PENDING QUOTE" } : i));
                              }}
                              className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-theme font-black uppercase text-[10px] rounded transition-colors cursor-pointer"
                            >
                              Generate Quote
                            </button>
                          )}
                          {inq.statusCode === "COMPLIANCE HOLD" && (
                            <button 
                              onClick={() => {
                                setInquiries(prev => prev.map(i => i.id === inq.id ? { ...i, statusCode: "CLEARED" } : i));
                              }}
                              className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-theme font-black uppercase text-[10px] rounded transition-colors cursor-pointer"
                            >
                              Expedite Quote
                            </button>
                          )}
                          {inq.statusCode === "PENDING QUOTE" && (
                            <button 
                              onClick={() => {
                                setInquiries(prev => prev.map(i => i.id === inq.id ? { ...i, statusCode: "CLEARED" } : i));
                              }}
                              className="flex-1 py-2 bg-theme hover:bg-theme text-theme font-black uppercase text-[10px] rounded transition-colors cursor-pointer"
                            >
                              Review & Clear
                            </button>
                          )}
                          {inq.statusCode === "CLEARED" && (
                            <button 
                              disabled
                              className="flex-1 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black uppercase text-[10px] rounded opacity-70"
                            >
                              In Transit
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              setInquiries(prev => prev.filter(i => i.id !== inq.id));
                            }}
                            className="p-2 border border-theme/10 hover:border-theme/30 rounded text-theme hover:text-theme transition-colors cursor-pointer"
                            aria-label="Delete inquiry"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 2: EXPORT CATALOG VIEW */}
          {activeSubTab === "catalog" && (
            <div className="space-y-6 flex-1 flex flex-col">
              
              {/* Header with Catalog list vs compiler picker */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-theme/10">
                <div>
                  <span className="text-[10px] text-amber-400 uppercase tracking-widest block mb-1">Global Inventory Management</span>
                  <h1 className="text-2xl font-bold text-theme uppercase tracking-tight">Export Catalog Management</h1>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setInquiriesView("overview")} // recycling view switch states to keep clean code
                    className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase transition-all cursor-pointer border ${
                      inquiriesView === "overview" 
                        ? "bg-amber-500 text-theme border-amber-500" 
                        : "border-theme/10 hover:bg-theme/5"
                    }`}
                  >
                    Products List
                  </button>
                  <button 
                    onClick={() => setInquiriesView("cards")}
                    className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase transition-all cursor-pointer border ${
                      inquiriesView === "cards" 
                        ? "bg-amber-500 text-theme border-amber-500" 
                        : "border-theme/10 hover:bg-theme/5"
                    }`}
                  >
                    PDF Compiler
                  </button>
                </div>
              </div>

              {/* PRODUCTS LIST PANEL VIEW (Image 1 representation) */}
              {inquiriesView === "overview" && (
                <div className="space-y-5 flex-1 flex flex-col justify-between">
                  
                  {/* Search, Filter, and Action Buttons bar */}
                  <div className="flex flex-col md:flex-row justify-between gap-4 items-stretch md:items-center">
                    
                    {/* Search Bar */}
                    <div className="flex-1 max-w-md relative flex items-center">
                      <Search className="absolute left-3.5 text-theme" size={14} />
                      <input 
                        type="text"
                        placeholder="Search by SKU, Model, or Component..."
                        value={catalogSearch}
                        onChange={(e) => setCatalogSearch(e.target.value)}
                        className="w-full bg-theme border border-theme/10 pl-10 pr-4 py-2.5 rounded text-xs focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2.5 items-center">
                      {/* Sector filter drop down */}
                      <div className="bg-theme border border-theme/10 px-3 py-2 rounded text-xs flex items-center gap-1.5">
                        <Filter size={12} className="text-theme" />
                        <select 
                          value={selectedSector}
                          onChange={(e) => setSelectedSector(e.target.value)}
                          className="bg-transparent text-theme border-none focus:outline-none focus:ring-0 cursor-pointer"
                        >
                          <option className="bg-theme" value="All Sectors">All Sectors</option>
                          <option className="bg-theme" value="Mining">Mining</option>
                          <option className="bg-theme" value="Automation">Automation</option>
                          <option className="bg-theme" value="Power Gen">Power Gen</option>
                        </select>
                      </div>

                      {/* Export CSV button */}
                      <button 
                        onClick={handleExportCsv}
                        className="px-4 py-2 border border-theme/10 hover:border-theme/35 bg-theme text-theme hover:text-amber-400 text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Download size={14} />
                        <span>Export CSV</span>
                      </button>

                      {/* Add Product button */}
                      <button 
                        onClick={() => setIsAddProductOpen(true)}
                        className="px-4 py-2 bg-theme hover:bg-theme text-theme text-xs font-black uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus size={14} strokeWidth={3} />
                        <span>Add Product</span>
                      </button>
                    </div>

                  </div>

                  {/* Catalog Table */}
                  <div className="bg-theme border border-theme/10 rounded-xl overflow-hidden flex-1">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-theme/80 text-theme font-bold uppercase tracking-wider border-b border-theme/10">
                            <th className="py-3.5 px-4">SKU / PRODUCT NAME</th>
                            <th className="py-3.5 px-4">SECTOR</th>
                            <th className="py-3.5 px-4 text-right">FOB PRICE (USD)</th>
                            <th className="py-3.5 px-4 text-center">FOB STATUS</th>
                            <th className="py-3.5 px-4">TECH SPECS (VOLT/FREQ)</th>
                            <th className="py-3.5 px-4 text-center">QTY</th>
                            <th className="py-3.5 px-4 text-center">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCatalog.map((prod) => (
                            <tr key={prod.sku} className="border-b border-theme/5 hover:bg-theme/5 transition-colors">
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded bg-theme/5 border border-theme/10 flex items-center justify-center text-theme font-black">
                                    ★
                                  </div>
                                  <div>
                                    <div className="font-bold text-theme">{prod.name}</div>
                                    <div className="text-[10px] text-theme">SKU: {prod.sku}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4 font-bold text-theme text-[10px]">{prod.sector}</td>
                              <td className="py-4 px-4 text-right text-amber-400 font-black">${prod.fobPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                              <td className="py-4 px-4 text-center">
                                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[9px] font-bold">
                                  {prod.paidStatus}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-theme text-[10px] max-w-[200px] truncate" title={prod.techSpecs}>
                                {prod.techSpecs}
                              </td>
                              <td className="py-4 px-4 text-center font-bold">{prod.quantity}</td>
                              <td className="py-4 px-4 text-center">
                                <button 
                                  onClick={() => {
                                    setExportProducts(prev => prev.filter(p => p.sku !== prod.sku));
                                  }}
                                  className="p-1 hover:bg-rose-500/10 text-theme hover:text-rose-400 rounded transition-colors cursor-pointer"
                                  title="Remove product"
                                >
                                  <X size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-theme font-bold pt-2">
                    <span>Showing 1-{filteredCatalog.length} of {exportProducts.length} Export Variants</span>
                    <div className="flex gap-2">
                      <button disabled className="px-2 py-1 border border-theme/5 text-theme rounded cursor-not-allowed">&lt;</button>
                      <button disabled className="px-2 py-1 border border-theme/5 text-theme rounded cursor-not-allowed">&gt;</button>
                    </div>
                  </div>

                </div>
              )}

              {/* PDF COMPILER / MANAGEMENT PANEL VIEW (Image 3 representation) */}
              {inquiriesView === "cards" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left block: Form parameters */}
                  <div className="lg:col-span-8 bg-theme border border-theme/10 rounded-xl p-5 space-y-6">
                    <div className="flex items-center gap-2 border-b border-theme/5 pb-3">
                      <FileText size={16} className="text-amber-400" />
                      <span className="text-theme font-bold text-xs uppercase">COMPILATION PARAMETERS</span>
                    </div>

                    {/* Checkbox inclusion list */}
                    <div className="space-y-3">
                      <span className="text-[10px] text-theme font-black uppercase block">INCLUSION CATEGORIES</span>
                      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                        {["Heavy Machinery", "Electronic Components", "Automotive Parts", "Raw Materials"].map((cat) => {
                          const isChecked = selectedCategories.includes(cat);
                          return (
                            <label key={cat} className="flex items-center gap-3 cursor-pointer select-none text-xs text-theme hover:text-theme transition-colors">
                              <input 
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setSelectedCategories(selectedCategories.filter(c => c !== cat));
                                  } else {
                                    setSelectedCategories([...selectedCategories, cat]);
                                  }
                                }}
                                className="w-4 h-4 rounded border-theme/10 bg-theme text-amber-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                              />
                              <span>{cat}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Priority Overrides Tag list */}
                    <div className="space-y-3">
                      <span className="text-[10px] text-theme font-black uppercase block">PRIORITY SKU OVERRIDES (FORCE INCLUSION)</span>
                      
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          placeholder="Enter SKU..."
                          value={overrideInput}
                          onChange={(e) => setOverrideInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddOverride()}
                          className="bg-theme border border-theme/10 text-xs px-3 py-2 rounded focus:outline-none focus:border-amber-500 flex-1 uppercase"
                        />
                        <button 
                          onClick={handleAddOverride}
                          className="px-4 bg-theme border border-theme/10 hover:border-amber-500/40 hover:text-amber-400 text-xs font-bold uppercase rounded cursor-pointer transition-colors"
                        >
                          + Add
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {skuOverrides.map((sku) => (
                          <span 
                            key={sku}
                            className="bg-theme border border-theme/10 text-[9px] font-bold text-theme px-2 py-1 rounded flex items-center gap-1.5"
                          >
                            <span>{sku}</span>
                            <button 
                              onClick={() => handleRemoveOverride(sku)}
                              className="text-theme hover:text-rose-400 cursor-pointer"
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-theme font-black uppercase block mb-2">TARGET REGION</span>
                        <select 
                          value={compilationRegion}
                          onChange={(e) => setCompilationRegion(e.target.value)}
                          className="w-full bg-theme border border-theme/10 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                          <option>Global (All Regions)</option>
                          <option>European Union</option>
                          <option>APAC & East Asia</option>
                          <option>Middle East & Africa</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[10px] text-theme font-black uppercase block mb-2">PRICING TIER</span>
                        <select 
                          value={pricingTier}
                          onChange={(e) => setPricingTier(e.target.value)}
                          className="w-full bg-theme border border-theme/10 rounded px-3 py-2.5 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                          <option>Standard Wholesale</option>
                          <option>Distributor Discount Tier</option>
                          <option>Enterprise Special Rates</option>
                        </select>
                      </div>
                    </div>

                    {/* Compile Button */}
                    <div className="pt-4 space-y-3">
                      {isCompiling ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold text-amber-400">
                            <span className="flex items-center gap-2">
                              <RefreshCw size={12} className="animate-spin" />
                              <span>COMPILING PRODUCTS...</span>
                            </span>
                            <span>{compileProgress}%</span>
                          </div>
                          <div className="h-1 bg-theme/5 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 transition-all duration-200" style={{ width: `${compileProgress}%` }}></div>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={triggerPdfCompilation}
                          className="w-full py-4 bg-theme hover:bg-theme text-theme font-black uppercase tracking-widest text-xs rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(251,191,36,0.1)]"
                        >
                          <RefreshCw size={14} />
                          <span>Compile & Generate PDF</span>
                        </button>
                      )}
                    </div>

                  </div>

                  {/* Right block: Compile History */}
                  <div className="lg:col-span-4 bg-theme border border-theme/10 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-theme/5 pb-3">
                      <div className="text-theme font-bold text-xs uppercase flex items-center gap-2">
                        <FileText size={16} className="text-amber-400" />
                        <span>PREVIOUS VERSIONS</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {pdfHistory.map((pdf) => (
                        <div key={pdf.id} className="p-3 border border-theme/5 bg-theme/50 rounded-lg hover:border-theme/10 transition-colors space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-theme text-xs font-bold line-clamp-1">{pdf.name}</span>
                            {pdf.status === "LATEST" && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[7px] font-black tracking-wider">
                                LATEST
                              </span>
                            )}
                            {pdf.status === "RECALLED" && (
                              <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[7px] font-black tracking-wider">
                                RECALLED
                              </span>
                            )}
                          </div>
                          
                          <div className="text-[10px] text-theme flex flex-col gap-0.5">
                            <span>Generated: {pdf.generated}</span>
                            <span>Size: {pdf.size} | {pdf.region}</span>
                          </div>

                          <div className="flex gap-2 pt-2 border-t border-theme/5 mt-2 justify-end">
                            <button className="p-1 hover:bg-theme/5 text-theme hover:text-theme rounded transition-colors cursor-pointer" title="View Document">
                              <Search size={12} />
                            </button>
                            <button className="p-1 hover:bg-theme/5 text-theme hover:text-theme rounded transition-colors cursor-pointer" title="Download Document">
                              <Download size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 3: LOGISTICS VIEW */}
          {activeSubTab === "logistics" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-theme/10">
                <span className="text-[10px] text-amber-400 uppercase tracking-widest block mb-1">GLOBAL INVENTORY MANAGEMENT</span>
                <h1 className="text-2xl font-bold text-theme uppercase tracking-tight">Logistics Management</h1>
              </div>

              {/* Mock tracking and freight status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Active Dispatches */}
                <div className="bg-theme border border-theme/10 p-5 rounded-xl space-y-4">
                  <h3 className="text-theme font-bold text-xs uppercase pb-2 border-b border-theme/5">Active Logistics Dispatches</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-theme font-bold">SHP-996-GLB (Rotterdam)</span>
                        <span className="text-emerald-400 font-bold">85% Complete</span>
                      </div>
                      <div className="h-1.5 bg-theme/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: "85%" }}></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-theme font-bold">ARR-772-FRA (Frankfurt)</span>
                        <span className="text-amber-400 font-bold">42% In Transit</span>
                      </div>
                      <div className="h-1.5 bg-theme/5 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: "42%" }}></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-theme font-bold">SHP-888-DXB (Dubai)</span>
                        <span className="text-blue-400 font-bold">100% Delivered</span>
                      </div>
                      <div className="h-1.5 bg-theme/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Freight Distribution */}
                <div className="bg-theme border border-theme/10 p-5 rounded-xl space-y-4">
                  <h3 className="text-theme font-bold text-xs uppercase pb-2 border-b border-theme/5">Freight Channels Distribution</h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-theme rounded-lg border border-theme/5">
                      <div className="text-2xl font-black text-amber-400">14</div>
                      <div className="text-[10px] text-theme uppercase font-black mt-1">Air Freight Operations</div>
                    </div>
                    <div className="p-4 bg-theme rounded-lg border border-theme/5">
                      <div className="text-2xl font-black text-[#8bceff]">32</div>
                      <div className="text-[10px] text-theme uppercase font-black mt-1">Sea Freight Container slots</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS VIEW */}
          {activeSubTab === "settings" && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-theme/10">
                <span className="text-[10px] text-amber-400 uppercase tracking-widest block mb-1">GLOBAL INVENTORY MANAGEMENT</span>
                <h1 className="text-2xl font-bold text-theme uppercase tracking-tight">Export Settings</h1>
              </div>

              <div className="bg-theme border border-theme/10 p-5 rounded-xl max-w-xl space-y-4 text-xs">
                <div className="flex justify-between items-center pb-3 border-b border-theme/5">
                  <span className="text-theme font-bold">Global Export Mode</span>
                  <span className="text-emerald-400 font-black">ENABLED</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-theme/5">
                  <span className="text-theme font-bold">Automated PDF Catalog Sync</span>
                  <span className="text-emerald-400 font-black">ACTIVE</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-theme/5">
                  <span className="text-theme font-bold">HS Code Auto-Verification API</span>
                  <span className="text-amber-400 font-black">STANDBY</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-theme font-bold">Wholesale Pricing Modifier</span>
                  <span className="text-theme font-bold">1.0x (Default)</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* MODAL 1: ADD PRODUCT TO EXPORT CATALOG (Image 1 - ADD PRODUCT) */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-theme/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-theme border border-theme/15 w-full max-w-md rounded-xl overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-theme/10 flex justify-between items-center bg-theme">
              <span className="text-xs font-black uppercase text-amber-400 tracking-wider">Add Export Product</span>
              <button onClick={() => setIsAddProductOpen(false)} className="text-theme hover:text-theme cursor-pointer"><X size={16} /></button>
            </div>
            
            <form onSubmit={handleAddProduct} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-theme font-bold block">SKU Code (e.g. EX-CEN-9080-A)</label>
                <input 
                  type="text"
                  required
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  placeholder="EX-CEN-..."
                  className="w-full bg-theme border border-theme/10 px-3 py-2 rounded focus:outline-none focus:border-amber-500 uppercase text-theme"
                />
              </div>

              <div className="space-y-1">
                <label className="text-theme font-bold block">Product Name</label>
                <input 
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Centrifuge, Multimeter..."
                  className="w-full bg-theme border border-theme/10 px-3 py-2 rounded focus:outline-none focus:border-amber-500 text-theme"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-theme font-bold block">Sector</label>
                  <select 
                    value={newProduct.sector}
                    onChange={(e) => setNewProduct({ ...newProduct, sector: e.target.value })}
                    className="w-full bg-theme border border-theme/10 px-3 py-2 rounded focus:outline-none focus:border-amber-500 text-theme cursor-pointer"
                  >
                    <option value="MINING">Mining</option>
                    <option value="AUTOMATION">Automation</option>
                    <option value="POWER GEN">Power Gen</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-theme font-bold block">FOB Price (USD)</label>
                  <input 
                    type="number"
                    required
                    value={newProduct.fobPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, fobPrice: e.target.value })}
                    placeholder="e.g. 42500"
                    className="w-full bg-theme border border-theme/10 px-3 py-2 rounded focus:outline-none focus:border-amber-500 text-theme"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-theme font-bold block">Tech Specs (Volt/Freq)</label>
                <input 
                  type="text"
                  value={newProduct.techSpecs}
                  onChange={(e) => setNewProduct({ ...newProduct, techSpecs: e.target.value })}
                  placeholder="e.g. 380V / 415V (3-Phase) | 50Hz"
                  className="w-full bg-theme border border-theme/10 px-3 py-2 rounded focus:outline-none focus:border-amber-500 text-theme"
                />
              </div>

              <div className="space-y-1">
                <label className="text-theme font-bold block">FOB Quantity / Status</label>
                <input 
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                  placeholder="e.g. 100"
                  className="w-full bg-theme border border-theme/10 px-3 py-2 rounded focus:outline-none focus:border-amber-500 text-theme"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-theme hover:bg-theme text-theme font-black uppercase text-xs rounded transition-colors cursor-pointer mt-2"
              >
                Create Product Option
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: NEW SHIPMENT / INQUIRY (Image 2 & 4 - NEW SHIPMENT) */}
      {isNewShipmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-theme/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-theme border border-theme/15 w-full max-w-md rounded-xl overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-theme/10 flex justify-between items-center bg-theme">
              <span className="text-xs font-black uppercase text-amber-400 tracking-wider">Register Export Shipment Inquiry</span>
              <button onClick={() => setIsNewShipmentOpen(false)} className="text-theme hover:text-theme cursor-pointer"><X size={16} /></button>
            </div>
            
            <form onSubmit={handleAddInquiry} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-theme font-bold block">Client Entity / Company</label>
                <input 
                  type="text"
                  required
                  value={newInquiry.clientEntity}
                  onChange={(e) => setNewInquiry({ ...newInquiry, clientEntity: e.target.value })}
                  placeholder="e.g. Stellar Dynamics Corp"
                  className="w-full bg-theme border border-theme/10 px-3 py-2 rounded focus:outline-none focus:border-amber-500 text-theme"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-theme font-bold block">Forwarding Channel</label>
                  <select 
                    value={newInquiry.forwarding}
                    onChange={(e) => setNewInquiry({ ...newInquiry, forwarding: e.target.value })}
                    className="w-full bg-theme border border-theme/10 px-3 py-2 rounded focus:outline-none focus:border-amber-500 text-theme cursor-pointer"
                  >
                    <option value="Air Freight">Air Freight</option>
                    <option value="Sea Freight">Sea Freight</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-theme font-bold block">Region</label>
                  <select 
                    value={newInquiry.region}
                    onChange={(e) => setNewInquiry({ ...newInquiry, region: e.target.value })}
                    className="w-full bg-theme border border-theme/10 px-3 py-2 rounded focus:outline-none focus:border-amber-500 text-theme cursor-pointer"
                  >
                    <option value="EU-Central">EU-Central</option>
                    <option value="APAC-East">APAC-East</option>
                    <option value="AF-South">AF-South</option>
                    <option value="LATAM-East">LATAM-East</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-theme font-bold block">Est. Volume (Containers/Pallets)</label>
                  <input 
                    type="text"
                    required
                    value={newInquiry.estVolume}
                    onChange={(e) => setNewInquiry({ ...newInquiry, estVolume: e.target.value })}
                    placeholder="e.g. 4x 40ft HQ"
                    className="w-full bg-theme border border-theme/10 px-3 py-2 rounded focus:outline-none focus:border-amber-500 text-theme"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-theme font-bold block">Est. Total Weight (KG)</label>
                  <input 
                    type="text"
                    value={newInquiry.weight}
                    onChange={(e) => setNewInquiry({ ...newInquiry, weight: e.target.value })}
                    placeholder="e.g. 1,200 KG"
                    className="w-full bg-theme border border-theme/10 px-3 py-2 rounded focus:outline-none focus:border-amber-500 text-theme"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-theme font-bold block">Classification Sector</label>
                <select 
                  value={newInquiry.classification}
                  onChange={(e) => setNewInquiry({ ...newInquiry, classification: e.target.value })}
                  className="w-full bg-theme border border-theme/10 px-3 py-2 rounded focus:outline-none focus:border-amber-500 text-theme cursor-pointer"
                >
                  <option value="Bluechips">Bluechips</option>
                  <option value="Ind. Parts">Industrial Parts</option>
                  <option value="Acta Parts">Mining Materials</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-theme hover:bg-theme text-theme font-black uppercase text-xs rounded transition-colors cursor-pointer mt-2"
              >
                Register Inquiry
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
