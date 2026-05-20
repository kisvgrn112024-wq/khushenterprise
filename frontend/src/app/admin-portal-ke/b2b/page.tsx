"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  FlaskConical, 
  Shapes, 
  Archive, 
  Users, 
  FileSpreadsheet, 
  BookOpen, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Globe, 
  HelpCircle, 
  TrendingUp, 
  ShieldCheck, 
  ChevronRight, 
  FileText, 
  AlertTriangle, 
  Plus, 
  DollarSign, 
  Layers, 
  CheckCircle, 
  Zap, 
  Sliders, 
  ArrowRight,
  FolderPlus,
  Package,
  Check,
  Download,
  Percent
} from "lucide-react";
import { getProducts, updateProduct, Product } from "@/lib/products";

// Define Types for B2B Inquiry CRM
interface B2BInquiry {
  id: string;
  clientName: string;
  location: string;
  category: string;
  targetDelivery: string;
  quantity: string;
  value: number;
  originalText: string;
  specs: {
    productCategory: string;
    orderVol: string;
    requestedSpecs: string;
  };
  status: "Pending" | "Under Review" | "Closed";
  notes?: string;
  clientTier: string;
  daysAgo: number;
}

export default function B2BAdminSuite() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"hub" | "catalog" | "inquiries">("hub");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Products from local store
  const [products, setProducts] = useState<Product[]>([]);
  const [globalB2BEnabled, setGlobalB2BEnabled] = useState(true);

  // Notification Feed State
  const [apiLoad, setApiLoad] = useState(42);
  const [activeSessions, setActiveSessions] = useState(815);

  // CRM Inquiries State
  const [inquiries, setInquiries] = useState<B2BInquiry[]>([]);
  const [selectedInquiryId, setSelectedInquiryId] = useState<string>("B2B-RFQ-102");
  const [inquirySearch, setInquirySearch] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<"All" | "Pending" | "Under Review" | "Closed">("All");

  // Operational notes temp storage
  const [currentNotes, setCurrentNotes] = useState("");

  // Quote Builder Modal State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [customMargin, setCustomMargin] = useState(12);
  const [additionalTerms, setAdditionalTerms] = useState("");
  const [quoteExporting, setQuoteExporting] = useState(false);
  const [quoteExportDone, setQuoteExportDone] = useState(false);

  // Categorization workbench state
  const [uncategorizedItems, setUncategorizedItems] = useState<{ id: string; title: string; sku: string }[]>([]);
  const [lifeSciencesModule, setLifeSciencesModule] = useState<{ id: string; title: string; sku: string }[]>([]);
  const [chemistryBasicsModule, setChemistryBasicsModule] = useState<{ id: string; title: string; sku: string }[]>([]);

  // Package builder state
  const [packageActive, setPackageActive] = useState(true);

  // Simulated telemetry variation
  useEffect(() => {
    const interval = setInterval(() => {
      setApiLoad(prev => Math.min(Math.max(prev + Math.floor(Math.random() * 7) - 3, 30), 85));
      setActiveSessions(prev => prev + Math.floor(Math.random() * 11) - 5);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Initialize data
  useEffect(() => {
    // 0. Set active tab from query parameter
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "hub" || tab === "catalog" || tab === "inquiries") {
        setActiveTab(tab);
      }
    }

    // 1. Fetch & Initialize Products
    const items = getProducts();
    // Add custom scientific items for B2B demo if not already populated
    const hasCentrifuge = items.some(p => p.title.includes("Centrifuge"));
    let finalItems = [...items];

    if (!hasCentrifuge) {
      const extraItems: Product[] = [
        {
          id: "b2b-1",
          title: "High-Speed Centrifuge 15000RPM",
          description: "High-efficiency brush-less motor scientific centrifuge with digital acceleration controls. Perfect for cell biology separation.",
          price: 95000,
          originalPrice: 110000,
          rating: 4.9,
          reviews: 14,
          icon: "FlaskConical",
          tag: "B2B EXCLUSIVE",
          discount: "13% OFF",
          stock: 45,
          category: "Lab Equipment",
          sku: "KE-CEN-15K",
          moq: 2,
          bulkPrice: 82000,
          product_status: "active"
        },
        {
          id: "b2b-2",
          title: "Biocular Compound Microscope V4",
          description: "Infinity corrected optical microscope system with 1000x oil immersion objective lens and high-definition smart camera mount.",
          price: 36000,
          originalPrice: 42000,
          rating: 4.8,
          reviews: 28,
          icon: "Microscope",
          tag: "POPULAR",
          discount: "14% OFF",
          stock: 120,
          category: "Optics",
          sku: "KE-MIC-B10",
          moq: 5,
          bulkPrice: 31000,
          product_status: "active"
        },
        {
          id: "b2b-3",
          title: "Borosilicate Glass Beakers 500ml (Pack of 12)",
          description: "Premium heavy-wall borosilicate 3.3 glass beakers with graduated markings and dual pouring spouts.",
          price: 3200,
          originalPrice: 4000,
          rating: 4.7,
          reviews: 94,
          icon: "FlaskConical",
          tag: "ESSENTIAL",
          discount: "20% OFF",
          stock: 0,
          category: "Glassware",
          sku: "KE-BEK-500",
          moq: 10,
          bulkPrice: 2400,
          product_status: "active"
        },
        {
          id: "b2b-4",
          title: "Programmable Robotic Arm Kit (Educational)",
          description: "5-Axis robotic arm trainer kit with servo drives, microcontroller deck and drag-and-drop block coding manual.",
          price: 48000,
          originalPrice: 55000,
          rating: 4.9,
          reviews: 9,
          icon: "Shapes",
          tag: "NEW",
          discount: "12% OFF",
          stock: 15,
          category: "Robotics",
          sku: "KE-ROB-ARM",
          moq: 1,
          bulkPrice: 43000,
          product_status: "active"
        }
      ];
      finalItems = [...extraItems, ...items];
      
      // Update local storage so they appear elsewhere too
      if (typeof window !== "undefined") {
        localStorage.setItem("ke_products", JSON.stringify(finalItems));
      }
    }

    // Set initial B2B visibility state on objects if undefined
    const initializedItems = finalItems.map((item, idx) => ({
      ...item,
      // First 4 items are B2B visible in mockup, others are off by default
      isB2BVisible: item.isB2BVisible !== undefined ? item.isB2BVisible : (idx < 4)
    }));
    setProducts(initializedItems);

    // 2. Initialize CRM inquiries
    const initialInquiries: B2BInquiry[] = [
      {
        id: "B2B-RFQ-102",
        clientName: "Global Tech Solutions Ltd.",
        location: "Frankfurt, Germany",
        category: "Structural Components",
        targetDelivery: "Q4 2026",
        quantity: "900 Metric Tons",
        value: 65000,
        clientTier: "Tier 1 Client",
        daysAgo: 3,
        status: "Pending",
        originalText: "We are expanding our secondary facility in Frankfurt and require a bulk supply of structural steel components. Quality must meet strict European standards (S355JR minimum).\n\nPlease provide a preliminary quote for 900 MT including logistics and delivery schedules to our hub. We are looking to establish a long-term contract if initial fulfillment is satisfactory.",
        specs: {
          productCategory: "Structural Steel",
          orderVol: "900 Metric Tons",
          requestedSpecs: "S355JR / EN10025"
        },
        notes: "Awaiting final clearance from the Hamburg port authority. Margin set at 12% for long term partnership potential."
      },
      {
        id: "B2B-RFQ-098",
        clientName: "Apex Manufacturing",
        location: "Bengaluru, India",
        category: "Precision Lab Equipment",
        targetDelivery: "Immediate (July 2026)",
        quantity: "15x High-Speed Centrifuges",
        value: 22000,
        clientTier: "Tier 2 Client",
        daysAgo: 8,
        status: "Under Review",
        originalText: "We urgently require 15 units of High-Speed Centrifuges (15000RPM) for our R&D Lab division expansion. Standard warranty terms must be extended to 3 years.\n\nPlease confirm availability and volume discount. Crucial: delivery must occur before the end of the current financial quarter.",
        specs: {
          productCategory: "Laboratory Equipment",
          orderVol: "15 Units",
          requestedSpecs: "15,000 RPM / Digital controls"
        },
        notes: "Dr. Arpan is the lead technical reviewer. Need to confirm if we can dispatch from the Pune warehouse within 48 hours."
      },
      {
        id: "B2B-RFQ-085",
        clientName: "Mesa Logistics Corp",
        location: "Austin, Texas",
        category: "Safety Wear Bulk",
        targetDelivery: "Q3 2026",
        quantity: "500 Units Safety Goggles",
        value: 850,
        clientTier: "Tier 3 Client",
        daysAgo: 14,
        status: "Closed",
        originalText: "Requesting quotation for 500 units of wrap-around clear protective eyewear (chemical splash resistant) for warehouse safety compliance training.\n\nQuote must include shipping costs to our Austin depot.",
        specs: {
          productCategory: "Personal Protective Equipment",
          orderVol: "500 Units",
          requestedSpecs: "ANSI Z87.1 / Anti-fog"
        },
        notes: "Completed. Invoice issued. Client fully satisfied, potential repeat buyer for winter safety items."
      }
    ];

    // Load persisted notes/inquiries from localStorage if they exist
    const savedInquiries = localStorage.getItem("ke_b2b_inquiries");
    if (savedInquiries) {
      try {
        setInquiries(JSON.parse(savedInquiries));
      } catch (e) {
        setInquiries(initialInquiries);
      }
    } else {
      setInquiries(initialInquiries);
      localStorage.setItem("ke_b2b_inquiries", JSON.stringify(initialInquiries));
    }

    // Set uncategorized items for the workbench
    setUncategorizedItems([
      { id: "unc-1", title: "Hydrochloric Acid (Molarity 12)", sku: "100-MCH-01" },
      { id: "unc-2", title: "Neoprene Lab Protective Apron", sku: "555-APR-03" },
      { id: "unc-3", title: "Prepared Slides Set (Botany)", sku: "313-SLD-99" },
      { id: "unc-4", title: "Safety Goggles (Anti-Fog Pack 10)", sku: "822-GGL-02" }
    ]);
  }, []);

  // Update selected inquiry notes when clicking on another card
  useEffect(() => {
    const selected = inquiries.find(inq => inq.id === selectedInquiryId);
    if (selected) {
      setCurrentNotes(selected.notes || "");
    }
  }, [selectedInquiryId, inquiries]);

  // Sync Notes to LocalState
  const handleSaveNotes = () => {
    const updated = inquiries.map(inq => {
      if (inq.id === selectedInquiryId) {
        return { ...inq, notes: currentNotes };
      }
      return inq;
    });
    setInquiries(updated);
    localStorage.setItem("ke_b2b_inquiries", JSON.stringify(updated));
  };

  // Toggle individual B2B visibility
  const toggleVisibility = (productId: string) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        const nextVal = !p.isB2BVisible;
        // Also update standard products database
        updateProduct(productId, { isB2BVisible: nextVal } as any);
        return { ...p, isB2BVisible: nextVal };
      }
      return p;
    });
    setProducts(updated);
  };

  // Sort/Categorization Workbench action
  const moveToModule = (itemId: string, destination: "science" | "chemistry" | "uncategorized") => {
    let itemToMove: { id: string; title: string; sku: string } | undefined;

    // Find and remove from source
    const searchUnc = uncategorizedItems.find(i => i.id === itemId);
    const searchSci = lifeSciencesModule.find(i => i.id === itemId);
    const searchChem = chemistryBasicsModule.find(i => i.id === itemId);

    if (searchUnc) {
      itemToMove = searchUnc;
      setUncategorizedItems(prev => prev.filter(i => i.id !== itemId));
    } else if (searchSci) {
      itemToMove = searchSci;
      setLifeSciencesModule(prev => prev.filter(i => i.id !== itemId));
    } else if (searchChem) {
      itemToMove = searchChem;
      setChemistryBasicsModule(prev => prev.filter(i => i.id !== itemId));
    }

    if (!itemToMove) return;

    // Add to destination
    if (destination === "science") {
      setLifeSciencesModule(prev => [...prev, itemToMove!]);
    } else if (destination === "chemistry") {
      setChemistryBasicsModule(prev => [...prev, itemToMove!]);
    } else {
      setUncategorizedItems(prev => [...prev, itemToMove!]);
    }
  };

  // Generate Quote execution
  const triggerQuoteGeneration = () => {
    setQuoteExporting(true);
    setQuoteExportDone(false);
    setTimeout(() => {
      setQuoteExporting(false);
      setQuoteExportDone(true);
      // Simulate file download notice
      setTimeout(() => {
        setIsQuoteModalOpen(false);
        setQuoteExportDone(false);
        // Switch status to Under Review
        const updated = inquiries.map(inq => {
          if (inq.id === selectedInquiryId) {
            return { ...inq, status: "Under Review" as const };
          }
          return inq;
        });
        setInquiries(updated);
        localStorage.setItem("ke_b2b_inquiries", JSON.stringify(updated));
      }, 1500);
    }, 2000);
  };

  // Selected Inquiry Data
  const selectedInq = inquiries.find(inq => inq.id === selectedInquiryId);

  // CRM Filter logic
  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = 
      inq.clientName.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.id.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.location.toLowerCase().includes(inquirySearch.toLowerCase());
    
    const matchesStatus = selectedStatusFilter === "All" || inq.status === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#050506] text-gray-300 font-sans flex overflow-hidden select-none antialiased">
      
      {/* Sidebar - Dark industrial charcoal with gold accents */}
      <aside className="w-64 bg-[#0c0c0e] border-r border-[#1e1e24] flex flex-col shrink-0">
        
        {/* KHUSH B2B ADMIN Branding */}
        <div className="p-6 border-b border-[#1e1e24]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#e5a93b] flex items-center justify-center text-black font-black text-lg shadow-[0_0_15px_rgba(229,169,59,0.4)]">
              K
            </div>
            <div>
              <h1 className="text-sm font-black tracking-widest text-[#e5a93b] uppercase">KHUSH B2B</h1>
              <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-0.5">ADMIN SUITE</div>
            </div>
          </div>
        </div>

        {/* Sidebar Info Card */}
        <div className="px-6 py-4 border-b border-[#1e1e24] bg-[#09090b]/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1b1b1f] border border-[#e5a93b]/30 flex items-center justify-center text-[#e5a93b] font-mono text-xs font-bold shadow-[0_0_10px_rgba(229,169,59,0.1)]">
              OP
            </div>
            <div>
              <div className="text-white font-bold text-xs">B2B Sourcing</div>
              <div className="text-[9px] font-mono text-[#e5a93b] uppercase tracking-wider mt-0.5 font-bold">Industrial Precision</div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <button
            onClick={() => setActiveTab("hub")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all relative group ${
              activeTab === "hub"
                ? "text-black bg-[#e5a93b] shadow-[0_4px_15px_rgba(229,169,59,0.25)] font-extrabold"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <LayoutDashboard size={16} strokeWidth={activeTab === "hub" ? 2.5 : 1.5} />
            <span>Hub</span>
            {activeTab === "hub" && (
              <span className="absolute right-3 w-1.5 h-1.5 bg-black rounded-full"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("catalog")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all relative group ${
              activeTab === "catalog"
                ? "text-black bg-[#e5a93b] shadow-[0_4px_15px_rgba(229,169,59,0.25)] font-extrabold"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <FlaskConical size={16} strokeWidth={activeTab === "catalog" ? 2.5 : 1.5} />
            <span>Catalog</span>
            {activeTab === "catalog" && (
              <span className="absolute right-3 w-1.5 h-1.5 bg-black rounded-full"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("inquiries")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all relative group ${
              activeTab === "inquiries"
                ? "text-black bg-[#e5a93b] shadow-[0_4px_15px_rgba(229,169,59,0.25)] font-extrabold"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <FileSpreadsheet size={16} strokeWidth={activeTab === "inquiries" ? 2.5 : 1.5} />
            <span>Inquiries</span>
            {activeTab === "inquiries" && (
              <span className="absolute right-3 w-1.5 h-1.5 bg-black rounded-full"></span>
            )}
          </button>

          <div className="pt-4 pb-2">
            <span className="px-4 text-[9px] font-mono text-gray-500 uppercase tracking-widest">Pricing & Stocks</span>
          </div>

          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-not-allowed">
            <TrendingUp size={15} strokeWidth={1.5} />
            <span className="font-semibold">Pricing Control</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-not-allowed">
            <Shapes size={15} strokeWidth={1.5} />
            <span className="font-semibold">Inventory</span>
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-not-allowed">
            <Users size={15} strokeWidth={1.5} />
            <span className="font-semibold">Institutions</span>
          </button>
        </nav>

        {/* Sidebar Footer Buttons */}
        <div className="p-4 border-t border-[#1e1e24] space-y-1">
          {/* Custom Action Trigger */}
          <button 
            onClick={() => {
              setActiveTab("inquiries");
              setSelectedInquiryId("B2B-RFQ-102");
              setIsQuoteModalOpen(true);
            }} 
            className="w-full mb-3 py-2 bg-[#e5a93b]/10 hover:bg-[#e5a93b]/20 border border-[#e5a93b]/30 hover:border-[#e5a93b]/60 text-[#e5a93b] rounded text-xs font-bold transition-all uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>New Procurement</span>
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2 rounded text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <HelpCircle size={16} strokeWidth={1.5} />
            <span className="font-semibold">Support Desk</span>
          </button>
          
          <button 
            onClick={() => router.push("/")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded text-xs text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} strokeWidth={1.5} />
            <span className="font-semibold">Exit Admin Suite</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-[#0c0c0e] border-b border-[#1e1e24] flex items-center justify-between px-8 z-10 shrink-0">
          
          {/* Breadcrumbs or Search */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono bg-[#161619] border border-[#1e1e24] text-gray-400 px-2.5 py-1 rounded tracking-widest uppercase">
              KHUSH ENTERPRISES
            </span>
            <ChevronRight size={14} className="text-gray-600" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {activeTab === "hub" && "Central Procurement Hub"}
              {activeTab === "catalog" && "B2B Catalog Management"}
              {activeTab === "inquiries" && "Procurement RFQs & Inquiries"}
            </span>
          </div>

          {/* Quick Metrics / Active Settings */}
          <div className="flex items-center gap-6">
            
            {/* Live Gateway Telemetry */}
            <div className="hidden lg:flex items-center gap-4 border-r border-[#1e1e24] pr-6">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-mono text-gray-500 uppercase">API GATEWAY LOAD</span>
                <span className="text-xs font-mono font-bold text-[#e5a93b]">{apiLoad}%</span>
              </div>
              <div className="w-12 h-1.5 bg-[#1b1b1f] rounded overflow-hidden">
                <div 
                  className="h-full bg-[#e5a93b] transition-all duration-1000" 
                  style={{ width: `${apiLoad}%` }}
                ></div>
              </div>
            </div>

            {/* Support icons */}
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#e5a93b] rounded-full border-2 border-[#0c0c0e]"></span>
            </button>

            <button className="text-gray-400 hover:text-white transition-colors cursor-not-allowed">
              <Globe size={18} />
            </button>

            <div className="w-[1px] h-6 bg-[#1e1e24]"></div>

            {/* Profiles */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#e5a93b] text-black font-black text-xs flex items-center justify-center">
                M
              </div>
              <span className="text-xs text-white font-semibold hidden md:block">Manager (Mumbai Depot)</span>
            </div>

          </div>
        </header>

        {/* Outer Dashboard Scroll Frame */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#050506]">
          
          <AnimatePresence mode="wait">
            
            {/* 1. CENTRAL PROCUREMENT HUB (DASHBOARD) */}
            {activeTab === "hub" && (
              <motion.div
                key="hub"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8 text-left"
              >
                {/* Hero Banner Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  
                  {/* Central Procurement Hub Title Panel */}
                  <div className="xl:col-span-2 bg-gradient-to-r from-[#0c0c0e] to-[#121217] border border-[#1e1e24] p-8 rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5 pointer-events-none">
                      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
                        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" />
                        <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" />
                        <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" />
                      </svg>
                    </div>
                    
                    <div>
                      <span className="text-[9px] font-mono text-[#e5a93b] border border-[#e5a93b]/30 px-2.5 py-1 rounded bg-[#e5a93b]/5 uppercase tracking-widest font-black">
                        SYSTEM ONLINE
                      </span>
                      <h2 className="text-2xl font-black text-white mt-4 tracking-tight">Central Procurement Hub</h2>
                      <p className="text-gray-400 text-xs mt-2 max-w-lg leading-relaxed">
                        Manage global B2B operations, institutional scientific inventory allocations, and corporate partnership contracts with industrial precision.
                      </p>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button 
                        onClick={() => setActiveTab("catalog")}
                        className="px-5 py-2.5 bg-[#e5a93b] hover:bg-[#c9922f] text-black font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-2"
                      >
                        <FlaskConical size={14} />
                        <span>Manage B2B Catalog</span>
                      </button>
                      <button 
                        onClick={() => {
                          setActiveTab("inquiries");
                          setSelectedInquiryId("B2B-RFQ-102");
                        }}
                        className="px-5 py-2.5 bg-transparent hover:bg-white/5 border border-gray-600 hover:border-white text-white font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-2"
                      >
                        <FileText size={14} />
                        <span>Process RFQs</span>
                      </button>
                    </div>
                  </div>

                  {/* Top Metric Cards */}
                  <div className="flex flex-col gap-6">
                    
                    {/* Active Orders Card */}
                    <div className="bg-[#0c0c0e] border border-[#1e1e24] p-6 rounded-xl flex items-center justify-between relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#e5a93b]"></div>
                      <div>
                        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Active Orders</div>
                        <div className="text-3xl font-black font-mono text-white tracking-tight">1,204</div>
                        <div className="text-[9px] text-[#e5a93b] font-mono mt-1 font-bold">● LIVE FROM DEPOTS</div>
                      </div>
                      <div className="p-3.5 bg-[#161619] rounded-lg text-[#e5a93b]">
                        <Archive size={20} />
                      </div>
                    </div>

                    {/* Revenue YTD Card */}
                    <div className="bg-[#0c0c0e] border border-[#1e1e24] p-6 rounded-xl flex items-center justify-between relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#e5a93b]"></div>
                      <div>
                        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Revenue YTD</div>
                        <div className="text-3xl font-black font-mono text-white tracking-tight">$4.2M</div>
                        <div className="text-[9px] text-green-400 font-mono mt-1 font-bold">+18.4% VS LAST YEAR</div>
                      </div>
                      <div className="p-3.5 bg-[#161619] rounded-lg text-[#e5a93b]">
                        <DollarSign size={20} />
                      </div>
                    </div>

                  </div>

                </div>

                {/* Control Center Modules Quick Access */}
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between border-b border-[#1e1e24] pb-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Control Center Modules</h3>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">QUICK ACCESS</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* Module 1: Pricing */}
                    <div className="bg-[#0c0c0e] border border-[#1e1e24] p-5 rounded-xl hover:border-[#e5a93b]/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-[150px]">
                      <div>
                        <div className="w-8 h-8 rounded bg-[#161619] border border-[#1e1e24] flex items-center justify-center text-[#e5a93b] mb-3">
                          <Percent size={15} />
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Wholesale Pricing Tiers</h4>
                        <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">
                          Manage volume-based discount margins, MOQ targets & contract rates.
                        </p>
                      </div>
                      <div className="flex items-center justify-end text-[#e5a93b] text-xs font-bold font-mono tracking-wider">
                        <span>OPEN</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>

                    {/* Module 2: Inventory */}
                    <div className="bg-[#0c0c0e] border border-[#1e1e24] p-5 rounded-xl hover:border-[#e5a93b]/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-[150px]">
                      <div>
                        <div className="w-8 h-8 rounded bg-[#161619] border border-[#1e1e24] flex items-center justify-center text-[#e5a93b] mb-3">
                          <Layers size={15} />
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Institutional Inventory</h4>
                        <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">
                          Bulk stock allocations, safety buffer thresholds and depot reserves.
                        </p>
                      </div>
                      <div className="flex items-center justify-end text-[#e5a93b] text-xs font-bold font-mono tracking-wider">
                        <span>OPEN</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>

                    {/* Module 3: Corporate Partnerships */}
                    <div className="bg-[#0c0c0e] border border-[#1e1e24] p-5 rounded-xl hover:border-[#e5a93b]/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-[150px]">
                      <div>
                        <div className="w-8 h-8 rounded bg-[#161619] border border-[#1e1e24] flex items-center justify-center text-[#e5a93b] mb-3">
                          <Users size={15} />
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Corporate Partnerships</h4>
                        <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">
                          Client custom portals, procurement agreements and tracking credentials.
                        </p>
                      </div>
                      <div className="flex items-center justify-end text-[#e5a93b] text-xs font-bold font-mono tracking-wider">
                        <span>OPEN</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>

                    {/* Module 4: Tax Compliance */}
                    <div className="bg-[#0c0c0e] border border-[#1e1e24] p-5 rounded-xl hover:border-[#e5a93b]/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-[150px]">
                      <div>
                        <div className="w-8 h-8 rounded bg-[#161619] border border-[#1e1e24] flex items-center justify-center text-[#e5a93b] mb-3">
                          <ShieldCheck size={15} />
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Tax Compliance</h4>
                        <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">
                          GST/ITC input credit logging, international B2B custom codes & tax rules.
                        </p>
                      </div>
                      <div className="flex items-center justify-end text-[#e5a93b] text-xs font-bold font-mono tracking-wider">
                        <span>OPEN</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Bottom Section: Recent B2B Interactions & System Telemetry */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                  
                  {/* Recent B2B Interactions Feed (Left Column) */}
                  <div className="lg:col-span-2 bg-[#0c0c0e] border border-[#1e1e24] rounded-xl p-6 text-left">
                    <div className="flex items-center justify-between border-b border-[#1e1e24] pb-4 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 bg-[#e5a93b] rounded-full animate-pulse"></div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white">Recent B2B Interactions</h3>
                      </div>
                      <span className="text-[10px] font-mono text-gray-500">TODAY</span>
                    </div>

                    <div className="space-y-4">
                      
                      {/* Interaction 1 */}
                      <div className="bg-[#050506] border border-[#161619] p-4 rounded-lg flex items-start gap-4 hover:border-gray-800 transition-colors">
                        <div className="p-2 bg-[#1b1b1f] border border-[#e5a93b]/20 rounded text-[#e5a93b] shrink-0 font-mono text-[10px] font-bold">
                          PO
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">Purchase Order #PO-0021 Approved</span>
                            <span className="text-[10px] font-mono text-gray-500">2 hrs ago</span>
                          </div>
                          <p className="text-[10.5px] text-gray-400 leading-relaxed">
                            Client: <span className="text-[#e5a93b] font-semibold">Apex Manufacturing Ltd.</span> Value: <span className="font-mono text-white font-bold">₹48,050.00</span>
                          </p>
                        </div>
                      </div>

                      {/* Interaction 2 */}
                      <div className="bg-[#050506] border border-[#161619] p-4 rounded-lg flex items-start gap-4 hover:border-gray-800 transition-colors">
                        <div className="p-2 bg-red-950/20 border border-red-500/20 rounded text-red-400 shrink-0">
                          <AlertTriangle size={14} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">Inventory Alert: Heavy Machinery Parts</span>
                            <span className="text-[10px] font-mono text-gray-500">5 hrs ago</span>
                          </div>
                          <p className="text-[10.5px] text-gray-400 leading-relaxed">
                            Stock level dropped below institutional reserve threshold. Action required for buffer clearance.
                          </p>
                        </div>
                      </div>

                      {/* Interaction 3 */}
                      <div className="bg-[#050506] border border-[#161619] p-4 rounded-lg flex items-start gap-4 hover:border-gray-800 transition-colors">
                        <div className="p-2 bg-[#1b1b1f] border border-[#e5a93b]/20 rounded text-[#e5a93b] shrink-0">
                          <Zap size={14} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">New Partner Onboarded</span>
                            <span className="text-[10px] font-mono text-gray-500">1 day ago</span>
                          </div>
                          <p className="text-[10.5px] text-gray-400 leading-relaxed">
                            Global Logistics Corp requested API access for active catalog sync configurations.
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* System Telemetry Panel (Right Column) */}
                  <div className="bg-[#0c0c0e] border border-[#1e1e24] rounded-xl p-6 flex flex-col justify-between text-left">
                    
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-[#1e1e24] pb-4 mb-4">
                        System Snapshot
                      </h3>
                      
                      <div className="space-y-6">
                        
                        {/* Gateway load */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                            <span className="text-gray-400">API GATEWAY LOAD</span>
                            <span className="text-[#e5a93b]">{apiLoad}%</span>
                          </div>
                          <div className="w-full h-2 bg-[#050506] border border-[#1e1e24] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#e5a93b]/70 to-[#e5a93b] transition-all duration-1000" 
                              style={{ width: `${apiLoad}%` }}
                            ></div>
                          </div>
                          <div className="text-[9px] font-mono text-gray-500">Active Node Cluster: IND-WEST-1</div>
                        </div>

                        {/* Active B2B Sessions */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                            <span className="text-gray-400">ACTIVE B2B SESSIONS</span>
                            <span className="text-white font-mono font-black">{activeSessions}</span>
                          </div>
                          <div className="w-full h-2 bg-[#050506] border border-[#1e1e24] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-white transition-all duration-500" 
                              style={{ width: `${(activeSessions / 1200) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-[9px] font-mono text-gray-500">Peak Connection Tolerance: 2,500/m</div>
                        </div>

                      </div>
                    </div>

                    {/* Consignment Tracking ID quick look */}
                    <div className="mt-8 pt-4 border-t border-[#1e1e24]">
                      <div className="text-[10px] font-mono text-gray-500 uppercase mb-2">QUICK SEARCH (SKU/PO)</div>
                      <div className="flex items-center bg-[#050506] border border-[#1e1e24] rounded px-3 py-1.5 focus-within:border-[#e5a93b]/40">
                        <Search size={14} className="text-gray-500 mr-2" />
                        <input 
                          type="text" 
                          placeholder="Enter tracking ID..." 
                          className="bg-transparent text-xs text-white outline-none w-full placeholder-gray-600 font-mono"
                        />
                      </div>
                    </div>

                  </div>

                </div>
              </motion.div>
            )}

            {/* 2. B2B CATALOG MANAGEMENT (INVENTORY & PACKAGES) */}
            {activeTab === "catalog" && (
              <motion.div
                key="catalog"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8 text-left"
              >
                {/* Catalog Header Banner */}
                <div className="bg-gradient-to-r from-[#0c0c0e] to-[#121217] border border-[#1e1e24] p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <span className="text-[9px] font-mono text-[#e5a93b] uppercase tracking-widest font-black">MODULE: CATALOG_OP</span>
                    <h2 className="text-xl font-black text-white mt-1">B2B Catalog Management</h2>
                    <p className="text-xs text-gray-400 mt-1 max-w-xl">
                      Control institutional visibility, categorize bulk inventory modules, and configure pre-packaged secondary lab bundles.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 border border-gray-600 hover:border-white hover:bg-white/5 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-2">
                      <Download size={14} />
                      <span>Export Catalog</span>
                    </button>
                    <button className="px-4 py-2 bg-[#e5a93b] hover:bg-[#c9922f] text-black font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-2">
                      <CheckCircle size={14} />
                      <span>Publish Changes</span>
                    </button>
                  </div>
                </div>

                {/* Global Catalog Visibility Controller Toggle */}
                <div className="bg-[#0c0c0e] border border-[#1e1e24] p-5 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Global Inventory Visibility</h3>
                    <p className="text-xs text-gray-500">
                      Toggle product availability master control for all B2B institutional client accounts.
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => setGlobalB2BEnabled(!globalB2BEnabled)}
                    className={`w-14 h-7 rounded-full p-1 transition-all duration-300 ${
                      globalB2BEnabled ? "bg-[#e5a93b]" : "bg-[#1b1b1f] border border-gray-800"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-all shadow ${
                      globalB2BEnabled ? "translate-x-7" : "translate-x-0"
                    }`}></div>
                  </button>
                </div>

                {/* Product Inventory Table List */}
                <div className="bg-[#0c0c0e] border border-[#1e1e24] rounded-xl overflow-hidden">
                  <div className="p-5 border-b border-[#1e1e24] flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest">B2B Core Inventory</h3>
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input 
                        type="text" 
                        placeholder="Filter scientific products..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-[#050506] border border-[#1e1e24] rounded pl-8 pr-4 py-1.5 text-xs text-white outline-none focus:border-[#e5a93b]/40 w-64"
                      />
                    </div>
                  </div>

                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-[#08080a] text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#1e1e24]">
                      <tr>
                        <th className="p-4 pl-6">SKU</th>
                        <th className="p-4">Item Description</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Base Price (B2B)</th>
                        <th className="p-4">Stock Level</th>
                        <th className="p-4 text-center pr-6">Institutional Vis.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e1e24]">
                      {products
                        .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((p) => (
                          <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 pl-6 font-mono font-bold text-[#e5a93b]">{p.sku || `KE-SKU-${p.id.toUpperCase()}`}</td>
                            <td className="p-4">
                              <div>
                                <span className="font-bold text-white">{p.title}</span>
                                <div className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{p.description}</div>
                              </div>
                            </td>
                            <td className="p-4 font-mono font-semibold uppercase">{p.category || "Unassigned"}</td>
                            <td className="p-4 font-mono font-bold text-white">
                              ₹{(p.bulkPrice || p.price * 0.85).toLocaleString("en-IN")}
                            </td>
                            <td className="p-4">
                              {p.stock > 0 ? (
                                <div className="flex items-center gap-1.5 text-green-400 font-bold">
                                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                  <span>{p.stock} units</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-red-400 font-bold">
                                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-ping"></span>
                                  <span>0 units</span>
                                </div>
                              )}
                            </td>
                            <td className="p-4 text-center pr-6">
                              <button 
                                onClick={() => toggleVisibility(p.id)}
                                className={`w-9 h-5 rounded-full p-0.5 inline-flex transition-all duration-300 ${
                                  p.isB2BVisible ? "bg-[#e5a93b]" : "bg-[#1b1b1f] border border-gray-800"
                                }`}
                              >
                                <div className={`w-4 h-4 rounded-full bg-white transition-all shadow ${
                                  p.isB2BVisible ? "translate-x-4" : "translate-x-0"
                                }`}></div>
                              </button>
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Custom Categorization workbench & package builder */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  
                  {/* Categorization tool workbench */}
                  <div className="xl:col-span-2 bg-[#0c0c0e] border border-[#1e1e24] rounded-xl p-6">
                    <div className="border-b border-[#1e1e24] pb-4 mb-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">Categorization Workbench</h3>
                      <p className="text-[10px] text-gray-500 mt-1">Assign uncategorized lab materials to specific course modules with single-click precision.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* Uncategorized items bucket */}
                      <div className="bg-[#050506] border border-[#1e1e24] rounded-lg p-3 flex flex-col">
                        <div className="text-[9px] font-mono text-[#e5a93b] font-bold uppercase tracking-widest border-b border-[#1e1e24] pb-2 mb-3">
                          Uncategorized Items ({uncategorizedItems.length})
                        </div>

                        <div className="space-y-2 flex-1 overflow-y-auto max-h-[220px] scrollbar-hide">
                          {uncategorizedItems.length === 0 ? (
                            <div className="text-[10px] text-gray-600 text-center py-10">All items assigned.</div>
                          ) : (
                            uncategorizedItems.map(item => (
                              <div key={item.id} className="bg-[#0c0c0e] border border-white/5 p-2.5 rounded hover:border-[#e5a93b]/30 transition-all flex flex-col justify-between gap-2">
                                <div>
                                  <div className="text-[10.5px] font-bold text-white line-clamp-1">{item.title}</div>
                                  <div className="text-[8.5px] font-mono text-gray-500 mt-0.5">SKU: {item.sku}</div>
                                </div>
                                <div className="flex gap-1 justify-end border-t border-white/5 pt-1.5">
                                  <button 
                                    onClick={() => moveToModule(item.id, "science")}
                                    className="p-1 bg-[#1b1b1f] border border-gray-800 hover:border-[#e5a93b] rounded text-[8.5px] text-[#e5a93b] hover:text-[#e5a93b] transition-all flex items-center gap-0.5 font-mono"
                                    title="Move to Life Sciences"
                                  >
                                    <span>SCI</span>
                                    <ArrowRight size={10} />
                                  </button>
                                  <button 
                                    onClick={() => moveToModule(item.id, "chemistry")}
                                    className="p-1 bg-[#1b1b1f] border border-gray-800 hover:border-[#e5a93b] rounded text-[8.5px] text-[#e5a93b] hover:text-[#e5a93b] transition-all flex items-center gap-0.5 font-mono"
                                    title="Move to Chemistry Basics"
                                  >
                                    <span>CHEM</span>
                                    <ArrowRight size={10} />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Destination 1: Life Sciences */}
                      <div className="bg-[#050506] border border-[#1e1e24] rounded-lg p-3 flex flex-col relative">
                        <div className="text-[9px] font-mono text-gray-400 font-bold uppercase tracking-widest border-b border-[#1e1e24] pb-2 mb-3 flex items-center justify-between">
                          <span>Life Sciences Module</span>
                          <span className="px-1.5 py-0.5 bg-[#1b1b1f] rounded text-[7px] text-[#e5a93b] font-mono font-bold">COURSE DECK</span>
                        </div>

                        <div className="space-y-2 flex-1 overflow-y-auto max-h-[220px] scrollbar-hide">
                          {lifeSciencesModule.length === 0 ? (
                            <div className="text-[9.5px] text-gray-700 text-center py-12 italic border border-dashed border-[#1e1e24] rounded">
                              Click items on the left to assign
                            </div>
                          ) : (
                            lifeSciencesModule.map(item => (
                              <div key={item.id} className="bg-[#0c0c0e] border border-[#e5a93b]/20 p-2.5 rounded flex justify-between items-center group">
                                <div className="max-w-[70%]">
                                  <div className="text-[10px] font-bold text-[#e5a93b] truncate">{item.title}</div>
                                  <div className="text-[8px] font-mono text-gray-500">{item.sku}</div>
                                </div>
                                <button 
                                  onClick={() => moveToModule(item.id, "uncategorized")}
                                  className="p-1 bg-red-950/20 hover:bg-red-900/30 text-red-400 rounded text-[9px] border border-red-500/10 transition-all font-mono"
                                  title="Unassign"
                                >
                                  REMOVE
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Destination 2: Chemistry Basics */}
                      <div className="bg-[#050506] border border-[#1e1e24] rounded-lg p-3 flex flex-col relative">
                        <div className="text-[9px] font-mono text-gray-400 font-bold uppercase tracking-widest border-b border-[#1e1e24] pb-2 mb-3 flex items-center justify-between">
                          <span>Chemistry Basics</span>
                          <span className="px-1.5 py-0.5 bg-[#1b1b1f] rounded text-[7px] text-[#e5a93b] font-mono font-bold font-black">LAB ASSORTED</span>
                        </div>

                        <div className="space-y-2 flex-1 overflow-y-auto max-h-[220px] scrollbar-hide">
                          {chemistryBasicsModule.length === 0 ? (
                            <div className="text-[9.5px] text-gray-700 text-center py-12 italic border border-dashed border-[#1e1e24] rounded">
                              Click items on the left to assign
                            </div>
                          ) : (
                            chemistryBasicsModule.map(item => (
                              <div key={item.id} className="bg-[#0c0c0e] border border-[#e5a93b]/20 p-2.5 rounded flex justify-between items-center group">
                                <div className="max-w-[70%]">
                                  <div className="text-[10px] font-bold text-[#e5a93b] truncate">{item.title}</div>
                                  <div className="text-[8px] font-mono text-gray-500">{item.sku}</div>
                                </div>
                                <button 
                                  onClick={() => moveToModule(item.id, "uncategorized")}
                                  className="p-1 bg-red-950/20 hover:bg-red-900/30 text-red-400 rounded text-[9px] border border-red-500/10 transition-all font-mono"
                                  title="Unassign"
                                >
                                  REMOVE
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Package Builder Widget */}
                  <div className="bg-[#0c0c0e] border border-[#1e1e24] rounded-xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="border-b border-[#1e1e24] pb-4 mb-4">
                        <span className="text-[8px] font-mono text-[#e5a93b] uppercase">PRE-CONFIGURED BUNDLE</span>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white mt-0.5">Package Builder</h3>
                        <p className="text-[9.5px] text-gray-500 mt-1 leading-relaxed">
                          Assemble multiple pieces of scientific equipment into unified course kits with dedicated pricing profiles.
                        </p>
                      </div>

                      {/* Package Card Details */}
                      <div className="bg-[#050506] border border-[#1e1e24] p-4 rounded-lg space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8px] font-mono bg-[#161619] border border-[#1e1e24] text-gray-400 px-2 py-0.5 rounded tracking-wide uppercase">
                              CATALOG SKU: KE-PKG-SEC2
                            </span>
                            <h4 className="text-xs font-bold text-white mt-1.5 uppercase">Secondary School Lab Package</h4>
                          </div>
                          <button className="px-2 py-1 border border-[#e5a93b]/30 hover:border-[#e5a93b] text-[#e5a93b] rounded text-[8px] font-bold tracking-widest font-mono">
                            EDIT COMPONENTS
                          </button>
                        </div>

                        {/* Components count & Pricing details */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-[#0c0c0e] p-2.5 rounded border border-white/5">
                            <div className="text-[7.5px] font-mono text-gray-500 uppercase">COMPONENTS</div>
                            <div className="text-xs font-black font-mono text-white mt-0.5">42 ITEMS</div>
                          </div>
                          <div className="bg-[#0c0c0e] p-2.5 rounded border border-white/5">
                            <div className="text-[7.5px] font-mono text-gray-500 uppercase">BASE PRICE</div>
                            <div className="text-xs font-black font-mono text-white mt-0.5">₹3.7 Lakh</div>
                          </div>
                          <div className="bg-[#0c0c0e] p-2.5 rounded border border-white/5">
                            <div className="text-[7.5px] font-mono text-gray-500 uppercase">STOCK STATUS</div>
                            <div className="text-[10px] font-mono font-bold text-green-400 mt-0.5 tracking-wide">● READY</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Active toggle */}
                    <div className="flex items-center justify-between border-t border-[#1e1e24] pt-4 mt-6">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-gray-400">PACKAGE ACTIVE STATUS</span>
                      </div>
                      
                      <button 
                        onClick={() => setPackageActive(!packageActive)}
                        className={`w-10 h-6 rounded-full p-0.5 transition-all duration-300 ${
                          packageActive ? "bg-[#e5a93b]" : "bg-[#1b1b1f] border border-gray-800"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-all shadow ${
                          packageActive ? "translate-x-4" : "translate-x-0"
                        }`}></div>
                      </button>
                    </div>

                  </div>

                </div>
              </motion.div>
            )}

            {/* 3. PROCUREMENT INQUIRIES (CRM / LEAD MANAGEMENT VIEW) */}
            {activeTab === "inquiries" && (
              <motion.div
                key="inquiries"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 text-left"
              >
                {/* RFQ Banner Header */}
                <div className="bg-gradient-to-r from-[#0c0c0e] to-[#121217] border border-[#1e1e24] p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <span className="text-[9px] font-mono text-[#e5a93b] uppercase tracking-widest font-black font-bold">MODULE: CRM_LEADS</span>
                    <h2 className="text-xl font-black text-white mt-1">Procurement Inquiries</h2>
                    <p className="text-xs text-gray-400 mt-1 max-w-xl">
                      Manage and route incoming high-volume institutional requests. Secure quoting and margin calculation pipeline active.
                    </p>
                  </div>
                  
                  {/* Status counts */}
                  <div className="flex items-center gap-3">
                    <div className="bg-[#0c0c0e] border border-[#1e1e24] px-4 py-2 rounded flex flex-col items-center">
                      <span className="text-[7.5px] font-mono text-gray-500 uppercase">PENDING RFQS</span>
                      <span className="text-sm font-mono font-black text-[#e5a93b] mt-0.5">14</span>
                    </div>
                    <div className="bg-[#0c0c0e] border border-[#1e1e24] px-4 py-2 rounded flex flex-col items-center">
                      <span className="text-[7.5px] font-mono text-gray-500 uppercase">UNDER REVIEW</span>
                      <span className="text-sm font-mono font-black text-white mt-0.5">08</span>
                    </div>
                  </div>
                </div>

                {/* CRM Dual-Pane Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                  
                  {/* Left Side: Scrollable incoming inquiry lists */}
                  <div className="space-y-4 flex flex-col">
                    
                    {/* Inquiry Search & Filters */}
                    <div className="bg-[#0c0c0e] border border-[#1e1e24] p-4 rounded-xl space-y-3">
                      <div className="flex items-center bg-[#050506] border border-[#1e1e24] rounded px-3 py-2">
                        <Search size={13} className="text-gray-500 mr-2" />
                        <input 
                          type="text" 
                          placeholder="Search inquiries..." 
                          value={inquirySearch}
                          onChange={(e) => setInquirySearch(e.target.value)}
                          className="bg-transparent text-xs text-white outline-none w-full placeholder-gray-600 font-mono"
                        />
                      </div>
                      
                      {/* Filter pills */}
                      <div className="flex bg-[#050506] border border-[#1e1e24] rounded p-0.5">
                        {["All", "Pending", "Under Review", "Closed"].map((st) => (
                          <button
                            key={st}
                            onClick={() => setSelectedStatusFilter(st as any)}
                            className={`flex-1 text-[9px] font-mono font-black py-1.5 rounded transition-colors uppercase ${
                              selectedStatusFilter === st
                                ? "bg-[#e5a93b] text-black"
                                : "text-gray-400 hover:text-white"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Inquiry Lists Container */}
                    <div className="flex-1 overflow-y-auto max-h-[480px] space-y-3 pr-1 scrollbar-thin">
                      {filteredInquiries.length === 0 ? (
                        <div className="bg-[#0c0c0e] border border-[#1e1e24] rounded-xl p-8 text-center text-gray-500 font-mono text-xs">
                          No matching RFQs found.
                        </div>
                      ) : (
                        filteredInquiries.map((inq) => (
                          <div 
                            key={inq.id}
                            onClick={() => setSelectedInquiryId(inq.id)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer text-left relative overflow-hidden ${
                              selectedInquiryId === inq.id
                                ? "bg-[#0c0c0e] border-[#e5a93b] shadow-[0_4px_15px_rgba(229,169,59,0.1)]"
                                : "bg-[#0c0c0e] border-[#1e1e24] hover:border-gray-800"
                            }`}
                          >
                            {/* Selected tag border */}
                            {selectedInquiryId === inq.id && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#e5a93b]"></div>
                            )}

                            {/* RFQ header details */}
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[9px] font-mono text-gray-500">{inq.id}</span>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-black uppercase ${
                                inq.status === "Pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                                inq.status === "Under Review" ? "bg-blue-500/10 text-[#8bceff] border border-blue-500/20" :
                                "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                              }`}>
                                {inq.status}
                              </span>
                            </div>

                            {/* Client Name & Category */}
                            <h4 className="text-xs font-black text-white uppercase tracking-wider">{inq.clientName}</h4>
                            <div className="text-[10px] text-[#e5a93b] font-semibold mt-0.5">{inq.category}</div>
                            
                            {/* Pricing value and days ago */}
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1e1e24] text-[9.5px] font-mono text-gray-500">
                              <span className="text-white font-bold font-mono">₹{inq.value.toLocaleString("en-IN")}</span>
                              <span>{inq.daysAgo}d ago</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                  </div>

                  {/* Right Side: Detailed View panel of the selected inquiry */}
                  <div className="lg:col-span-2 bg-[#0c0c0e] border border-[#1e1e24] rounded-xl flex flex-col justify-between">
                    
                    {selectedInq ? (
                      <>
                        {/* Detail Header */}
                        <div className="p-6 border-b border-[#1e1e24] flex flex-wrap items-center justify-between gap-4 bg-[#09090b]/50">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9.5px] font-mono text-gray-500">{selectedInq.id}</span>
                              <span className="text-[9px] font-mono font-bold text-gray-400 border border-gray-800 px-2 py-0.5 rounded">
                                {selectedInq.clientTier}
                              </span>
                            </div>
                            <h3 className="text-base font-black text-white mt-1.5 uppercase tracking-wider">
                              {selectedInq.clientName}
                            </h3>
                            <div className="text-xs text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
                              <Globe size={12} className="text-gray-500" />
                              <span>{selectedInq.location}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <button className="px-4 py-2 border border-gray-600 hover:border-white text-white font-bold text-xs uppercase tracking-wider rounded transition-colors">
                              Assign Rep
                            </button>
                            
                            {selectedInq.status !== "Closed" && (
                              <button 
                                onClick={() => setIsQuoteModalOpen(true)}
                                className="px-4 py-2 bg-[#e5a93b] hover:bg-[#c9922f] text-black font-bold text-xs uppercase tracking-wider rounded transition-all shadow-[0_4px_10px_rgba(229,169,59,0.15)] flex items-center gap-1.5"
                              >
                                <DollarSign size={14} strokeWidth={2.5} />
                                <span>Generate Quote</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Detail Specifications & Text Scrollable Area */}
                        <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[350px] scrollbar-thin">
                          
                          {/* Grid procurement spec cards */}
                          <div>
                            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-3">PROCUREMENT SPECS</span>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="bg-[#050506] border border-[#1e1e24] p-3 rounded-lg">
                                <div className="text-[8px] font-mono text-gray-500 uppercase">CATEGORY</div>
                                <div className="text-[10.5px] font-bold text-white mt-1 line-clamp-1">{selectedInq.specs.productCategory}</div>
                              </div>
                              <div className="bg-[#050506] border border-[#1e1e24] p-3 rounded-lg">
                                <div className="text-[8px] font-mono text-gray-500 uppercase">ORDER VOLUME</div>
                                <div className="text-[10.5px] font-bold text-white mt-1 line-clamp-1">{selectedInq.specs.orderVol}</div>
                              </div>
                              <div className="bg-[#050506] border border-[#1e1e24] p-3 rounded-lg">
                                <div className="text-[8px] font-mono text-gray-500 uppercase">SPECS DETAILS</div>
                                <div className="text-[10.5px] font-bold text-white mt-1 line-clamp-1">{selectedInq.specs.requestedSpecs}</div>
                              </div>
                              <div className="bg-[#050506] border border-[#1e1e24] p-3 rounded-lg">
                                <div className="text-[8px] font-mono text-gray-500 uppercase">TARGET DELIVERY</div>
                                <div className="text-[10.5px] font-bold text-white mt-1 line-clamp-1 font-mono text-[#e5a93b]">{selectedInq.targetDelivery}</div>
                              </div>
                            </div>
                          </div>

                          {/* Original RFP Inquiry text */}
                          <div>
                            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-3">ORIGINAL INQUIRY TEXT</span>
                            <div className="bg-[#050506] border border-[#1e1e24] rounded-lg p-5 relative">
                              <span className="absolute right-4 top-3 text-[#e5a93b]/20 font-black text-6xl pointer-events-none select-none font-serif">“</span>
                              <p className="text-[11.5px] text-gray-300 font-mono leading-relaxed whitespace-pre-line text-left">
                                {selectedInq.originalText}
                              </p>
                            </div>
                          </div>

                        </div>

                        {/* Interactive internal operational notes log */}
                        <div className="p-6 border-t border-[#1e1e24] bg-[#09090b]/30 space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="block text-[9.5px] font-mono text-gray-400 uppercase tracking-wider">
                              Internal Operational Notes
                            </label>
                            <button 
                              onClick={handleSaveNotes}
                              className="px-3 py-1 bg-[#161619] border border-gray-800 hover:border-[#e5a93b] text-gray-300 hover:text-white rounded text-[9.5px] font-bold uppercase tracking-wider transition-all"
                            >
                              Save Notes
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            placeholder="Add operational notes here..."
                            value={currentNotes}
                            onChange={(e) => setCurrentNotes(e.target.value)}
                            className="w-full bg-[#050506] border border-[#1e1e24] focus:border-[#e5a93b]/30 rounded p-3 text-xs text-white outline-none resize-none placeholder-gray-700"
                          ></textarea>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-gray-600 font-mono text-xs">
                        Select an institutional inquiry from the list.
                      </div>
                    )}

                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </main>
      </div>

      {/* 4. MARGIN CALCULATION QUOTE BUILDER MODAL */}
      <AnimatePresence>
        {isQuoteModalOpen && selectedInq && (
          <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0c0c0e] border border-[#1e1e24] rounded-xl p-6 w-full max-w-[550px] shadow-2xl relative text-left"
            >
              
              {/* Close Button */}
              <button 
                onClick={() => setIsQuoteModalOpen(false)} 
                className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors"
                disabled={quoteExporting}
              >
                ✕
              </button>

              {/* Modal Title */}
              <div className="border-b border-[#1e1e24] pb-4 mb-6">
                <span className="text-[8px] font-mono text-[#e5a93b] border border-[#e5a93b]/30 px-2 py-0.5 rounded bg-[#e5a93b]/5 uppercase tracking-widest font-black">
                  GENERATIVE QUOTE BUILDER
                </span>
                <h3 className="text-lg font-black text-white mt-2 uppercase tracking-wide">
                  Generate Quote for Sourcing
                </h3>
                <div className="text-[10px] text-gray-500 font-mono mt-0.5">Inquiry ID: {selectedInq.id} ({selectedInq.clientName})</div>
              </div>

              {/* Automated Margin calculations display */}
              <div className="space-y-4">
                
                <div className="bg-[#050506] border border-[#1e1e24] p-4 rounded-lg space-y-2">
                  <div className="text-[9px] font-mono text-gray-500 uppercase border-b border-[#1e1e24]/60 pb-2 mb-2">
                    Automated Margin & Discount Matrix
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Base Wholesale Value</span>
                    <span className="font-mono text-white">₹{selectedInq.value.toLocaleString("en-IN")}</span>
                  </div>

                  {/* Dynamic Tier Discount calculation */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-emerald-400">Tier Sourcing Discount ({selectedInq.clientTier === "Tier 1 Client" ? "10%" : "5%"})</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      -₹{(selectedInq.value * (selectedInq.clientTier === "Tier 1 Client" ? 0.1 : 0.05)).toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Manual adjustment value */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#e5a93b]">Selected Adjustment Margin ({customMargin}%)</span>
                    <span className="font-mono text-[#e5a93b] font-bold">
                      +₹{(selectedInq.value * (customMargin / 100)).toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Proposed total calculation */}
                  <div className="flex justify-between items-center border-t border-[#1e1e24] pt-2.5 mt-2.5">
                    <span className="text-xs font-bold text-white">PROPOSED FINAL QUOTE</span>
                    <span className="text-base font-black font-mono text-[#e5a93b] tracking-wider">
                      ₹{(
                        selectedInq.value - 
                        (selectedInq.value * (selectedInq.clientTier === "Tier 1 Client" ? 0.1 : 0.05)) +
                        (selectedInq.value * (customMargin / 100))
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Adjustment slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[9.5px] font-mono text-gray-400 uppercase">
                    <span>Adjustment Margin (%)</span>
                    <span className="text-[#e5a93b] font-bold font-mono">{customMargin}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="2" 
                    max="25" 
                    value={customMargin}
                    onChange={(e) => setCustomMargin(parseInt(e.target.value))}
                    className="w-full h-1 bg-[#1b1b1f] rounded-lg appearance-none cursor-pointer accent-[#e5a93b]"
                    disabled={quoteExporting}
                  />
                  <div className="flex justify-between text-[8px] font-mono text-gray-600">
                    <span>MIN (2%)</span>
                    <span>DEF (12%)</span>
                    <span>MAX (25%)</span>
                  </div>
                </div>

                {/* Additional sourcing terms */}
                <div className="space-y-1.5">
                  <label className="block text-[9.5px] font-mono text-gray-400 uppercase">
                    Additional Sourcing Terms (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Free door-step logistics, 18% ITC credit statement, dispatch within 7 days..."
                    value={additionalTerms}
                    onChange={(e) => setAdditionalTerms(e.target.value)}
                    className="w-full bg-[#050506] border border-[#1e1e24] focus:border-[#e5a93b]/40 rounded p-2.5 text-xs text-white outline-none resize-none placeholder-gray-700"
                    disabled={quoteExporting}
                  ></textarea>
                </div>

              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 mt-6 border-t border-[#1e1e24] pt-4">
                <button 
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-white transition-colors"
                  disabled={quoteExporting}
                >
                  Cancel
                </button>
                
                <button
                  onClick={triggerQuoteGeneration}
                  className="px-5 py-2.5 bg-[#e5a93b] hover:bg-[#c9922f] text-black font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 min-w-[170px]"
                  disabled={quoteExporting}
                >
                  {quoteExporting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Computing Margins...</span>
                    </>
                  ) : quoteExportDone ? (
                    <>
                      <Check size={14} strokeWidth={2.5} />
                      <span>PDF Exported!</span>
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      <span>Export & Send Quote</span>
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
