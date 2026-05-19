"use client";

import { useStore } from "@/context/StoreContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Microscope, Scale, Pipette, Glasses, FlaskConical, Flame } from "lucide-react";

const IconMap: Record<string, React.ElementType> = {
  Microscope, Scale, Pipette, Glasses, FlaskConical, Flame,
};

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, cartTotal, removeFromCart, updateQuantity } = useStore();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#050b14] border-l border-white/10 z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#03060a]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Shopping Cart <span className="bg-neon-cyan/20 text-neon-cyan text-xs py-1 px-2 rounded-full">{cart.length}</span>
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                  <Package size={64} className="opacity-20" />
                  <p>Your cart is empty.</p>
                  <button onClick={() => setIsCartOpen(false)} className="text-neon-cyan hover:underline">Continue Shopping</button>
                </div>
              ) : (
                cart.map((item) => {
                  const IconComponent = IconMap[item.icon] || Package;

                  return (
                    <div key={item.id} className="flex gap-4 p-4 glass-dark rounded-xl border border-white/5 relative group">
                      <div className="w-20 h-20 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 relative overflow-hidden">
                        <img 
                          src={`/design/images/${item.id}.jpeg`} 
                          alt={item.title} 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <IconComponent size={40} className="text-slate-300 hidden" strokeWidth={1} />
                      </div>
                      
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-white text-sm font-medium line-clamp-2 leading-tight mb-2 pr-6">{item.title}</h3>
                        
                        {item.moq && item.quantity >= item.moq && item.bulkPrice ? (
                           <div className="mb-3">
                             <div className="font-bold text-neon-cyan">₹{item.bulkPrice.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ea</span></div>
                             <div className="text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded w-max mt-1">Bulk Discount Applied</div>
                           </div>
                        ) : (
                           <div className="font-bold text-neon-cyan mb-3">₹{item.price.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ea</span></div>
                        )}
                        
                        <div className="flex items-center justify-between mt-auto">
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-3 bg-black/40 rounded-lg px-2 py-1 border border-white/5">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-slate-400 hover:text-white"
                            ><Minus size={14}/></button>
                            <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-slate-400 hover:text-white"
                            ><Plus size={14}/></button>
                          </div>

                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-500 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#03060a]">
                <div className="flex items-center justify-between text-slate-300 mb-2">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 mb-6 text-sm">
                  <span>Shipping & Taxes</span>
                  <span className="text-slate-500">Calculated at checkout</span>
                </div>
                <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
                  <button className="w-full bg-electric-blue hover:bg-white text-white hover:text-midnight-navy box-glow py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                    Proceed to Checkout <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
