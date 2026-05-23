"use client";

import { CheckCircle2, Circle, Package, Truck, Calendar, MessageSquare, Phone, Copy, Check, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

interface Order {
  id: string;
  date: string;
  total: number;
  payment: string;
  status: "Placed" | "Processing" | "Dispatched" | "Delivered";
  expectedDate: string;
  courier: string;
  tracking: string;
  itemsCount: number;
  progress: number; // 0 to 4
  weight: string;
  dimensions: string;
  hsnCode: string;
  packingDesc: string;
}

const DEFAULT_ORDERS: Order[] = [
  {
    id: "KE-ORD-88741",
    date: "14 May 2026, 02:15 PM",
    total: 38400,
    payment: "B2B Credit Line (30 Days)",
    status: "Dispatched",
    expectedDate: "Expected Delivery: 19 May 2026",
    courier: "Blue Dart Aviation Express",
    tracking: "98765432109876",
    itemsCount: 3,
    progress: 3,
    weight: "8.25 kg",
    dimensions: "45cm x 35cm x 50cm",
    hsnCode: "HSN 9011 - Optical Microscope Assembly",
    packingDesc: "Heavy-duty Borosilicate Double-walled Styropack with shock absorption pads."
  },
  {
    id: "KE-ORD-88690",
    date: "12 May 2026, 10:30 AM",
    total: 12500,
    payment: "UPI / QR Code",
    status: "Delivered",
    expectedDate: "Delivered on 15 May 2026",
    courier: "Delhivery Surface",
    tracking: "DLV1234567890",
    itemsCount: 1,
    progress: 4,
    weight: "3.10 kg",
    dimensions: "30cm x 30cm x 35cm",
    hsnCode: "HSN 7017 - Laboratory Glassware",
    packingDesc: "Standard bubble wrap casing with foam peanuts."
  },
  {
    id: "KE-ORD-88755",
    date: "17 May 2026, 11:20 AM",
    total: 9400,
    payment: "Cash On Delivery (COD)",
    status: "Processing",
    expectedDate: "Undergoing quality inspection",
    courier: "TBD",
    tracking: "TBD",
    itemsCount: 2,
    progress: 1,
    weight: "2.50 kg",
    dimensions: "25cm x 20cm x 30cm",
    hsnCode: "HSN 9027 - Physical Analysis Instruments",
    packingDesc: "Electrostatic discharge safe poly-lining."
  }
];

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    { sender: "bot", text: "Welcome to Khush Enterprises Dispatch Desk! How can we assist you with your consignment today?" }
  ]);

  const steps = ["Placed", "Confirmed", "Packed", "Dispatched", "Delivered"];

  useEffect(() => {
    // Load orders
    const savedOrders = localStorage.getItem("ke_orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      setOrders(DEFAULT_ORDERS);
      localStorage.setItem("ke_orders", JSON.stringify(DEFAULT_ORDERS));
    }

    // Load active session profile
    const savedUser = localStorage.getItem("ke_user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    const newMsg = { sender: "user" as const, text };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput("");

    // Simulated Bot Responses
    setTimeout(() => {
      let reply = "I've recorded your query. A dispatch executive will reach out to you shortly.";
      const query = text.toLowerCase();
      
      if (query.includes("invoice") || query.includes("hsn")) {
        reply = "Certainly! I have generated your digital B2B Tax Invoice matching your HSN declarations. You can download it directly using the 'Download Invoice' button next to your order details.";
      } else if (query.includes("tracking") || query.includes("where")) {
        const activeTracking = orders.find(o => o.status === "Dispatched")?.tracking || "98765432109876";
        reply = `Consignment consignment tracking code for your active order is ${activeTracking}. Shipped via Blue Dart Aviation. Live tracking is updating now.`;
      } else if (query.includes("credit") || query.includes("limit")) {
        reply = `Your B2B account profile is verified under contract terms. Credit line limit: ₹1,50,000. Balance remaining: ₹1,11,600. Net payment terms: 30 days.`;
      }

      setChatMessages(prev => [...prev, { sender: "bot" as const, text: reply }]);
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-slate-300">
      
      {/* Dynamic greeting header from Google One-Tap */}
      {currentUser && (
        <div className="bg-theme/20 border border-theme/10 p-4 rounded-xl mb-8 flex justify-between items-center backdrop-blur-md">
          <div>
            <div className="text-[10px] uppercase font-bold text-[#8bceff] tracking-widest">Active B2B Contract Session</div>
            <div className="text-theme font-extrabold text-lg mt-0.5">Welcome, {currentUser.name}</div>
            <div className="text-xs text-theme font-mono mt-0.5">{currentUser.org} | {currentUser.email}</div>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem("ke_user");
              window.location.reload();
            }}
            className="text-xs text-theme hover:text-theme underline"
          >
            Switch Account
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Order Consignments */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-theme/5">
            <div>
              <h1 className="text-2xl font-bold text-theme mb-1">Your Consignments</h1>
              <p className="text-xs text-theme">Track shipping, packaging dimensions, and retrieve custom HSN reports.</p>
            </div>
          </div>

          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-theme rounded-xl p-6 border border-theme/5 shadow-md flex flex-col justify-between">
                
                {/* Core Order Info Bar */}
                <div className="flex flex-wrap md:flex-nowrap justify-between gap-6 mb-6 pb-6 border-b border-theme/5">
                  <div className="w-full md:w-1/3">
                    <div className="text-[10px] font-bold text-theme uppercase tracking-widest mb-1">Order ID</div>
                    <div className="font-bold text-theme text-base mb-1">{order.id}</div>
                    <div className="text-xs text-theme mb-4 flex items-center gap-1.5"><Calendar size={13}/> {order.date}</div>
                    
                    <div className="text-[10px] font-bold text-theme uppercase tracking-widest mb-1">Wholesale Total</div>
                    <div className="font-extrabold text-theme text-lg mb-1">₹{order.total.toLocaleString("en-IN")}</div>
                    <div className="text-xs text-theme font-mono">Terms: {order.payment}</div>
                  </div>

                  {/* Dynamic Progress Timeline */}
                  <div className="w-full md:w-2/3 flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-3">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        order.status === "Delivered" ? "bg-green-500/10 text-green-400" :
                        order.status === "Dispatched" ? "bg-blue-500/10 text-[#8bceff]" : "bg-yellow-500/10 text-yellow-400"
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-xs text-theme">{order.expectedDate}</span>
                    </div>

                    <div className="relative mt-4">
                      <div className="absolute top-2 left-0 w-full h-1 bg-slate-800 rounded-full"></div>
                      <div className="absolute top-2 left-0 h-1 bg-green-500 rounded-full transition-all duration-500" style={{ width: `${(order.progress / 4) * 100}%` }}></div>
                      
                      <div className="relative flex justify-between">
                        {steps.map((step, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            {idx <= order.progress ? (
                              <CheckCircle2 size={16} className="text-green-500 bg-theme rounded-full z-10" />
                            ) : (
                              <Circle size={16} className="text-slate-600 bg-theme rounded-full z-10" />
                            )}
                            <span className={`text-[10px] font-bold mt-2 ${idx <= order.progress ? 'text-theme' : 'text-slate-600'}`}>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logistics Dispatch Summary Box for "Dispatched" orders */}
                {order.status === "Dispatched" && (
                  <div className="bg-theme/60 border border-theme/20 rounded-lg p-5 mb-6">
                    <div className="text-[#8bceff] font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Truck size={14} /> Cargo Logistics Dispatch Summary
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono mb-4 pb-4 border-b border-theme/5">
                      <div>
                        <span className="text-theme block text-[9px] uppercase tracking-wider">HSN Code</span>
                        <span className="text-theme font-bold">{order.hsnCode}</span>
                      </div>
                      <div>
                        <span className="text-theme block text-[9px] uppercase tracking-wider">Cargo Weight</span>
                        <span className="text-theme font-bold">{order.weight}</span>
                      </div>
                      <div>
                        <span className="text-theme block text-[9px] uppercase tracking-wider">Box Dimensions</span>
                        <span className="text-theme font-bold">{order.dimensions}</span>
                      </div>
                      <div>
                        <span className="text-theme block text-[9px] uppercase tracking-wider">Courier Carrier</span>
                        <span className="text-theme font-bold">{order.courier}</span>
                      </div>
                    </div>

                    <div className="text-xs mb-4">
                      <span className="text-theme block text-[9px] font-mono uppercase tracking-wider mb-0.5">Packaging Description</span>
                      <p className="text-theme leading-relaxed">{order.packingDesc}</p>
                    </div>

                    <div className="flex items-center justify-between bg-theme/30 p-3 rounded border border-theme/5">
                      <div>
                        <span className="text-theme block text-[9px] font-mono uppercase tracking-wider">Blue Dart Air Tracking ID</span>
                        <span className="text-[#8bceff] font-bold font-mono">{order.tracking}</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => copyToClipboard(order.tracking)}
                          className="px-2.5 py-1.5 bg-theme hover:bg-theme/5 border border-theme/5 rounded text-[10px] text-theme flex items-center gap-1 transition-colors"
                        >
                          {copiedId === order.tracking ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                          {copiedId === order.tracking ? "Copied" : "Copy ID"}
                        </button>
                        <a 
                          href="https://api.whatsapp.com/send?phone=919876543210&text=Hi%20Khush%20Enterprises,%20I'm%20checking%20the%20status%20of%20my%20consignment%20ID%20KE-ORD-88741"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-theme hover:bg-theme text-theme font-bold rounded text-[10px] flex items-center gap-1 transition-colors"
                        >
                          WhatsApp Support
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Default Bottom Bar / Actions */}
                <div className="flex justify-between items-center pt-2 mt-auto">
                  <div className="text-[11px] text-theme font-mono">
                    Consignment items count: {order.itemsCount}
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-1.5 bg-theme hover:bg-theme/5 border border-theme/5 rounded text-xs font-bold transition-colors">
                      Download HSN Invoice
                    </button>
                    {order.status === "Delivered" && (
                      <button className="px-4 py-1.5 bg-theme/10 hover:bg-theme/20 border border-theme/20 text-[#8bceff] rounded text-xs font-bold transition-colors">
                        Order Again
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Integrated B2B Support Desk */}
        <div className="space-y-6">
          <div className="bg-theme border border-theme/5 rounded-xl p-6 flex flex-col h-[550px]">
            <div className="border-b border-theme/5 pb-4 mb-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-theme/10 text-[#8bceff] flex items-center justify-center">
                <MessageSquare size={18} />
              </div>
              <div>
                <h3 className="text-theme font-bold text-sm">KE Consignment Assistant</h3>
                <span className="text-[10px] text-green-400 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></div> Online (B2B Desk)
                </span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs leading-relaxed mb-4 scrollbar-thin scrollbar-thumb-white/5">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-lg max-w-[85%] ${
                    msg.sender === "user" 
                      ? "bg-theme/10 text-theme ml-auto border border-theme/20" 
                      : "bg-theme text-theme mr-auto border border-theme/5"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Quick Queries Buttons */}
            <div className="space-y-2 mb-4">
              <span className="text-[9px] font-bold text-theme uppercase tracking-widest block mb-1">Consignment Quick Prompts</span>
              <div className="flex flex-wrap gap-1.5">
                <button 
                  onClick={() => handleSendMessage("Check current order tracking")}
                  className="bg-theme hover:bg-theme/5 border border-theme/5 rounded px-2.5 py-1 text-[10px] text-theme transition-all text-left"
                >
                  🔍 Track Active Consignment
                </button>
                <button 
                  onClick={() => handleSendMessage("Request duplicate HSN invoice")}
                  className="bg-theme hover:bg-theme/5 border border-theme/5 rounded px-2.5 py-1 text-[10px] text-theme transition-all text-left"
                >
                  📄 Download HSN Invoice
                </button>
                <button 
                  onClick={() => handleSendMessage("Show B2B contract credit balance")}
                  className="bg-theme hover:bg-theme/5 border border-theme/5 rounded px-2.5 py-1 text-[10px] text-theme transition-all text-left"
                >
                  💳 Check Credit Terms
                </button>
              </div>
            </div>

            {/* Message Input */}
            <div className="flex gap-2 border-t border-theme/5 pt-3">
              <input 
                type="text" 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleSendMessage(chatInput); }}
                placeholder="Ask dispatch query..."
                className="flex-1 bg-theme border border-theme/5 rounded px-3 py-2 text-theme text-xs outline-none focus:border-theme transition-colors"
              />
              <button 
                onClick={() => handleSendMessage(chatInput)}
                className="bg-theme hover:bg-theme text-theme px-3 rounded text-xs font-bold transition-all"
              >
                Send
              </button>
            </div>
          </div>

          {/* Corporate Contacts Helpbox */}
          <div className="bg-theme border border-theme/5 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-theme uppercase tracking-widest">Wholesale Dispatch Records</h4>
            <div className="space-y-2.5 text-xs text-theme">
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-[#8bceff]" />
                <span>Consignment Hotline: <span className="text-theme">+91 98765 43210</span></span>
              </div>
              <div className="flex items-center gap-2">
                <ExternalLink size={13} className="text-[#8bceff]" />
                <span>Support Email: <span className="text-theme">dispatch@khushenterprises.com</span></span>
              </div>
              <p className="text-[10px] text-theme leading-normal font-mono">
                Logistics Hub Hours:<br/>
                Mon - Sat: 09:30 AM to 06:30 PM (IST)
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
