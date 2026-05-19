"use client";

import { Download, Calendar, MoreVertical, Building2, User, CheckCircle2, XCircle, Clock, Truck, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { useDownload } from "@/components/admin/DownloadToast";

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState("All Orders");
  const { startDownload } = useDownload();
  
  const initialOrders = [
    {
      id: "#ORD-8901",
      date: "Oct 24, 2023",
      time: "14:32",
      customer: "BioTech Solutions Inc.",
      email: "contact@biotech.com",
      amount: "$4,250.00",
      status: "Processing",
      type: "company"
    },
    {
      id: "#ORD-8895",
      date: "Oct 23, 2023",
      time: "09:15",
      customer: "Dr. Emily Chen (University Lab)",
      email: "echen@university.edu",
      amount: "$12,800.50",
      status: "Shipped",
      type: "individual"
    },
    {
      id: "#ORD-8872",
      date: "Oct 20, 2023",
      time: "16:45",
      customer: "National Research Facility",
      email: "procurement@nrf.gov",
      amount: "$35,000.00",
      status: "Delivered",
      type: "company"
    },
    {
      id: "#ORD-8850",
      date: "Oct 18, 2023",
      time: "11:20",
      customer: "Independent Clinics LLC",
      email: "orders@indclinics.com",
      amount: "$850.00",
      status: "Cancelled",
      type: "company"
    },
    {
      id: "#ORD-8841",
      date: "Oct 15, 2023",
      time: "10:05",
      customer: "St. Jude High School",
      email: "science.dept@stjude.edu",
      amount: "$2,100.00",
      status: "Delivered",
      type: "company"
    }
  ];

  const [orders, setOrders] = useState<typeof initialOrders>([]);

  // Load from localStorage or fallback
  useEffect(() => {
    const saved = localStorage.getItem("ke_admin_orders");
    if (saved) {
      setOrders(JSON.parse(saved));
    } else {
      setOrders(initialOrders);
      localStorage.setItem("ke_admin_orders", JSON.stringify(initialOrders));
    }
  }, []);

  const filteredOrders = orders.filter(order => 
    activeTab === "All Orders" ? true : order.status === activeTab
  );

  const handleStatusChange = (id: string, newStatus: string) => {
    const updated = orders.map(order => order.id === id ? { ...order, status: newStatus } : order);
    setOrders(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("ke_admin_orders", JSON.stringify(updated));
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Order Management</h1>
          <p className="text-gray-400 text-sm">Monitor, filter, and process recent customer equipment orders.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => startDownload("Orders_Report.pdf", "3.2 MB", "PDF Document")} className="flex items-center gap-2 bg-[#8bceff] border border-[#8bceff]/20 hover:bg-[#6ab3f0] text-black text-sm px-4 py-2.5 rounded transition-colors font-bold">
            <Download size={16} /> PDF
          </button>
          <button onClick={() => startDownload("Orders_Export.csv", "1.1 MB", "CSV File")} className="flex items-center gap-2 bg-[#0c1825] border border-[#8bceff]/20 hover:bg-[#112435] text-[#8bceff] text-sm px-4 py-2.5 rounded transition-colors font-bold">
            <FileText size={16} /> CSV
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#161616] border border-white/5 rounded-lg p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Status:</span>
          {["All Orders", "Processing", "Shipped", "Delivered", "Cancelled"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                activeTab === tab 
                  ? "bg-[#8bceff]/10 text-[#8bceff] border border-[#8bceff]/20" 
                  : "bg-transparent text-gray-400 border border-white/10 hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#111111] border border-white/5 rounded px-3 py-1.5">
            <Calendar size={14} className="text-gray-500" />
            <span className="text-xs text-gray-300">Oct 1</span>
          </div>
          <span className="text-gray-500">-</span>
          <div className="flex items-center gap-2 bg-[#111111] border border-white/5 rounded px-3 py-1.5">
            <Calendar size={14} className="text-gray-500" />
            <span className="text-xs text-gray-300">Oct 31</span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#161616] border border-white/5 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#161616] text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/5">
            <tr>
              <th className="p-5">Order ID</th>
              <th className="p-5">Date</th>
              <th className="p-5">Customer</th>
              <th className="p-5">Amount</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredOrders.map((order, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors relative group">
                <td className="p-5 font-bold text-[#8bceff]">{order.id}</td>
                <td className="p-5">
                  <div className="text-gray-300 mb-0.5">{order.date}</div>
                  <div className="text-xs text-gray-500">{order.time}</div>
                </td>
                <td className="p-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#111111] border border-white/5 flex items-center justify-center text-gray-500 shrink-0">
                    {order.type === 'company' ? <Building2 size={14} /> : <User size={14} />}
                  </div>
                  <div>
                    <div className="text-gray-300 font-medium mb-0.5">{order.customer}</div>
                    <div className="text-xs text-gray-500">{order.email}</div>
                  </div>
                </td>
                <td className="p-5 font-bold text-white">{order.amount}</td>
                <td className="p-5">
                  {order.status === 'Processing' && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest bg-[#1f1a11] border border-brand-yellow/20 px-3 py-1 rounded-full text-brand-yellow uppercase">
                      <Clock size={10} /> {order.status}
                    </span>
                  )}
                  {order.status === 'Shipped' && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest bg-[#0c1825] border border-[#8bceff]/20 px-3 py-1 rounded-full text-[#8bceff] uppercase">
                      <Truck size={10} /> {order.status}
                    </span>
                  )}
                  {order.status === 'Delivered' && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest bg-[#0c1810] border border-green-400/20 px-3 py-1 rounded-full text-green-400 uppercase">
                      <CheckCircle2 size={10} /> {order.status}
                    </span>
                  )}
                  {order.status === 'Cancelled' && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest bg-[#1f1111] border border-[#ff4d4d]/20 px-3 py-1 rounded-full text-[#ff4d4d] uppercase">
                      <XCircle size={10} /> {order.status}
                    </span>
                  )}
                </td>
                <td className="p-5 text-center relative">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="bg-[#111111] border border-white/5 text-gray-400 text-xs py-1.5 px-2 rounded outline-none cursor-pointer hover:bg-white/5 transition-colors appearance-none text-center"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500">
          <div>Showing 1 to {filteredOrders.length} of {orders.length} orders</div>
          <div className="flex gap-1">
            <button className="w-6 h-6 flex items-center justify-center hover:text-white transition-colors">{'<'}</button>
            <button className="w-6 h-6 flex items-center justify-center bg-[#0c1825] text-[#8bceff] rounded font-bold">1</button>
            <button className="w-6 h-6 flex items-center justify-center hover:text-white transition-colors">2</button>
            <button className="w-6 h-6 flex items-center justify-center hover:text-white transition-colors">3</button>
            <span className="w-6 h-6 flex items-center justify-center text-gray-600">...</span>
            <button className="w-6 h-6 flex items-center justify-center hover:text-white transition-colors">{'>'}</button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
