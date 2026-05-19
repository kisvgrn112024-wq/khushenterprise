import { Filter, Download, DollarSign, AlertTriangle, Home, Search, Plus, Minus } from "lucide-react";

export default function InventoryManagement() {
  const stockItems = [
    { sku: "MCR-8001", name: "Digital Binocular Microscope", warehouse: "North Hub (A)", stock: 142, status: "IN STOCK" },
    { sku: "CEN-4522", name: "High-Speed Centrifuge", warehouse: "East Facility", stock: 5, status: "LOW STOCK" },
    { sku: "PIP-1002", name: "Adjustable Volume Pipette", warehouse: "North Hub (B)", stock: 0, status: "OUT OF STOCK" },
    { sku: "INC-3050", name: "Laboratory Incubator", warehouse: "South Depot", stock: 28, status: "IN STOCK" },
    { sku: "AUT-9910", name: "Benchtop Autoclave", warehouse: "North Hub (A)", stock: 2, status: "LOW STOCK" }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Inventory Management</h1>
          <p className="text-gray-400 text-sm">Comprehensive stock overview and movement tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#111111] border border-white/5 hover:bg-white/5 text-gray-300 text-sm px-4 py-2.5 rounded transition-colors font-bold">
            <Filter size={16} /> Filter
          </button>
          <button className="bg-[#8bceff] hover:bg-[#6ab3f0] text-black font-bold px-4 py-2.5 rounded text-sm flex items-center gap-2 transition-colors">
            <Download size={16} strokeWidth={2.5} /> Export Report
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#161616] border border-white/5 rounded-lg p-6 relative overflow-hidden">
          <div className="flex items-start justify-between mb-4 relative z-10">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Stock Value</span>
            <DollarSign size={16} className="text-[#8bceff]" />
          </div>
          <div className="relative z-10">
            <div className="text-4xl font-bold text-white mb-1">$1.24M</div>
            <div className="text-xs text-brand-yellow font-medium">~ +4.2% from last month</div>
          </div>
        </div>

        <div className="bg-[#1f1111] border border-[#ff4d4d]/20 rounded-lg p-6 relative overflow-hidden">
          <div className="flex items-start justify-between mb-4 relative z-10">
            <span className="text-xs font-bold text-[#ff4d4d] uppercase tracking-widest">Critical Low Stock</span>
            <AlertTriangle size={16} className="text-[#ff4d4d]" />
          </div>
          <div className="relative z-10">
            <div className="text-4xl font-bold text-white mb-1">24</div>
            <div className="text-xs text-gray-400">Items require immediate reordering</div>
          </div>
        </div>

        <div className="bg-[#161616] border border-white/5 rounded-lg p-6 relative overflow-hidden">
          <div className="flex items-start justify-between mb-4 relative z-10">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Warehouse Capacity</span>
            <Home size={16} className="text-[#8bceff]" />
          </div>
          <div className="relative z-10 flex flex-col justify-end h-[68px]">
            <div className="flex justify-between items-end mb-2">
              <div className="text-4xl font-bold text-white">78%</div>
              <div className="text-xs text-gray-400 mb-1">Utilization</div>
            </div>
            <div className="w-full bg-[#111111] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#8bceff] h-full w-[78%]"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Stock Levels by Item */}
        <div className="lg:col-span-2 bg-[#161616] border border-white/5 rounded-lg flex flex-col">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Stock Levels by Item</h2>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search SKU or Name" className="bg-[#111111] border border-white/5 focus:border-white/20 text-xs text-white pl-8 pr-4 py-2 rounded w-64 outline-none transition-colors" />
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-[#161616] text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Warehouse</th>
                <th className="px-6 py-4 text-right">Stock</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stockItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-[#8bceff] font-mono text-xs">{item.sku}</td>
                  <td className="px-6 py-4 text-gray-300 font-medium">{item.name}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{item.warehouse}</td>
                  <td className={`px-6 py-4 text-right font-bold ${item.stock === 0 ? 'text-gray-500' : 'text-white'}`}>{item.stock}</td>
                  <td className="px-6 py-4 text-center">
                    {item.status === 'IN STOCK' && (
                      <span className="inline-block text-[10px] font-bold tracking-widest bg-[#1f1a11] border border-brand-yellow/20 px-3 py-1 rounded-full text-brand-yellow">IN STOCK</span>
                    )}
                    {item.status === 'LOW STOCK' && (
                      <span className="inline-block text-[10px] font-bold tracking-widest bg-[#1f1111] border border-[#ff4d4d]/20 px-3 py-1 rounded-full text-[#ff4d4d]">LOW STOCK</span>
                    )}
                    {item.status === 'OUT OF STOCK' && (
                      <span className="inline-block text-[10px] font-bold tracking-widest bg-[#111111] border border-white/10 px-3 py-1 rounded-full text-gray-500">OUT OF STOCK</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t border-white/5 text-center mt-auto">
            <button className="text-sm font-bold text-[#8bceff] hover:text-white transition-colors">View All Inventory</button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          {/* Status Breakdown */}
          <div className="bg-[#161616] border border-white/5 rounded-lg p-6">
            <h2 className="text-lg font-bold text-white mb-6">Status Breakdown</h2>
            <div className="flex flex-col items-center justify-center relative mb-8 mt-4">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-tr from-brand-yellow via-brand-yellow/50 to-[#8bceff] relative flex items-center justify-center overflow-hidden">
                 <div className="absolute top-0 right-0 w-1/2 h-full bg-[#8bceff]"></div>
                 <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#ff4d4d]"></div>
                 <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-white/60"></div>
                 <div className="w-24 h-24 bg-[#161616] rounded-xl relative z-10 flex flex-col items-center justify-center border border-white/5 shadow-inner">
                   <div className="text-3xl font-bold text-white">68%</div>
                 </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#8bceff]"></div><span className="text-gray-300">In Stock</span></div>
                <span className="text-gray-400">68%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#ff4d4d]"></div><span className="text-gray-300">Low Stock</span></div>
                <span className="text-gray-400">15%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-brand-yellow"></div><span className="text-gray-300">Out of Stock</span></div>
                <span className="text-gray-400">17%</span>
              </div>
            </div>
          </div>

          {/* Recent Movement */}
          <div className="bg-[#161616] border border-white/5 rounded-lg p-6">
            <h2 className="text-lg font-bold text-white mb-4">Recent Movement</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded bg-[#0c1825] border border-[#8bceff]/20 flex items-center justify-center text-[#8bceff] shrink-0 mt-1"><Plus size={14} /></div>
                <div>
                  <div className="text-sm text-gray-300 mb-0.5"><span className="text-white font-bold">+50 Units</span> received at North Hub (A)</div>
                  <div className="text-[10px] text-gray-500 font-mono">MCR-8001 • 2 hrs ago</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded bg-[#111111] border border-white/10 flex items-center justify-center text-gray-500 shrink-0 mt-1"><Minus size={14} /></div>
                <div>
                  <div className="text-sm text-gray-300 mb-0.5"><span className="text-white font-bold">-12 Units</span> shipped from East Facility</div>
                  <div className="text-[10px] text-gray-500 font-mono">CEN-4522 • 5 hrs ago</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded bg-[#1f1111] border border-[#ff4d4d]/20 flex items-center justify-center text-[#ff4d4d] shrink-0 mt-1"><AlertTriangle size={14} /></div>
                <div>
                  <div className="text-sm text-gray-300 mb-0.5"><span className="text-[#ff4d4d] font-bold">Stock Depleted</span> at North Hub (B)</div>
                  <div className="text-[10px] text-gray-500 font-mono">PIP-1002 • 1 day ago</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
