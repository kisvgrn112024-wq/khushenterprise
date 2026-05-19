"use client";

import { Plus, Download, Search, FileText, Package, Truck, Target, Mail, Phone, MoreVertical, X } from "lucide-react";
import { useState } from "react";
import { useDownload } from "@/components/admin/DownloadToast";

export default function BulkOrderManagement() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [activeQuoteId, setActiveQuoteId] = useState("");
  const { startDownload } = useDownload();

  const [inquiries, setInquiries] = useState([
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
      officer: "Procurement Officer Sarah",
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
    },
    {
      id: "#BK-29377",
      institution: "Apex Pharma Lab",
      officer: "Dr. Lisa Wong",
      items: ["12x Centrifuges", "3x Autoclaves"],
      value: "$310,000",
      status: "Pending Quote",
      action: "GENERATE QUOTE",
      contactType: "mail",
      phone: ""
    }
  ]);

  const handleStatusChange = (id: string, newStatus: string) => {
    setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
  };

  const handleActionClick = (inq: any) => {
    if (inq.action === 'GENERATE QUOTE') {
      setActiveQuoteId(inq.id);
      setIsQuoteModalOpen(true);
    } else if (inq.action === 'DOWNLOAD PO') {
      startDownload(`Purchase_Order_${inq.id.replace('#', '')}.pdf`, "1.4 MB", "PDF Document");
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 relative">

      {/* Generative Quote Modal */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#161616] border border-white/10 rounded-xl p-6 w-[550px]">
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
                  <span className="text-sm text-white">Base Total (MSRP)</span>
                  <span className="text-sm text-gray-400 line-through">$84,200.00</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#8bceff]">Tier 2 Bulk Discount (15%)</span>
                  <span className="text-sm text-[#8bceff] font-bold">-$12,630.00</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-2">
                  <span className="text-sm font-bold text-white">Proposed Final Quote</span>
                  <span className="text-lg font-bold text-brand-yellow">$71,570.00</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Custom Adjustments (%)</label>
                <input type="number" defaultValue={15} className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-white text-sm outline-none focus:border-[#8bceff]" />
              </div>
              
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Additional Terms (Optional)</label>
                <textarea rows={3} placeholder="e.g. Free shipping included..." className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-white text-sm outline-none focus:border-[#8bceff] resize-none"></textarea>
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
          <p className="text-gray-400 text-sm">Overseeing high-volume inquiries and institutional procurement.</p>
        </div>
        <button className="bg-[#8bceff] hover:bg-[#6ab3f0] text-black font-bold px-4 py-2.5 rounded text-sm flex items-center gap-2 transition-colors">
          <Plus size={16} strokeWidth={2.5} /> New Manual Inquiry
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#161616] border border-white/5 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <FileText size={16} className="text-[#8bceff]" />
            <span className="text-[10px] font-bold text-[#8bceff] tracking-wider">+12%</span>
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pending Quotes</div>
          <div className="text-3xl font-bold text-white">24</div>
        </div>
        <div className="bg-[#161616] border border-white/5 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <Package size={16} className="text-brand-yellow" />
            <span className="text-[10px] font-bold text-brand-yellow tracking-wider">Active</span>
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Processing</div>
          <div className="text-3xl font-bold text-white">18</div>
        </div>
        <div className="bg-[#161616] border border-white/5 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <Truck size={16} className="text-[#8bceff]" />
            <span className="text-[10px] font-bold text-[#8bceff] tracking-wider">On Time</span>
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Shipped Today</div>
          <div className="text-3xl font-bold text-white">42</div>
        </div>
        <div className="bg-[#161616] border border-white/5 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <Target size={16} className="text-white" />
            <span className="text-[10px] font-bold text-gray-400 tracking-wider">Q4 Goal</span>
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Value (Inquiry)</div>
          <div className="text-3xl font-bold text-white">$1.2M</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap gap-4 items-end justify-between mb-6">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Institution Type</label>
            <select className="bg-[#111111] border border-white/5 rounded px-4 py-2 text-white text-sm outline-none focus:border-[#8bceff] transition-colors appearance-none min-w-[160px]">
              <option>All Institutions</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Order Value</label>
            <select className="bg-[#111111] border border-white/5 rounded px-4 py-2 text-white text-sm outline-none focus:border-[#8bceff] transition-colors appearance-none min-w-[160px]">
              <option>Any Value</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Status</label>
            <div className="flex bg-[#111111] border border-white/5 rounded p-1">
              <button className="px-4 py-1 rounded border border-[#8bceff]/20 bg-[#0c1825] text-[#8bceff] text-xs font-bold transition-colors">All</button>
              <button className="px-4 py-1 rounded text-gray-400 hover:text-white text-xs font-bold transition-colors">Pending</button>
              <button className="px-4 py-1 rounded text-gray-400 hover:text-white text-xs font-bold transition-colors">Shipped</button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search inquiry ID or officer." className="bg-[#111111] border border-white/5 focus:border-white/20 text-xs text-white pl-8 pr-4 py-2.5 rounded w-64 outline-none transition-colors" />
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
              <th className="p-5">Est. Value</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {inquiries.map((inq, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-5 font-bold text-[#8bceff]">{inq.id}</td>
                <td className="p-5">
                  <div className="text-white font-medium mb-1">{inq.institution}</div>
                  <div className="text-xs text-gray-500">{inq.officer}</div>
                </td>
                <td className="p-5">
                  <div className="flex flex-wrap gap-1.5">
                    {inq.items.map((item, i) => (
                      <span key={i} className="px-2 py-1 bg-[#111111] border border-white/5 rounded text-[10px] text-gray-300">{item}</span>
                    ))}
                  </div>
                </td>
                <td className="p-5 font-bold text-white">{inq.value}</td>
                <td className="p-5">
                  <select 
                    value={inq.status}
                    onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                    className="bg-[#111111] border border-white/5 text-gray-400 text-xs py-1.5 px-2 rounded outline-none cursor-pointer hover:bg-white/5 transition-colors appearance-none min-w-[120px]"
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
                    {inq.contactType === 'mail' && <a href={`mailto:officer@${inq.institution.toLowerCase().replace(/ /g, '')}.com`}><Mail size={16} className="text-gray-400 hover:text-white cursor-pointer transition-colors" /></a>}
                    {inq.contactType === 'phone' && <a href={`tel:${inq.phone}`}><Phone size={16} className="text-gray-400 hover:text-white cursor-pointer transition-colors" /></a>}
                    {inq.contactType === 'more' && <MoreVertical size={16} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500">
          <div>Showing 4 of 128 bulk inquiries</div>
          <div className="flex gap-1">
            <button className="w-6 h-6 flex items-center justify-center hover:text-white transition-colors">{'<'}</button>
            <button className="w-6 h-6 flex items-center justify-center bg-[#111111] text-[#8bceff] border border-white/10 rounded font-bold">1</button>
            <button className="w-6 h-6 flex items-center justify-center hover:text-white transition-colors">2</button>
            <button className="w-6 h-6 flex items-center justify-center hover:text-white transition-colors">3</button>
            <button className="w-6 h-6 flex items-center justify-center hover:text-white transition-colors">{'>'}</button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
