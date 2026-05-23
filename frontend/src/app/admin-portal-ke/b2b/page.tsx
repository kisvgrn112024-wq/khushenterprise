"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  FlaskConical, 
  Shapes, 
  Users, 
  FileSpreadsheet, 
  BookOpen, 
  Settings, 
  LogOut, 
  Search, 
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
  Activity,
  AlertTriangle,
  Clock,
  Filter,
  MoreVertical,
  HelpCircle,
  TrendingUp,
  FileText,
  X,
  MapPin,
  Calendar,
  Layers3,
  ShieldAlert,
  ChevronRight
} from "lucide-react";
import { getProducts, addProduct, Product } from "@/lib/products";

// Define Interfaces
interface CustomQuotation {
  institution: string;
  department: string;
  contactName: string;
  email: string;
  phone: string;
  requirements: string;
  submittedAt: string;
  status?: string;
  id?: string;
}

interface GeneralInquiry {
  id: string;
  clientName: string;
  sector: "B2B" | "School" | "College" | "Research" | "Commercial";
  subSector?: string;
  items: string;
  value: number;
  status: "Pending" | "Under Review" | "Approved" | "Closed";
  submittedAt: string;
  contactEmail: string;
  contactPhone: string;
  message: string;
  location?: string;
}

interface ResearchAsset {
  id: string;
  name: string;
  sku: string;
  calibration: "OPTIMIZED" | "CALIBRATION REQUIRED" | "CRITICAL";
  stockLevel: number;
  location: string;
  department: string;
}

interface CommercialTest {
  id: string;
  serviceName: string;
  code: string;
  price: number;
  category: string;
  turnaround: string;
  popularity: number;
}

export default function UnifiedAdminPortal() {
  const router = useRouter();
  
  // Navigation active sector/tab: 
  // "hub", "b2b", "school", "colleges", "research", "commercial", "enquiries"
  const [activeSector, setActiveSector] = useState<string>("hub");
  
  // School Sub-Sectors: "biology", "chemistry", "physics", "general"
  const [activeSchoolTab, setActiveSchoolTab] = useState<string>("biology");

  // Global reach details state
  const [systemLoad, setSystemLoad] = useState<number>(42);
  const [activeAdmins, setActiveAdmins] = useState<number>(3);

  // Unified lists
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<GeneralInquiry[]>([]);
  const [assets, setAssets] = useState<ResearchAsset[]>([]);
  const [commercialTests, setCommercialTests] = useState<CommercialTest[]>([]);
  const [categories, setCategories] = useState<{ [key: string]: string[] }>({
    b2b: ["Heavy Equipment", "Lab Glassware", "Chemical Reagents", "Safety Gear"],
    school: ["Biochemistry Kits", "Mechanics Sets", "Optical Glass", "General STEM"],
    college: ["Spectroscopy", "Thermal Baths", "Centrifuges", "Distillation units"],
  });

  // Active Selected Inquiry for detail popup/drawer
  const [selectedInquiry, setSelectedInquiry] = useState<GeneralInquiry | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Forms state
  const [newProdName, setNewProdName] = useState("");
  const [newProdSKU, setNewProdSKU] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("");
  const [newProdMOQ, setNewProdMOQ] = useState("5");

  const [newCatName, setNewCatName] = useState("");

  // Research asset registration form state
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetSKU, setNewAssetSKU] = useState("");
  const [newAssetDept, setNewAssetDept] = useState("Biotech");
  const [newAssetStock, setNewAssetStock] = useState("10");

  // Commercial Lab Service Form
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceCode, setNewServiceCode] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceTime, setNewServiceTime] = useState("3-5 Days");

  // Telemetry fluctuation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad(prev => Math.min(Math.max(prev + Math.floor(Math.random() * 5) - 2, 30), 85));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Hydrate lists
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Fetch & Initialize Products
      const storedProds = getProducts();
      setProducts(storedProds);

      // 2. Fetch Inquiries from various localStorage schemas and merge into general list
      const b2bInquiries = JSON.parse(localStorage.getItem("ke_b2b_inquiries") || "[]");
      const customInquiries = JSON.parse(localStorage.getItem("ke_custom_quotations") || "[]");
      const bulkOrders = JSON.parse(localStorage.getItem("ke_bulk_orders") || "[]");

      const merged: GeneralInquiry[] = [];

      // Hydrate B2B Inquiries
      b2bInquiries.forEach((item: any, index: number) => {
        merged.push({
          id: item.id || `RFQ-B2B-${100 + index}`,
          clientName: item.contactName || item.legalName || "B2B Client",
          sector: "B2B",
          items: item.requestedItems ? item.requestedItems.map((i: any) => `${i.sku} (x${i.qty})`).join(", ") : item.categories?.join(", ") || "General Inquiry",
          value: item.requestedItems ? item.requestedItems.reduce((acc: number, curr: any) => acc + (curr.price || 500) * curr.qty, 0) : 45200,
          status: item.status?.includes("Approved") ? "Approved" : item.status?.includes("Closed") ? "Closed" : "Pending",
          submittedAt: item.submittedAt || new Date().toISOString(),
          contactEmail: item.email || "client@company.com",
          contactPhone: item.phone || "+91 99999 99999",
          location: item.deliveryLocation || "India",
          message: item.message || `Procurement Request for B2B. Tax ID: ${item.taxId || "N/A"}.`
        });
      });

      // Hydrate Custom Quotations
      customInquiries.forEach((item: any, index: number) => {
        merged.push({
          id: item.id || `RFQ-INST-${500 + index}`,
          clientName: item.contactName || "Academic Client",
          sector: item.department?.toLowerCase().includes("school") ? "School" : "College",
          subSector: item.department || "Lab Department",
          items: `Custom Sourcing: ${item.requirements?.substring(0, 40)}...`,
          value: 75000,
          status: item.status || "Pending",
          submittedAt: item.submittedAt || new Date().toISOString(),
          contactEmail: item.email || "academic@inst.edu",
          contactPhone: item.phone || "+91 88888 88888",
          location: item.institution || "Educational Institution",
          message: item.requirements || "Custom lab setup required."
        });
      });

      // Add static dummy fallback inquiries if list is empty
      if (merged.length === 0) {
        const dummy: GeneralInquiry[] = [
          {
            id: "RFQ-SCH-902",
            clientName: "Dr. Arpan Mehta",
            sector: "School",
            subSector: "Chemistry Lab",
            items: "15x Spectrometer V4, 50x Glassware Sets",
            value: 84200,
            status: "Pending",
            submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
            contactEmail: "a.mehta@xavier.edu",
            contactPhone: "+91 97294 57762",
            location: "St. Xavier Research Wing",
            message: "Require high-grade chemical glassware and digital testing models."
          },
          {
            id: "RFQ-COL-905",
            clientName: "Dean Sarah Jenkins",
            sector: "College",
            subSector: "Biochemistry",
            items: "5x Cryo-Storage Units, 2x Autoclaves",
            value: 142500,
            status: "Under Review",
            submittedAt: new Date(Date.now() - 3600000 * 26).toISOString(),
            contactEmail: "jenkins.s@biogen-solutions.org",
            contactPhone: "+91 98900 11762",
            location: "BioGen Solutions Ltd",
            message: "Sourcing temperature control laboratory chambers."
          },
          {
            id: "RFQ-RES-401",
            clientName: "Dr. Rajesh Kumar",
            sector: "Research",
            items: "1x High-Resolution Electron Microscope X-9",
            value: 285000,
            status: "Approved",
            submittedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
            contactEmail: "r.kumar@aiims.gov.in",
            contactPhone: "+91 97294 57762",
            location: "National AIIMS Hospital",
            message: "Procuring microscope assembly setup."
          },
          {
            id: "RFQ-COM-101",
            clientName: "Pooja Hegde (Lab Director)",
            sector: "Commercial",
            items: "Commercial soil and nutrient profile evaluation",
            value: 12000,
            status: "Pending",
            submittedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
            contactEmail: "pooja.h@soiltestinglabs.co.in",
            contactPhone: "+91 96541 23654",
            location: "Agro Soil Care Labs",
            message: "Need regular heavy metal testing kits."
          }
        ];
        localStorage.setItem("ke_b2b_inquiries", JSON.stringify(dummy));
        setInquiries(dummy);
      } else {
        setInquiries(merged);
      }

      // Initialize Research Assets
      const storedAssets = JSON.parse(localStorage.getItem("ke_research_assets") || "[]");
      if (storedAssets.length === 0) {
        const defaultAssets: ResearchAsset[] = [
          { id: "AST-821", name: "Electron Microscope X-9", sku: "KE-EM-X9", calibration: "OPTIMIZED", stockLevel: 94, location: "Bldg-A4 / SP1", department: "Biotech" },
          { id: "AST-842", name: "Nano Spectrometer V2", sku: "KE-NS-V2", calibration: "CALIBRATION REQUIRED", stockLevel: 25, location: "Bldg-C1 / RM3", department: "Chemical" },
          { id: "AST-905", name: "Centrifuge ProSpin S", sku: "KE-CEN-PS", calibration: "OPTIMIZED", stockLevel: 89, location: "Bldg-B2 / SP14", department: "Physics" },
          { id: "AST-104", name: "Liquid Chromatograph Pro", sku: "KE-LC-PRO", calibration: "CRITICAL", stockLevel: 12, location: "Bldg-D4 / LAB2", department: "Biotech" }
        ];
        localStorage.setItem("ke_research_assets", JSON.stringify(defaultAssets));
        setAssets(defaultAssets);
      } else {
        setAssets(storedAssets);
      }

      // Initialize Commercial Services Catalog
      const storedServices = JSON.parse(localStorage.getItem("ke_commercial_services") || "[]");
      if (storedServices.length === 0) {
        const defaultServices: CommercialTest[] = [
          { id: "SVC-001", serviceName: "Water Quality & Heavy Metals Test", code: "KE-TST-H2O", price: 4500, category: "Environmental Analysis", turnaround: "3-5 Days", popularity: 94 },
          { id: "SVC-002", serviceName: "Soil Chemical Composition Analysis", code: "KE-TST-SOIL", price: 6200, category: "Agriculture Testing", turnaround: "5-7 Days", popularity: 82 },
          { id: "SVC-003", serviceName: "Unknown Compound Gas Chromatography", code: "KE-TST-GCMS", price: 12500, category: "Chemical Identification", turnaround: "2-3 Days", popularity: 75 },
          { id: "SVC-004", serviceName: "Biological Micro-Pathogen Screening", code: "KE-TST-PATH", price: 8900, category: "Biotech Bio-Safety", turnaround: "24-48 Hours", popularity: 61 }
        ];
        localStorage.setItem("ke_commercial_services", JSON.stringify(defaultServices));
        setCommercialTests(defaultServices);
      } else {
        setCommercialTests(storedServices);
      }
    }
  }, [activeSector]);

  // Product addition handler
  const handleAddProduct = (sector: string, subSec?: string) => {
    if (!newProdName || !newProdPrice || !newProdSKU) {
      alert("Please fill in Product Name, SKU, and Price.");
      return;
    }

    const priceNum = parseFloat(newProdPrice);
    if (isNaN(priceNum)) {
      alert("Please provide a valid price number.");
      return;
    }

    // Determine category key
    const targetCat = newProdCategory || (sector === "school" ? "Biochemistry Kits" : sector === "college" ? "Spectroscopy" : "Lab Equipment");

    const newProd: Product = {
      id: `prod_${Date.now()}`,
      title: newProdName,
      description: `Premium lab selection tailored for ${sector} ${subSec || ""} laboratories. High-durability component structure.`,
      price: priceNum,
      originalPrice: priceNum * 1.2,
      rating: 4.8,
      reviews: 5,
      icon: sector === "school" ? "FlaskConical" : "Scale",
      tag: "NEW",
      discount: "15% OFF",
      stock: 50,
      moq: parseInt(newProdMOQ) || 5,
      bulkPrice: priceNum * 0.85,
      product_status: "active",
      edited_by_admin: true,
      isB2BVisible: true,
      b2bCategory: targetCat
    };

    // Save using standard product update script
    addProduct(newProd);

    // Refresh state
    setProducts(getProducts());

    // Reset fields
    setNewProdName("");
    setNewProdSKU("");
    setNewProdPrice("");
    setNewProdCategory("");
    alert(`Successfully added "${newProdName}" to the active catalog!`);
  };

  // Add Category Handler
  const handleAddCategory = (sector: string) => {
    if (!newCatName) return;
    setCategories(prev => {
      const current = prev[sector] || [];
      if (current.includes(newCatName)) return prev;
      return {
        ...prev,
        [sector]: [...current, newCatName]
      };
    });
    setNewCatName("");
    alert(`Category "${newCatName}" added successfully.`);
  };

  // Register Research Asset Handler
  const handleRegisterAsset = () => {
    if (!newAssetName || !newAssetSKU) {
      alert("Please fill in Asset Name and SKU ID.");
      return;
    }

    const newAst: ResearchAsset = {
      id: `AST-${Math.floor(Math.random() * 900) + 100}`,
      name: newAssetName,
      sku: newAssetSKU,
      calibration: "OPTIMIZED",
      stockLevel: parseInt(newAssetStock) || 10,
      location: `Bldg-${newAssetDept === "Biotech" ? "A4" : newAssetDept === "Chemical" ? "C1" : "B2"} / LAB`,
      department: newAssetDept
    };

    const updated = [newAst, ...assets];
    setAssets(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("ke_research_assets", JSON.stringify(updated));
    }

    setNewAssetName("");
    setNewAssetSKU("");
    alert(`Asset "${newAssetName}" registered successfully!`);
  };

  // Add Commercial Test Handler
  const handleAddCommercialTest = () => {
    if (!newServiceName || !newServicePrice || !newServiceCode) {
      alert("Please provide Service Name, Code, and Price.");
      return;
    }

    const priceNum = parseFloat(newServicePrice);
    if (isNaN(priceNum)) {
      alert("Invalid price.");
      return;
    }

    const newSvc: CommercialTest = {
      id: `SVC-${Math.floor(Math.random() * 900) + 100}`,
      serviceName: newServiceName,
      code: newServiceCode,
      price: priceNum,
      category: "Custom Analysis",
      turnaround: newServiceTime,
      popularity: 50
    };

    const updated = [newSvc, ...commercialTests];
    setCommercialTests(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("ke_commercial_services", JSON.stringify(updated));
    }

    setNewServiceName("");
    setNewServiceCode("");
    setNewServicePrice("");
    alert(`Commercial test service "${newServiceName}" created!`);
  };

  // Update enquiry status
  const handleInquiryStatusChange = (id: string, newStatus: "Pending" | "Under Review" | "Approved" | "Closed") => {
    const updated = inquiries.map(inq => {
      if (inq.id === id) {
        return { ...inq, status: newStatus };
      }
      return inq;
    });
    setInquiries(updated);

    // Save back to localStorage
    if (typeof window !== "undefined") {
      // Find which store it belongs to
      if (id.startsWith("RFQ-B2B-") || id.startsWith("B2B-RFQ-")) {
        const stored = JSON.parse(localStorage.getItem("ke_b2b_inquiries") || "[]");
        const idx = stored.findIndex((x: any, i: number) => (x.id === id || `RFQ-B2B-${100 + i}` === id));
        if (idx !== -1) {
          stored[idx].status = newStatus === "Approved" ? "Approved Bid Quote" : newStatus;
          localStorage.setItem("ke_b2b_inquiries", JSON.stringify(stored));
        }
      } else {
        const storedCustom = JSON.parse(localStorage.getItem("ke_custom_quotations") || "[]");
        const idx = storedCustom.findIndex((x: any, i: number) => (x.id === id || `RFQ-INST-${500 + i}` === id));
        if (idx !== -1) {
          storedCustom[idx].status = newStatus;
          localStorage.setItem("ke_custom_quotations", JSON.stringify(storedCustom));
        }
      }

      // Sync into bulk orders
      const bulk = JSON.parse(localStorage.getItem("ke_bulk_orders") || "[]");
      const bIdx = bulk.findIndex((x: any) => x.id === id);
      if (bIdx !== -1) {
        bulk[bIdx].status = newStatus;
        localStorage.setItem("ke_bulk_orders", JSON.stringify(bulk));
      }
    }

    // Update details modal if open
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  // Construct WhatsApp Follow-up message
  const triggerWhatsAppFollowUp = (inq: GeneralInquiry) => {
    const text = `Hello ${inq.clientName},\n\nThis is Khush Enterprises following up on your procurement request (${inq.id}) submitted on our portal:\n- Sourcing requirements: ${inq.items}\n- Current Status: ${inq.status}\n\nOur team is drafting the formal quotation. Do you have any specific regulatory or shipping requests?`;
    const url = `https://wa.me/919729457762?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // Filtered inquiries list for the general Enquiry page
  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = inq.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inq.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (inq.location && inq.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "All" || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-theme text-theme font-sans overflow-hidden">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-theme border-r border-theme/60 flex flex-col z-20 shrink-0">
        
        {/* Brand Profile Banner */}
        <div className="p-6 border-b border-theme/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-theme/10 border border-theme/30 flex items-center justify-center text-[#e5a93b] font-black text-lg">
            KE
          </div>
          <div>
            <div className="text-theme font-extrabold text-xs uppercase tracking-wider">Industrial Suite</div>
            <div className="text-[#e5a93b] text-[9px] font-mono tracking-widest font-black uppercase mt-0.5">Admin Control</div>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          
          <div className="px-3 pb-2">
            <span className="text-[9px] font-mono font-bold text-theme uppercase tracking-widest">Enterprise Hub</span>
          </div>

          <button
            onClick={() => setActiveSector("hub")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all relative ${
              activeSector === "hub"
                ? "text-theme bg-theme font-extrabold shadow-[0_0_15px_rgba(229,169,59,0.25)]"
                : "text-theme hover:text-theme hover:bg-theme/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard size={15} strokeWidth={2.5} />
              <span>Procurement Hub</span>
            </div>
            {activeSector === "hub" && <div className="w-1.5 h-1.5 rounded-full bg-theme"></div>}
          </button>

          <button
            onClick={() => setActiveSector("b2b")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all relative ${
              activeSector === "b2b"
                ? "text-theme bg-theme font-extrabold shadow-[0_0_15px_rgba(229,169,59,0.25)]"
                : "text-theme hover:text-theme hover:bg-theme/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <Package size={15} strokeWidth={2.5} />
              <span>B2B Suite</span>
            </div>
            {activeSector === "b2b" && <div className="w-1.5 h-1.5 rounded-full bg-theme"></div>}
          </button>

          <div className="px-3 pt-5 pb-2">
            <span className="text-[9px] font-mono font-bold text-theme uppercase tracking-widest">Institutional</span>
          </div>

          <button
            onClick={() => setActiveSector("school")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all relative ${
              activeSector === "school"
                ? "text-theme bg-theme font-extrabold shadow-[0_0_15px_rgba(229,169,59,0.25)]"
                : "text-theme hover:text-theme hover:bg-theme/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <FlaskConical size={15} strokeWidth={2.5} />
              <span>School Center</span>
            </div>
            {activeSector === "school" && <div className="w-1.5 h-1.5 rounded-full bg-theme"></div>}
          </button>

          <button
            onClick={() => setActiveSector("colleges")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all relative ${
              activeSector === "colleges"
                ? "text-theme bg-theme font-extrabold shadow-[0_0_15px_rgba(229,169,59,0.25)]"
                : "text-theme hover:text-theme hover:bg-theme/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen size={15} strokeWidth={2.5} />
              <span>Colleges Sector</span>
            </div>
            {activeSector === "colleges" && <div className="w-1.5 h-1.5 rounded-full bg-theme"></div>}
          </button>

          <button
            onClick={() => setActiveSector("research")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all relative ${
              activeSector === "research"
                ? "text-theme bg-theme font-extrabold shadow-[0_0_15px_rgba(229,169,59,0.25)]"
                : "text-theme hover:text-theme hover:bg-theme/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <Sliders size={15} strokeWidth={2.5} />
              <span>Research Labs</span>
            </div>
            {activeSector === "research" && <div className="w-1.5 h-1.5 rounded-full bg-theme"></div>}
          </button>

          <div className="px-3 pt-5 pb-2">
            <span className="text-[9px] font-mono font-bold text-theme uppercase tracking-widest">Commercial & Leads</span>
          </div>

          <button
            onClick={() => setActiveSector("commercial")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all relative ${
              activeSector === "commercial"
                ? "text-theme bg-theme font-extrabold shadow-[0_0_15px_rgba(229,169,59,0.25)]"
                : "text-theme hover:text-theme hover:bg-theme/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <DollarSign size={15} strokeWidth={2.5} />
              <span>Commercial Labs</span>
            </div>
            {activeSector === "commercial" && <div className="w-1.5 h-1.5 rounded-full bg-theme"></div>}
          </button>

          <button
            onClick={() => setActiveSector("enquiries")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded text-xs font-bold uppercase tracking-wider transition-all relative ${
              activeSector === "enquiries"
                ? "text-theme bg-theme font-extrabold shadow-[0_0_15px_rgba(229,169,59,0.25)]"
                : "text-theme hover:text-theme hover:bg-theme/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <FileSpreadsheet size={15} strokeWidth={2.5} />
              <span>Enquiry Center</span>
            </div>
            {activeSector === "enquiries" && <div className="w-1.5 h-1.5 rounded-full bg-theme"></div>}
          </button>

        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-theme/40 space-y-2">
          <Link
            href="/admin-portal-ke"
            className="w-full py-2.5 bg-theme hover:bg-theme border border-theme hover:border-theme/40 text-theme hover:text-[#e5a93b] rounded text-[11px] font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
          >
            <ArrowRight size={13} />
            <span>Main Dashboard</span>
          </Link>
        </div>
      </aside>

      {/* 2. MAIN CONTENT WRAPPER */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-theme relative">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-theme/40 flex items-center justify-between px-8 bg-theme shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-black text-theme uppercase tracking-wider">
              {activeSector === "hub" && "Institutional Procurement Hub"}
              {activeSector === "b2b" && "B2B Procurement Suite"}
              {activeSector === "school" && `School Solutions Manager - ${activeSchoolTab.toUpperCase()} DIVISION`}
              {activeSector === "colleges" && "Colleges & Academic Suite"}
              {activeSector === "research" && "Advanced Research Inventory"}
              {activeSector === "commercial" && "Commercial Labs Sourcing Dashboard"}
              {activeSector === "enquiries" && "Unified Sourcing Inquiry Center"}
            </h1>
            <span className="text-[10px] bg-theme border border-theme/20 px-2 py-0.5 rounded text-theme font-mono">
              SYSTEM STATUS: OPTIMIZED
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-theme font-mono">Telemetry Active: {systemLoad}% Load</span>
            </div>
            <div className="w-px h-4 bg-theme"></div>
            <div className="text-theme font-mono">
              HELPLINE CONTACT: <span className="text-theme font-bold">+91 97294 57762</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 p-8">
          
          {/* ==================== A. PROCUREMENT HUB OVERVIEW ==================== */}
          {activeSector === "hub" && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Central Map / Telemetry Graph Banner */}
              <div className="bg-theme border border-theme/50 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-theme/5 rounded-full filter blur-3xl pointer-events-none"></div>
                <div className="space-y-4 max-w-xl relative z-10">
                  <span className="text-[10px] font-mono text-[#e5a93b] font-black uppercase tracking-widest border border-theme/20 px-2.5 py-1 rounded">
                    Global Sourcing Registry
                  </span>
                  <h2 className="text-3xl font-black text-theme tracking-wide">
                    Operational Procurement Network
                  </h2>
                  <p className="text-theme text-sm leading-relaxed">
                    Khush Enterprises bridges STEM educational laboratories, colleges, and enterprise-grade advanced research laboratories. Manage custom quotes, product inventory, and active tenders locally.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-6 pt-4">
                    <div>
                      <div className="text-2xl font-black text-theme">5,400+</div>
                      <div className="text-[10px] text-theme uppercase font-mono tracking-wider mt-1">Catalog SKUs</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-[#e5a93b]">248</div>
                      <div className="text-[10px] text-theme uppercase font-mono tracking-wider mt-1">Pending Inquiries</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-theme">42</div>
                      <div className="text-[10px] text-theme uppercase font-mono tracking-wider mt-1">Global Tenders</div>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-80 bg-theme border border-theme p-6 rounded-lg relative z-10 shrink-0 space-y-4">
                  <div className="text-xs font-bold text-theme uppercase tracking-wider">Procurement Quick Actions</div>
                  
                  <button 
                    onClick={() => setActiveSector("enquiries")}
                    className="w-full flex items-center justify-between p-3 bg-theme hover:bg-theme border border-theme hover:border-theme/30 rounded text-xs transition-all"
                  >
                    <span>Inspect Received Tenders</span>
                    <ChevronRight size={14} className="text-[#e5a93b]" />
                  </button>

                  <button 
                    onClick={() => setActiveSector("research")}
                    className="w-full flex items-center justify-between p-3 bg-theme hover:bg-theme border border-theme hover:border-theme/30 rounded text-xs transition-all"
                  >
                    <span>Access Research Inventory</span>
                    <ChevronRight size={14} className="text-[#e5a93b]" />
                  </button>

                  <button 
                    onClick={() => setActiveSector("commercial")}
                    className="w-full flex items-center justify-between p-3 bg-theme hover:bg-theme border border-theme hover:border-theme/30 rounded text-xs transition-all"
                  >
                    <span>Launch Test Monetizer</span>
                    <ChevronRight size={14} className="text-[#e5a93b]" />
                  </button>
                </div>
              </div>

              {/* Sector Quick Shortcuts Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-theme border border-theme/30 p-6 rounded-xl space-y-4 hover:border-theme/30 transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded bg-theme/10 flex items-center justify-center text-[#e5a93b]"><FlaskConical size={18} /></div>
                    <h3 className="text-lg font-bold text-theme">School Laboratory Solutions</h3>
                    <p className="text-xs text-theme leading-relaxed">
                      STEM Starter kits, Biology dissection utilities, chemical reactants, and basic mechanics kits optimized for secondary educational standards.
                    </p>
                  </div>
                  <button 
                    onClick={() => { setActiveSector("school"); setActiveSchoolTab("biology"); }}
                    className="text-xs font-bold text-[#e5a93b] flex items-center gap-1.5 pt-4 hover:underline"
                  >
                    <span>EXPLORE SECTOR</span> <ArrowRight size={12} />
                  </button>
                </div>

                <div className="bg-theme border border-theme/30 p-6 rounded-xl space-y-4 hover:border-theme/30 transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded bg-theme/10 flex items-center justify-center text-[#8bceff]"><BookOpen size={18} /></div>
                    <h3 className="text-lg font-bold text-theme">Academic & University Packages</h3>
                    <p className="text-xs text-theme leading-relaxed">
                      High-precision instrumentation and modular lab suites tailored for tertiary institutions, chemistry labs, and advanced physics setups.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveSector("colleges")}
                    className="text-xs font-bold text-[#8bceff] flex items-center gap-1.5 pt-4 hover:underline"
                  >
                    <span>VIEW MODULES</span> <ArrowRight size={12} />
                  </button>
                </div>

                <div className="bg-theme border border-theme/30 p-6 rounded-xl space-y-4 hover:border-theme/30 transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded bg-green-500/10 flex items-center justify-center text-green-400"><Sliders size={18} /></div>
                    <h3 className="text-lg font-bold text-theme">Advanced Research Centers</h3>
                    <p className="text-xs text-theme leading-relaxed">
                      Highly specialized testing equipment, environmental measurement systems, and analytics machinery for commercial labs and research foundations.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveSector("research")}
                    className="text-xs font-bold text-green-400 flex items-center gap-1.5 pt-4 hover:underline"
                  >
                    <span>INSPECT REGISTRY</span> <ArrowRight size={12} />
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* ==================== B. B2B SUITE ==================== */}
          {activeSector === "b2b" && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Stat Telemetry cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-theme border border-theme/30 p-5 rounded-lg">
                  <div className="text-[10px] font-mono text-theme uppercase tracking-widest">Active B2B Products</div>
                  <div className="text-2xl font-black text-theme mt-1">
                    {products.filter(p => p.isB2BVisible).length}
                  </div>
                </div>
                <div className="bg-theme border border-theme/30 p-5 rounded-lg">
                  <div className="text-[10px] font-mono text-theme uppercase tracking-widest">B2B Sourcing Requests</div>
                  <div className="text-2xl font-black text-[#e5a93b] mt-1">
                    {inquiries.filter(i => i.sector === "B2B").length}
                  </div>
                </div>
                <div className="bg-theme border border-theme/30 p-5 rounded-lg">
                  <div className="text-[10px] font-mono text-theme uppercase tracking-widest">Global Tenders</div>
                  <div className="text-2xl font-black text-theme mt-1">14 Tenders</div>
                </div>
                <div className="bg-theme border border-theme/30 p-5 rounded-lg">
                  <div className="text-[10px] font-mono text-theme uppercase tracking-widest">Helpline Sync</div>
                  <div className="text-xs text-green-400 font-bold mt-2">WhatsApp Verified</div>
                </div>
              </div>

              {/* Main Panel Content - Split Left Catalog and Right Form */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Catalog Grid */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex justify-between items-center bg-theme border border-theme/40 px-6 py-4 rounded-lg">
                    <h3 className="font-bold text-theme text-sm">Active B2B Procurement Catalog</h3>
                    <span className="text-xs text-theme">{products.length} Products Found</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.slice(0, 6).map(prod => (
                      <div key={prod.id} className="bg-theme border border-theme/30 p-5 rounded-lg space-y-3 hover:border-theme/20 transition-all">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-mono bg-theme border border-theme/20 text-[#e5a93b] px-2 py-0.5 rounded font-black">
                            {prod.sku || "KE-GEN-SKU"}
                          </span>
                          <span className="text-xs font-mono font-bold text-theme">MOQ: {prod.moq || 5} Units</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-theme">{prod.title}</h4>
                          <p className="text-xs text-theme line-clamp-2 mt-1">{prod.description}</p>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-theme/30">
                          <div>
                            <div className="text-[9px] text-theme uppercase">Unit Price</div>
                            <div className="text-sm font-black text-theme">₹{prod.price?.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-[9px] text-theme uppercase text-right">Bulk Sourcing</div>
                            <div className="text-xs font-bold text-[#e5a93b]">₹{prod.bulkPrice?.toLocaleString() || "Quote req."}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Form: B2B Sourcing Config */}
                <div className="bg-theme border border-theme/40 p-6 rounded-lg space-y-6 h-max">
                  <div className="border-b border-theme/40 pb-4">
                    <h3 className="font-bold text-theme text-sm">Create New Product Sourcing</h3>
                    <p className="text-xs text-theme mt-1">Configure price tiers and publish details dynamically.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-theme uppercase tracking-wider mb-2">Product Title</label>
                      <input 
                        type="text" 
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        placeholder="e.g. Borosilicate Distillation Kit" 
                        className="w-full bg-theme border border-theme focus:border-theme rounded px-4 py-2.5 text-theme text-xs outline-none" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-theme uppercase tracking-wider mb-2">Catalog SKU</label>
                        <input 
                          type="text" 
                          value={newProdSKU}
                          onChange={(e) => setNewProdSKU(e.target.value)}
                          placeholder="KE-BD-01" 
                          className="w-full bg-theme border border-theme focus:border-theme rounded px-4 py-2.5 text-theme text-xs outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-theme uppercase tracking-wider mb-2">Unit Price (INR)</label>
                        <input 
                          type="number" 
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(e.target.value)}
                          placeholder="12500" 
                          className="w-full bg-theme border border-theme focus:border-theme rounded px-4 py-2.5 text-theme text-xs outline-none" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-theme uppercase tracking-wider mb-2">MOQ Limit</label>
                        <input 
                          type="number" 
                          value={newProdMOQ}
                          onChange={(e) => setNewProdMOQ(e.target.value)}
                          placeholder="5" 
                          className="w-full bg-theme border border-theme focus:border-theme rounded px-4 py-2.5 text-theme text-xs outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-theme uppercase tracking-wider mb-2">Category Segment</label>
                        <select 
                          value={newProdCategory}
                          onChange={(e) => setNewProdCategory(e.target.value)}
                          className="w-full bg-theme border border-theme focus:border-theme rounded px-4 py-2.5 text-theme text-xs outline-none"
                        >
                          {categories.b2b.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleAddProduct("b2b")}
                      className="w-full py-3 bg-theme hover:bg-theme text-theme font-extrabold text-xs uppercase tracking-wider rounded transition-all mt-4"
                    >
                      ADD TO CATALOG
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================== C. SCHOOL SECTOR ==================== */}
          {activeSector === "school" && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Secondary Navigation System */}
              <div className="flex border-b border-theme/40 gap-1 bg-theme p-1.5 rounded-lg w-max">
                {["biology", "chemistry", "physics", "general"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveSchoolTab(tab)}
                    className={`px-5 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                      activeSchoolTab === tab 
                        ? "bg-theme text-theme shadow-lg" 
                        : "text-theme hover:text-theme"
                    }`}
                  >
                    {tab} Lab
                  </button>
                ))}
              </div>

              {/* Main School Content Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Listing */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Category Filter Title */}
                  <div className="bg-theme border border-theme/40 px-6 py-4 rounded-lg flex justify-between items-center">
                    <h3 className="font-bold text-theme text-sm">
                      {activeSchoolTab.toUpperCase()} LAB SEGMENT INVENTORY
                    </h3>
                    <span className="text-xs text-theme">
                      {products.filter(p => p.b2bCategory?.toLowerCase().includes(activeSchoolTab)).length} Active SKUs
                    </span>
                  </div>

                  {/* Lab Specific Items list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products
                      .filter(p => p.b2bCategory?.toLowerCase().includes(activeSchoolTab) || p.title.toLowerCase().includes(activeSchoolTab))
                      .map(prod => (
                        <div key={prod.id} className="bg-theme border border-theme/30 p-5 rounded-lg space-y-3">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-mono bg-theme/5 border border-theme/10 text-theme px-2 py-0.5 rounded font-bold">
                              {prod.sku || "KE-SCH-SKU"}
                            </span>
                            <span className="text-xs text-theme font-mono">MOQ: {prod.moq || 10}</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-theme">{prod.title}</h4>
                            <p className="text-xs text-theme mt-1 line-clamp-2">{prod.description}</p>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-theme/30">
                            <div>
                              <div className="text-[9px] text-theme">Unit Sourcing Cost</div>
                              <div className="text-sm font-bold text-[#e5a93b]">₹{prod.price}</div>
                            </div>
                            <span className="text-[10px] bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded font-mono font-bold">
                              IN STOCK
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {products.filter(p => p.b2bCategory?.toLowerCase().includes(activeSchoolTab) || p.title.toLowerCase().includes(activeSchoolTab)).length === 0 && (
                        <div className="col-span-2 text-center py-12 border border-dashed border-theme/30 bg-theme/30 rounded-lg text-theme text-xs">
                          No specific products loaded. Use the config panel to add new lab items.
                        </div>
                      )}
                  </div>
                </div>

                {/* Right Category and Form Config */}
                <div className="space-y-6">
                  
                  {/* Form 1: Add Lab Product */}
                  <div className="bg-theme border border-theme/40 p-6 rounded-lg space-y-4">
                    <div>
                      <h4 className="font-bold text-theme text-xs uppercase tracking-wider mb-1">Add School Lab Product</h4>
                      <p className="text-[11px] text-theme">Append items directly to {activeSchoolTab} categories.</p>
                    </div>

                    <div className="space-y-3">
                      <input 
                        type="text" 
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        placeholder="Product Name" 
                        className="w-full bg-theme border border-theme rounded px-3 py-2 text-theme text-xs outline-none" 
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input 
                          type="text" 
                          value={newProdSKU}
                          onChange={(e) => setNewProdSKU(e.target.value)}
                          placeholder="SKU Code" 
                          className="w-full bg-theme border border-theme rounded px-3 py-2 text-theme text-xs outline-none" 
                        />
                        <input 
                          type="number" 
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(e.target.value)}
                          placeholder="Price (INR)" 
                          className="w-full bg-theme border border-theme rounded px-3 py-2 text-theme text-xs outline-none" 
                        />
                      </div>
                      <input 
                        type="text" 
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        placeholder={`Category (Default: ${activeSchoolTab.toUpperCase()})`} 
                        className="w-full bg-theme border border-theme rounded px-3 py-2 text-theme text-xs outline-none" 
                      />

                      <button 
                        onClick={() => handleAddProduct("school", activeSchoolTab)}
                        className="w-full py-2.5 bg-theme hover:bg-theme text-theme font-extrabold text-xs rounded transition-all mt-2"
                      >
                        CONFIRM ADDITION
                      </button>
                    </div>
                  </div>

                  {/* Form 2: Category Builder */}
                  <div className="bg-theme border border-theme/40 p-6 rounded-lg space-y-4">
                    <div>
                      <h4 className="font-bold text-theme text-xs uppercase tracking-wider mb-1">Add School Category</h4>
                      <p className="text-[11px] text-theme">Insert custom organizational nodes.</p>
                    </div>

                    <div className="space-y-3">
                      <input 
                        type="text" 
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="e.g. Microbiology deck" 
                        className="w-full bg-theme border border-theme rounded px-3 py-2 text-theme text-xs outline-none" 
                      />
                      <button 
                        onClick={() => handleAddCategory("school")}
                        className="w-full py-2 bg-theme/5 hover:bg-theme/10 text-theme font-bold text-xs rounded border border-theme/10 transition-all"
                      >
                        ADD NODE
                      </button>

                      <div className="pt-2">
                        <div className="text-[10px] text-theme font-mono uppercase mb-2">Existing categories:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {categories.school.map(cat => (
                            <span key={cat} className="text-[10px] bg-theme border border-theme text-theme px-2 py-0.5 rounded">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ==================== D. COLLEGES SECTOR ==================== */}
          {activeSector === "colleges" && (
            <div className="space-y-8 animate-fadeIn">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left side colleges catalog */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Category Filter Title */}
                  <div className="bg-theme border border-theme/40 px-6 py-4 rounded-lg flex justify-between items-center">
                    <h3 className="font-bold text-theme text-sm">
                      UNIVERSITY LABS SUITES & HIGH-PRECISION CATALOG
                    </h3>
                    <span className="text-xs text-theme">
                      {products.filter(p => p.sku?.includes("COL") || p.title.includes("Analytical") || p.title.includes("Arm")).length} Items Found
                    </span>
                  </div>

                  {/* Listings Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.slice(0, 8).map(prod => (
                      <div key={prod.id} className="bg-theme border border-theme/30 p-5 rounded-lg space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-mono bg-theme/5 border border-theme/10 text-theme px-2 py-0.5 rounded font-bold">
                            {prod.sku || "KE-COL-SKU"}
                          </span>
                          <span className="text-xs text-theme font-mono">MOQ: {prod.moq || 2}</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-theme">{prod.title}</h4>
                          <p className="text-xs text-theme mt-1 line-clamp-2">{prod.description}</p>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-theme/30">
                          <div>
                            <div className="text-[9px] text-theme">University Contract Cost</div>
                            <div className="text-sm font-bold text-[#8bceff]">₹{prod.price}</div>
                          </div>
                          <span className="text-[10px] bg-theme/10 border border-theme/20 text-[#8bceff] px-2 py-0.5 rounded font-mono font-bold">
                            ACTIVE SUPPLY
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right side form block */}
                <div className="space-y-6">
                  
                  {/* College Sourcing Form */}
                  <div className="bg-theme border border-theme/40 p-6 rounded-lg space-y-4">
                    <div>
                      <h4 className="font-bold text-theme text-xs uppercase tracking-wider mb-1">Add College Product</h4>
                      <p className="text-[11px] text-theme">Add heavy-grade university laboratory appliances.</p>
                    </div>

                    <div className="space-y-3">
                      <input 
                        type="text" 
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        placeholder="Product Name" 
                        className="w-full bg-theme border border-theme rounded px-3 py-2 text-theme text-xs outline-none" 
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input 
                          type="text" 
                          value={newProdSKU}
                          onChange={(e) => setNewProdSKU(e.target.value)}
                          placeholder="SKU Code" 
                          className="w-full bg-theme border border-theme rounded px-3 py-2 text-theme text-xs outline-none" 
                        />
                        <input 
                          type="number" 
                          value={newProdPrice}
                          onChange={(e) => setNewProdPrice(e.target.value)}
                          placeholder="Price (INR)" 
                          className="w-full bg-theme border border-theme rounded px-3 py-2 text-theme text-xs outline-none" 
                        />
                      </div>
                      <select 
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value)}
                        className="w-full bg-theme border border-theme rounded px-3 py-2 text-theme text-xs outline-none"
                      >
                        {categories.college.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>

                      <button 
                        onClick={() => handleAddProduct("college")}
                        className="w-full py-2.5 bg-theme hover:bg-theme text-theme font-extrabold text-xs rounded transition-all mt-2"
                      >
                        CREATE ENTRY
                      </button>
                    </div>
                  </div>

                  {/* College Categories List */}
                  <div className="bg-theme border border-theme/40 p-6 rounded-lg space-y-4">
                    <div>
                      <h4 className="font-bold text-theme text-xs uppercase tracking-wider mb-1">Add College Category</h4>
                      <p className="text-[11px] text-theme">Insert custom organizational nodes.</p>
                    </div>

                    <div className="space-y-3">
                      <input 
                        type="text" 
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="e.g. Laser optics deck" 
                        className="w-full bg-theme border border-theme rounded px-3 py-2 text-theme text-xs outline-none" 
                      />
                      <button 
                        onClick={() => handleAddCategory("college")}
                        className="w-full py-2 bg-theme/5 hover:bg-theme/10 text-theme font-bold text-xs rounded border border-theme/10 transition-all"
                      >
                        ADD NODE
                      </button>

                      <div className="pt-2">
                        <div className="text-[10px] text-theme font-mono uppercase mb-2">College Tenders categories:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {categories.college.map(cat => (
                            <span key={cat} className="text-[10px] bg-theme border border-theme text-theme px-2 py-0.5 rounded">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ==================== E. RESEARCH SECTOR (IMAGE 1 EXACT DESIGN) ==================== */}
          {activeSector === "research" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Header Status Bar (From image 1) */}
              <div className="flex justify-between items-center bg-theme border border-theme/40 px-6 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <span className="text-[10px] font-mono text-theme uppercase tracking-wider">
                    SYSTEM STATUS: OPTIMIZED | LAST SYNC: {new Date().toLocaleTimeString()} UTC
                  </span>
                </div>
                <div className="flex gap-4 font-mono text-[10px]">
                  <div>TOTAL ASSETS: <span className="text-theme font-bold">14,208</span></div>
                  <div>ACTIVE RUNS: <span className="text-[#e5a93b] font-bold">83</span></div>
                </div>
              </div>

              {/* Asset Charts and maintenance cycle (split 2/3 and 1/3) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Side: Asset Utilization Bar Chart */}
                <div className="lg:col-span-2 bg-theme border border-theme/30 p-6 rounded-lg flex flex-col h-72">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-sm font-bold text-theme uppercase tracking-wider">Asset Utilization</h4>
                      <p className="text-[10px] text-theme">Real-time throughput analysis across all research sectors.</p>
                    </div>
                    <span className="text-[9px] font-mono bg-theme/5 border border-theme/10 px-2 py-0.5 rounded text-theme">
                      LAST 24 HOURS
                    </span>
                  </div>

                  {/* CSS Bar Chart */}
                  <div className="flex-1 flex items-end justify-between gap-4 px-2 relative">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      <div className="border-t border-theme/5 w-full"></div>
                      <div className="border-t border-theme/5 w-full"></div>
                      <div className="border-t border-theme/5 w-full"></div>
                    </div>
                    
                    <div className="w-full flex flex-col items-center gap-2 relative z-10">
                      <div className="w-full bg-theme hover:bg-theme/80 h-24 rounded-t transition-colors cursor-pointer"></div>
                      <span className="text-[8px] font-mono text-theme uppercase">Sector 1</span>
                    </div>
                    <div className="w-full flex flex-col items-center gap-2 relative z-10">
                      <div className="w-full bg-theme h-36 rounded-t shadow-[0_0_10px_rgba(229,169,59,0.2)] cursor-pointer"></div>
                      <span className="text-[8px] font-mono text-theme uppercase">Sector 2</span>
                    </div>
                    <div className="w-full flex flex-col items-center gap-2 relative z-10">
                      <div className="w-full bg-theme hover:bg-theme/80 h-20 rounded-t transition-colors cursor-pointer"></div>
                      <span className="text-[8px] font-mono text-theme uppercase">Sector 3</span>
                    </div>
                    <div className="w-full flex flex-col items-center gap-2 relative z-10">
                      <div className="w-full bg-theme hover:bg-theme/80 h-32 rounded-t transition-colors cursor-pointer"></div>
                      <span className="text-[8px] font-mono text-theme uppercase">Sector 4</span>
                    </div>
                    <div className="w-full flex flex-col items-center gap-2 relative z-10">
                      <div className="w-full bg-theme hover:bg-theme/80 h-28 rounded-t transition-colors cursor-pointer"></div>
                      <span className="text-[8px] font-mono text-theme uppercase">Sector 5</span>
                    </div>
                    <div className="w-full flex flex-col items-center gap-2 relative z-10">
                      <div className="w-full bg-theme hover:bg-theme/80 h-16 rounded-t transition-colors cursor-pointer"></div>
                      <span className="text-[8px] font-mono text-theme uppercase">Sector 6</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Maintenance Cycles gauges */}
                <div className="bg-theme border border-theme/30 p-6 rounded-lg flex flex-col justify-between h-72">
                  <div>
                    <h4 className="text-sm font-bold text-theme uppercase tracking-wider mb-4">Maintenance Cycles</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-theme">Critical Calibration</span>
                          <span className="text-[#ff4d4d] font-bold font-mono">92%</span>
                        </div>
                        <div className="w-full bg-theme h-1.5 rounded-full overflow-hidden">
                          <div className="bg-theme h-full" style={{ width: "92%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-theme">Routine Stackup</span>
                          <span className="text-orange-400 font-bold font-mono">45%</span>
                        </div>
                        <div className="w-full bg-theme h-1.5 rounded-full overflow-hidden">
                          <div className="bg-orange-400 h-full" style={{ width: "45%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-theme">Optimal State</span>
                          <span className="text-green-400 font-bold font-mono">42%</span>
                        </div>
                        <div className="w-full bg-theme h-1.5 rounded-full overflow-hidden">
                          <div className="bg-green-400 h-full" style={{ width: "42%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-theme/5 border border-theme/10 rounded flex items-start gap-2">
                    <ShieldAlert size={14} className="text-[#e5a93b] shrink-0 mt-0.5" />
                    <span className="text-[10px] text-theme leading-relaxed font-mono">
                      Next global system audit is in 2005.4 Hours.
                    </span>
                  </div>
                </div>

              </div>

              {/* Lower Section: Registry List & Register Asset Form */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Asset Registry List */}
                <div className="lg:col-span-2 bg-theme border border-theme/30 rounded-lg p-6 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-theme/40">
                    <h4 className="text-sm font-bold text-theme uppercase tracking-wider">Asset Registry List</h4>
                    <span className="text-xs text-theme font-mono">{assets.length} Registered Nodes</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] font-mono text-theme uppercase border-b border-theme/30">
                        <tr>
                          <th className="py-2.5">Asset / SKU</th>
                          <th className="py-2.5">Calibration</th>
                          <th className="py-2.5">Stock Level</th>
                          <th className="py-2.5">Location</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1a273b]/20">
                        {assets.map((ast) => (
                          <tr key={ast.id} className="hover:bg-theme/[0.01]">
                            <td className="py-3">
                              <div className="font-bold text-theme">{ast.name}</div>
                              <div className="text-[10px] text-theme font-mono mt-0.5">{ast.sku}</div>
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                                ast.calibration === "OPTIMIZED" 
                                  ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                                  : ast.calibration === "CRITICAL"
                                  ? "bg-theme/10 text-[#ff4d4d] border border-theme/20"
                                  : "bg-theme/10 text-[#e5a93b] border border-theme/20"
                              }`}>
                                {ast.calibration}
                              </span>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <span className="font-bold font-mono text-theme">{ast.stockLevel}%</span>
                                <div className="w-16 bg-theme h-1 rounded overflow-hidden">
                                  <div className="bg-green-400 h-full" style={{ width: `${ast.stockLevel}%` }}></div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 text-theme font-mono">{ast.location}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Register Asset Form (Right Side) */}
                <div className="bg-theme border border-theme/30 rounded-lg p-6 space-y-4">
                  <div className="border-b border-theme/40 pb-3">
                    <h4 className="text-sm font-bold text-theme uppercase tracking-wider">Register Asset</h4>
                    <p className="text-[10px] text-theme mt-1">Configure registry entries globally.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-mono text-theme uppercase tracking-widest mb-1.5">Asset Name</label>
                      <input 
                        type="text" 
                        value={newAssetName}
                        onChange={(e) => setNewAssetName(e.target.value)}
                        placeholder="e.g. Cryogenic Chamber v4" 
                        className="w-full bg-theme border border-theme rounded px-3 py-2 text-theme text-xs outline-none" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-mono text-theme uppercase tracking-widest mb-1.5">SKU ID</label>
                        <input 
                          type="text" 
                          value={newAssetSKU}
                          onChange={(e) => setNewAssetSKU(e.target.value)}
                          placeholder="KE-CC-V4" 
                          className="w-full bg-theme border border-theme rounded px-3 py-2 text-theme text-xs outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-theme uppercase tracking-widest mb-1.5">Department</label>
                        <select 
                          value={newAssetDept}
                          onChange={(e) => setNewAssetDept(e.target.value)}
                          className="w-full bg-theme border border-theme text-theme rounded px-3 py-2 text-xs outline-none"
                        >
                          <option>Biotech</option>
                          <option>Chemical</option>
                          <option>Physics</option>
                          <option>Environmental</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono text-theme uppercase tracking-widest mb-1.5">Critical Stock Qty</label>
                      <input 
                        type="number" 
                        value={newAssetStock}
                        onChange={(e) => setNewAssetStock(e.target.value)}
                        className="w-full bg-theme border border-theme rounded px-3 py-2 text-theme text-xs outline-none" 
                      />
                    </div>

                    <button 
                      onClick={handleRegisterAsset}
                      className="w-full py-3 bg-theme hover:bg-theme text-theme font-extrabold text-xs uppercase tracking-wider rounded transition-all mt-2"
                    >
                      CONFIRM REGISTRATION
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================== F. COMMERCIAL LABS ==================== */}
          {activeSector === "commercial" && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Stat Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-theme border border-theme/30 p-5 rounded-lg">
                  <div className="text-[10px] font-mono text-theme uppercase tracking-widest">Completed Test Bookings</div>
                  <div className="text-2xl font-black text-theme mt-1">1,248 Tests</div>
                </div>
                <div className="bg-theme border border-theme/30 p-5 rounded-lg">
                  <div className="text-[10px] font-mono text-theme uppercase tracking-widest">Active Test Queue</div>
                  <div className="text-2xl font-black text-[#e5a93b] mt-1">15 In Progress</div>
                </div>
                <div className="bg-theme border border-theme/30 p-5 rounded-lg">
                  <div className="text-[10px] font-mono text-theme uppercase tracking-widest">Service Revenue</div>
                  <div className="text-2xl font-black text-theme mt-1">₹4,82,500.00</div>
                </div>
                <div className="bg-theme border border-theme/30 p-5 rounded-lg">
                  <div className="text-[10px] font-mono text-theme uppercase tracking-widest">Utilization Rate</div>
                  <div className="text-2xl font-black text-green-400 mt-1">82.5%</div>
                </div>
              </div>

              {/* Service Management */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Commercial Services List */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-theme border border-theme/40 px-6 py-4 rounded-lg flex justify-between items-center">
                    <h3 className="font-bold text-theme text-sm">Active Test Packages & Services</h3>
                    <span className="text-xs text-theme">{commercialTests.length} Analysis Packages</span>
                  </div>

                  <div className="space-y-3">
                    {commercialTests.map(svc => (
                      <div key={svc.id} className="bg-theme border border-theme/30 p-5 rounded-lg flex justify-between items-center">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono bg-theme/5 border border-theme/10 text-theme px-2 py-0.5 rounded">
                              {svc.code}
                            </span>
                            <span className="text-xs text-theme font-mono">{svc.category}</span>
                          </div>
                          <h4 className="text-sm font-bold text-theme">{svc.serviceName}</h4>
                          <div className="text-xs text-theme">Standard turnaround: <span className="text-theme font-bold">{svc.turnaround}</span></div>
                        </div>

                        <div className="text-right space-y-2">
                          <div className="text-xs text-theme">Service Fee</div>
                          <div className="text-base font-black text-[#e5a93b]">₹{svc.price.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Svc Form panel */}
                <div className="bg-theme border border-theme/40 p-6 rounded-lg space-y-4 h-max">
                  <div>
                    <h4 className="font-bold text-theme text-xs uppercase tracking-wider mb-1">Create Lab Service</h4>
                    <p className="text-[11px] text-theme">Monetize testing services dynamically.</p>
                  </div>

                  <div className="space-y-3">
                    <input 
                      type="text" 
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      placeholder="e.g. Water Quality & Metal Testing" 
                      className="w-full bg-theme border border-theme rounded px-3 py-2 text-theme text-xs outline-none" 
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        value={newServiceCode}
                        onChange={(e) => setNewServiceCode(e.target.value)}
                        placeholder="SVC-Code" 
                        className="w-full bg-theme border border-theme rounded px-3 py-2 text-theme text-xs outline-none" 
                      />
                      <input 
                        type="number" 
                        value={newServicePrice}
                        onChange={(e) => setNewServicePrice(e.target.value)}
                        placeholder="Cost (INR)" 
                        className="w-full bg-theme border border-theme rounded px-3 py-2 text-theme text-xs outline-none" 
                      />
                    </div>
                    <select 
                      value={newServiceTime}
                      onChange={(e) => setNewServiceTime(e.target.value)}
                      className="w-full bg-theme border border-theme text-theme rounded px-3 py-2 text-xs outline-none"
                    >
                      <option>24-48 Hours</option>
                      <option>2-3 Days</option>
                      <option>3-5 Days</option>
                      <option>5-7 Days</option>
                    </select>

                    <button 
                      onClick={handleAddCommercialTest}
                      className="w-full py-2.5 bg-theme hover:bg-theme text-theme font-extrabold text-xs rounded transition-all mt-2"
                    >
                      MONETIZE SERVICE
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================== G. UNIFIED ENQUIRY CENTER ==================== */}
          {activeSector === "enquiries" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Filter controls */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-theme border border-theme/40 px-6 py-4 rounded-lg">
                <div className="relative w-full md:w-80">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme" />
                  <input 
                    type="text" 
                    placeholder="Search by ID, client or location..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-theme border border-theme rounded pl-9 pr-4 py-2 text-theme text-xs outline-none"
                  />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  {["All", "Pending", "Under Review", "Approved", "Closed"].map(st => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3.5 py-1.5 rounded text-[11px] font-bold uppercase transition-all ${
                        statusFilter === st 
                          ? "bg-theme text-theme" 
                          : "bg-theme/5 text-theme hover:text-theme"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inquiry Table list */}
              <div className="bg-theme border border-theme/40 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-theme text-[10px] font-mono text-theme uppercase border-b border-theme/30">
                    <tr>
                      <th className="p-4">Inquiry Code</th>
                      <th className="p-4">Client / Institution</th>
                      <th className="p-4">Sector Type</th>
                      <th className="p-4">Requirement Details</th>
                      <th className="p-4">Estimated Value</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a273b]/20">
                    {filteredInquiries.map(inq => (
                      <tr key={inq.id} className="hover:bg-theme/[0.01] transition-all">
                        <td className="p-4">
                          <span className="font-mono font-bold text-theme">{inq.id}</span>
                          <div className="text-[10px] text-theme mt-1">
                            {new Date(inq.submittedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-theme">{inq.clientName}</div>
                          <div className="text-[10px] text-theme flex items-center gap-1 mt-0.5">
                            <MapPin size={10} className="text-[#e5a93b]" /> {inq.location || "Online"}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            inq.sector === "B2B" ? "bg-purple-500/10 text-purple-400" :
                            inq.sector === "School" ? "bg-theme/10 text-[#e5a93b]" :
                            inq.sector === "College" ? "bg-theme/10 text-[#8bceff]" :
                            inq.sector === "Research" ? "bg-green-500/10 text-green-400" :
                            "bg-orange-500/10 text-orange-400"
                          }`}>
                            {inq.sector}
                          </span>
                          {inq.subSector && <div className="text-[9px] text-theme mt-1 font-mono">{inq.subSector}</div>}
                        </td>
                        <td className="p-4 max-w-xs truncate text-theme">
                          {inq.items}
                        </td>
                        <td className="p-4 font-bold text-theme font-mono">
                          ₹{inq.value.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            inq.status === "Approved" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                            inq.status === "Under Review" ? "bg-theme/10 text-[#8bceff] border border-theme/20" :
                            inq.status === "Closed" ? "bg-theme/5 text-theme border border-theme/10" :
                            "bg-theme/10 text-[#e5a93b] border border-theme/20"
                          }`}>
                            {inq.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => setSelectedInquiry(inq)}
                            className="bg-theme hover:bg-theme hover:text-theme border border-theme px-3 py-1 rounded text-[11px] font-bold transition-all"
                          >
                            Inspect Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                    
                    {filteredInquiries.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-theme text-xs">
                          No sourcing inquiries found matching criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>

      </main>

      {/* 3. UINIFIED INQUIRY DETAIL MODAL / DRAWER */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-theme/80 flex items-center justify-center z-50 p-4">
          <div className="bg-theme border border-theme rounded-xl w-full max-w-2xl p-6 relative animate-zoomIn space-y-6 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-theme/40 pb-4">
              <div>
                <span className="text-[9px] font-mono text-[#e5a93b] uppercase tracking-widest font-black">
                  Inquiry Detail Inspection
                </span>
                <h3 className="text-lg font-black text-theme mt-1">
                  RFQ ID: {selectedInquiry.id}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedInquiry(null)}
                className="text-theme hover:text-theme"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
              
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] uppercase font-mono text-theme mb-1">Client Name</div>
                  <div className="text-sm font-bold text-theme">{selectedInquiry.clientName}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-theme mb-1">Sourcing Sector</div>
                  <div className="text-xs text-theme font-bold">
                    {selectedInquiry.sector} {selectedInquiry.subSector ? `- ${selectedInquiry.subSector}` : ""}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-theme mb-1">Contact Email</div>
                  <div className="text-xs text-theme font-mono">{selectedInquiry.contactEmail}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-theme mb-1">Contact Phone</div>
                  <div className="text-xs text-theme font-mono">{selectedInquiry.contactPhone}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-[10px] uppercase font-mono text-theme mb-1">Estimated Tender Value</div>
                  <div className="text-sm font-black text-[#e5a93b] font-mono">₹{selectedInquiry.value.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-theme mb-1">Shipping Location / Site Location</div>
                  <div className="text-xs text-theme">{selectedInquiry.location || "Not Provided"}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-theme mb-1">Requirement Overview</div>
                  <div className="text-xs text-theme bg-theme border border-theme p-3 rounded font-mono">
                    {selectedInquiry.items}
                  </div>
                </div>
              </div>

            </div>

            {/* Inquiry Message */}
            <div className="bg-theme border border-theme p-4 rounded text-xs">
              <div className="text-[10px] uppercase font-mono text-theme mb-2">Detailed Sourcing Requirements / Cover Letter</div>
              <p className="text-theme leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap">
                {selectedInquiry.message}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-theme/40">
              
              {/* Status Updater */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-theme uppercase">Set Status:</span>
                <div className="flex bg-theme border border-theme p-1 rounded gap-1">
                  {(["Pending", "Under Review", "Approved", "Closed"] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => handleInquiryStatusChange(selectedInquiry.id, st)}
                      className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase transition-all ${
                        selectedInquiry.status === st
                          ? "bg-theme text-theme"
                          : "text-theme hover:text-theme"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* WhatsApp follow up action */}
              <button 
                onClick={() => triggerWhatsAppFollowUp(selectedInquiry)}
                className="w-full md:w-auto px-5 py-2.5 bg-green-500 hover:bg-green-600 text-theme font-extrabold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Zap size={14} />
                <span>FOLLOW-UP VIA WHATSAPP</span>
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
