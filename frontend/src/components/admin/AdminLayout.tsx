"use client";

import { LayoutDashboard, FlaskConical, Shapes, Archive, Users, FileSpreadsheet, BookOpen, ImageIcon, Settings, LogOut, Globe, ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DownloadProvider } from "./DownloadToast";
import { useViewMode } from "@/context/ViewModeContext";
import ViewToggleBar from "@/components/shared/ViewToggleBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { viewMode } = useViewMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isBulkOpen, setIsBulkOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      return path.includes("/admin-portal-ke/b2b") || path.includes("/admin-portal-ke/bulk-orders");
    }
    return false;
  });

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin-portal-ke" },
    { icon: FlaskConical, label: "Products", href: "/admin-portal-ke/products" },
    { icon: Shapes, label: "Categories", href: "/admin-portal-ke/categories" },
    { icon: Archive, label: "Orders", href: "/admin-portal-ke/orders" },
    { icon: Users, label: "Customers", href: "/admin-portal-ke/customers" },
    { 
      icon: FileSpreadsheet, 
      label: "Bulk Orders", 
      href: "/admin-portal-ke/bulk-orders",
      subItems: [
        { label: "B2B Hub", href: "/admin-portal-ke/b2b?tab=hub" },
        { label: "B2B Catalog", href: "/admin-portal-ke/b2b?tab=catalog" },
        { label: "Procurement RFQs", href: "/admin-portal-ke/b2b?tab=inquiries" },
        { label: "Bulk Orders List", href: "/admin-portal-ke/bulk-orders" },
      ]
    },
    { icon: BookOpen, label: "Catalogue", href: "/admin-portal-ke/catalogue" },
    { icon: ImageIcon, label: "Banners", href: "/admin-portal-ke/banners" },
    { icon: Globe, label: "Export Central", href: "/admin-portal-ke/export-controller" },
  ];

  return (
    <DownloadProvider>
      <div className="w-full min-h-screen bg-[#07090e] flex flex-col font-sans">
        {/* Sticky top layout toggle bar */}
        <ViewToggleBar />

        {/* Main layout container */}
        <div
          className={`flex-grow flex flex-col w-full transition-all duration-300 ${
            viewMode === "desktop"
              ? "min-w-[1280px] overflow-x-auto bg-[#0a0a0a]"
              : "max-w-full md:max-w-[480px] mx-auto bg-[#0a0a0a] min-h-screen shadow-[0_0_50px_rgba(0,255,255,0.08)] border-x border-white/5 relative overflow-x-hidden"
          }`}
        >
          <div className="relative flex flex-1 h-screen overflow-hidden text-gray-300 bg-[#111111]">
            {/* Sidebar backdrop for mobile view */}
            {viewMode === "mobile" && isSidebarOpen && (
              <div 
                className="absolute inset-0 bg-black/75 z-40 backdrop-blur-sm transition-opacity" 
                onClick={() => setIsSidebarOpen(false)}
              ></div>
            )}

            {/* Sidebar */}
            <aside 
              className={`bg-[#161616] border-r border-white/5 flex flex-col z-50 shrink-0 transition-transform duration-300 ${
                viewMode === "mobile"
                  ? `absolute inset-y-0 left-0 w-64 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`
                  : "w-64 relative translate-x-0"
              }`}
            >
              
              {/* Profile / Brand Header */}
              <div className="p-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100" alt="Admin" className="w-10 h-10 rounded shadow-md object-cover grayscale" />
                  <div>
                    <div className="text-white font-bold text-sm tracking-wide">Khush Admin</div>
                    <div className="text-gray-400 text-[10px]">Lab Specialist</div>
                  </div>
                </div>
                {viewMode === "mobile" && (
                  <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-white cursor-pointer">
                    <X size={18} />
                  </button>
                )}
              </div>

              <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                {menuItems.map((item, idx) => {
                  const hasSubItems = 'subItems' in item;

                  if (hasSubItems) {
                    const subItems = (item as any).subItems;
                    const isAnySubActive = subItems.some((sub: any) => {
                      const cleanHref = sub.href.split('?')[0];
                      return pathname === cleanHref || (cleanHref !== "/admin-portal-ke" && pathname.startsWith(cleanHref));
                    });

                    return (
                      <div key={idx} className="space-y-1">
                        <button
                          onClick={() => setIsBulkOpen(!isBulkOpen)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-sm transition-colors relative group cursor-pointer ${
                            isAnySubActive
                              ? "text-[#8bceff] bg-[#0c1825]/50"
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon size={18} className={isAnySubActive ? "text-[#8bceff]" : "text-gray-400 group-hover:text-white"} strokeWidth={1.5} />
                            <span className="font-semibold">{item.label}</span>
                          </div>
                          <div className="text-gray-400 group-hover:text-white">
                            {isBulkOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </div>
                        </button>

                        {isBulkOpen && (
                          <div className="pl-6 pr-2 py-1 space-y-1 bg-black/10 rounded ml-4 border-l border-white/5">
                            {subItems.map((sub: any, subIdx: number) => {
                              // Match sub route actively
                              let isSubActive = false;
                              if (typeof window !== "undefined") {
                                const cleanSubHref = sub.href.split('?')[0];
                                const hasTabQuery = sub.href.includes('tab=');
                                const targetTab = hasTabQuery ? sub.href.split('tab=')[1] : null;
                                const currentTab = new URLSearchParams(window.location.search).get('tab');
                                
                                isSubActive = pathname === cleanSubHref && (!hasTabQuery || currentTab === targetTab);
                              } else {
                                isSubActive = pathname === sub.href.split('?')[0];
                              }

                              return (
                                <Link
                                  key={subIdx}
                                  href={sub.href}
                                  onClick={() => viewMode === "mobile" && setIsSidebarOpen(false)}
                                  className={`block px-3 py-1.5 rounded text-xs transition-colors ${
                                    isSubActive
                                      ? "text-[#8bceff] font-bold bg-[#0c1825]/30"
                                      : "text-gray-400 hover:text-white hover:bg-white/5"
                                  }`}
                                >
                                  {sub.label}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  const isActive = pathname === item.href || (item.href !== "/admin-portal-ke" && pathname.startsWith(item.href));
                  
                  return (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => viewMode === "mobile" && setIsSidebarOpen(false)}
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
                <Link 
                  href="/admin-portal-ke/settings" 
                  onClick={() => viewMode === "mobile" && setIsSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Settings size={18} strokeWidth={1.5} />
                  <span className="font-semibold">Settings</span>
                </Link>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-[#ffa8a8] hover:bg-[#ffa8a8]/10 transition-colors cursor-pointer">
                  <LogOut size={18} strokeWidth={1.5} />
                  <span className="font-semibold">Logout</span>
                </button>
              </div>
            </aside>

            {/* Content & Top Hamburger row */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Mobile top admin bar */}
              {viewMode === "mobile" && (
                <div className="w-full bg-[#161616] border-b border-white/5 px-4 py-3 flex items-center justify-between z-30 shrink-0">
                  <button onClick={() => setIsSidebarOpen(true)} className="text-gray-400 hover:text-white cursor-pointer p-1">
                    <Menu size={18} />
                  </button>
                  <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Logo" className="w-5 h-5 object-contain" />
                    <span className="text-xs font-bold text-white tracking-wider uppercase">Admin Portal</span>
                  </div>
                  <div className="w-6"></div>
                </div>
              )}

              {/* Main Content */}
              <main className={`flex-grow overflow-y-auto bg-[#0a0a0a] transition-all duration-300 ${
                viewMode === "mobile" ? "p-4" : "p-6 md:p-8"
              }`}>
                {children}
              </main>
            </div>

          </div>
        </div>
      </div>
    </DownloadProvider>
  );
}
