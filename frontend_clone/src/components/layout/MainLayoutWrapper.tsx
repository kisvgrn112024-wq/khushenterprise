"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useViewMode } from "@/context/ViewModeContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/shared/ChatWidget";
import CartDrawer from "@/components/store/CartDrawer";
import ViewToggleBar from "@/components/shared/ViewToggleBar";

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { viewMode, isInitialized } = useViewMode();

  const isAdminRoute = pathname ? (pathname.startsWith("/admin-secret-khush") || pathname === "/secure-portal-access") : false;

  const isProduction = process.env.NODE_ENV === "production";

  const isEmbedded = typeof window !== "undefined" && window.self !== window.top;

  // Bypass storefront layout wrapper for admin portal and login routes
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Render side-by-side desktop and mobile views if Split View is selected in development mode
  if (viewMode === "split" && !isProduction && !isEmbedded) {
    return (
      <div className="min-h-screen bg-theme text-theme font-sans flex flex-col overflow-hidden">
        {/* Sticky top layout toggle bar */}
        <ViewToggleBar />
        
        {/* Split View Container */}
        <div className="flex-grow flex flex-row h-[calc(100vh-38px)] bg-theme/5 divide-x divide-theme/10 overflow-hidden">
          {/* Left panel: Desktop View Simulation (65% width) */}
          <div className="flex-[3] flex flex-col h-full overflow-hidden">
            <div className="bg-theme/40 border-b border-theme/5 px-4 py-2 flex items-center justify-between text-[10px] font-bold tracking-widest uppercase text-theme/60">
              <span>Desktop Simulation</span>
              <span>1280px Width (Scaled to fit)</span>
            </div>
            <div className="flex-grow bg-black/20 p-4 flex items-center justify-center overflow-auto min-h-0">
              <div className="w-[1280px] h-[95%] border border-theme/10 rounded-lg shadow-2xl overflow-hidden bg-theme relative origin-center scale-[0.95] transform-gpu">
                <iframe src={pathname} className="w-full h-full border-0 pointer-events-auto" />
              </div>
            </div>
          </div>

          {/* Right panel: Mobile View Simulation (35% width) */}
          <div className="flex-[2] max-w-[480px] min-w-[360px] flex flex-col h-full overflow-hidden bg-theme/20">
            <div className="bg-theme/40 border-b border-theme/5 px-4 py-2 flex items-center justify-between text-[10px] font-bold tracking-widest uppercase text-theme/60">
              <span>Mobile Simulation</span>
              <span>400px Width</span>
            </div>
            <div className="flex-grow bg-black/20 p-4 flex items-center justify-center overflow-auto min-h-0">
              <div className="w-[400px] h-[95%] border border-theme/10 rounded-lg shadow-2xl overflow-hidden bg-theme relative">
                <iframe src={pathname} className="w-full h-full border-0 pointer-events-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme text-theme font-sans flex flex-col">
      {/* Sticky top layout toggle bar - only shown in development mode */}
      {!isProduction && !isEmbedded && <ViewToggleBar />}

      {/* Main layout container - fully responsive in production, simulated in development */}
      <div
        className={`flex-grow flex flex-col w-full transition-all duration-300 ${
          isProduction || isEmbedded
            ? "max-w-full bg-theme relative overflow-x-hidden min-h-screen"
            : viewMode === "desktop"
              ? "min-w-[1280px] overflow-x-auto bg-theme"
              : "max-w-full md:max-w-[600px] mx-auto bg-theme min-h-screen shadow-[0_0_50px_rgba(0,255,255,0.08)] border-x border-theme/5 relative overflow-x-hidden"
        }`}
      >
        <Header />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
        <ChatWidget />
        <CartDrawer />
      </div>
    </div>
  );
}
