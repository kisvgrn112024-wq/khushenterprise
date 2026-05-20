"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, User, Mail, ShieldAlert, Award, FileText, CheckCircle2, 
  HelpCircle, Anchor, HardHat, Cog, ShieldCheck, Layers, ArrowRight
} from "lucide-react";

interface PendingQuoteItem {
  sku: string;
  title: string;
  qty: number;
}

export default function BulkInquiryPage() {
  // Form states
  const [legalName, setLegalName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  
  // GST Tax Invoicing States
  const [gstRequest, setGstRequest] = useState(false);
  const [gstin, setGstin] = useState("");
  const [gstCompany, setGstCompany] = useState("");
  
  // Category selections (selectable cards)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Logistics states
  const [volume, setVolume] = useState(3500); // Default Metric Tons
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [siteReadiness, setSiteReadiness] = useState(false);
  
  // Prefilled items from previous page
  const [pendingItems, setPendingItems] = useState<PendingQuoteItem[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Load prefilled items and draft from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pending = localStorage.getItem("ke_pending_quote_request");
      if (pending) {
        try {
          setPendingItems(JSON.parse(pending));
        } catch (e) {
          console.error(e);
        }
      }
      
      const draft = localStorage.getItem("ke_inquiry_draft");
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          setLegalName(parsed.legalName || "");
          setTaxId(parsed.taxId || "");
          setContactName(parsed.contactName || "");
          setEmail(parsed.email || "");
          setSelectedCategories(parsed.categories || []);
          setVolume(parsed.volume || 3500);
          setDeliveryLocation(parsed.deliveryLocation || "");
          setSiteReadiness(parsed.siteReadiness || false);
          setGstRequest(parsed.gstRequest || false);
          setGstin(parsed.gstin || "");
          setGstCompany(parsed.gstCompany || "");
        } catch (e) {
          console.error(e);
        }
      }

      // Prefill from B2B parameters set on landing page if present
      const landingGst = localStorage.getItem("ke_b2b_gst_details");
      if (landingGst) {
        try {
          const parsed = JSON.parse(landingGst);
          if (parsed.gstRequest) {
            setGstRequest(true);
            setGstin(parsed.gstin || "");
            setGstCompany(parsed.gstCompany || "");
            if (parsed.gstCompany) setLegalName(parsed.gstCompany);
            if (parsed.gstin) setTaxId(parsed.gstin);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSaveDraft = () => {
    const draftData = {
      legalName,
      taxId,
      contactName,
      email,
      categories: selectedCategories,
      volume,
      deliveryLocation,
      siteReadiness,
      gstRequest,
      gstin,
      gstCompany
    };
    
    if (typeof window !== "undefined") {
      localStorage.setItem("ke_inquiry_draft", JSON.stringify(draftData));
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!legalName.trim() || !contactName.trim() || !email.trim()) {
      setErrorMessage("Please complete Legal Entity Name, Primary Contact, and Work Email.");
      return;
    }
    if (!deliveryLocation.trim()) {
      setErrorMessage("Please specify the Primary Delivery Location / Port Code.");
      return;
    }
    if (gstRequest && (!gstin.trim() || !gstCompany.trim())) {
      setErrorMessage("Please provide complete GSTIN and company legal name registration fields.");
      return;
    }

    setLoading(true);

    const submission = {
      id: `B2B-RFQ-${Date.now().toString().slice(-6)}`,
      legalName,
      taxId,
      contactName,
      email,
      categories: selectedCategories,
      volume,
      deliveryLocation,
      siteReadiness,
      requestedItems: pendingItems,
      submittedAt: new Date().toISOString(),
      status: "Pending Bid Quotation",
      gstDetails: gstRequest ? { gstin, companyName: gstCompany } : null
    };

    // Save to list of submissions
    const existing = JSON.parse(localStorage.getItem("ke_b2b_inquiries") ?? "[]");
    existing.unshift(submission);
    localStorage.setItem("ke_b2b_inquiries", JSON.stringify(existing));

    // Push into general bulk orders for admin panel
    const adminOrders = JSON.parse(localStorage.getItem("ke_bulk_orders") ?? "[]");
    adminOrders.unshift({
      id: submission.id,
      name: contactName,
      company: gstRequest && gstCompany ? gstCompany : legalName,
      items: pendingItems.length > 0 
        ? pendingItems.map(i => `${i.sku} (${i.qty})`).join(", ") 
        : `B2B Categories: ${selectedCategories.join(", ")}`,
      quantity: `${volume} Metric Tons`,
      message: `B2B Bulk Procurement at ${deliveryLocation}. Tax ID: ${taxId}. Site Ready: ${siteReadiness ? 'Yes' : 'No'}.${
        gstRequest ? ` GSTIN Invoice Requested for ${gstCompany} (GSTIN: ${gstin})` : ""
      }`,
      status: "Pending",
      createdAt: new Date().toISOString(),
      type: "B2B RFQ"
    });
    localStorage.setItem("ke_bulk_orders", JSON.stringify(adminOrders));

    // Clear quote cart and pending items post submission
    localStorage.removeItem("ke_pending_quote_request");
    localStorage.removeItem("ke_quote_cart");
    localStorage.removeItem("ke_inquiry_draft");
    localStorage.removeItem("ke_b2b_gst_details");

    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center px-4 py-12 selection:bg-brand-yellow/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 bg-brand-yellow/10 border border-brand-yellow/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} className="text-brand-yellow" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Inquiry Protocol Initiated</h2>
            <p className="text-gray-400 text-sm">
              Your bulk procurement specifications have been received. Our technical logistics team will issue a formal custom proposal within 24 hours.
            </p>
          </div>

          <div className="bg-[#0b0e14] border border-white/5 rounded-xl p-5 text-left space-y-2.5 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">REQUEST ID</span>
              <span className="text-brand-yellow font-bold">RFQ-{Date.now().toString().slice(-6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">ENTITY</span>
              <span className="text-white font-medium">{gstRequest ? gstCompany : legalName}</span>
            </div>
            {gstRequest && (
              <div className="flex justify-between border-b border-white/5 pb-1.5 mb-1.5">
                <span className="text-gray-500">GST TAX INVOICE</span>
                <span className="text-brand-yellow font-bold uppercase tracking-wider">ACTIVE (GSTIN: {gstin})</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">DELIVERY TERMINAL</span>
              <span className="text-white font-medium">{deliveryLocation.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">ANNUAL VOLUME</span>
              <span className="text-white font-medium">{volume.toLocaleString()} MT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">SECURITY STATUS</span>
              <span className="text-green-400 font-bold">NDA SECURED & SIGNED</span>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link href="/bulk-orders">
              <button className="px-6 py-2.5 border border-white/10 rounded text-xs font-bold text-gray-400 hover:text-white hover:border-white/20 transition-all uppercase tracking-wider cursor-pointer">
                Return to B2B
              </button>
            </Link>
            <Link href="/products">
              <button className="px-6 py-2.5 bg-brand-yellow hover:bg-[#e6b10f] text-black font-black rounded text-xs uppercase tracking-wider transition-colors cursor-pointer">
                Browse Products
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-300 pb-24 selection:bg-brand-yellow/30 relative">
      
      {/* Background Grids */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-yellow/[0.01] blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-electric-blue/[0.02] blur-[100px] rounded-full"></div>
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 pt-10">
        
        {/* Breadcrumb / Title */}
        <div className="mb-10 text-left">
          <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">
            <Link href="/bulk-orders" className="hover:text-brand-yellow transition-colors">B2B Portal</Link>
            <span>/</span>
            <span className="text-brand-yellow">Inquiry</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Bulk Procurement Inquiry Form</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
            Submit your wholesale specifications. Our dedicated trade desks will formulate a binding custom proposal within 24 business hours.
          </p>
        </div>

        {/* Main Double Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Inquiry Form Column */}
          <div className="lg:col-span-8 bg-[#0b0e14] border border-white/5 rounded-xl p-6 lg:p-8 shadow-2xl space-y-8">
            
            <form onSubmit={handleSubmit} className="space-y-8 text-left">
              
              {/* SECTION 01: Company Details */}
              <div className="space-y-5">
                <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                  <span className="text-brand-yellow font-mono font-bold text-sm">01</span>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Company Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                      Legal Entity Name *
                    </label>
                    <div className="relative">
                      <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Acme Industrial Solutions Ltd."
                        value={legalName}
                        onChange={(e) => setLegalName(e.target.value)}
                        className="bg-[#0e121a] border border-white/10 focus:border-brand-yellow/50 text-xs text-white pl-9 pr-4 py-3 rounded w-full outline-none transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                      Registration / Tax ID *
                    </label>
                    <input 
                      type="text" 
                      placeholder="Tax/VAT ID"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      className="bg-[#0e121a] border border-white/10 focus:border-brand-yellow/50 text-xs text-white px-4 py-3 rounded w-full outline-none transition-colors font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                      Primary Contact Name *
                    </label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                      <input 
                        type="text" 
                        required
                        placeholder="Full Name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="bg-[#0e121a] border border-white/10 focus:border-brand-yellow/50 text-xs text-white pl-9 pr-4 py-3 rounded w-full outline-none transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                      Work Email *
                    </label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                      <input 
                        type="email" 
                        required
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-[#0e121a] border border-white/10 focus:border-brand-yellow/50 text-xs text-white pl-9 pr-4 py-3 rounded w-full outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* GST Tax Invoice Segment */}
                <div className="border border-white/5 bg-black/20 rounded-lg p-4 mt-4 space-y-4">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={gstRequest}
                      onChange={(e) => {
                        setGstRequest(e.target.checked);
                        if (e.target.checked) {
                          if (gstCompany === "") setGstCompany(legalName);
                          if (gstin === "") setGstin(taxId);
                        }
                      }}
                      className="w-4 h-4 rounded text-brand-yellow accent-brand-yellow bg-transparent border-white/10 cursor-pointer"
                    />
                    <span className="text-xs text-white font-bold uppercase tracking-wider">I require a GST Tax Invoice (Claim 18% Input Credit)</span>
                  </label>
                  
                  <AnimatePresence>
                    {gstRequest && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-4 pt-2"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                              GST Registered Company Legal Name *
                            </label>
                            <input 
                              type="text" 
                              required={gstRequest}
                              placeholder="Legal Entity Name"
                              value={gstCompany}
                              onChange={(e) => {
                                setGstCompany(e.target.value);
                                setLegalName(e.target.value);
                              }}
                              className="bg-[#0e121a] border border-white/10 focus:border-brand-yellow/50 text-xs text-white px-3 py-2.5 rounded w-full outline-none transition-colors font-bold uppercase"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                              GSTIN Registration Number (15-Digit) *
                            </label>
                            <input 
                              type="text" 
                              required={gstRequest}
                              maxLength={15}
                              placeholder="e.g. 06AAAAA1111A1Z1"
                              value={gstin}
                              onChange={(e) => {
                                setGstin(e.target.value.toUpperCase());
                                setTaxId(e.target.value.toUpperCase());
                              }}
                              className="bg-[#0e121a] border border-white/10 focus:border-brand-yellow/50 text-xs text-white px-3 py-2.5 rounded w-full outline-none transition-colors font-mono font-bold uppercase tracking-widest"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* SECTION 02: Product Categories */}
              <div className="space-y-5">
                <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                  <span className="text-brand-yellow font-mono font-bold text-sm">02</span>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Product Categories</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Category 1 */}
                  <div 
                    onClick={() => toggleCategory("Glassware")}
                    className={`bg-[#0e121a] border rounded-lg p-4 cursor-pointer flex items-start gap-3.5 transition-all select-none ${
                      selectedCategories.includes("Glassware") 
                        ? "border-brand-yellow bg-brand-yellow/[0.02]" 
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className={`p-2 rounded-lg border shrink-0 transition-colors ${
                      selectedCategories.includes("Glassware") 
                        ? "bg-brand-yellow/15 border-brand-yellow/30 text-brand-yellow" 
                        : "bg-white/5 border-white/10 text-gray-500"
                    }`}>
                      <Cog size={16} />
                    </div>
                    <div>
                      <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-0.5">Glassware</h4>
                      <p className="text-[10px] text-gray-500 uppercase font-semibold">LAB BEAKERS & TUBES</p>
                    </div>
                  </div>

                  {/* Category 2 */}
                  <div 
                    onClick={() => toggleCategory("Liquid Handling")}
                    className={`bg-[#0e121a] border rounded-lg p-4 cursor-pointer flex items-start gap-3.5 transition-all select-none ${
                      selectedCategories.includes("Liquid Handling") 
                        ? "border-brand-yellow bg-brand-yellow/[0.02]" 
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className={`p-2 rounded-lg border shrink-0 transition-colors ${
                      selectedCategories.includes("Liquid Handling") 
                        ? "bg-brand-yellow/15 border-brand-yellow/30 text-brand-yellow" 
                        : "bg-white/5 border-white/10 text-gray-500"
                    }`}>
                      <Layers size={16} />
                    </div>
                    <div>
                      <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-0.5">Liquid Handling</h4>
                      <p className="text-[10px] text-gray-500 uppercase font-semibold">MICROPIPETTES & SYRINGES</p>
                    </div>
                  </div>

                  {/* Category 3 */}
                  <div 
                    onClick={() => toggleCategory("Consumables")}
                    className={`bg-[#0e121a] border rounded-lg p-4 cursor-pointer flex items-start gap-3.5 transition-all select-none ${
                      selectedCategories.includes("Consumables") 
                        ? "border-brand-yellow bg-brand-yellow/[0.02]" 
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className={`p-2 rounded-lg border shrink-0 transition-colors ${
                      selectedCategories.includes("Consumables") 
                        ? "bg-brand-yellow/15 border-brand-yellow/30 text-brand-yellow" 
                        : "bg-white/5 border-white/10 text-gray-500"
                    }`}>
                      <HardHat size={16} />
                    </div>
                    <div>
                      <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-0.5">Consumables</h4>
                      <p className="text-[10px] text-gray-500 uppercase font-semibold">PETRI DISHES & TUBES</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* SECTION 03: Logistics Requirements */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                  <span className="text-brand-yellow font-mono font-bold text-sm">03</span>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Logistics Requirements</h3>
                </div>
                
                {/* Sliders annual volume */}
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Estimated Sourcing Quantities (Total Units) *
                    </label>
                    <div className="flex items-center gap-1">
                      <span className="text-brand-yellow font-mono font-black text-sm">{volume.toLocaleString()}</span>
                      <span className="text-gray-500 text-[10px] font-mono font-bold uppercase">Units</span>
                    </div>
                  </div>
                  
                  <div className="relative pt-2">
                    <input 
                      type="range" 
                      min="10" 
                      max="10000" 
                      step="10"
                      value={volume}
                      onChange={(e) => setVolume(parseInt(e.target.value) || 10)}
                      className="w-full h-1.5 bg-[#0e121a] rounded-lg appearance-none cursor-pointer accent-brand-yellow border border-white/5"
                    />
                    
                    <div className="flex justify-between text-[9px] text-gray-600 font-mono pt-2 font-bold uppercase">
                      <span>10 units</span>
                      <span>5,000 units</span>
                      <span>10,000+ units</span>
                    </div>
                  </div>
                </div>

                {/* Delivery location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                      Primary Delivery Location / Port Code *
                    </label>
                    <div className="relative">
                      <Anchor size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                      <input 
                        type="text" 
                        required
                        placeholder="City, Shipping Terminal, or Zip"
                        value={deliveryLocation}
                        onChange={(e) => setDeliveryLocation(e.target.value)}
                        className="bg-[#0e121a] border border-white/10 focus:border-brand-yellow/50 text-xs text-white pl-9 pr-4 py-3 rounded w-full outline-none transition-colors"
                      />
                    </div>
                  </div>
                  
                  {/* Site Readiness */}
                  <div className="flex items-center pt-5">
                    <label className="flex items-start gap-3 cursor-pointer group text-xs text-gray-400 hover:text-white transition-colors">
                      <input 
                        type="checkbox"
                        checked={siteReadiness}
                        onChange={(e) => setSiteReadiness(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-white/10 bg-[#0e121a] text-brand-yellow focus:ring-0 focus:ring-offset-0 cursor-pointer accent-brand-yellow shrink-0"
                      />
                      <div className="space-y-0.5">
                        <span className="font-bold uppercase tracking-wider text-[10px] block text-white">Facility Unloading Confirmed</span>
                        <span className="text-[10px] text-gray-500 leading-relaxed font-light block">Our institutional facility is ready to receive wholesale shipments and heavy cargo handling.</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* DYNAMIC ITEMS PREVIEW: Loaded from Cart/Quick Entry */}
              {pendingItems.length > 0 && (
                <div className="bg-[#0e121a] border border-white/5 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] text-brand-yellow font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <FileText size={12} /> Pending Quote Items ({pendingItems.length})
                    </span>
                    <button 
                      type="button"
                      onClick={() => {
                        setPendingItems([]);
                        if (typeof window !== "undefined") {
                          localStorage.removeItem("ke_pending_quote_request");
                        }
                      }}
                      className="text-[9px] text-gray-600 hover:text-red-400 transition-colors uppercase font-bold"
                    >
                      Remove All
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-36 overflow-y-auto pr-1">
                    {pendingItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs bg-black/35 p-2 rounded border border-white/5">
                        <div className="font-mono text-gray-400">
                          <span className="text-[10px] text-brand-yellow font-bold uppercase block">{item.sku}</span>
                          <span className="line-clamp-1 text-[11px] font-sans">{item.title}</span>
                        </div>
                        <span className="font-mono text-white font-black px-2.5 py-1 bg-[#121620] rounded border border-white/5">{item.qty} units</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Toast / status messages */}
              {draftSaved && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-green-400 text-xs bg-green-500/5 border border-green-500/10 rounded px-4 py-2.5"
                >
                  <CheckCircle2 size={14} />
                  Inquiry draft successfully stored in local cache.
                </motion.div>
              )}

              {errorMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-400 text-xs bg-red-500/5 border border-red-500/15 rounded px-4 py-3"
                >
                  <ShieldAlert size={14} />
                  {errorMessage}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-2">
                <button 
                  type="button" 
                  onClick={handleSaveDraft}
                  className="px-6 py-3.5 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Save Draft
                </button>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-brand-yellow hover:bg-[#e6b10f] disabled:opacity-60 disabled:cursor-not-allowed text-black font-black text-xs py-3.5 rounded flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-[0_0_20px_rgba(252,211,77,0.15)] cursor-pointer"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Routing Binding RFQ Protocol...
                    </>
                  ) : (
                    <>
                      Request custom Binding Quotation <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* RIGHT: Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Technical support card */}
            <div className="bg-[#0b0e14] border border-white/5 rounded-xl p-6 shadow-2xl space-y-4 text-left">
              <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
                <HelpCircle size={16} className="text-brand-yellow" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Technical Sourcing</h3>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed font-light">
                Need specialized catalog mapping or customized equipment tenders? Connect directly with our institutional desks.
              </p>
              
              <div className="space-y-3 font-mono text-[11px] pt-1">
                <div className="flex justify-between items-start border-b border-white/5 pb-1.5">
                  <span className="text-gray-500 font-bold uppercase tracking-wider">GLOBAL HELPLINES</span>
                  <div className="text-right">
                    <div className="text-white font-bold">+91 98900 11762</div>
                    <div className="text-white font-bold">+91 97294 57762</div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold uppercase tracking-wider">EMAIL ASSISTANCE</span>
                  <span className="text-brand-yellow font-bold">khushenterprisesupppy@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Compliance Panel */}
            <div className="bg-[#0b0e14] border border-white/5 rounded-xl p-6 shadow-2xl space-y-5 text-left">
              <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
                <ShieldCheck size={16} className="text-brand-yellow" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Compliance & Standards</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0e121a] border border-white/5 rounded p-3 text-center space-y-1">
                  <Award size={18} className="text-brand-yellow mx-auto" />
                  <span className="text-[10px] text-white font-black block tracking-tight">ISO 9001:2015</span>
                </div>
                <div className="bg-[#0e121a] border border-white/5 rounded p-3 text-center space-y-1">
                  <Award size={18} className="text-brand-yellow mx-auto" />
                  <span className="text-[10px] text-white font-black block tracking-tight">ISO 14001</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-brand-yellow/5 border border-brand-yellow/10 rounded p-3">
                <ShieldAlert size={14} className="text-brand-yellow mt-0.5 shrink-0" />
                <span className="text-[10px] text-gray-500 leading-relaxed font-light">All submissions are completely secure and governed under standard non-disclosure terms.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
