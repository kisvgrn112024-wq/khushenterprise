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
        <div className="fixed inset-0 bg-theme/80 flex items-center justify-center z-50">
          <div className="bg-theme border border-theme/10 rounded-xl p-6 w-[450px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-theme">Create New Coupon</h2>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-theme hover:text-theme"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-theme uppercase tracking-widest mb-2">Coupon Code</label>
                <input type="text" placeholder="e.g. LABEQUIP15" className="w-full bg-theme border border-theme/5 rounded px-4 py-3 text-theme text-sm outline-none focus:border-theme" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-theme uppercase tracking-widest mb-2">Discount Type</label>
                <select className="w-full bg-theme border border-theme/5 rounded px-4 py-3 text-theme text-sm outline-none focus:border-theme appearance-none">
                  <option>Percentage (%)</option>
                  <option>Fixed Amount ($)</option>
                  <option>Conditional Free Shipping</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-theme uppercase tracking-widest mb-2">Usage Limit</label>
                  <input type="number" placeholder="e.g. 100" className="w-full bg-theme border border-theme/5 rounded px-4 py-3 text-theme text-sm outline-none focus:border-theme" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-theme uppercase tracking-widest mb-2">Expiration Date</label>
                  <input type="date" className="w-full bg-theme border border-theme/5 rounded px-4 py-3 text-theme text-sm outline-none focus:border-theme appearance-none" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsCouponModalOpen(false)} className="px-4 py-2 text-sm font-bold text-theme hover:text-theme transition-colors">Cancel</button>
              <button onClick={() => setIsCouponModalOpen(false)} className="px-6 py-2 bg-theme hover:bg-theme text-theme font-bold text-sm rounded transition-colors">Create Coupon</button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: Coupons & Offers */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-theme mb-1">Coupons & Offers</h1>
            <p className="text-theme text-sm">Manage discount codes, track usage, and monitor promotion performance.</p>
          </div>
          <button onClick={() => setIsCouponModalOpen(true)} className="bg-theme hover:bg-theme text-theme font-bold px-4 py-2.5 rounded text-sm flex items-center gap-2 transition-colors">
            <Plus size={16} strokeWidth={2.5} /> Create New Coupon
          </button>
        </div>

        {/* Coupons Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-theme border border-theme/5 p-5 rounded-lg flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-theme uppercase tracking-widest">Active Codes</span>
              <div className="bg-theme p-2 rounded text-[#8bceff]"><Tag size={16} /></div>
            </div>
            <div>
              <div className="text-3xl font-bold text-theme mb-1">24</div>
              <div className="text-[10px] text-theme flex items-center gap-1"><TrendingUp size={12} className="text-theme" /> +3 this week</div>
            </div>
          </div>
          
          <div className="bg-theme border border-theme/5 p-5 rounded-lg flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-theme uppercase tracking-widest">Total Revenue<br/>Generated</span>
              <div className="bg-theme p-2 rounded text-brand-yellow"><CircleDollarSign size={16} /></div>
            </div>
            <div>
              <div className="text-3xl font-bold text-theme mb-1">₹{(142500 * multiplier).toLocaleString()}</div>
              <div className="text-[10px] text-theme flex items-center gap-1"><TrendingUp size={12} className="text-theme" /> +12.5% vs last month</div>
            </div>
          </div>

          <div className="bg-theme border border-theme/5 p-5 rounded-lg flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-theme uppercase tracking-widest">Total<br/>Redemptions</span>
              <div className="bg-theme p-2 rounded text-theme"><ShoppingCart size={16} /></div>
            </div>
            <div>
              <div className="text-3xl font-bold text-theme mb-1">{Math.round(1845 * multiplier)}</div>
              <div className="text-[10px] text-theme">Across all active offers</div>
            </div>
          </div>

          <div className="bg-theme border border-theme/5 p-5 rounded-lg flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-theme uppercase tracking-widest">Expiring Soon</span>
              <div className="bg-theme p-2 rounded text-[#ff4d4d]"><Timer size={16} /></div>
            </div>
            <div>
              <div className="text-3xl font-bold text-theme mb-1">3</div>
              <div className="text-[10px] text-[#ff4d4d] flex items-center gap-1"><span className="text-xs">⚠️</span> Within next 7 days</div>
            </div>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="bg-theme border border-theme/5 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-theme/5 flex justify-between items-center bg-theme">
            <h2 className="text-lg font-bold text-theme">Active & Recent Codes</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme" />
                <input type="text" placeholder="Search codes..." className="bg-theme border border-transparent focus:border-theme/20 text-xs text-theme px-8 py-2 rounded outline-none w-48 transition-colors" />
              </div>
              <button className="flex items-center gap-2 bg-theme border border-theme/5 hover:bg-theme/5 text-theme text-xs px-3 py-2 rounded transition-colors">
                <Filter size={14} /> Filter
              </button>
            </div>
          </div>
          
          <table className="w-full text-left text-sm">
            <thead className="bg-theme text-[10px] font-bold text-theme uppercase tracking-wider border-b border-theme/5">
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
              <tr className="hover:bg-theme/[0.02]">
                <td className="p-4"><span className="text-[#8bceff] font-bold tracking-wider bg-theme/10 px-2 py-1 rounded">LABEQUIP15</span></td>
                <td className="p-4"><div className="text-theme font-medium">15% Off</div><div className="text-xs text-theme">Percentage</div></td>
                <td className="p-4">
                  <div className="flex justify-between text-xs mb-1"><span className="text-theme">342 / 500</span><span className="text-theme">68%</span></div>
                  <div className="w-full bg-theme h-1.5 rounded-full overflow-hidden"><div className="bg-theme h-full" style={{width:'68%'}}></div></div>
                </td>
                <td className="p-4"><span className="flex items-center gap-2 text-xs text-[#8bceff] bg-theme/10 px-2.5 py-1 rounded-full w-max border border-theme/20"><div className="w-1.5 h-1.5 rounded-full bg-theme"></div> ACTIVE</span></td>
                <td className="p-4 text-theme">₹45,200.00</td>
                <td className="p-4 text-center"><button className="text-theme hover:text-theme"><MoreVertical size={16} /></button></td>
              </tr>
              <tr className="hover:bg-theme/[0.02]">
                <td className="p-4"><span className="text-theme font-bold tracking-wider bg-theme/5 px-2 py-1 rounded">FREESHIP500</span></td>
                <td className="p-4"><div className="text-theme font-medium">Free Shipping</div><div className="text-xs text-theme">Conditional {'>'} ₹500</div></td>
                <td className="p-4">
                  <div className="flex justify-between text-xs mb-1"><span className="text-theme">1,204 / ∞</span><span className="text-theme">--</span></div>
                  <div className="w-full bg-theme h-1.5 rounded-full overflow-hidden"><div className="bg-brand-yellow h-full w-full"></div></div>
                </td>
                <td className="p-4"><span className="flex items-center gap-2 text-xs text-[#8bceff] bg-theme/10 px-2.5 py-1 rounded-full w-max border border-theme/20"><div className="w-1.5 h-1.5 rounded-full bg-theme"></div> ACTIVE</span></td>
                <td className="p-4 text-theme">₹89,450.00</td>
                <td className="p-4 text-center"><button className="text-theme hover:text-theme"><MoreVertical size={16} /></button></td>
              </tr>
              <tr className="hover:bg-theme/[0.02]">
                <td className="p-4"><span className="text-[#ff6b6b] font-bold tracking-wider bg-theme/10 px-2 py-1 rounded">NEWYEAR24</span></td>
                <td className="p-4"><div className="text-theme font-medium">₹100 Off</div><div className="text-xs text-theme">Fixed Amount</div></td>
                <td className="p-4">
                  <div className="flex justify-between text-xs mb-1"><span className="text-theme">100 / 100</span><span className="text-theme">100%</span></div>
                  <div className="w-full bg-theme h-1.5 rounded-full overflow-hidden"><div className="bg-theme h-full w-full"></div></div>
                </td>
                <td className="p-4"><span className="flex items-center gap-2 text-xs text-theme bg-theme/5 px-2.5 py-1 rounded-full w-max border border-theme/10"><div className="w-1.5 h-1.5 rounded-full bg-theme"></div> DEPLETED</span></td>
                <td className="p-4 text-theme">₹7,850.00</td>
                <td className="p-4 text-center"><button className="text-theme hover:text-theme"><MoreVertical size={16} /></button></td>
              </tr>
              <tr className="hover:bg-theme/[0.02]">
                <td className="p-4"><span className="text-theme font-bold tracking-wider bg-theme/5 px-2 py-1 rounded">EDUGRANT10</span></td>
                <td className="p-4"><div className="text-theme font-medium">10% Off</div><div className="text-xs text-theme">Percentage (Edu Only)</div></td>
                <td className="p-4">
                  <div className="flex justify-between text-xs mb-1"><span className="text-theme">89 / 200</span><span className="text-theme">44%</span></div>
                  <div className="w-full bg-theme h-1.5 rounded-full overflow-hidden"><div className="bg-theme h-full" style={{width:'44%'}}></div></div>
                </td>
                <td className="p-4"><span className="flex items-center gap-2 text-xs text-brand-yellow bg-brand-yellow/10 px-2.5 py-1 rounded-full w-max border border-brand-yellow/20"><div className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></div> EXPIRING SOON</span></td>
                <td className="p-4 text-theme">₹12,300.00</td>
                <td className="p-4 text-center"><button className="text-theme hover:text-theme"><MoreVertical size={16} /></button></td>
              </tr>
            </tbody>
          </table>
          <div className="p-4 border-t border-theme/5 flex justify-between items-center text-xs text-theme">
            <div>Showing 1 to 4 of 24 codes</div>
            <div className="flex gap-1">
              <button className="w-6 h-6 flex items-center justify-center hover:text-theme">{'<'}</button>
              <button className="w-6 h-6 flex items-center justify-center bg-theme text-[#8bceff] rounded">1</button>
              <button className="w-6 h-6 flex items-center justify-center hover:text-theme">2</button>
              <button className="w-6 h-6 flex items-center justify-center hover:text-theme">3</button>
              <button className="w-6 h-6 flex items-center justify-center hover:text-theme">{'>'}</button>
            </div>
          </div>
        </div>
      </div>


      {/* SECTION 2: Sales Reports & Analytics */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-theme mb-1">Sales Reports & Analytics</h1>
            <p className="text-theme text-sm">High-level financial overview and performance metrics.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme" />
              <select 
                value={timeframe} 
                onChange={(e) => setTimeframe(e.target.value)}
                className="bg-theme border border-theme/5 hover:bg-theme/5 text-theme text-xs pl-8 pr-8 py-2.5 rounded transition-colors appearance-none outline-none cursor-pointer"
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            <button onClick={() => startDownload(`Sales_Report_${timeframe.replace(/ /g, '_')}.csv`, "2.1 MB", "CSV File")} className="flex items-center gap-2 bg-theme border border-theme/5 hover:bg-theme/5 text-theme text-xs px-3 py-2.5 rounded transition-colors">
              <FileText size={14} /> CSV
            </button>
            <button onClick={() => startDownload(`Sales_Report_${timeframe.replace(/ /g, '_')}.pdf`, "4.8 MB", "PDF Document")} className="flex items-center gap-2 bg-theme hover:bg-theme text-theme font-bold text-xs px-3 py-2.5 rounded transition-colors">
              <Download size={14} /> PDF
            </button>
          </div>
        </div>

        {/* Analytics Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-theme border border-theme/5 p-5 rounded-lg flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute right-[-10px] top-[-10px] opacity-5 text-theme/50"><CircleDollarSign size={80} /></div>
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <div className="text-[#8bceff]"><CircleDollarSign size={16} /></div>
              <span className="text-xs font-bold text-theme uppercase tracking-widest">Total Revenue</span>
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-bold text-theme mb-1">₹{(124500 * multiplier).toLocaleString()}</div>
              <div className="text-[10px] text-theme flex items-center gap-1"><TrendingUp size={12} className="text-[#8bceff]" /> <span className="text-[#8bceff]">+12.5%</span> vs last month</div>
            </div>
          </div>
          
          <div className="bg-theme border border-theme/5 p-5 rounded-lg flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="absolute right-[-10px] top-[-10px] opacity-5 text-theme/50"><ShoppingCart size={80} /></div>
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <div className="text-theme"><ShoppingCart size={16} /></div>
              <span className="text-xs font-bold text-theme uppercase tracking-widest">Total Orders</span>
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-bold text-theme mb-1">{Math.round(842 * multiplier)}</div>
              <div className="text-[10px] text-theme flex items-center gap-1"><TrendingUp size={12} className="text-[#8bceff]" /> <span className="text-[#8bceff]">+5.2%</span> vs last month</div>
            </div>
          </div>

          <div className="bg-theme border border-theme/5 p-5 rounded-lg flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="absolute right-[-10px] top-[-10px] opacity-5 text-theme/50"><TrendingUp size={80} /></div>
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <div className="text-theme"><TrendingUp size={16} /></div>
              <span className="text-xs font-bold text-theme uppercase tracking-widest">Avg. Order Value</span>
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-bold text-theme mb-1">₹{(147.80).toFixed(2)}</div>
              <div className="text-[10px] text-theme flex items-center gap-1"><TrendingDown size={12} className="text-[#ff4d4d]" /> <span className="text-[#ff4d4d]">-1.4%</span> vs last month</div>
            </div>
          </div>

          <div className="bg-theme border border-theme/5 p-5 rounded-lg flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="absolute right-[-10px] top-[-10px] opacity-5 text-theme/50"><Activity size={80} /></div>
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <div className="text-[#8bceff]"><Activity size={16} /></div>
              <span className="text-xs font-bold text-theme uppercase tracking-widest">Conversion Rate</span>
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-bold text-theme mb-1">3.2%</div>
              <div className="text-[10px] text-theme flex items-center gap-1"><TrendingUp size={12} className="text-[#8bceff]" /> <span className="text-[#8bceff]">+0.8%</span> vs last month</div>
            </div>
          </div>
        </div>

        {/* Charts & Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Revenue Trends Chart */}
          <div className="lg:col-span-2 bg-theme border border-theme/5 rounded-lg p-6 flex flex-col h-80">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg font-bold text-theme">Revenue Trends</h2>
               <button className="text-theme hover:text-theme"><MoreVertical size={16} /></button>
             </div>
             <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 relative px-2">
               {/* Grid lines */}
               <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                 <div className="border-t border-theme/5 w-full"></div>
                 <div className="border-t border-theme/5 w-full"></div>
                 <div className="border-t border-theme/5 w-full"></div>
                 <div className="border-t border-theme/5 w-full"></div>
               </div>
               
               {/* Bars */}
               <div className="w-full bg-theme h-[25%] rounded-t-sm relative z-10 hover:bg-theme transition-colors cursor-pointer group"></div>
               <div className="w-full bg-theme h-[35%] rounded-t-sm relative z-10 hover:bg-theme transition-colors cursor-pointer group"></div>
               <div className="w-full bg-theme h-[30%] rounded-t-sm relative z-10 hover:bg-theme transition-colors cursor-pointer group"></div>
               <div className="w-full bg-theme h-[55%] rounded-t-sm relative z-10 hover:bg-theme transition-colors cursor-pointer group"></div>
               <div className="w-full bg-theme h-[45%] rounded-t-sm relative z-10 hover:bg-theme transition-colors cursor-pointer group"></div>
               <div className="w-full bg-theme h-[75%] rounded-t-sm relative z-10 hover:bg-theme transition-colors cursor-pointer group"></div>
               <div className="w-full bg-theme h-[90%] rounded-t-sm relative z-10 shadow-[0_0_15px_rgba(139,206,255,0.4)] cursor-pointer group"></div>
             </div>
             <div className="flex justify-between items-center text-[10px] text-theme font-bold uppercase tracking-widest mt-4 px-4">
               <span>W1</span><span>W2</span><span>W3</span><span>W4</span><span>W5</span><span>W6</span><span>W7</span>
             </div>
          </div>

          {/* Top Products */}
          <div className="bg-theme border border-theme/5 rounded-lg p-6 flex flex-col h-80">
            <h2 className="text-lg font-bold text-theme mb-6">Top Products</h2>
            <div className="flex-1 space-y-4">
              
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-theme">Centrifuge 5424 R</span><span className="text-[#8bceff] font-bold">₹45k</span></div>
                <div className="w-full bg-theme h-1.5 rounded-full overflow-hidden"><div className="bg-theme h-full" style={{width:'85%'}}></div></div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-theme">Microscope Series X</span><span className="text-theme font-bold">₹32k</span></div>
                <div className="w-full bg-theme h-1.5 rounded-full overflow-hidden"><div className="bg-theme/60 h-full" style={{width:'65%'}}></div></div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-theme">Autoclave Pro 20L</span><span className="text-theme font-bold">₹28k</span></div>
                <div className="w-full bg-theme h-1.5 rounded-full overflow-hidden"><div className="bg-theme/40 h-full" style={{width:'55%'}}></div></div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-theme">Precision Balance</span><span className="text-theme font-bold">₹18k</span></div>
                <div className="w-full bg-theme h-1.5 rounded-full overflow-hidden"><div className="bg-theme/30 h-full" style={{width:'35%'}}></div></div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-theme">Spectrophotometer</span><span className="text-theme font-bold">₹12k</span></div>
                <div className="w-full bg-theme h-1.5 rounded-full overflow-hidden"><div className="bg-theme/20 h-full" style={{width:'20%'}}></div></div>
              </div>

            </div>
          </div>
        </div>

        {/* Regional Sales Distribution */}
        <div className="bg-theme border border-theme/5 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-theme/5 flex justify-between items-center">
            <h2 className="text-lg font-bold text-theme">Regional Sales Distribution</h2>
            <button className="text-xs text-[#8bceff] hover:text-theme transition-colors flex items-center gap-1">View Full Report -{'>'}</button>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-theme text-[10px] font-bold text-theme uppercase tracking-wider border-b border-theme/5">
              <tr>
                <th className="p-4">Region</th>
                <th className="p-4">Revenue</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Top Category</th>
                <th className="p-4 text-right">Growth (YOY)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-theme/[0.02]">
                <td className="p-4 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-theme"></div> <span className="text-theme">North America</span></td>
                <td className="p-4 text-[#8bceff]">₹58,200</td>
                <td className="p-4 text-theme">342</td>
                <td className="p-4 text-theme">Centrifuges</td>
                <td className="p-4 text-right text-green-400">+15.2%</td>
              </tr>
              <tr className="hover:bg-theme/[0.02]">
                <td className="p-4 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-theme/60"></div> <span className="text-theme">Europe</span></td>
                <td className="p-4 text-theme">₹42,150</td>
                <td className="p-4 text-theme">285</td>
                <td className="p-4 text-theme">Microscopes</td>
                <td className="p-4 text-right text-green-400">+8.4%</td>
              </tr>
              <tr className="hover:bg-theme/[0.02]">
                <td className="p-4 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-theme/40"></div> <span className="text-theme">Asia Pacific</span></td>
                <td className="p-4 text-theme">₹18,400</td>
                <td className="p-4 text-theme">156</td>
                <td className="p-4 text-theme">Consumables</td>
                <td className="p-4 text-right text-green-400">+22.1%</td>
              </tr>
              <tr className="hover:bg-theme/[0.02]">
                <td className="p-4 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-theme/20"></div> <span className="text-theme">Latin America</span></td>
                <td className="p-4 text-theme">₹5,750</td>
                <td className="p-4 text-theme">59</td>
                <td className="p-4 text-theme">Liquid Handling</td>
                <td className="p-4 text-right text-[#ff4d4d]">-2.3%</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
