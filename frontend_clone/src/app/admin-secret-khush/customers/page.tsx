"use client";

import { Search, Filter, Download, Users, Zap, Eye, Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";
import { useDownload } from "@/components/admin/DownloadToast";

export default function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const { startDownload } = useDownload();

  const allCustomers = [
    {
      initials: "C1", color: "bg-theme text-[#8bceff]",
      id: "CUST-10492",
      orders: "14 Orders", lifetime: "₹4,28,000 Lifetime",
      status: "In Stock / Active", statusColor: "text-[#8bceff]",
      active: "2 hours ago"
    },
    {
      initials: "C2", color: "bg-theme text-brand-yellow",
      id: "CUST-29381",
      orders: "3 Orders", lifetime: "₹82,500 Lifetime",
      status: "On Hold", statusColor: "text-brand-yellow",
      active: "3 days ago"
    },
    {
      initials: "C3", color: "bg-theme text-[#8bceff]",
      id: "CUST-98211",
      orders: "42 Orders", lifetime: "₹12,40,000 Lifetime",
      status: "Elite Member", statusColor: "text-[#8bceff]",
      active: "15 mins ago"
    },
    {
      initials: "C4", color: "bg-theme text-[#ff4d4d]",
      id: "CUST-00921",
      orders: "0 Orders", lifetime: "₹0 Lifetime",
      status: "Deactivated", statusColor: "text-[#ff4d4d]",
      active: "2 months ago"
    }
  ];

  const customers = allCustomers.filter(c => 
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-theme mb-1">Customer Management</h1>
          <p className="text-theme text-sm">Review detailed user metrics and administrative controls.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme" />
            <input 
              type="text" 
              placeholder="Search by ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-theme border border-theme/5 focus:border-theme/20 text-xs text-theme pl-8 pr-4 py-2.5 rounded w-64 outline-none transition-colors" 
            />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Stat 1 */}
        <div className="bg-theme border border-theme/5 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between h-36">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 rounded bg-theme border border-theme/20 flex items-center justify-center text-[#8bceff]">
              <Users size={18} />
            </div>
            <span className="text-[10px] font-bold text-[#8bceff] tracking-widest">+12% this month</span>
          </div>
          <div className="relative z-10">
            <div className="text-[10px] font-bold text-theme uppercase tracking-widest mb-1">Total Customers</div>
            <div className="text-4xl font-bold text-theme">2,840</div>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-theme border border-theme/5 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between h-36">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-10 h-10 rounded bg-theme border border-brand-yellow/20 flex items-center justify-center text-brand-yellow">
              <Zap size={18} />
            </div>
            <span className="text-[10px] font-bold text-brand-yellow tracking-widest">Active Now: 432</span>
          </div>
          <div className="relative z-10">
            <div className="text-[10px] font-bold text-theme uppercase tracking-widest mb-1">Active Accounts</div>
            <div className="text-4xl font-bold text-theme">1,950</div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-theme border border-theme/5 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between h-36">
          {/* Map background placeholder */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-cover bg-center"></div>
          
          <div className="relative z-10">
            <div className="text-[10px] font-bold text-theme uppercase tracking-widest mb-1">Geographic Reach</div>
            <div className="text-xl font-bold text-theme mb-1">Top Region: Mumbai, IN</div>
          </div>
          
          <div className="relative z-10 flex gap-4 mt-auto">
            <div className="flex items-center gap-1.5 text-xs text-theme">
               <div className="w-2 h-2 rounded-full bg-theme"></div> Domestic (65%)
            </div>
            <div className="flex items-center gap-1.5 text-xs text-theme">
               <div className="w-2 h-2 rounded-full bg-brand-yellow"></div> International (35%)
            </div>
          </div>
        </div>
        
      </div>

      {/* Customer Registry Table */}
      <div className="bg-theme border border-theme/5 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-theme/5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-theme">Customer Registry</h2>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-theme border border-theme/5 hover:bg-theme/5 text-theme text-xs px-4 py-2 rounded transition-colors font-bold uppercase tracking-widest">
              <Filter size={14} /> Filter
            </button>
            <button 
              onClick={() => startDownload("Customer_Registry.csv", "5.8 MB", "CSV File")}
              className="flex items-center gap-2 bg-theme border border-theme/5 hover:bg-theme/5 text-theme text-xs px-4 py-2 rounded transition-colors font-bold uppercase tracking-widest"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>
        
        <table className="w-full text-left text-sm">
          <thead className="bg-theme text-[10px] font-bold text-theme uppercase tracking-wider border-b border-theme/5">
            <tr>
              <th className="p-5">Customer ID</th>
              <th className="p-5">Purchase History</th>
              <th className="p-5">Account Status</th>
              <th className="p-5">Last Active</th>
              <th className="p-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {customers.map((c, idx) => (
              <tr key={idx} className="hover:bg-theme/[0.02] transition-colors">
                <td className="p-5 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded font-bold flex items-center justify-center shrink-0 ${c.color}`}>
                    {c.initials}
                  </div>
                  <div>
                    <div className="text-theme font-medium mb-1 font-mono">{c.id}</div>
                  </div>
                </td>
                <td className="p-5">
                  <div className="text-theme mb-1">{c.orders}</div>
                  <div className="text-xs text-[#8bceff]">{c.lifetime}</div>
                </td>
                <td className="p-5">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${c.statusColor}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${c.statusColor.replace('text-', 'bg-')}`}></div> {c.status}
                  </span>
                </td>
                <td className="p-5 text-theme text-xs">
                  {c.active}
                </td>
                <td className="p-5 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button className="text-theme hover:text-theme transition-colors"><Eye size={16} /></button>
                    <button className="text-theme hover:text-theme transition-colors"><SettingsIcon size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="p-4 border-t border-theme/5 flex justify-between items-center text-xs text-theme">
          <div>Showing 1 to {customers.length} of 2,840 results</div>
          <div className="flex gap-1">
            <button className="w-6 h-6 flex items-center justify-center hover:text-theme transition-colors">{'<'}</button>
            <button className="w-6 h-6 flex items-center justify-center bg-theme text-[#8bceff] border border-theme/20 rounded font-bold">1</button>
            <button className="w-6 h-6 flex items-center justify-center hover:text-theme transition-colors border border-transparent">2</button>
            <button className="w-6 h-6 flex items-center justify-center hover:text-theme transition-colors border border-transparent">3</button>
            <button className="w-6 h-6 flex items-center justify-center hover:text-theme transition-colors">{'>'}</button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
