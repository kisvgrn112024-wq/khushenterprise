"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, Plus, Trash2, ArrowRight, ShieldCheck, FileText, CheckCircle2, 
  HelpCircle, Layers, Info, ClipboardList, BookOpen, ShieldAlert, Award,
  GraduationCap, FlaskConical, Microscope
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Product, getImageUrl } from "@/lib/products";

// Quick Entry row interface
interface QuickEntryRow {
  id: string;
  sku: string;
  qty: number;
  active: boolean;
}

// Static Restored items interface
interface RestoredBulkItem {
  sku: string;
  title: string;
  desc: string;
  category: string;
  minQty: number;
  regPrice: number;
  bulkPrice: number;
  status: "IN STOCK" | "LOW STOCK" | "OUT OF STOCK";
}

function BulkOrdersContent() {
  const dbProducts = useProducts();
  const searchParams = useSearchParams();
  const [selectedSector, setSelectedSector] = useState<"b2b" | "institutional" | "commercial">("b2b");
  const [selectedSubSector, setSelectedSubSector] = useState<"schools" | "colleges" | "research">("schools");
  const [selectedSchoolLab, setSelectedSchoolLab] = useState<"biology" | "chemistry" | "physics" | "general">("biology");

  // Sync state from query parameters
  useEffect(() => {
    const sector = searchParams.get("sector");
    const sub = searchParams.get("sub");
    const lab = searchParams.get("lab");

    if (sector === "b2b" || sector === "institutional" || sector === "commercial") {
      setSelectedSector(sector);
    }
    if (sub === "schools" || sub === "colleges" || sub === "research") {
      setSelectedSubSector(sub);
    }
    if (lab === "biology" || lab === "chemistry" || lab === "physics" || lab === "general") {
      setSelectedSchoolLab(lab);
    }
  }, [searchParams]);

  const [quoteCart, setQuoteCart] = useState<{ product: Product; qty: number }[]>([]);
  const [quickRows, setQuickRows] = useState<QuickEntryRow[]>([
    { id: "row-1", sku: "WT-CC-01", qty: 50, active: true },
    { id: "row-2", sku: "WT-LSB-02", qty: 100, active: true },
    { id: "row-3", sku: "", qty: 1, active: false }
  ]);

  // GST Invoicing States
  const [gstRequest, setGstRequest] = useState(false);
  const [gstin, setGstin] = useState("");
  const [gstCompany, setGstCompany] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Restore the original items deleted from previous catalog version
  const restoredItems: RestoredBulkItem[] = useMemo(() => [
    {
      sku: "BKR-250-GL",
      title: "Borosilicate Glass Beakers, 250ml",
      desc: "Graduated heavy-wall borosilicate glass beakers designed for high-temperature thermal resilience.",
      category: "Glassware",
      minQty: 100,
      regPrice: 180,
      bulkPrice: 130,
      status: "IN STOCK"
    },
    {
      sku: "PIP-10-MC",
      title: "Micropipettes, Variable Volume 1-10μL",
      desc: "High-precision adjustable liquid micropipette with ergonomic thumb plunger release.",
      category: "Liquid Handling",
      minQty: 50,
      regPrice: 2400,
      bulkPrice: 1800,
      status: "IN STOCK"
    },
    {
      sku: "PET-90-PS",
      title: "Petri Dishes, Polystyrene, 90mm x 15mm",
      desc: "Gamma-sterile disposable petri dishes for microbial assays, packaged in sterile packs.",
      category: "Consumables",
      minQty: 500,
      regPrice: 25,
      bulkPrice: 18,
      status: "LOW STOCK"
    },
    {
      sku: "CEN-15-PP",
      title: "Centrifuge Tubes, Conical Bottom, 15ml",
      desc: "Polypropylene leak-proof centrifuge tubes, graduated with flat write-on caps.",
      category: "Consumables",
      minQty: 1000,
      regPrice: 12,
      bulkPrice: 8,
      status: "IN STOCK"
    }
  ], []);

  // Filter products added by the admin or active
  const catalogProducts = useMemo(() => {
    // Return all active products from storefront so nothing is deleted
    return dbProducts.filter((p) => p.product_status === "active");
  }, [dbProducts]);

  // Load quote cart and GST states on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("ke_quote_cart");
      if (savedCart) {
        try { setQuoteCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
      }
      
      const savedGst = localStorage.getItem("ke_b2b_gst_details");
      if (savedGst) {
        try {
          const parsed = JSON.parse(savedGst);
          setGstRequest(parsed.gstRequest || false);
          setGstin(parsed.gstin || "");
          setGstCompany(parsed.gstCompany || "");
        } catch (e) { console.error(e); }
      }
    }
  }, []);

  // Sync GST to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ke_b2b_gst_details", JSON.stringify({ gstRequest, gstin, gstCompany }));
    }
  }, [gstRequest, gstin, gstCompany]);

  const saveQuoteCart = (newCart: { product: Product; qty: number }[]) => {
    setQuoteCart(newCart);
    if (typeof window !== "undefined") {
      localStorage.setItem("ke_quote_cart", JSON.stringify(newCart));
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Add product to quote cart
  const handleAddToQuote = (product: Product, qty: number) => {
    const existingIndex = quoteCart.findIndex(item => item.product.id === product.id);
    let newCart = [...quoteCart];
    
    if (existingIndex > -1) {
      newCart[existingIndex].qty += qty;
    } else {
      newCart.push({ product, qty });
    }
    
    saveQuoteCart(newCart);
    showToast(`Added ${qty}x ${product.title} to your Inquiry Quote.`);

    // Sync quick entry rows
    const sku = product.sku || `KE-${product.id.toUpperCase()}`;
    const rowExists = quickRows.some(r => r.sku === sku);
    if (!rowExists) {
      const emptyRowIdx = quickRows.findIndex(r => r.sku === "");
      if (emptyRowIdx > -1) {
        const updated = [...quickRows];
        updated[emptyRowIdx] = { ...updated[emptyRowIdx], sku, qty, active: true };
        setQuickRows(updated);
      } else {
        setQuickRows(prev => [...prev, { id: `row-${Date.now()}`, sku, qty, active: true }]);
      }
    }
  };

  // Add restored item directly to quote basket
  const handleAddRestoredToQuote = (item: RestoredBulkItem) => {
    const matchedProduct: Product = {
      id: item.sku.toLowerCase(),
      title: item.title,
      description: item.desc,
      price: item.regPrice,
      bulkPrice: item.bulkPrice,
      sku: item.sku,
      moq: item.minQty,
      stock: 5000,
      icon: "Package",
      product_status: "active",
      originalPrice: item.regPrice,
      rating: 5,
      reviews: 12
    };
    handleAddToQuote(matchedProduct, item.minQty);
  };

  // Quick Entry actions
  const handleAddRow = () => {
    setQuickRows(prev => [...prev, { id: `row-${Date.now()}`, sku: "", qty: 1, active: true }]);
  };

  const handleRemoveRow = (id: string) => {
    if (quickRows.length > 1) {
      setQuickRows(prev => prev.filter(r => r.id !== id));
    } else {
      setQuickRows([{ id: "row-1", sku: "", qty: 1, active: true }]);
    }
  };

  const handleRowChange = (id: string, field: keyof QuickEntryRow, value: any) => {
    setQuickRows(prev => prev.map(row => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  // Submit bulk quote cart & quick rows to enquiry form
  const handleRequestQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process quick rows that are active and have a SKU
    const activeQuickItems = quickRows.filter(r => r.active && r.sku.trim() !== "");
    
    // Merge quick items and quoteCart
    const finalQuoteItems: { sku: string; title: string; qty: number }[] = [];
    
    // Add quoteCart items
    quoteCart.forEach(item => {
      finalQuoteItems.push({
        sku: item.product.sku || `KE-${item.product.id.toUpperCase()}`,
        title: item.product.title,
        qty: item.qty
      });
    });

    // Add quick items if not already added
    activeQuickItems.forEach(qItem => {
      const existingIdx = finalQuoteItems.findIndex(f => f.sku.toLowerCase() === qItem.sku.toLowerCase());
      if (existingIdx > -1) {
        finalQuoteItems[existingIdx].qty = Math.max(finalQuoteItems[existingIdx].qty, qItem.qty);
      } else {
        // Find product title from DB or fallback
        const matchedProd = dbProducts.find(p => (p.sku || "").toLowerCase() === qItem.sku.toLowerCase());
        finalQuoteItems.push({
          sku: qItem.sku.toUpperCase(),
          title: matchedProd ? matchedProd.title : `SKU Part: ${qItem.sku.toUpperCase()}`,
          qty: qItem.qty
        });
      }
    });

    if (finalQuoteItems.length === 0) {
      alert("Please add items to quote or enter active SKUs in Quick Entry first.");
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("ke_pending_quote_request", JSON.stringify(finalQuoteItems));
      
      // Save current chosen sector in draft state
      const draft = JSON.parse(localStorage.getItem("ke_inquiry_draft") || "{}");
      draft.legalName = gstCompany || draft.legalName || "";
      draft.taxId = gstin || draft.taxId || "";
      draft.sector = selectedSector;
      localStorage.setItem("ke_inquiry_draft", JSON.stringify(draft));
      
      window.location.href = "/bulk-orders/enquiry";
    }
  };

  // Submit quotation to WhatsApp directly
  const handleWhatsAppQuote = (e: React.FormEvent) => {
    e.preventDefault();
    
    const activeQuickItems = quickRows.filter(r => r.active && r.sku.trim() !== "");
    const finalQuoteItems: { sku: string; title: string; qty: number }[] = [];
    
    quoteCart.forEach(item => {
      finalQuoteItems.push({
        sku: item.product.sku || `KE-${item.product.id.toUpperCase()}`,
        title: item.product.title,
        qty: item.qty
      });
    });

    activeQuickItems.forEach(qItem => {
      const existingIdx = finalQuoteItems.findIndex(f => f.sku.toLowerCase() === qItem.sku.toLowerCase());
      if (existingIdx > -1) {
        finalQuoteItems[existingIdx].qty = Math.max(finalQuoteItems[existingIdx].qty, qItem.qty);
      } else {
        const matchedProd = dbProducts.find(p => (p.sku || "").toLowerCase() === qItem.sku.toLowerCase());
        finalQuoteItems.push({
          sku: qItem.sku.toUpperCase(),
          title: matchedProd ? matchedProd.title : `SKU: ${qItem.sku.toUpperCase()}`,
          qty: qItem.qty
        });
      }
    });

    if (finalQuoteItems.length === 0) {
      alert("Please add items to quote or enter active SKUs in Quick Entry first.");
      return;
    }

    let message = `Hello Khush Enterprises,\n\nI would like to request a bulk order quotation for the following items:\n\n`;
    finalQuoteItems.forEach((item, idx) => {
      message += `${idx + 1}. [SKU: ${item.sku}] ${item.title} - Qty: ${item.qty} units\n`;
    });

    if (gstRequest && gstCompany && gstin) {
      message += `\nTax Entity: ${gstCompany}\nGSTIN: ${gstin}\n`;
    }
    
    message += `\nSector: ${selectedSector.toUpperCase()}`;
    if (selectedSector === "institutional") {
      message += ` / ${selectedSubSector.toUpperCase()}`;
      if (selectedSubSector === "schools") {
        message += ` / ${selectedSchoolLab.toUpperCase()} LAB`;
      }
    }

    const url = `https://wa.me/919890011762?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  // Dynamic values depending on sector and its subparts
  const sectorData = useMemo(() => {
    switch (selectedSector) {
      case "institutional": {
        if (selectedSubSector === "schools") {
          switch (selectedSchoolLab) {
            case "biology":
              return {
                title: "School Labs / Biology Division",
                subtitle: "K-12 Educational Biology Lab Sourcing",
                desc: "Standardized biological classroom apparatus, compound LED microscopes, anatomical structures, and student-safe prep trays. Curriculum-aligned with national safety protocols.",
                moqText: "MIN. MOQ: 10 units",
                imageUrl: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&q=80&w=1000",
                guidelines: {
                  title: "Biology Classroom Safety Guidelines",
                  desc: "Preserved specimens shipped in non-toxic buffers. Standardized storage cases for slides and optical lenses. Drop-proof plastic replacements available."
                },
                discountTiers: [
                  { label: "Tier 1 (10-49 Units)", discount: "15% OFF" },
                  { label: "Tier 2 (50-199 Units)", discount: "22% OFF" },
                  { label: "Enterprise (200+ Units)", discount: "30% OFF" }
                ]
              };
            case "chemistry":
              return {
                title: "School Labs / Chemistry Division",
                subtitle: "K-12 Chemistry Lab Glassware & Stations",
                desc: "High-grade borosilicate beakers, test tube racks, student burners, and spill-prevention setups. Focused heavily on high durability and classroom protection.",
                moqText: "MIN. MOQ: 15 units",
                imageUrl: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&q=80&w=1000",
                guidelines: {
                  title: "School Chemistry Lab Safety",
                  desc: "Heavy-duty glass construction designed to prevent thermal shock cracks. Acid-resistant labeling and protective silicon bumpers on flask bases."
                },
                discountTiers: [
                  { label: "Tier 1 (15-59 Units)", discount: "12% OFF" },
                  { label: "Tier 2 (60-199 Units)", discount: "20% OFF" },
                  { label: "Enterprise (200+ Units)", discount: "28% OFF" }
                ]
              };
            case "physics":
              return {
                title: "School Labs / Physics Division",
                subtitle: "K-12 Physics & Optics Experiment Kits",
                desc: "Durable dynamics tracks, spring scales, basic breadboards, battery packs, and lens benches. Student-resilient construction for kinematics and electrical experiments.",
                moqText: "MIN. MOQ: 10 units",
                imageUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=1000",
                guidelines: {
                  title: "School Physics Lab Guidelines",
                  desc: "Low-voltage power grids, enclosed laser sources for eye-safe experiments, and impact-resistant casings for electronics. Calibrated to CBSE/State boards."
                },
                discountTiers: [
                  { label: "Tier 1 (10-49 Units)", discount: "15% OFF" },
                  { label: "Tier 2 (50-199 Units)", discount: "22% OFF" },
                  { label: "Enterprise (200+ Units)", discount: "30% OFF" }
                ]
              };
            case "general":
            default:
              return {
                title: "School Labs / General Science",
                subtitle: "K-12 General Science STEM Kits Sourcing",
                desc: "All-in-one STEM kits, magnifying sets, classroom safety goggles, and general-purpose scientific glassware clusters for early education labs.",
                moqText: "MIN. MOQ: 8 units",
                imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000",
                guidelines: {
                  title: "General Science Sourcing Guidelines",
                  desc: "Complete classroom kits in stackable organizer trays. Teacher guides and student manuals included. High-impact drop-proof plastic elements."
                },
                discountTiers: [
                  { label: "Tier 1 (8-39 Units)", discount: "15% OFF" },
                  { label: "Tier 2 (40-99 Units)", discount: "25% OFF" },
                  { label: "Enterprise (100+ Units)", discount: "35% OFF" }
                ]
              };
          }
        } else if (selectedSubSector === "colleges") {
          return {
            title: "Colleges & University Departmental Packages",
            subtitle: "Higher Education Lab Equipment Sourcing",
            desc: "Comprehensive college setup modules, analytical-grade glassware, digital centrifuges, professional incubators, and high-precision spectrophotometers.",
            moqText: "MIN. MOQ: 25 units",
            imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1000",
            guidelines: {
              title: "College & University Guidelines",
              desc: "Flexible procurement packages mapped to chemistry/biology degree curriculums. Net-45 purchase orders available. Comprehensive equipment calibration certifications provided."
            },
            discountTiers: [
              { label: "Tier 1 (25-99 Units)", discount: "10% OFF" },
              { label: "Tier 2 (100-249 Units)", discount: "18% OFF" },
              { label: "Enterprise (250+ Units)", discount: "25% OFF" }
            ]
          };
        } else {
          return {
            title: "Advanced Research Laboratories / R&D",
            subtitle: "Tier-1 Scientific Facilities & Research Hubs",
            desc: "Specialized high-precision analytical instrumentation, ISO-certified calibration setups, cleanroom supplies, and high-grade chemical synthesis ware.",
            moqText: "MIN. MOQ: 20 units",
            imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1000",
            guidelines: {
              title: "Research Facility Guidelines",
              desc: "NABL certified calibration sheets supplied with every dispatch. Priority cold-chain logistics for temperature-sensitive materials. Specialized post-purchase technical support."
            },
            discountTiers: [
              { label: "Tier 1 (20-74 Units)", discount: "8% OFF" },
              { label: "Tier 2 (75-149 Units)", discount: "15% OFF" },
              { label: "Enterprise (150+ Units)", discount: "20% OFF" }
            ]
          };
        }
      }
      case "commercial":
        return {
          title: "Commercial Labs / R&D",
          subtitle: "High-Precision Laboratory Instruments Sourcing",
          desc: "Specialized wholesale channels for industrial laboratories, pharmaceutical quality controls, clinical trials, and environmental research agencies. Direct compliance accreditation, high-accuracy calibrations, and cold-chain freight routing support.",
          moqText: "MIN. MOQ: 20 units",
          imageUrl: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=1000",
          guidelines: {
            title: "Commercial Labs Guidelines",
            desc: "NABL accredited certificate of calibration supplied upon dispatch. Priority logistics with high-volume express air dispatch formats. Custom multi-year service contracts and replacement programs available."
          },
          discountTiers: [
            { label: "Tier 1 (20-99 Units)", discount: "8% OFF" },
            { label: "Tier 2 (100-299 Units)", discount: "15% OFF" },
            { label: "Enterprise (300+ Units)", discount: "20% OFF" }
          ]
        };
      case "b2b":
      default:
        return {
          title: "B2B Business",
          subtitle: "Institutional Global Procurement Center",
          desc: "Streamline your supply chain with our global logistics network. High-volume business distributions, bulk factory rates, direct export licenses, and project-based dedicated agent assignments.",
          moqText: "MIN. MOQ: 50 units",
          imageUrl: "https://images.unsplash.com/photo-1579081290373-e393a92c57be?auto=format&fit=crop&q=80&w=1000",
          guidelines: {
            title: "B2B Trade Guidelines",
            desc: "Standard FOB and CIF shipping terms supported. Flexible Letters of Credit (L/C) and T/T wire terms available. Automated B2B dashboard post-order confirmation."
          },
          discountTiers: [
            { label: "Tier 1 (50-199 Units)", discount: "10% OFF" },
            { label: "Tier 2 (200-499 Units)", discount: "18% OFF" },
            { label: "Enterprise (500+ Units)", discount: "25% OFF" }
          ]
        };
    }
  }, [selectedSector, selectedSubSector, selectedSchoolLab]);

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-300 pb-24 selection:bg-brand-yellow/30">
      
      {/* Background Grids & Decorative Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-brand-yellow/5 to-transparent"></div>
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-brand-yellow/[0.02] blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-electric-blue/[0.03] blur-[120px] rounded-full"></div>
        
        {/* Futuristic Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-[#121620] border border-brand-yellow/40 text-white px-5 py-3 rounded-lg shadow-[0_10px_30px_rgba(252,211,77,0.15)] flex items-center gap-3 text-xs max-w-sm"
          >
            <CheckCircle2 size={18} className="text-brand-yellow shrink-0" />
            <div>
              <span className="font-bold block text-brand-yellow mb-0.5">Basket Sync</span>
              <span>{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
        {/* ── SECTOR OPTION BAR (TOP TABS) ── */}
        <div className="pt-8 pb-4 border-b border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-[10px] text-brand-yellow font-black tracking-widest uppercase">Wholesale Segment Selection</span>
              <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">Select Your Procurement Category</h2>
            </div>
            
            {/* Top segment options */}
            <div className="flex bg-black/60 p-1 border border-white/10 rounded-lg">
  <button 
    onClick={() => setSelectedSector("b2b")}
    className={`px-4 py-2 text-xs font-black tracking-wider uppercase rounded-md transition-all cursor-pointer ${
      selectedSector === "b2b" 
        ? "bg-brand-yellow text-black shadow-lg" 
        : "text-gray-400 hover:text-white"
    }`}
  >
    💼 B2B Business
  </button>
  <button 
    onClick={() => setSelectedSector("institutional")}
    className={`px-4 py-2 text-xs font-black tracking-wider uppercase rounded-md transition-all cursor-pointer ${
      selectedSector === "institutional" 
        ? "bg-brand-yellow text-black shadow-lg" 
        : "text-gray-400 hover:text-white"
    }`}
  >
    🏫 Institutional Sector
  </button>
  <button 
    onClick={() => setSelectedSector("commercial")}
    className={`px-4 py-2 text-xs font-black tracking-wider uppercase rounded-md transition-all cursor-pointer ${
      selectedSector === "commercial" 
        ? "bg-brand-yellow text-black shadow-lg" 
        : "text-gray-400 hover:text-white"
    }`}
  >
    🏭 Commercial Labs
  </button>
</div>
              
            </div>
          </div>

          {/* ── SUB-SECTOR OPTION BAR FOR INSTITUTIONAL ── */}
          {selectedSector === "institutional" && (
            <div className="mt-4 pt-4 pb-2 border-t border-white/5 flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
              <span className="text-[10px] text-gray-500 font-black tracking-widest uppercase mr-1">Sub-Sector:</span>
              <div className="flex bg-black/40 p-1 border border-white/5 rounded-md gap-1">
                <button
                  onClick={() => {
                    setSelectedSubSector("schools");
                    setSelectedSchoolLab("biology");
                  }}
                  className={`px-3.5 py-1.5 text-[11px] font-black tracking-wider uppercase rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedSubSector === "schools"
                      ? "bg-[#e5a93b] text-black shadow-md font-extrabold"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <GraduationCap size={13} /> Schools
                </button>
                <button
                  onClick={() => setSelectedSubSector("colleges")}
                  className={`px-3.5 py-1.5 text-[11px] font-black tracking-wider uppercase rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedSubSector === "colleges"
                      ? "bg-[#e5a93b] text-black shadow-md font-extrabold"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <FlaskConical size={13} /> Colleges
                </button>
                <button
                  onClick={() => setSelectedSubSector("research")}
                  className={`px-3.5 py-1.5 text-[11px] font-black tracking-wider uppercase rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedSubSector === "research"
                      ? "bg-[#e5a93b] text-black shadow-md font-extrabold"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Microscope size={13} /> Research Labs
                </button>
              </div>
            </div>
          )}

          {/* ── SCHOOL LAB SUB-PARTS SELECTOR ── */}
          {selectedSector === "institutional" && selectedSubSector === "schools" && (
            <div className="mt-2 pt-2 pb-2 flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
              <span className="text-[10px] text-gray-500 font-black tracking-widest uppercase mr-1">School Division:</span>
              <div className="flex bg-black/20 p-1 border border-white/5 rounded gap-1 flex-wrap">
                {[
                  { id: "biology", label: "Biology Lab" },
                  { id: "chemistry", label: "Chemistry Lab" },
                  { id: "physics", label: "Physics Lab" },
                  { id: "general", label: "General Science" }
                ].map((lab) => (
                  <button
                    key={lab.id}
                    onClick={() => setSelectedSchoolLab(lab.id as any)}
                    className={`px-3 py-1 text-[10px] font-bold uppercase rounded tracking-wider transition-all cursor-pointer ${
                      selectedSchoolLab === lab.id
                        ? "bg-white/10 text-white font-extrabold border border-white/10"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {lab.label}
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* ── HERO BANNER (ADAPTIVE BASED ON TAB) ── */}
        <section className="py-12 lg:py-16 border-b border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 border border-brand-yellow/30 bg-brand-yellow/5 text-brand-yellow text-[9px] font-black tracking-widest px-3.5 py-1.5 rounded uppercase">
                <span className="w-1.5 h-1.5 bg-brand-yellow rounded-full animate-pulse" />
                {sectorData.subtitle}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight">
                {sectorData.title.split("/")[0]} <br />
                <span className="text-brand-yellow">Wholesale Sourcing</span>
              </h1>
              
              <p className="text-gray-400 text-sm font-light leading-relaxed max-w-2xl">
                {sectorData.desc}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                
                <a href="#catalogue-section">
                  <button className="bg-transparent text-gray-300 hover:text-white px-8 py-3.5 rounded text-xs font-bold uppercase tracking-wider transition-all border border-white/10 hover:border-white/20 cursor-pointer">
                    View Dynamic Catalogues
                  </button>
                </a>
              </div>
            </div>

            {/* Right Graphic Panel (Blueprint Image) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md aspect-[4/3] rounded-xl overflow-hidden border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.6)] bg-[#0d1017] p-2 group">
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-transparent z-10"></div>
                <div className="absolute inset-0 bg-brand-yellow/[0.03] mix-blend-overlay z-10 rounded-xl"></div>
                <img 
                  src={sectorData.imageUrl} 
                  alt={sectorData.title} 
                  className="w-full h-full object-cover rounded-lg opacity-85 transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Tech specifications label */}
                <div className="absolute bottom-4 left-4 z-20 font-mono text-[9px] text-gray-500 bg-black/75 px-3 py-1.5 rounded border border-white/5 space-y-0.5">
                  <div>ACC COMPLIANCE: {selectedSector.toUpperCase()}-APPROVED</div>
                  <div>DISCOUNT TIER: {sectorData.discountTiers[2].discount} CAP</div>
                  <div className="text-brand-yellow font-bold">MINIMUM ORDER: {sectorData.moqText}</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── SECTION: FREQUENTLY SOURCED IN BULK (RESTORED OLD ITEMS) ── */}
        <section className="py-12 border-b border-white/5">
          <div className="text-left mb-8">
            <span className="text-[10px] text-brand-yellow font-bold tracking-widest uppercase">Verified Standard Inventory</span>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-1">Frequently Sourced in Bulk</h2>
            <p className="text-gray-500 text-xs mt-1">
              High-volume static inventory lines requested regularly by laboratories and academies. Fully interactive — click Add to Quote.
            </p>
          </div>

          <div className="w-full overflow-x-auto bg-[#0b0e14] border border-white/5 rounded-xl shadow-2xl">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="text-[10px] uppercase bg-black/50 text-gray-500 font-black tracking-wider border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">SKU Code</th>
                  <th className="px-6 py-4">Product Description</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Min. Wholesale MOQ</th>
                  <th className="px-6 py-4">Est. Wholesale Price</th>
                  <th className="px-6 py-4">Compliance Status</th>
                  <th className="px-6 py-4 text-center">Add to Quote</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {restoredItems.map((item) => (
                  <tr key={item.sku} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 text-brand-yellow font-mono">{item.sku}</td>
                    <td className="px-6 py-4">
                      <div className="text-white text-xs font-bold">{item.title}</div>
                      <div className="text-gray-500 text-[10px] font-light font-sans max-w-sm truncate">{item.desc}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{item.category}</td>
                    <td className="px-6 py-4 text-white font-mono">{item.minQty} pcs</td>
                    <td className="px-6 py-4">
                      <span className="text-gray-500 line-through text-[10px] mr-1.5">₹{item.regPrice.toLocaleString("en-IN")}</span>
                      <span className="text-brand-yellow font-bold">₹{item.bulkPrice.toLocaleString("en-IN")}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-[9px] font-black px-2 py-0.5 rounded tracking-wider">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleAddRestoredToQuote(item)}
                        className="bg-brand-yellow hover:bg-[#e6b10f] text-black font-black text-[9px] px-3.5 py-1.5 rounded tracking-wider uppercase transition-all transform active:scale-95 cursor-pointer"
                      >
                        Add {item.minQty} Units
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── DYNAMIC CATALOGUE (INCLUDES ALL ACTIVE PRODUCTS FROM ADMIN) ── */}
        <section id="catalogue-section" className="py-12 border-b border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div className="text-left">
              <span className="text-[10px] text-brand-yellow font-bold tracking-widest uppercase">Admin Inventory Synchronization</span>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-1">Live Store Wholesale Catalogues</h2>
              <p className="text-gray-500 text-xs mt-1">All active items managed by your store administrator.</p>
            </div>
            
            <Link href="/products" className="text-brand-yellow hover:text-yellow-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shrink-0">
              View Entire Inventory <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalogProducts.length === 0 ? (
              <div className="col-span-full bg-[#0b0e14] border border-white/5 rounded-xl p-8 text-center space-y-2 text-gray-500">
                <Package size={36} className="mx-auto text-gray-700" />
                <p className="text-xs">No live active products identified. Fill items inside Admin Portal first.</p>
              </div>
            ) : (
              catalogProducts.map((prod) => {
                const sku = prod.sku || `KE-${prod.id.slice(-4).toUpperCase()}`;
                const moq = prod.moq || 25;
                const bulkPrice = prod.bulkPrice || Math.round(prod.price * 0.85);
                const isOutOfStock = (prod.stock || 0) === 0;

                return (
                  <div key={prod.id} className="bg-[#0b0e14] border border-white/5 hover:border-brand-yellow/30 p-5 rounded-xl flex flex-col justify-between group transition-all duration-300">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="px-2 py-0.5 bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-[9px] font-bold uppercase rounded">MIN. MOQ: {moq} units</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded border font-bold uppercase tracking-wider ${
                          isOutOfStock ? "bg-red-500/10 border-red-500/10 text-red-400" : "bg-green-500/10 border-green-500/10 text-green-400"
                        }`}>
                          {isOutOfStock ? "OUT OF STOCK" : "IN STOCK"}
                        </span>
                      </div>

                      {/* Graphic/Image display */}
                      <div className="bg-[#0e111a] rounded-lg mb-4 h-36 border border-white/5 relative overflow-hidden flex items-center justify-center">
                        {prod.images && prod.images[0] ? (
                          <img src={getImageUrl(prod.images[0])} alt={prod.title} className="w-full h-full object-contain opacity-80 mix-blend-screen p-2 transform group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <Package size={48} className="text-gray-700 transform group-hover:scale-105 transition-transform duration-500" strokeWidth={1} />
                        )}
                      </div>

                      <div className="text-[9px] text-gray-500 font-mono tracking-wider uppercase mb-1">SKU: {sku}</div>
                      <h3 className="text-white text-sm font-bold leading-snug group-hover:text-brand-yellow transition-colors mb-2 line-clamp-1">{prod.title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{prod.description}</p>
                    </div>

                    <div className="pt-4 border-t border-white/5 space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500 block text-[9px] uppercase font-semibold">Store Price</span>
                          <span className="text-gray-400 line-through">₹{(prod.originalPrice || prod.price).toLocaleString("en-IN")}</span>
                        </div>
                        <div>
                          <span className="text-brand-yellow block text-[9px] uppercase font-bold">Wholesale Price</span>
                          <span className="text-white font-extrabold text-sm">₹{bulkPrice.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                      
                      <div className="text-[10px] text-gray-500 bg-[#0f121d] px-3 py-1.5 rounded border border-white/5 flex justify-between font-mono">
                        <span>Tier 2 (200+ units):</span>
                        <span className="text-brand-yellow font-bold">₹{Math.round(bulkPrice * 0.9).toLocaleString("en-IN")}</span>
                      </div>

                      <button 
                        onClick={() => handleAddToQuote(prod, moq)}
                        className="w-full bg-[#121620] hover:bg-brand-yellow hover:text-black border border-white/10 hover:border-brand-yellow font-bold text-xs py-2.5 rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                      >
                        <Plus size={14} /> Add to Quote
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* ── INTERACTIVE TAX COMPLIANCE: GST TAX INVOICE PANEL ── */}
        <section className="py-6">
          <div className="bg-gradient-to-r from-brand-yellow/15 via-brand-yellow/5 to-transparent border border-brand-yellow/20 rounded-xl p-6 shadow-xl text-left">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-brand-yellow" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">GST Tax Invoicing & Input Credit</h3>
                </div>
                <p className="text-gray-400 text-xs font-light max-w-2xl leading-relaxed">
                  Provide your company/institution GSTIN details to receive a GST compliant B2B tax invoice. Claim up to 18% tax input credit automatically routed to your ledger.
                </p>
              </div>

              {/* Tax Invoice Toggle */}
              <div className="flex items-center gap-3 shrink-0 bg-black/40 px-4 py-2.5 rounded border border-white/10">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={gstRequest}
                    onChange={(e) => setGstRequest(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-yellow accent-brand-yellow bg-transparent border-white/10 cursor-pointer"
                  />
                  <span className="text-xs text-white font-bold uppercase tracking-wider">Request GST Invoice</span>
                </label>
              </div>
            </div>

            {/* GST Fields Open */}
            <AnimatePresence>
              {gstRequest && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-6 pt-6 border-t border-white/5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                        GST Registered Company Legal Name
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. KHUSH ENTERPRISES PRIVATE LIMITED"
                        value={gstCompany}
                        onChange={(e) => setGstCompany(e.target.value)}
                        className="bg-[#0e121a] border border-white/10 focus:border-brand-yellow/50 text-xs text-white px-4 py-3 rounded w-full outline-none transition-colors font-bold uppercase tracking-wider"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                        GSTIN Registration Number (15-Digit)
                      </label>
                      <input 
                        type="text" 
                        maxLength={15}
                        placeholder="e.g. 06AAAAA1111A1Z1"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        className="bg-[#0e121a] border border-white/10 focus:border-brand-yellow/50 text-xs text-white px-4 py-3 rounded w-full outline-none transition-colors font-mono font-bold tracking-widest uppercase"
                      />
                      <span className="text-[9px] text-gray-500 font-mono mt-1 block">Valid Format: 2-Digit State Code + 10-Character PAN + 3-Character Entity ID</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2 bg-[#0e121a] border border-brand-yellow/10 rounded px-4 py-2.5 text-[10px] text-gray-400 font-medium">
                    <ShieldCheck size={14} className="text-brand-yellow shrink-0" />
                    <span>✓ Details locked. GSTIN details will automatically synchronize with your B2B inquiry payload.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── BOTTOM DOUBLE-GRID: QUICK ENTRY & GUIDELINES ── */}
        <section className="py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Quick Entry Column */}
          <div className="lg:col-span-7 bg-[#0b0e14] border border-white/5 rounded-xl p-6 lg:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList size={18} className="text-brand-yellow" />
                <h2 className="text-xl font-black text-white tracking-tight">Bulk Order Quick Entry Grid</h2>
              </div>
              <p className="text-gray-500 text-xs mb-6">Enter SKUs and desired quantities directly to configure your quote request.</p>

              <form onSubmit={handleRequestQuoteSubmit} className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-500 uppercase tracking-wider font-bold">
                        <th className="pb-3 w-10 text-center">Active</th>
                        <th className="pb-3 pl-2">SKU / Part Code</th>
                        <th className="pb-3 w-32 pl-4">Qty</th>
                        <th className="pb-3 w-16 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {quickRows.map((row) => (
                        <tr key={row.id} className="hover:bg-white/[0.01]">
                          <td className="py-3 text-center">
                            <input 
                              type="checkbox" 
                              checked={row.active}
                              onChange={(e) => handleRowChange(row.id, "active", e.target.checked)}
                              className="accent-brand-yellow rounded border-white/10 bg-transparent cursor-pointer"
                            />
                          </td>
                          <td className="py-2 pl-2">
                            <input 
                              type="text" 
                              placeholder="e.g. BKR-250-GL" 
                              value={row.sku}
                              onChange={(e) => handleRowChange(row.id, "sku", e.target.value)}
                              className="bg-[#0e121a] border border-white/10 focus:border-brand-yellow/50 text-xs text-white px-3 py-2 rounded w-full outline-none transition-colors font-mono uppercase"
                            />
                          </td>
                          <td className="py-2 pl-4">
                            <input 
                              type="number" 
                              min="1"
                              placeholder="1"
                              value={row.qty}
                              onChange={(e) => handleRowChange(row.id, "qty", parseInt(e.target.value) || 0)}
                              className="bg-[#0e121a] border border-white/10 focus:border-brand-yellow/50 text-xs text-white px-3 py-2 rounded w-full outline-none transition-colors font-mono font-bold"
                            />
                          </td>
                          <td className="py-2 text-center">
                            <button 
                              type="button"
                              onClick={() => handleRemoveRow(row.id)}
                              className="text-gray-500 hover:text-red-400 transition-colors p-1"
                              title="Delete Row"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
                  <button 
                    type="button" 
                    onClick={handleAddRow}
                    className="px-4 py-2.5 border border-white/10 hover:border-brand-yellow/50 text-gray-300 hover:text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus size={14} /> Add SKU Row
                  </button>
                  
                  <button 
                    type="submit" 
                    className="flex-1 bg-brand-yellow hover:bg-[#e6b10f] text-black font-black text-xs py-2.5 rounded flex items-center justify-center gap-1.5 transition-all transform active:scale-95 cursor-pointer uppercase tracking-wider"
                  >
                    Initiate Quote <ArrowRight size={14} />
                  </button>

                  <button 
                    type="button"
                    onClick={handleWhatsAppQuote}
                    className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs px-4 py-2.5 rounded flex items-center justify-center gap-1.5 transition-all transform active:scale-95 cursor-pointer uppercase tracking-wider shadow-[0_0_15px_rgba(37,211,102,0.2)]"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a5.227 5.227 0 00-.571-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Send to WhatsApp
                  </button>
                </div>
              </form>
            </div>

            {/* Quote Cart preview list */}
            {quoteCart.length > 0 && (
              <div className="mt-8 bg-[#0f131f] border border-brand-yellow/10 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-brand-yellow font-bold uppercase tracking-widest flex items-center gap-1">
                    <Info size={11} /> Configured Basket ({quoteCart.length} items)
                  </span>
                  <button 
                    onClick={() => saveQuoteCart([])}
                    className="text-[10px] text-gray-500 hover:text-red-400 transition-colors uppercase font-semibold"
                  >
                    Clear Cart
                  </button>
                </div>
                <div className="max-h-24 overflow-y-auto space-y-1.5 pr-2">
                  {quoteCart.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-gray-400">
                      <span className="line-clamp-1">{item.product.title}</span>
                      <span className="font-mono text-white font-bold shrink-0">{item.qty} units</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Guidelines Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Guidelines Card */}
            <div className="bg-[#0b0e14] border border-white/5 rounded-xl p-6 shadow-2xl space-y-6 text-left">
              
              {/* Import Guidelines */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-brand-yellow" strokeWidth={2.5} />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">{sectorData.guidelines.title}</h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed font-light">
                  {sectorData.guidelines.desc}
                </p>
              </div>

              {/* Compliance & Certifications */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-brand-yellow" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Compliance & Standards</h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed font-light">
                  All scientific equipment adheres strictly to international ISO 9001:2015. Quality testing reports and technical certificates of compliance provided upon shipment.
                </p>
              </div>

              {/* Volume Discount Rules (DYNAMIC BY SEGMENT) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-brand-yellow" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Tiered Discounts ({selectedSector.toUpperCase()})</h3>
                </div>
                
                <div className="space-y-2">
                  {sectorData.discountTiers.map((tier, idx) => (
                    <div key={idx} className="flex justify-between text-xs border-b border-white/5 pb-1">
                      <span className="text-gray-500">{tier.label}</span>
                      <span className="text-brand-yellow font-bold font-mono">{tier.discount}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Direct Assistance helpline */}
            <div className="bg-gradient-to-r from-brand-yellow/10 via-brand-yellow/5 to-transparent border border-brand-yellow/15 rounded-xl p-6 text-left">
              <h3 className="text-white font-bold text-sm mb-1">Direct Help Desk Sourcing</h3>
              <p className="text-gray-500 text-xs mb-4">Require customized product configurations or custom logistics parameters?</p>
              <div className="font-mono text-xs space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="text-gray-500">HELPLINES:</span>
                  <div className="text-right">
                    <div className="text-white font-bold">+91 98900 11762</div>
                    <div className="text-white font-bold">+91 97294 57762</div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">EMAIL:</span>
                  <span className="text-brand-yellow font-bold hover:underline cursor-pointer">khushenterprisesupppy@gmail.com</span>
                </div>
              </div>
            </div>

          </div>

        </section>

      </div>
    </div>
  );
}

export default function BulkOrdersPage() {
  return (
    <Suspense fallback={<div className="text-white text-center py-20 bg-[#0a0a0a] min-h-screen">Loading Bulk Sourcing...</div>}>
      <BulkOrdersContent />
    </Suspense>
  );
}
