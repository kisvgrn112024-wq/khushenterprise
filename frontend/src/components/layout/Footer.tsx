"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useViewMode } from "@/context/ViewModeContext";

export default function Footer() {
  const pathname = usePathname();
  const { viewMode } = useViewMode();

  if (pathname?.startsWith("/admin-portal-ke")) {
    return null;
  }
  return (
    <footer className="bg-theme pt-16 pb-8 border-t border-theme/5 text-theme text-xs">
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`grid gap-12 mb-12 ${
          viewMode === "mobile" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-4"
        }`}>
          
          {/* Column 1: Brand & Contact Info */}
          <div className="space-y-6">
            <div className="inline-flex flex-col">
              <span className="text-xl font-bold tracking-tight text-theme uppercase">
                KHUSH
              </span>
            </div>
            <div className="leading-relaxed space-y-4 text-theme">
              <p className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#8bceff] shrink-0 mt-0.5" />
                <span>5299, Science Square, Science Market<br />Ambala Cantt-133001, Haryana (INDIA)</span>
              </p>
              <p className="flex items-start gap-2.5">
                <Phone size={16} className="text-[#8bceff] shrink-0 mt-0.5" />
                <span className="flex flex-col">
                  <span>+91 9890011762</span>
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail size={16} className="text-[#8bceff]" />
                <span>khushenterprisessupppy@gmail.com</span>
              </p>
            </div>
          </div>

          {/* Column 2: NAVIGATION */}
          <div>
            <h3 className="text-theme font-bold text-xs uppercase mb-6 tracking-wider">NAVIGATION</h3>
            <ul className="space-y-4">
              <li><Link href="/catalogue" className="hover:text-theme transition-colors">Catalogue</Link></li>
              <li><Link href="/products" className="hover:text-theme transition-colors">Products</Link></li>
              <li><Link href="/bulk-orders" className="hover:text-theme transition-colors">Bulk Orders</Link></li>
              <li><Link href="/about-us" className="hover:text-theme transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Column 3: SUPPORT */}
          <div>
            <h3 className="text-theme font-bold text-xs uppercase mb-6 tracking-wider">SUPPORT</h3>
            <ul className="space-y-4">
              <li><Link href="/shipping-policy" className="hover:text-theme transition-colors">Shipping Policy</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-theme transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-conditions" className="hover:text-theme transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/contact-us" className="hover:text-theme transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-theme font-bold text-xs uppercase mb-6 tracking-wider">TECHNICAL UPDATES</h3>
            <p className="leading-relaxed mb-6 text-theme">
              Stay informed about new equipment and scientific supplies.
            </p>
            <div className="flex relative items-center">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="bg-theme border border-theme/10 text-theme text-xs px-4 py-3 w-full outline-none focus:border-theme transition-colors rounded-l"
              />
              <button 
                type="button" 
                className="bg-theme hover:bg-theme text-theme h-[40px] px-4 transition-colors flex items-center justify-center rounded-r cursor-pointer bg-[#8bceff]"
                aria-label="Subscribe"
              >
                <Send size={14} className="text-black" />
              </button>
            </div>
          </div>
          
        </div>

        <div className={`border-t border-theme/5 pt-8 flex items-center justify-between gap-4 text-[10px] text-theme uppercase tracking-wider ${
          viewMode === "mobile" ? "flex-col text-center" : "flex-col md:flex-row"
        }`}>
          <p>© 2024 Khush Enterprises. Laboratory Equipment & General Supplies. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
