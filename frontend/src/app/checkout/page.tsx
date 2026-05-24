"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { CheckCircle2, ChevronRight, Lock, MapPin, CreditCard, Building2, Smartphone, ShieldCheck, Upload, QrCode, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [screenshotUploaded, setScreenshotUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "",
  });

  // Verify auth and pre-fill fields
  useEffect(() => {
    const savedUser = localStorage.getItem("ke_user");
    if (!savedUser) {
      router.push("/account/login?redirect=/checkout");
      return;
    }
    const user = JSON.parse(savedUser);
    setFormData(prev => ({
      ...prev,
      name: user.name || "",
      email: user.email || "",
    }));
  }, [router]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const tax = cartTotal * 0.18; // 18% GST mock
  const shipping = cartTotal > 999 ? 0 : 150;
  const finalTotal = cartTotal + tax + shipping;

  const handlePayment = async () => {
    setIsSubmitting(true);
    const orderId = `KE-ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const formattedDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    const newOrder = {
      id: orderId,
      customer: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      amount: `₹${finalTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      total: finalTotal,
      payment: paymentMethod === 'upi' ? "Prepaid UPI" : "Cash on Delivery (COD)",
      status: "Placed",
      date: `${formattedDate}, ${formattedTime}`,
      time: formattedTime,
      expectedDate: "Expected Delivery: 3-5 business days",
      courier: "TBD",
      tracking: "TBD",
      itemsCount: cart.reduce((acc, item) => acc + item.quantity, 0),
      items: cart.map(item => ({
        productId: item.id,
        title: item.title,
        quantity: item.quantity,
        price: item.price
      })),
      progress: 0,
      weight: "TBD",
      dimensions: "TBD",
      hsnCode: "HSN 9011 - Optical Microscope Assembly",
      packingDesc: "Standard shipping box with air cushions."
    };

    // Try posting to backend API
    try {
      const API_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? `http://${window.location.hostname}:5000/api/orders`
        : '/api/orders';

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) throw new Error("API post failed");
    } catch (e) {
      console.warn("API offline or error, saving locally only.");
    }

    // Always mirror to customer local storage
    const savedOrders = localStorage.getItem("ke_orders");
    const ordersList = savedOrders ? JSON.parse(savedOrders) : [];
    ordersList.unshift(newOrder);
    localStorage.setItem("ke_orders", JSON.stringify(ordersList));

    // Also mirror to admin orders in localStorage for instant fallback sync!
    const adminOrders = localStorage.getItem("ke_admin_orders");
    const adminOrdersList = adminOrders ? JSON.parse(adminOrders) : [];
    const adminOrder = {
      id: newOrder.id,
      date: formattedDate,
      time: formattedTime,
      customer: newOrder.customer,
      email: newOrder.email,
      amount: newOrder.amount,
      status: "Placed",
      type: "individual"
    };
    adminOrdersList.unshift(adminOrder);
    localStorage.setItem("ke_admin_orders", JSON.stringify(adminOrdersList));

    // Wait 1.5 seconds for nice loader feel
    setTimeout(() => {
      clearCart();
      setIsSubmitting(false);
      router.push(`/checkout/success?orderId=${orderId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-theme text-slate-300">
      {/* Simplified Header */}
      <header className="bg-midnight-navy border-b border-theme/10 py-4 px-8 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Khush Enterprises" width={32} height={32} />
            <span className="font-bold text-theme tracking-widest text-lg">KHUSH ENTERPRISES</span>
          </Link>
          <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
            <Lock size={16} /> 100% Secure Checkout
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col - Steps */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Shipping */}
          <div className={`glass-dark rounded-xl border ${step === 1 ? 'border-neon-cyan/50 box-glow' : 'border-theme/5 opacity-70'} overflow-hidden`}>
            <div className="p-4 bg-theme/5 border-b border-theme/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-theme flex items-center gap-2">
                <span className="bg-neon-cyan text-midnight-navy w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                Shipping Details
              </h2>
              {step > 1 && <button onClick={() => setStep(1)} className="text-neon-cyan text-sm">Edit</button>}
            </div>
            {step === 1 && (
             <form onSubmit={handleNext} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-theme/20 border border-slate-700 rounded px-3 py-2 text-theme outline-none focus:border-neon-cyan" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Phone Number</label>
                    <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-theme/20 border border-slate-700 rounded px-3 py-2 text-theme outline-none focus:border-neon-cyan" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Complete Address</label>
                  <input required type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-theme/20 border border-slate-700 rounded px-3 py-2 text-theme outline-none focus:border-neon-cyan" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">City</label>
                    <input required type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full bg-theme/20 border border-slate-700 rounded px-3 py-2 text-theme outline-none focus:border-neon-cyan" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">State</label>
                    <input required type="text" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full bg-theme/20 border border-slate-700 rounded px-3 py-2 text-theme outline-none focus:border-neon-cyan" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">PIN Code</label>
                    <input required type="text" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} className="w-full bg-theme/20 border border-slate-700 rounded px-3 py-2 text-theme outline-none focus:border-neon-cyan" />
                  </div>
                </div>
                <button type="submit" className="bg-electric-blue hover:bg-blue-600 text-theme font-medium py-3 px-8 rounded mt-4 transition-colors">
                  Continue to Order Summary
                </button>
              </form>
            )}
          </div>

          {/* Step 2: Order Summary */}
          <div className={`glass-dark rounded-xl border ${step === 2 ? 'border-neon-cyan/50 box-glow' : 'border-theme/5 opacity-70'} overflow-hidden`}>
            <div className="p-4 bg-theme/5 border-b border-theme/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-theme flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${step >= 2 ? 'bg-neon-cyan text-midnight-navy' : 'bg-slate-700 text-slate-400'}`}>2</span>
                Order Summary
              </h2>
              {step > 2 && <button onClick={() => setStep(2)} className="text-neon-cyan text-sm">Edit</button>}
            </div>
            {step === 2 && (
              <div className="p-6">
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between border-b border-theme/5 pb-4">
                      <div>
                        <h4 className="text-theme text-sm font-medium">{item.title}</h4>
                        <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-theme font-medium">₹{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                <button onClick={(e) => handleNext(e as any)} className="bg-electric-blue hover:bg-blue-600 text-theme font-medium py-3 px-8 rounded transition-colors">
                  Proceed to Payment
                </button>
              </div>
            )}
          </div>

          {/* Step 3: Payment */}
          <div className={`glass-dark rounded-xl border ${step === 3 ? 'border-neon-cyan/50 box-glow' : 'border-theme/5 opacity-70'} overflow-hidden`}>
            <div className="p-4 bg-theme/5 border-b border-theme/5">
              <h2 className="text-lg font-bold text-theme flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${step === 3 ? 'bg-neon-cyan text-midnight-navy' : 'bg-slate-700 text-slate-400'}`}>3</span>
                Payment Method
              </h2>
            </div>
            {step === 3 && (
              <div className="p-6 space-y-4">
                
                {/* Prepaid UPI / QR */}
                <div className={`border rounded-lg transition-colors overflow-hidden ${paymentMethod === 'upi' ? 'border-neon-cyan/50 bg-neon-cyan/5' : 'border-theme/10 hover:border-theme/30'}`}>
                  <label className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setPaymentMethod('upi')}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="accent-neon-cyan" />
                      <span className="text-theme font-medium flex items-center gap-2"><QrCode size={18}/> Prepaid UPI / QR Code</span>
                    </div>
                    {paymentMethod === 'upi' && <span className="text-xs text-neon-cyan font-bold bg-neon-cyan/10 px-2 py-1 rounded">Save 5%</span>}
                  </label>
                  
                  {paymentMethod === 'upi' && (
                    <div className="p-4 pt-0 border-t border-theme/5 mt-2 bg-theme/20">
                      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start p-4">
                        <div className="bg-theme p-2 rounded-xl flex-shrink-0">
                          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=immalhotra57-2@okhdfcbank`} alt="UPI QR Code" className="w-32 h-32" />
                        </div>
                        <div className="flex-1 space-y-3 w-full">
                          <p className="text-sm text-slate-300">Scan this QR code with any UPI app (GPay, PhonePe, Paytm, etc.) or use the UPI ID below to complete your payment.</p>
                          <div className="bg-theme border border-theme/10 p-3 rounded flex justify-between items-center">
                            <div>
                              <div className="text-[10px] text-theme font-bold tracking-widest uppercase">UPI ID</div>
                              <div className="text-theme font-mono text-sm">immalhotra57-2@okhdfcbank</div>
                            </div>
                            <button onClick={() => navigator.clipboard.writeText('immalhotra57-2@okhdfcbank')} className="text-xs text-neon-cyan hover:text-theme transition-colors">Copy</button>
                          </div>
                          
                          <div className="mt-4 border border-dashed border-theme/20 rounded p-4 text-center hover:border-neon-cyan/50 transition-colors cursor-pointer bg-theme/5" onClick={() => {
                            // Simulate upload
                            setTimeout(() => setScreenshotUploaded(true), 800);
                          }}>
                            {screenshotUploaded ? (
                              <div className="flex flex-col items-center gap-2 text-green-400">
                                <CheckCircle2 size={24} />
                                <span className="text-sm font-bold">Screenshot Verified</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2 text-theme">
                                <Upload size={20} className="text-neon-cyan" />
                                <span className="text-sm">Click to upload payment screenshot</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cash on Delivery */}
                <div className={`border rounded-lg transition-colors ${paymentMethod === 'cod' ? 'border-neon-cyan/50 bg-neon-cyan/5' : 'border-theme/10 hover:border-theme/30'}`}>
                  <label className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setPaymentMethod('cod')}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-neon-cyan" />
                      <span className="text-theme font-medium flex items-center gap-2"><Truck size={18}/> Cash on Delivery (COD)</span>
                    </div>
                  </label>
                  {paymentMethod === 'cod' && (
                    <div className="px-10 pb-4 text-xs text-slate-400">
                      Pay at your doorstep. Standard shipping rates apply.
                    </div>
                  )}
                </div>

                <label className="flex items-center justify-between p-4 border border-theme/10 hover:border-theme/30 rounded-lg cursor-pointer transition-colors" onClick={() => setPaymentMethod('card')}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="accent-neon-cyan" />
                    <span className="text-theme font-medium flex items-center gap-2"><CreditCard size={18}/> Credit / Debit Card</span>
                  </div>
                </label>

                <button 
                  onClick={handlePayment} 
                  disabled={(paymentMethod === 'upi' && !screenshotUploaded) || isSubmitting}
                  className={`w-full font-bold py-4 rounded-lg mt-6 text-lg transition-colors shadow-[0_0_15px_rgba(0,255,255,0.4)] ${((paymentMethod === 'upi' && !screenshotUploaded) || isSubmitting) ? 'bg-theme text-theme cursor-not-allowed shadow-none' : 'bg-neon-cyan hover:bg-theme text-midnight-navy'}`}
                >
                  {isSubmitting ? "Processing Order..." : (paymentMethod === 'upi' ? (screenshotUploaded ? `Confirm Payment of ₹${finalTotal.toLocaleString()}` : "Upload Screenshot to Continue") : `Place Order • ₹${finalTotal.toLocaleString()}`)}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Col - Price Breakdown */}
        <div className="lg:col-span-1">
          <div className="glass-dark rounded-xl border border-theme/5 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-theme mb-4">Price Details</h3>
            <div className="space-y-3 text-sm border-b border-theme/5 pb-4 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Total MRP ({cart.length} items)</span>
                <span className="text-theme">₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Discount on MRP</span>
                <span className="text-green-400">-₹0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated GST (18%)</span>
                <span className="text-theme">₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Shipping</span>
                <span className={shipping === 0 ? "text-green-400" : "text-theme"}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-theme font-bold text-lg">Total Amount</span>
              <span className="text-neon-cyan font-bold text-xl">₹{finalTotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-theme/5 p-3 rounded">
              <ShieldCheck size={24} className="text-green-500 flex-shrink-0" />
              Safe and secure payments. 100% Authentic products.
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
