"use client";

import { Plus, Tag, CircleDollarSign, ShoppingCart, Timer, Search, Filter, Calendar, FileText, Download, TrendingUp, TrendingDown, MoreVertical, Activity, X } from "lucide-react";
import { useState } from "react";
import { useDownload } from "@/components/admin/DownloadToast";

export default function DashboardOverview() {
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [timeframe, setTimeframe] = useState("Last 30 Days");
  const { startDownload } = useDownload();

  // Dynamic values based on timeframe to simulate filtering
  const multiplier = timeframe === "Last 7 Days" ? 0.3 : timeframe === "Last 90 Days" ? 2.5 : 1;

  return (
    <div className="max-w-6xl mx-auto pb-12 relative">
      
      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#161616] border border-white/10 rounded-xl p-6 w-[450px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Create New Coupon</h2>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Coupon Code</label>
                <input type="text" placeholder="e.g. LABEQUIP15" className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-white text-sm outline-none focus:border-[#8bceff]" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Discount Type</label>
                <select className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-white text-sm outline-none focus:border-[#8bceff] appearance-none">
                  <option>Percentage (%)</option>
                  <option>Fixed Amount ($)</option>
                  <option>Conditional Free Shipping</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Usage Limit</label>
                  <input type="number" placeholder="e.g. 100" className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-white text-sm outline-none focus:border-[#8bceff]" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Expiration Date</label>
                  <input type="date" className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-gray-400 text-sm outline-none focus:border-[#8bceff] appearance-none" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsCouponModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={() => setIsCouponModalOpen(false)} className="px-6 py-2 bg-[#8bceff] hover:bg-[#6ab3f0] text-black font-bold text-sm rounded transition-colors">Create Coupon</button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: Coupons & Offers */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Coupons & Offers</h1>
            <p className="text-gray-400 text-sm">Manage discount codes, track usage, and monitor promotion performance.</p>
          </div>
          <button onClick={() => setIsCouponModalOpen(true)} className="bg-[#8bceff] hover:bg-[#6ab3f0] text-black font-bold px-4 py-2.5 rounded text-sm flex items-center gap-2 transition-colors">
            <Plus size={16} strokeWidth={2.5} /> Create New Coupon
          </button>
        </div>

        {/* Coupons Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#161616] border border-white/5 p-5 rounded-lg flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Codes</span>
              <div className="bg-[#0c1825] p-2 rounded text-[#8bceff]"><Tag size={16} /></div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">24</div>
              <div className="text-[10px] text-gray-400 flex items-center gap-1"><TrendingUp size={12} className="text-white" /> +3 this week</div>
            </div>
          </div>
          
          <div className="bg-[#161616] border border-white/5 p-5 rounded-lg flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Revenue<br/>Generated</span>
              <div className="bg-[#1a180b] p-2 rounded text-brand-yellow"><CircleDollarSign size={16} /></div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">₹{(142500 * multiplier).toLocaleString()}</div>
              <div className="text-[10px] text-gray-400 flex items-center gap-1"><TrendingUp size={12} className="text-white" /> +12.5% vs last month</div>
            </div>
          </div>

          <div className="bg-[#161616] border border-white/5 p-5 rounded-lg flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total<br/>Redemptions</span>
              <div className="bg-[#1f1f1f] p-2 rounded text-gray-300"><ShoppingCart size={16} /></div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">{Math.round(1845 * multiplier)}</div>
              <div className="text-[10px] text-gray-400">Across all active offers</div>
            </div>
          </div>

          <div className="bg-[#161616] border border-white/5 p-5 rounded-lg flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Expiring Soon</span>
              <div className="bg-[#2a0e0e] p-2 rounded text-[#ff4d4d]"><Timer size={16} /></div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">3</div>
              <div className="text-[10px] text-[#ff4d4d] flex items-center gap-1"><span className="text-xs">⚠️</span> Within next 7 days</div>
            </div>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="bg-[#161616] border border-white/5 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#1a1a1a]">
            <h2 className="text-lg font-bold text-white">Active & Recent Codes</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search codes..." className="bg-[#111111] border border-transparent focus:border-white/20 text-xs text-white px-8 py-2 rounded outline-none w-48 transition-colors" />
              </div>
              <button className="flex items-center gap-2 bg-[#111111] border border-white/5 hover:bg-white/5 text-gray-300 text-xs px-3 py-2 rounded transition-colors">
                <Filter size={14} /> Filter
              </button>
            </div>
          </div>
          
          <table className="w-full text-left text-sm">
            <thead className="bg-[#161616] text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Type & Value</th>
                <th className="p-4">Usage Limit</th>
                <th className="p-4">Status</th>
                <th className="p-4">Revenue Gen.</th>
                <th className="p-4 w-12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4"><span className="text-[#8bceff] font-bold tracking-wider bg-[#8bceff]/10 px-2 py-1 rounded">LABEQUIP15</span></td>
                <td className="p-4"><div className="text-white font-medium">15% Off</div><div className="text-xs text-gray-500">Percentage</div></td>
                <td className="p-4">
                  <div className="flex justify-between text-xs mb-1"><span className="text-gray-300">342 / 500</span><span className="text-gray-500">68%</span></div>
                  <div className="w-full bg-[#111111] h-1.5 rounded-full overflow-hidden"><div className="bg-white h-full" style={{width:'68%'}}></div></div>
                </td>
                <td className="p-4"><span className="flex items-center gap-2 text-xs text-[#8bceff] bg-[#8bceff]/10 px-2.5 py-1 rounded-full w-max border border-[#8bceff]/20"><div className="w-1.5 h-1.5 rounded-full bg-[#8bceff]"></div> ACTIVE</span></td>
                <td className="p-4 text-gray-300">₹45,200.00</td>
                <td className="p-4 text-center"><button className="text-gray-500 hover:text-white"><MoreVertical size={16} /></button></td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4"><span className="text-gray-300 font-bold tracking-wider bg-white/5 px-2 py-1 rounded">FREESHIP500</span></td>
                <td className="p-4"><div className="text-white font-medium">Free Shipping</div><div className="text-xs text-gray-500">Conditional {'>'} ₹500</div></td>
                <td className="p-4">
                  <div className="flex justify-between text-xs mb-1"><span className="text-gray-300">1,204 / ∞</span><span className="text-gray-500">--</span></div>
                  <div className="w-full bg-[#111111] h-1.5 rounded-full overflow-hidden"><div className="bg-brand-yellow h-full w-full"></div></div>
                </td>
                <td className="p-4"><span className="flex items-center gap-2 text-xs text-[#8bceff] bg-[#8bceff]/10 px-2.5 py-1 rounded-full w-max border border-[#8bceff]/20"><div className="w-1.5 h-1.5 rounded-full bg-[#8bceff]"></div> ACTIVE</span></td>
                <td className="p-4 text-gray-300">₹89,450.00</td>
                <td className="p-4 text-center"><button className="text-gray-500 hover:text-white"><MoreVertical size={16} /></button></td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4"><span className="text-[#ff6b6b] font-bold tracking-wider bg-[#ff6b6b]/10 px-2 py-1 rounded">NEWYEAR24</span></td>
                <td className="p-4"><div className="text-white font-medium">₹100 Off</div><div className="text-xs text-gray-500">Fixed Amount</div></td>
                <td className="p-4">
                  <div className="flex justify-between text-xs mb-1"><span className="text-gray-300">100 / 100</span><span className="text-gray-500">100%</span></div>
                  <div className="w-full bg-[#111111] h-1.5 rounded-full overflow-hidden"><div className="bg-gray-600 h-full w-full"></div></div>
                </td>
                <td className="p-4"><span className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded-full w-max border border-white/10"><div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div> DEPLETED</span></td>
                <td className="p-4 text-gray-300">₹7,850.00</td>
                <td className="p-4 text-center"><button className="text-gray-500 hover:text-white"><MoreVertical size={16} /></button></td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4"><span className="text-gray-300 font-bold tracking-wider bg-white/5 px-2 py-1 rounded">EDUGRANT10</span></td>
                <td className="p-4"><div className="text-white font-medium">10% Off</div><div className="text-xs text-gray-500">Percentage (Edu Only)</div></td>
                <td className="p-4">
                  <div className="flex justify-between text-xs mb-1"><span className="text-gray-300">89 / 200</span><span className="text-gray-500">44%</span></div>
                  <div className="w-full bg-[#111111] h-1.5 rounded-full overflow-hidden"><div className="bg-[#83709b] h-full" style={{width:'44%'}}></div></div>
                </td>
                <td className="p-4"><span className="flex items-center gap-2 text-xs text-brand-yellow bg-brand-yellow/10 px-2.5 py-1 rounded-full w-max border border-brand-yellow/20"><div className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></div> EXPIRING SOON</span></td>
                <td className="p-4 text-gray-300">₹12,300.00</td>
                <td className="p-4 text-center"><button className="text-gray-500 hover:text-white"><MoreVertical size={16} /></button></td>
              </tr>
            </tbody>
          </table>
          <div className="p-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500">
            <div>Showing 1 to 4 of 24 codes</div>
            <div className="flex gap-1">
              <button className="w-6 h-6 flex items-center justify-center hover:text-white">{'<'}</button>
              <button className="w-6 h-6 flex items-center justify-center bg-[#0c1825] text-[#8bceff] rounded">1</button>
              <button className="w-6 h-6 flex items-center justify-center hover:text-white">2</button>
              <button className="w-6 h-6 flex items-center justify-center hover:text-white">3</button>
              <button className="w-6 h-6 flex items-center justify-center hover:text-white">{'>'}</button>
            </div>
          </div>
        </div>
      </div>


      {/* SECTION 2: Sales Reports & Analytics */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Sales Reports & Analytics</h1>
            <p className="text-gray-400 text-sm">High-level financial overview and performance metrics.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select 
                value={timeframe} 
                onChange={(e) => setTimeframe(e.target.value)}
                className="bg-[#111111] border border-white/5 hover:bg-white/5 text-gray-300 text-xs pl-8 pr-8 py-2.5 rounded transition-colors appearance-none outline-none cursor-pointer"
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            <button onClick={() => startDownload(`Sales_Report_${timeframe.replace(/ /g, '_')}.csv`, "2.1 MB", "CSV File")} className="flex items-center gap-2 bg-[#111111] border border-white/5 hover:bg-white/5 text-gray-300 text-xs px-3 py-2.5 rounded transition-colors">
              <FileText size={14} /> CSV
            </button>
            <button onClick={() => startDownload(`Sales_Report_${timeframe.replace(/ /g, '_')}.pdf`, "4.8 MB", "PDF Document")} className="flex items-center gap-2 bg-[#8bceff] hover:bg-[#6ab3f0] text-black font-bold text-xs px-3 py-2.5 rounded transition-colors">
              <Download size={14} /> PDF
            </button>
          </div>
        </div>

        {/* Analytics Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#161616] border border-white/5 p-5 rounded-lg flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute right-[-10px] top-[-10px] opacity-5 text-white/50"><CircleDollarSign size={80} /></div>
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <div className="text-[#8bceff]"><CircleDollarSign size={16} /></div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Revenue</span>
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-bold text-white mb-1">₹{(124500 * multiplier).toLocaleString()}</div>
              <div className="text-[10px] text-gray-400 flex items-center gap-1"><TrendingUp size={12} className="text-[#8bceff]" /> <span className="text-[#8bceff]">+12.5%</span> vs last month</div>
            </div>
          </div>
          
          <div className="bg-[#161616] border border-white/5 p-5 rounded-lg flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="absolute right-[-10px] top-[-10px] opacity-5 text-white/50"><ShoppingCart size={80} /></div>
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <div className="text-gray-400"><ShoppingCart size={16} /></div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Orders</span>
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-bold text-white mb-1">{Math.round(842 * multiplier)}</div>
              <div className="text-[10px] text-gray-400 flex items-center gap-1"><TrendingUp size={12} className="text-[#8bceff]" /> <span className="text-[#8bceff]">+5.2%</span> vs last month</div>
            </div>
          </div>

          <div className="bg-[#161616] border border-white/5 p-5 rounded-lg flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="absolute right-[-10px] top-[-10px] opacity-5 text-white/50"><TrendingUp size={80} /></div>
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <div className="text-gray-400"><TrendingUp size={16} /></div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Avg. Order Value</span>
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-bold text-white mb-1">₹{(147.80).toFixed(2)}</div>
              <div className="text-[10px] text-gray-400 flex items-center gap-1"><TrendingDown size={12} className="text-[#ff4d4d]" /> <span className="text-[#ff4d4d]">-1.4%</span> vs last month</div>
            </div>
          </div>

          <div className="bg-[#161616] border border-white/5 p-5 rounded-lg flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="absolute right-[-10px] top-[-10px] opacity-5 text-white/50"><Activity size={80} /></div>
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <div className="text-[#8bceff]"><Activity size={16} /></div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Conversion Rate</span>
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-bold text-white mb-1">3.2%</div>
              <div className="text-[10px] text-gray-400 flex items-center gap-1"><TrendingUp size={12} className="text-[#8bceff]" /> <span className="text-[#8bceff]">+0.8%</span> vs last month</div>
            </div>
          </div>
        </div>

        {/* Charts & Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Revenue Trends Chart */}
          <div className="lg:col-span-2 bg-[#161616] border border-white/5 rounded-lg p-6 flex flex-col h-80">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg font-bold text-white">Revenue Trends</h2>
               <button className="text-gray-500 hover:text-white"><MoreVertical size={16} /></button>
             </div>
             <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 relative px-2">
               {/* Grid lines */}
               <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                 <div className="border-t border-white/5 w-full"></div>
                 <div className="border-t border-white/5 w-full"></div>
                 <div className="border-t border-white/5 w-full"></div>
                 <div className="border-t border-white/5 w-full"></div>
               </div>
               
               {/* Bars */}
               <div className="w-full bg-[#1f2c3d] h-[25%] rounded-t-sm relative z-10 hover:bg-[#8bceff] transition-colors cursor-pointer group"></div>
               <div className="w-full bg-[#273b54] h-[35%] rounded-t-sm relative z-10 hover:bg-[#8bceff] transition-colors cursor-pointer group"></div>
               <div className="w-full bg-[#304a6b] h-[30%] rounded-t-sm relative z-10 hover:bg-[#8bceff] transition-colors cursor-pointer group"></div>
               <div className="w-full bg-[#3e608a] h-[55%] rounded-t-sm relative z-10 hover:bg-[#8bceff] transition-colors cursor-pointer group"></div>
               <div className="w-full bg-[#4a76a8] h-[45%] rounded-t-sm relative z-10 hover:bg-[#8bceff] transition-colors cursor-pointer group"></div>
               <div className="w-full bg-[#598ec9] h-[75%] rounded-t-sm relative z-10 hover:bg-[#8bceff] transition-colors cursor-pointer group"></div>
               <div className="w-full bg-[#75b2fa] h-[90%] rounded-t-sm relative z-10 shadow-[0_0_15px_rgba(139,206,255,0.4)] cursor-pointer group"></div>
             </div>
             <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-4 px-4">
               <span>W1</span><span>W2</span><span>W3</span><span>W4</span><span>W5</span><span>W6</span><span>W7</span>
             </div>
          </div>

          {/* Top Products */}
          <div className="bg-[#161616] border border-white/5 rounded-lg p-6 flex flex-col h-80">
            <h2 className="text-lg font-bold text-white mb-6">Top Products</h2>
            <div className="flex-1 space-y-4">
              
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-white">Centrifuge 5424 R</span><span className="text-[#8bceff] font-bold">₹45k</span></div>
                <div className="w-full bg-[#111111] h-1.5 rounded-full overflow-hidden"><div className="bg-[#8bceff] h-full" style={{width:'85%'}}></div></div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-white">Microscope Series X</span><span className="text-gray-300 font-bold">₹32k</span></div>
                <div className="w-full bg-[#111111] h-1.5 rounded-full overflow-hidden"><div className="bg-white/60 h-full" style={{width:'65%'}}></div></div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-white">Autoclave Pro 20L</span><span className="text-gray-300 font-bold">₹28k</span></div>
                <div className="w-full bg-[#111111] h-1.5 rounded-full overflow-hidden"><div className="bg-white/40 h-full" style={{width:'55%'}}></div></div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-white">Precision Balance</span><span className="text-gray-300 font-bold">₹18k</span></div>
                <div className="w-full bg-[#111111] h-1.5 rounded-full overflow-hidden"><div className="bg-white/30 h-full" style={{width:'35%'}}></div></div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-white">Spectrophotometer</span><span className="text-gray-300 font-bold">₹12k</span></div>
                <div className="w-full bg-[#111111] h-1.5 rounded-full overflow-hidden"><div className="bg-white/20 h-full" style={{width:'20%'}}></div></div>
              </div>

            </div>
          </div>
        </div>

        {/* Regional Sales Distribution */}
        <div className="bg-[#161616] border border-white/5 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Regional Sales Distribution</h2>
            <button className="text-xs text-[#8bceff] hover:text-white transition-colors flex items-center gap-1">View Full Report -{'>'}</button>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-[#161616] text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="p-4">Region</th>
                <th className="p-4">Revenue</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Top Category</th>
                <th className="p-4 text-right">Growth (YOY)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#8bceff]"></div> <span className="text-gray-300">North America</span></td>
                <td className="p-4 text-[#8bceff]">₹58,200</td>
                <td className="p-4 text-gray-400">342</td>
                <td className="p-4 text-gray-400">Centrifuges</td>
                <td className="p-4 text-right text-green-400">+15.2%</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/60"></div> <span className="text-gray-300">Europe</span></td>
                <td className="p-4 text-gray-300">₹42,150</td>
                <td className="p-4 text-gray-400">285</td>
                <td className="p-4 text-gray-400">Microscopes</td>
                <td className="p-4 text-right text-green-400">+8.4%</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/40"></div> <span className="text-gray-300">Asia Pacific</span></td>
                <td className="p-4 text-gray-300">₹18,400</td>
                <td className="p-4 text-gray-400">156</td>
                <td className="p-4 text-gray-400">Consumables</td>
                <td className="p-4 text-right text-green-400">+22.1%</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/20"></div> <span className="text-gray-300">Latin America</span></td>
                <td className="p-4 text-gray-300">₹5,750</td>
                <td className="p-4 text-gray-400">59</td>
                <td className="p-4 text-gray-400">Liquid Handling</td>
                <td className="p-4 text-right text-[#ff4d4d]">-2.3%</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
