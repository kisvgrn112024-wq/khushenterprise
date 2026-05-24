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

  const isAdminRoute = pathname ? (pathname.startsWith("/admin-portal-ke") || pathname === "/secure-portal-access") : false;

  // Bypass storefront layout wrapper for admin portal and login routes
  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-theme text-theme font-sans flex flex-col">
      {/* Sticky top layout toggle bar */}
      <ViewToggleBar />

      {/* Main layout container */}
      <div
        className={`flex-grow flex flex-col w-full transition-all duration-300 ${
          viewMode === "desktop"
            ? "min-w-[1280px] overflow-x-auto bg-theme"
            : "max-w-full md:max-w-[480px] mx-auto bg-theme min-h-screen shadow-[0_0_50px_rgba(0,255,255,0.08)] border-x border-theme/5 relative overflow-x-hidden"
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
