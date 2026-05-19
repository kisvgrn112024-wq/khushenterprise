"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#111111] pt-16 pb-8 border-t border-white/5">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand & Contact Info */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3">
              <img src="/logo.png" alt="KE" className="w-9 h-9 object-contain" />
              <span className="text-2xl font-black text-white tracking-wider block">KHUSH</span>
            </Link>
            <div className="text-gray-400 text-xs leading-relaxed space-y-4">
              <p>5299, Science Square, Science Market<br/>Ambala Cantt-133001, Haryana (INDIA)</p>
              <p className="flex items-center gap-2"><Phone size={14} className="text-white"/> +91 9890011762</p>
              <p className="flex items-center gap-2"><Mail size={14} className="text-white"/> khushenterprisesupppy@gmail.com</p>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-electric-blue font-bold text-[10px] tracking-widest uppercase mb-6">NAVIGATION</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/catalogue" className="hover:text-white transition-colors">Catalogue</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
              <li><Link href="/bulk-orders" className="hover:text-white transition-colors">Bulk Orders</Link></li>
              <li><Link href="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="text-electric-blue font-bold text-[10px] tracking-widest uppercase mb-6">SUPPORT</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-electric-blue font-bold text-[10px] tracking-widest uppercase mb-6">TECHNICAL UPDATES</h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
              Stay informed about new equipment and scientific supplies.
            </p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-[#1a1a1a] border border-white/10 text-white text-xs px-4 py-2 w-full outline-none focus:border-white/30 transition-colors"
                required
              />
              <button 
                type="submit" 
                className="bg-electric-blue hover:bg-blue-600 text-white px-4 py-2 transition-colors flex items-center justify-center"
              >
                <span className="transform rotate-0">▹</span>
              </button>
            </form>
          </div>
          
        </div>

        <div className="border-t border-white/5 pt-8 text-center md:text-left">
          <p className="text-[#666666] text-[10px] uppercase tracking-wider">&copy; 2024 Khush Enterprises. Laboratory Equipment & General Supplies. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
