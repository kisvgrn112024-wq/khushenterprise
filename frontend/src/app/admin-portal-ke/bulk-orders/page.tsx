"use client";

import { Plus, Download, Search, FileText, Package, Truck, Target, Mail, Phone, MoreVertical, X, Check } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useDownload } from "@/components/admin/DownloadToast";

interface DynamicBulkOrder {
  id: string;
  name: string;
  company: string;
  items: string;
  quantity: string;
  message: string;
  status: string;
  createdAt: string;
  type?: string;
}

export default function BulkOrderManagement() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [activeQuoteId, setActiveQuoteId] = useState("");
  const { startDownload } = useDownload();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [dynamicOrders, setDynamicOrders] = useState<DynamicBulkOrder[]>([]);

  // Static fallback values
  const [staticInquiries] = useState([
    {
      id: "#BK-29402",
      institution: "St. Xavier Research Wing",
      officer: "Dr. Arpan Mehta",
      items: ["15x Spectrometer V4", "50x Glassware Sets"],
      value: "$84,200",
      status: "Pending Quote",
      action: "GENERATE QUOTE",
      contactType: "mail",
      phone: ""
    },
    {
      id: "#BK-29398",
      institution: "BioGen Solutions Ltd",
      officer: SarahProcurement(),
      items: ["5x Cryo-Storage Units"],
      value: "$142,500",
      status: "Processing",
      action: "DOWNLOAD PO",
      contactType: "phone",
      phone: "+1234567890"
    },
    {
      id: "#BK-29385",
      institution: "National AIIMS Hospital",
      officer: "Admin Rajesh Kumar",
      items: ["200x Digital Thermometers"],
      value: "$12,000",
      status: "Shipped",
      action: "TRACKING",
      contactType: "more",
      phone: ""
    }
  ]);

  function SarahProcurement() {
    return "Procurement Officer Sarah";
  }

  // Load inquiries from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const orders = localStorage.getItem("ke_bulk_orders");
      if (orders) {
        try {
          setDynamicOrders(JSON.parse(orders));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handleStatusChange = (id: string, newStatus: string) => {
    // Check if dynamic
    if (id.startsWith("B2B-RFQ-") || id.startsWith("RFQ-")) {
      const updated = dynamicOrders.map(order => 
        order.id === id ? { ...order, status: newStatus } : order
      );
      setDynamicOrders(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("ke_bulk_orders", JSON.stringify(updated));
      }
    }
  };

  const handleActionClick = (inq: any) => {
    if (inq.action === 'GENERATE QUOTE') {
      setActiveQuoteId(inq.id);
      setIsQuoteModalOpen(true);
    } else if (inq.action === 'DOWNLOAD PO') {
      startDownload(`Purchase_Order_${inq.id.replace('#', '')}.pdf`, "1.4 MB", "PDF Document");
    }
  };

  // Merge static and dynamic lists
  const combinedList = useMemo(() => {
    const list: any[] = [];

    // First list dynamic orders
    dynamicOrders.forEach(o => {
      list.push({
        id: o.id,
        institution: o.company || "Direct Procurement",
        officer: o.name || "Sourcing Agent",
        items: o.items ? o.items.split(",") : ["Bulk Sourcing"],
        value: o.quantity || "Dynamic Bulk",
        status: o.status || "Pending Quote",
        action: "GENERATE QUOTE",
        contactType: "mail",
        phone: "",
        message: o.message || ""
      });
    });

    // Add static inquiries
    staticInquiries.forEach(s => {
      list.push(s);
    });

    return list;
  }, [dynamicOrders, staticInquiries]);

  // Filter list
  const filteredList = useMemo(() => {
    return combinedList.filter(item => {
      const matchesSearch = 
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.officer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = 
        selectedStatus === "All" ||
        (selectedStatus === "Pending" && item.status.includes("Pending")) ||
        (selectedStatus === "Shipped" && item.status.includes("Shipped"));

      return matchesSearch && matchesStatus;
    });
  }, [combinedList, searchQuery, selectedStatus]);

  return (
    <div className="max-w-6xl mx-auto pb-12 relative text-left">

      {/* Generative Quote Modal */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#161616] border border-white/10 rounded-xl p-6 w-[550px] text-left">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Generative Quote Builder</h2>
                <div className="text-xs text-gray-500 mt-1">Inquiry {activeQuoteId}</div>
              </div>
              <button onClick={() => setIsQuoteModalOpen(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-[#111111] p-4 rounded border border-white/5">
                <div className="text-xs text-gray-400 mb-2">Automated Margin Calculation</div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white">Base Total (Wholesale)</span>
                  <span className="text-sm text-gray-400 font-mono">₹45,000.00</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#8bceff]">Tier 1 Discount applied</span>
                  <span className="text-sm text-[#8bceff] font-bold font-mono">-₹4,500.00</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-2">
                  <span className="text-sm font-bold text-white">Proposed Final Quote</span>
                  <span className="text-lg font-bold text-brand-yellow font-mono">₹40,500.00</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Custom Adjustments (%)</label>
                <input type="number" defaultValue={10} className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-white text-sm outline-none focus:border-[#8bceff]" />
              </div>
              
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Additional Terms (Optional)</label>
                <textarea rows={3} placeholder="e.g. Free shipping and delivery within 5 days..." className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-white text-sm outline-none focus:border-[#8bceff] resize-none"></textarea>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsQuoteModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={() => {
                setIsQuoteModalOpen(false);
                startDownload(`Quote_${activeQuoteId.replace('#', '')}.pdf`, "0.8 MB", "PDF Document");
              }} className="px-6 py-2 bg-[#8bceff] hover:bg-[#6ab3f0] text-black font-bold text-sm rounded transition-colors flex items-center gap-2">
                Generate & Export PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Bulk Order Management</h1>
          <p className="text-gray-400 text-sm">Overseeing high-volume inquiries, GST inputs, and institutional procurement.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#161616] border border-white/5 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <FileText size={16} className="text-[#8bceff]" />
            <span className="text-[10px] font-bold text-[#8bceff] tracking-wider">+12%</span>
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Inquiries</div>
          <div className="text-3xl font-bold text-white">{combinedList.length}</div>
        </div>
        <div className="bg-[#161616] border border-white/5 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <Package size={16} className="text-brand-yellow" />
            <span className="text-[10px] font-bold text-brand-yellow tracking-wider">Active</span>
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pending Processing</div>
          <div className="text-3xl font-bold text-white">
            {combinedList.filter(i => i.status.toLowerCase().includes("pending") || i.status.toLowerCase().includes("process")).length}
          </div>
        </div>
        <div className="bg-[#161616] border border-white/5 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <Truck size={16} className="text-[#8bceff]" />
            <span className="text-[10px] font-bold text-[#8bceff] tracking-wider">Completed</span>
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Shipped Inquiries</div>
          <div className="text-3xl font-bold text-white">
            {combinedList.filter(i => i.status.toLowerCase().includes("shipped")).length}
          </div>
        </div>
        <div className="bg-[#161616] border border-white/5 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <Target size={16} className="text-white" />
            <span className="text-[10px] font-bold text-gray-400 tracking-wider">Q4 Sourcing</span>
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tax-deductible Ledger</div>
          <div className="text-3xl font-bold text-white">18% ITC</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap gap-4 items-end justify-between mb-6">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Filter Status</label>
            <div className="flex bg-[#111111] border border-white/5 rounded p-1">
              <button 
                onClick={() => setSelectedStatus("All")}
                className={`px-4 py-1 rounded text-xs font-bold transition-colors ${
                  selectedStatus === "All" ? "bg-[#0c1825] text-[#8bceff] border border-[#8bceff]/20" : "text-gray-400 hover:text-white"
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setSelectedStatus("Pending")}
                className={`px-4 py-1 rounded text-xs font-bold transition-colors ${
                  selectedStatus === "Pending" ? "bg-[#0c1825] text-[#8bceff] border border-[#8bceff]/20" : "text-gray-400 hover:text-white"
                }`}
              >
                Pending
              </button>
              <button 
                onClick={() => setSelectedStatus("Shipped")}
                className={`px-4 py-1 rounded text-xs font-bold transition-colors ${
                  selectedStatus === "Shipped" ? "bg-[#0c1825] text-[#8bceff] border border-[#8bceff]/20" : "text-gray-400 hover:text-white"
                }`}
              >
                Shipped
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search inquiry or officer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#111111] border border-white/5 focus:border-white/20 text-xs text-white pl-8 pr-4 py-2.5 rounded w-64 outline-none transition-colors" 
            />
          </div>
          <button onClick={() => startDownload("Bulk_Inquiries_Export.csv", "3.4 MB", "CSV File")} className="bg-[#111111] border border-white/5 hover:bg-white/10 text-gray-300 p-2.5 rounded transition-colors">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-[#161616] border border-white/5 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#161616] text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/5">
            <tr>
              <th className="p-5">Inquiry ID</th>
              <th className="p-5">Institution & Officer</th>
              <th className="p-5">Order Content</th>
              <th className="p-5">Est. Qty / Volume</th>
              <th className="p-5">GST / Message Details</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-gray-500 font-light">
                  No matching B2B inquiries found.
                </td>
              </tr>
            ) : (
              filteredList.map((inq, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-5 font-bold text-[#8bceff] font-mono">{inq.id}</td>
                  <td className="p-5">
                    <div className="text-white font-bold mb-1 uppercase tracking-wider">{inq.institution}</div>
                    <div className="text-xs text-gray-400">{inq.officer}</div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {inq.items.map((item: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-[#111111] border border-white/5 rounded text-[10px] text-gray-300">{item}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-5 font-bold text-white font-mono">{inq.value}</td>
                  <td className="p-5 text-xs text-gray-400 max-w-sm">
                    {inq.message || "Standard procurement guidelines applied."}
                  </td>
                  <td className="p-5">
                    <select 
                      value={inq.status}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                      className="bg-[#111111] border border-white/5 text-gray-300 text-xs py-1.5 px-2 rounded outline-none cursor-pointer hover:bg-white/5 transition-colors appearance-none min-w-[120px]"
                    >
                      <option value="Pending Quote">Pending Quote</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                    </select>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleActionClick(inq)}
                        className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          inq.action === 'GENERATE QUOTE' ? 'bg-[#8bceff] hover:bg-[#6ab3f0] text-black' :
                          inq.action === 'DOWNLOAD PO' ? 'bg-white/10 hover:bg-white/20 text-white' :
                          'bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300'
                        }`}
                      >
                        {inq.action}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500">
          <div>Showing {filteredList.length} of {combinedList.length} inquiries</div>
        </div>
      </div>
      
    </div>
  );
}
