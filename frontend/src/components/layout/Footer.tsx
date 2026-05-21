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
    <footer className="bg-[#0b0c10] pt-16 pb-8 border-t border-white/5 text-gray-400 text-xs">
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`grid gap-12 mb-12 ${
          viewMode === "mobile" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-4"
        }`}>
          
          {/* Column 1: Brand & Contact Info */}
          <div className="space-y-6">
            <div className="inline-flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white uppercase">
                KHUSHI <span className="font-light text-gray-400">ENTERPRISES</span>
              </span>
            </div>
            <div className="leading-relaxed space-y-4 text-gray-400">
              <p className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#8bceff] shrink-0 mt-0.5" />
                <span>105, Starling Square, 10-Starling Road,<br />Vile Parle West - 400056, Mumbai (INDIA)</span>
              </p>
              <p className="flex items-start gap-2.5">
                <Phone size={16} className="text-[#8bceff] shrink-0 mt-0.5" />
                <span className="flex flex-col">
                  <span>+91 98900 11762</span>
                  <span>+91 97294 57762</span>
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail size={16} className="text-[#8bceff]" />
                <span>PLMuchiagnsvrate@gmail.com</span>
              </p>
            </div>
          </div>

          {/* Column 2: TEGPLINKS */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase mb-6 tracking-wider">TEGPLINKS</h3>
            <ul className="space-y-4">
              <li><Link href="/catalogue" className="hover:text-white transition-colors">Catalog in</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
              <li><Link href="/products?category=electronics" className="hover:text-white transition-colors">ELEctronics</Link></li>
              <li><Link href="/contact-us" className="hover:text-white transition-colors">eContact</Link></li>
            </ul>
          </div>

          {/* Column 3: SUPPORT */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase mb-6 tracking-wider">SUPPORT</h3>
            <ul className="space-y-4">
              <li><Link href="/about-us" className="hover:text-white transition-colors">ABOUT US</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Product Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Termsk conditions</Link></li>
              <li><Link href="/help" className="hover:text-white transition-colors">Chhathhar</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase mb-6 tracking-wider">USEFUL LINKS</h3>
            <p className="leading-relaxed mb-6 text-gray-400">
              Stay informed about low equipment and scientificstrafilts.
            </p>
            <div className="flex relative items-center">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-[#111111] border border-white/10 text-white text-xs px-4 py-3 w-full outline-none focus:border-[#8bceff] transition-colors rounded-l"
              />
              <button 
                type="button" 
                className="bg-[#8bceff] hover:bg-[#72bde6] text-black h-[40px] px-4 transition-colors flex items-center justify-center rounded-r cursor-pointer"
                aria-label="Subscribe"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
          
        </div>

        <div className={`border-t border-white/5 pt-8 flex items-center justify-between gap-4 text-[10px] text-gray-500 uppercase tracking-wider ${
          viewMode === "mobile" ? "flex-col text-center" : "flex-col md:flex-row"
        }`}>
          <p>© 2024 Khushi Enterprise Laboratory Aspected in Moderm Explorer. All Rights Reserved.</p>
          <div className="flex gap-2">
            <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors cursor-pointer">★</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
