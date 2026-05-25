"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Globe,
  Package2,
  FileQuestion,
  Award,
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
  Plane,
  Ship,
} from "lucide-react";

const SIDEBAR_LINKS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/export" },
  { icon: Package2, label: "Inventory", href: "/export/products" },
  { icon: FileQuestion, label: "Inquiries", href: "/export/enquiry", active: true },
  { icon: Award, label: "Certifications", href: "/certifications" },
];

const INVENTORY_TYPES = [
  "Industrial Parts",
  "Raw Materials",
  "Electronics",
  "Consumer Goods",
];

const GLOBAL_REGIONS = [
  "Select global region...",
  "South Asia",
  "Middle East & GCC",
  "Africa",
  "South-East Asia",
  "Europe",
  "North America",
  "Latin America",
  "Central Asia",
  "Australia & Pacific",
];

type LogisticsVector = "Air Freight" | "Sea Freight";

interface FormState {
  customerName: string;
  businessEntity: string;
  destinationCountry: string;
  secureComms: string;
  inventoryTypes: string[];
  volumeEstimate: string;
  logisticsVector: LogisticsVector;
  additionalNotes: string;
}

const INITIAL: FormState = {
  customerName: "",
  businessEntity: "",
  destinationCountry: "",
  secureComms: "",
  inventoryTypes: [],
  volumeEstimate: "",
  logisticsVector: "Sea Freight",
  additionalNotes: "",
};

export default function ExportEnquiryPage() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleInventoryType = (type: string) => {
    setForm((prev) => ({
      ...prev,
      inventoryTypes: prev.inventoryTypes.includes(type)
        ? prev.inventoryTypes.filter((t) => t !== type)
        : [...prev.inventoryTypes, type],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.customerName.trim() || !form.businessEntity.trim() || form.destinationCountry === GLOBAL_REGIONS[0] || !form.destinationCountry) {
      setError("Please fill in Customer Name, Business Entity, and Destination Country.");
      return;
    }
    if (form.inventoryTypes.length === 0) {
      setError("Please select at least one inventory classification.");
      return;
    }

    setLoading(true);

    // Save enquiry to localStorage (mirrors admin portal pattern)
    const enquiry = {
      id: `EXP-${Date.now()}`,
      ...form,
      submittedAt: new Date().toISOString(),
      status: "Pending Review",
    };

    const existing = JSON.parse(localStorage.getItem("ke_export_enquiries") ?? "[]");
    existing.unshift(enquiry);
    localStorage.setItem("ke_export_enquiries", JSON.stringify(existing));

    // Also push to bulk-orders store for admin visibility
    const bulkOrders = JSON.parse(localStorage.getItem("ke_bulk_orders") ?? "[]");
    bulkOrders.unshift({
      id: enquiry.id,
      name: form.customerName,
      company: form.businessEntity,
      items: form.inventoryTypes.join(", "),
      quantity: form.volumeEstimate || "TBD",
      message: `Export enquiry to ${form.destinationCountry} via ${form.logisticsVector}. ${form.additionalNotes}`,
      status: "Pending",
      createdAt: new Date().toISOString(),
      type: "export",
    });
    localStorage.setItem("ke_bulk_orders", JSON.stringify(bulkOrders));

    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-theme flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-brand-yellow/10 border border-brand-yellow/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} className="text-brand-yellow" />
          </div>
          <h2 className="text-2xl font-black text-theme mb-3">Inquiry Submitted to Anvil</h2>
          <p className="text-theme text-sm mb-2">
            Your export inquiry has been securely routed to the KE management dashboard.
          </p>
          <p className="text-theme text-xs mb-8 font-mono">Secure transmissions active.</p>

          <div className="bg-theme border border-theme/5 rounded-xl p-5 text-left mb-6 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-theme">Reference ID</span>
              <span className="text-brand-yellow font-mono font-bold">
                EXP-{Date.now().toString().slice(-6)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-theme">Destination</span>
              <span className="text-theme font-medium">{form.destinationCountry}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-theme">Logistics</span>
              <span className="text-theme font-medium">{form.logisticsVector}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-theme">Status</span>
              <span className="text-green-400 font-bold">Pending Review</span>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Link href="/export">
              <button className="px-6 py-2.5 border border-theme/10 rounded text-xs font-bold text-theme hover:text-theme hover:border-theme/25 transition-all uppercase tracking-wider">
                Export Hub
              </button>
            </Link>
            <button
              onClick={() => { setSubmitted(false); setForm(INITIAL); }}
              className="px-6 py-2.5 bg-brand-yellow hover:bg-yellow-400 text-theme rounded text-xs font-black uppercase tracking-wider transition-colors"
            >
              New Enquiry
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme text-theme flex">
      {/* ── Sidebar ── */}
      <aside className="hidden md:flex flex-col w-56 bg-theme border-r border-theme/5 min-h-screen sticky top-[73px] h-screen pt-6 pb-10 px-3">
        <div className="mb-8 px-3">
          <div className="text-brand-yellow text-[10px] font-black tracking-widest uppercase">Export Hub</div>
          <div className="text-theme text-[9px] tracking-wider mt-0.5">Khush Global Logistics</div>
        </div>

        <nav className="flex-1 space-y-1">
          {SIDEBAR_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                item.active
                  ? "bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20"
                  : "text-theme hover:text-theme hover:bg-theme/5"
              }`}
            >
              <item.icon size={15} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 px-3 space-y-2">
          <div className="text-theme text-[9px] uppercase tracking-widest font-bold mb-2">Quick Links</div>
          <Link href="/contact-us" className="flex items-center gap-2 text-theme hover:text-theme text-[10px] transition-colors">
            <Globe size={10} /> Support
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Page header */}
        <div className="border-b border-theme/5 bg-theme px-6 py-5">
          <div className="text-theme text-[10px] font-bold uppercase tracking-widest mb-1">Export Hub</div>
          <h1 className="text-2xl md:text-3xl font-black text-theme">
            Initiate Export{" "}
            <span className="text-brand-yellow">Protocol</span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <p className="text-theme text-xs">
              Inquiry will be directly routed to the management dashboard. Secure transmissions active.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 px-4 md:px-8 py-8 max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-theme uppercase tracking-widest mb-2">
                  Customer Name <span className="text-brand-yellow">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Primary Contact"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="w-full bg-theme border border-theme/10 rounded px-4 py-3 text-sm text-theme placeholder-gray-600 outline-none focus:border-brand-yellow/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-theme uppercase tracking-widest mb-2">
                  Business Entity <span className="text-brand-yellow">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Registered Company Name"
                  value={form.businessEntity}
                  onChange={(e) => setForm({ ...form, businessEntity: e.target.value })}
                  className="w-full bg-theme border border-theme/10 rounded px-4 py-3 text-sm text-theme placeholder-gray-600 outline-none focus:border-brand-yellow/40 transition-colors"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-theme uppercase tracking-widest mb-2">
                  Destination Country <span className="text-brand-yellow">*</span>
                </label>
                <select
                  value={form.destinationCountry}
                  onChange={(e) => setForm({ ...form, destinationCountry: e.target.value })}
                  className="w-full bg-theme border border-theme/10 rounded px-4 py-3 text-sm text-theme outline-none focus:border-brand-yellow/40 transition-colors appearance-none"
                >
                  {GLOBAL_REGIONS.map((r) => (
                    <option key={r} value={r === GLOBAL_REGIONS[0] ? "" : r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-theme uppercase tracking-widest mb-2">
                  Secure Comms Line
                </label>
                <input
                  type="tel"
                  placeholder="+1-000-000-0000"
                  value={form.secureComms}
                  onChange={(e) => setForm({ ...form, secureComms: e.target.value })}
                  className="w-full bg-theme border border-theme/10 rounded px-4 py-3 text-sm text-theme placeholder-gray-600 outline-none focus:border-brand-yellow/40 transition-colors"
                />
              </div>
            </div>

            {/* Inventory Classification */}
            <div>
              <label className="block text-[10px] font-bold text-theme uppercase tracking-widest mb-3">
                Inventory Classification (Select Multiple) <span className="text-brand-yellow">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {INVENTORY_TYPES.map((type) => {
                  const active = form.inventoryTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleInventoryType(type)}
                      className={`px-4 py-2 rounded border text-xs font-bold uppercase tracking-wider transition-all ${
                        active
                          ? "bg-brand-yellow/15 border-brand-yellow/50 text-brand-yellow"
                          : "border-theme/10 text-theme hover:border-theme/20 hover:text-theme"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-theme uppercase tracking-widest mb-2">
                  Volume Estimate (TEU/Units)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 500"
                  value={form.volumeEstimate}
                  onChange={(e) => setForm({ ...form, volumeEstimate: e.target.value })}
                  className="w-full bg-theme border border-theme/10 rounded px-4 py-3 text-sm text-theme placeholder-gray-600 outline-none focus:border-brand-yellow/40 transition-colors"
                />
              </div>

              {/* Logistics Vector */}
              <div>
                <label className="block text-[10px] font-bold text-theme uppercase tracking-widest mb-3">
                  Logistics Vector
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(["Air Freight", "Sea Freight"] as LogisticsVector[]).map((opt) => {
                    const active = form.logisticsVector === opt;
                    const Icon = opt === "Air Freight" ? Plane : Ship;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setForm({ ...form, logisticsVector: opt })}
                        className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border text-[10px] font-black uppercase tracking-wider transition-all ${
                          active
                            ? "bg-brand-yellow/10 border-brand-yellow/50 text-brand-yellow shadow-[0_0_15px_rgba(252,211,77,0.1)]"
                            : "border-theme/10 text-theme hover:border-theme/20"
                        }`}
                      >
                        <Icon size={18} />
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-[10px] font-bold text-theme uppercase tracking-widest mb-2">
                Additional Notes
              </label>
              <textarea
                rows={3}
                placeholder="Special handling requirements, certifications needed, preferred shipment window..."
                value={form.additionalNotes}
                onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })}
                className="w-full bg-theme border border-theme/10 rounded px-4 py-3 text-sm text-theme placeholder-gray-600 outline-none focus:border-brand-yellow/40 transition-colors resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-xs bg-red-500/5 border border-red-500/15 rounded px-4 py-3"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              className="flex items-center gap-3 bg-brand-yellow hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed text-theme px-8 py-3.5 rounded text-xs font-black uppercase tracking-wider transition-colors"
            >
              {loading ? (
                <>
                  <span className="w-3 h-3 border-2 border-theme/30 border-t-black rounded-full animate-spin" />
                  Routing to Anvil...
                </>
              ) : (
                <>
                  Submit Inquiry to Anvil
                  <ArrowRight size={14} />
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Footer strip */}
        <div className="px-6 py-4 border-t border-theme/5 text-[9px] text-theme font-mono flex flex-wrap gap-4">
          <span>© 2024 Khush Enterprises. Managed by Ishan Malhotra &amp; Vikas Malhotra.</span>
          <Link href="/contact-us" className="hover:text-theme transition-colors">WhatsApp Contact</Link>
          <Link href="/contact-us" className="hover:text-theme transition-colors">Manager Support</Link>
          <Link href="/certifications" className="hover:text-theme transition-colors">Logistics Certifications</Link>
          <Link href="/about-us" className="hover:text-theme transition-colors">Terms of Export</Link>
        </div>
      </div>
    </div>
  );
}
