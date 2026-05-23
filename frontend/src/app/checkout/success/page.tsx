"use client";

import { CheckCircle, ArrowRight, FileText, Package } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CheckoutSuccessPage() {
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    setTimeout(() => setOrderId(`KE-${Math.floor(Math.random() * 100000000)}`), 0);
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-theme p-4">
      <div className="max-w-md w-full glass-dark rounded-2xl border border-theme/10 p-8 text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-theme mb-2">Order Confirmed!</h1>
        <p className="text-slate-400 mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
        
        <div className="bg-theme/30 rounded-lg p-4 mb-8 border border-theme/5">
          <p className="text-xs text-slate-500 mb-1">ORDER ID</p>
          <p className="text-lg font-mono font-bold text-neon-cyan">{orderId}</p>
        </div>

        <div className="space-y-3">
          <Link href="/my-orders">
            <button className="w-full bg-electric-blue hover:bg-theme text-theme hover:text-midnight-navy py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors">
              <Package size={18} /> Track My Order
            </button>
          </Link>
          <button className="w-full bg-theme/5 hover:bg-theme/10 text-theme py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
            <FileText size={18} /> Download Invoice
          </button>
          <Link href="/" className="block mt-4 text-sm text-slate-400 hover:text-theme transition-colors">
            Continue Shopping <ArrowRight size={14} className="inline ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
