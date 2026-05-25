"use client";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";

const MOCK_CUSTOMERS = [
  { id: "CUST-48291", email: "rahul.mehta@instsci.edu", phone: "+91 98765 43210", ordersCount: 14, lastOrderDate: "24 May 2026" },
  { id: "CUST-10394", email: "a.sharma@biolabs.in", phone: "+91 87654 32109", ordersCount: 3, lastOrderDate: "22 May 2026" },
  { id: "CUST-98274", email: "v.khanna@qclabs.com", phone: "+91 76543 21098", ordersCount: 42, lastOrderDate: "25 May 2026" },
];

const generateCustId = (email: string) => {
  if (!email) return "CUST-UNKNOWN";
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  const code = Math.abs(hash % 90000) + 10000;
  return `CUST-${code}`;
};

export default function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    // Load customer data from orders
    const savedOrders = localStorage.getItem("ke_orders");
    let ordersList: any[] = [];
    if (savedOrders) {
      try {
        ordersList = JSON.parse(savedOrders);
      } catch (e) {
        console.error(e);
      }
    }

    const savedAdminOrders = localStorage.getItem("ke_admin_orders");
    let adminOrdersList: any[] = [];
    if (savedAdminOrders) {
      try {
        adminOrdersList = JSON.parse(savedAdminOrders);
      } catch (e) {
        console.error(e);
      }
    }

    // Merge orders to avoid duplicates
    const allOrdersMap = new Map();
    ordersList.forEach(o => allOrdersMap.set(o.id, o));
    adminOrdersList.forEach(o => {
      if (!allOrdersMap.has(o.id)) {
        allOrdersMap.set(o.id, {
          id: o.id,
          customer: o.customer,
          email: o.email,
          phone: o.phone || "N/A",
          date: o.date,
        });
      }
    });

    const mergedOrders = Array.from(allOrdersMap.values());

    const customerMap = new Map();
    mergedOrders.forEach(order => {
      const email = order.email?.toLowerCase().trim() || "unknown@khush.com";
      const phone = order.phone || "N/A";
      const orderDate = order.date ? order.date.split(",")[0] : "TBD";

      if (customerMap.has(email)) {
        const existing = customerMap.get(email);
        existing.ordersCount += 1;
        if (orderDate && orderDate !== "TBD") {
          existing.lastOrderDate = orderDate;
        }
      } else {
        customerMap.set(email, {
          id: generateCustId(email),
          email: email,
          phone: phone,
          ordersCount: 1,
          lastOrderDate: orderDate
        });
      }
    });

    if (customerMap.size === 0) {
      setCustomers(MOCK_CUSTOMERS);
    } else {
      setCustomers(Array.from(customerMap.values()));
    }
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-theme mb-1">Customer Registry</h1>
          <p className="text-theme text-sm">Overview of customers authorized to place orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme" />
            <input 
              type="text" 
              placeholder="Search registry..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-theme border border-theme/5 focus:border-theme/20 text-xs text-theme pl-8 pr-4 py-2.5 rounded w-64 outline-none transition-colors" 
            />
          </div>
        </div>
      </div>

      {/* Customer Registry Table */}
      <div className="bg-theme border border-theme/5 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-theme/5">
          <h2 className="text-xl font-bold text-theme">Authorized Customer IDs</h2>
        </div>
        
        <table className="w-full text-left text-sm">
          <thead className="bg-theme text-[10px] font-bold text-theme uppercase tracking-wider border-b border-theme/5">
            <tr>
              <th className="p-5">Customer ID</th>
              <th className="p-5">Email Address</th>
              <th className="p-5">Phone Number</th>
              <th className="p-5 text-center">Orders Placed</th>
              <th className="p-5 text-right">Last Order Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredCustomers.map((c, idx) => (
              <tr key={idx} className="hover:bg-theme/[0.02] transition-colors">
                <td className="p-5">
                  <span className="font-mono text-xs font-bold text-[#8bceff]">{c.id}</span>
                </td>
                <td className="p-5 text-theme text-xs font-mono">
                  {c.email}
                </td>
                <td className="p-5 text-theme text-xs font-mono">
                  {c.phone}
                </td>
                <td className="p-5 text-center text-theme font-medium">
                  {c.ordersCount}
                </td>
                <td className="p-5 text-right text-theme text-xs">
                  {c.lastOrderDate}
                </td>
              </tr>
            ))}
            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-theme text-sm">
                  No registered customers found matching search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        <div className="p-4 border-t border-theme/5 flex justify-between items-center text-xs text-theme">
          <div>Showing {filteredCustomers.length} customer records</div>
        </div>
      </div>
      
    </div>
  );
}
