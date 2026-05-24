"use client";

import { Download, Calendar, MoreVertical, Building2, User, CheckCircle2, XCircle, Clock, Truck, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { useDownload } from "@/components/admin/DownloadToast";

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState("All Orders");
  const { startDownload } = useDownload();
  
  const initialOrders: any[] = [];

  const [orders, setOrders] = useState<any[]>([]);

  // Load from localStorage or database
  useEffect(() => {
    const fetchOrders = async () => {
      // First load local storage
      let localOrders = [];
      const saved = localStorage.getItem("ke_admin_orders");
      if (saved) {
        localOrders = JSON.parse(saved);
        setOrders(localOrders);
      } else {
        setOrders([]);
        localStorage.setItem("ke_admin_orders", JSON.stringify([]));
      }

      // Try fetching from backend API
      try {
        const API_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
          ? `http://${window.location.hostname}:5000/api/orders`
          : '/api/orders';
        const res = await fetch(API_URL);
        if (res.ok) {
          const data = await res.json();
          // Transform to admin order shape
          const adminOrders = data.map((o: any) => ({
            id: o.id,
            date: o.date.split(",")[0],
            time: o.time,
            customer: o.customer,
            email: o.email,
            amount: o.amount,
            status: o.status,
            type: o.payment.includes("UPI") ? "individual" : "company"
          }));
          setOrders(adminOrders);
          localStorage.setItem("ke_admin_orders", JSON.stringify(adminOrders));
        }
      } catch (err) {
        console.warn("API offline or error fetching orders in admin portal.");
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => 
    activeTab === "All Orders" ? true : order.status === activeTab
  );

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Generate tracking details if dispatched
    let payload: any = { status: newStatus };
    if (newStatus === "Dispatched") {
      payload.courier = "Blue Dart Express";
      payload.tracking = `987654${Math.floor(10000000 + Math.random() * 90000000)}`;
      payload.expectedDate = `Expected Delivery: ${new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`;
      payload.weight = "8.25 kg";
      payload.dimensions = "45cm x 35cm x 50cm";
      payload.hsnCode = "HSN 9011 - Optical Microscope Assembly";
      payload.packingDesc = "Heavy-duty Borosilicate Double-walled Styropack with shock absorption pads.";
    }

    try {
      const API_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? `http://${window.location.hostname}:5000/api/orders/${id}`
        : `/api/orders/${id}`;
      const res = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        console.log("Order status updated successfully in DB");
      }
    } catch (e) {
      console.warn("Offline: updated locally only");
    }

    // Always mirror to localStorage ke_admin_orders
    const updatedAdmin = orders.map(order => order.id === id ? { ...order, status: newStatus } : order);
    setOrders(updatedAdmin);
    localStorage.setItem("ke_admin_orders", JSON.stringify(updatedAdmin));

    // Mirror to customer-facing localStorage key "ke_orders"
    const savedCustomer = localStorage.getItem("ke_orders");
    if (savedCustomer) {
      const customerOrders = JSON.parse(savedCustomer);
      const updatedCustomer = customerOrders.map((o: any) => {
        if (o.id === id) {
          let updatedItem = { 
            ...o, 
            status: newStatus,
            progress: newStatus === "Placed" ? 0 : newStatus === "Confirmed" ? 1 : newStatus === "Packed" ? 2 : newStatus === "Dispatched" ? 3 : newStatus === "Delivered" ? 4 : o.progress
          };
          if (newStatus === "Dispatched") {
            updatedItem.courier = "Blue Dart Express";
            updatedItem.tracking = payload.tracking;
            updatedItem.expectedDate = payload.expectedDate;
            updatedItem.weight = payload.weight;
            updatedItem.dimensions = payload.dimensions;
            updatedItem.hsnCode = payload.hsnCode;
            updatedItem.packingDesc = payload.packingDesc;
          } else if (newStatus === "Delivered") {
            updatedItem.expectedDate = `Delivered on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`;
          }
          return updatedItem;
        }
        return o;
      });
      localStorage.setItem("ke_orders", JSON.stringify(updatedCustomer));
      
      // Dispatch a storage event to alert other tabs of change!
      window.dispatchEvent(new Event("storage"));
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-theme mb-1">Order Management</h1>
          <p className="text-theme text-sm">Monitor, filter, and process recent customer equipment orders.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => startDownload("Orders_Report.pdf", "3.2 MB", "PDF Document")} className="flex items-center gap-2 bg-theme border border-theme/20 hover:bg-theme text-theme text-sm px-4 py-2.5 rounded transition-colors font-bold">
            <Download size={16} /> PDF
          </button>
          <button onClick={() => startDownload("Orders_Export.csv", "1.1 MB", "CSV File")} className="flex items-center gap-2 bg-theme border border-theme/20 hover:bg-theme text-[#8bceff] text-sm px-4 py-2.5 rounded transition-colors font-bold">
            <FileText size={16} /> CSV
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-theme border border-theme/5 rounded-lg p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-theme uppercase tracking-widest mr-2">Status:</span>
          {["All Orders", "Processing", "Shipped", "Delivered", "Cancelled"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                activeTab === tab 
                  ? "bg-theme/10 text-[#8bceff] border border-theme/20" 
                  : "bg-transparent text-theme border border-theme/10 hover:bg-theme/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-theme border border-theme/5 rounded px-3 py-1.5">
            <Calendar size={14} className="text-theme" />
            <span className="text-xs text-theme">Oct 1</span>
          </div>
          <span className="text-theme">-</span>
          <div className="flex items-center gap-2 bg-theme border border-theme/5 rounded px-3 py-1.5">
            <Calendar size={14} className="text-theme" />
            <span className="text-xs text-theme">Oct 31</span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-theme border border-theme/5 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-theme text-[10px] font-bold text-theme uppercase tracking-wider border-b border-theme/5">
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
              <tr key={idx} className="hover:bg-theme/[0.02] transition-colors relative group">
                <td className="p-5 font-bold text-[#8bceff]">{order.id}</td>
                <td className="p-5">
                  <div className="text-theme mb-0.5">{order.date}</div>
                  <div className="text-xs text-theme">{order.time}</div>
                </td>
                <td className="p-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-theme border border-theme/5 flex items-center justify-center text-theme shrink-0">
                    {order.type === 'company' ? <Building2 size={14} /> : <User size={14} />}
                  </div>
                  <div>
                    <div className="text-theme font-medium mb-0.5">{order.customer}</div>
                    <div className="text-xs text-theme">{order.email}</div>
                  </div>
                </td>
                <td className="p-5 font-bold text-theme">{order.amount}</td>
                <td className="p-5">
                  {order.status === 'Placed' && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest bg-theme border border-yellow-500/20 px-3 py-1 rounded-full text-yellow-500 uppercase">
                      <Clock size={10} /> Placed
                    </span>
                  )}
                  {order.status === 'Confirmed' && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest bg-theme border border-teal-500/20 px-3 py-1 rounded-full text-teal-400 uppercase">
                      <CheckCircle2 size={10} /> Confirmed
                    </span>
                  )}
                  {order.status === 'Packed' && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest bg-theme border border-blue-500/20 px-3 py-1 rounded-full text-[#8bceff] uppercase">
                      <Clock size={10} /> Packed
                    </span>
                  )}
                  {order.status === 'Dispatched' && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest bg-theme border border-sky-400/20 px-3 py-1 rounded-full text-sky-400 uppercase">
                      <Truck size={10} /> Dispatched
                    </span>
                  )}
                  {order.status === 'Delivered' && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest bg-theme border border-green-400/20 px-3 py-1 rounded-full text-green-400 uppercase">
                      <CheckCircle2 size={10} /> Delivered
                    </span>
                  )}
                  {order.status === 'Cancelled' && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest bg-theme border border-red-500/20 px-3 py-1 rounded-full text-red-500 uppercase">
                      <XCircle size={10} /> Cancelled
                    </span>
                  )}
                </td>
                <td className="p-5 text-center relative">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="bg-theme border border-theme/5 text-theme text-xs py-1.5 px-2 rounded outline-none cursor-pointer hover:bg-theme/5 transition-colors appearance-none text-center"
                  >
                    <option value="Placed">Placed</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Packed">Packed</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 border-t border-theme/5 flex justify-between items-center text-xs text-theme">
          <div>Showing 1 to {filteredOrders.length} of {orders.length} orders</div>
          <div className="flex gap-1">
            <button className="w-6 h-6 flex items-center justify-center hover:text-theme transition-colors">{'<'}</button>
            <button className="w-6 h-6 flex items-center justify-center bg-theme text-[#8bceff] rounded font-bold">1</button>
            <button className="w-6 h-6 flex items-center justify-center hover:text-theme transition-colors">2</button>
            <button className="w-6 h-6 flex items-center justify-center hover:text-theme transition-colors">3</button>
            <span className="w-6 h-6 flex items-center justify-center text-theme">...</span>
            <button className="w-6 h-6 flex items-center justify-center hover:text-theme transition-colors">{'>'}</button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
