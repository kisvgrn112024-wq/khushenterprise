"use client";

import { LayoutDashboard, FlaskConical, Shapes, Archive, Users, FileSpreadsheet, BookOpen, ImageIcon, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DownloadProvider } from "./DownloadToast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin-portal-ke" },
    { icon: FlaskConical, label: "Products", href: "/admin-portal-ke/products" },
    { icon: Shapes, label: "Categories", href: "/admin-portal-ke/categories" },
    { icon: Archive, label: "Orders", href: "/admin-portal-ke/orders" },
    { icon: Users, label: "Customers", href: "/admin-portal-ke/customers" },
    { icon: FileSpreadsheet, label: "Bulk Orders", href: "/admin-portal-ke/bulk-orders" },
    { icon: BookOpen, label: "Catalogue", href: "/admin-portal-ke/catalogue" },
    { icon: ImageIcon, label: "Banners", href: "/admin-portal-ke/banners" },
  ];

  return (
    <DownloadProvider>
      <div className="flex h-screen bg-[#111111] text-gray-300 font-sans overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[#161616] border-r border-white/5 flex flex-col z-20 shrink-0">
          
          {/* Profile / Brand Header */}
          <div className="p-6 flex items-center gap-3">
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100" alt="Admin" className="w-10 h-10 rounded shadow-md object-cover grayscale" />
            <div>
              <div className="text-white font-bold text-sm tracking-wide">Khush Admin</div>
              <div className="text-gray-400 text-[10px]">Lab Equipment Specialist</div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
            {menuItems.map((item, idx) => {
              // Determine if the current path is this item or a child of this item
              const isActive = pathname === item.href || (item.href !== "/admin-portal-ke" && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors relative group ${
                    isActive 
                      ? "text-[#8bceff] bg-[#0c1825]" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8bceff] rounded-r"></div>
                  )}
                  <item.icon size={18} className={isActive ? "text-[#8bceff]" : "text-gray-400 group-hover:text-white"} strokeWidth={1.5} />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 space-y-1">
            <Link href="/admin-portal-ke/settings" className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <Settings size={18} strokeWidth={1.5} />
              <span className="font-semibold">Settings</span>
            </Link>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-[#ffa8a8] hover:bg-[#ffa8a8]/10 transition-colors">
              <LogOut size={18} strokeWidth={1.5} />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a] p-6 md:p-8">
          {children}
        </main>
      </div>
    </DownloadProvider>
  );
}
