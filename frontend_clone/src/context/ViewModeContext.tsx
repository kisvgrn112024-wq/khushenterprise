"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ViewMode = "desktop" | "mobile" | "split";

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isInitialized: boolean;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>("desktop");
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if we are running in the final website/production environment
  const isProduction = process.env.NODE_ENV === "production";

  useEffect(() => {
    const handleResize = () => {
      const isMobileScreen = window.innerWidth < 1024; // 1024px is standard lg breakpoint for header nav
      
      const isEmbedded = typeof window !== "undefined" && window.self !== window.top;
      if (isProduction || isEmbedded) {
        // In production or when embedded, always match screen width dynamically
        setViewModeState(isMobileScreen ? "mobile" : "desktop");
      } else {
        // In development, allow manual simulation toggle from localStorage if saved
        const savedMode = localStorage.getItem("ke_view_mode") as ViewMode | null;
        if (savedMode === "desktop" || savedMode === "mobile" || savedMode === "split") {
          setViewModeState(savedMode);
        } else {
          setViewModeState(isMobileScreen ? "mobile" : "desktop");
        }
      }
    };

    // Initialize
    handleResize();
    setIsInitialized(true);

    // Listen for real window size changes
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isProduction]);

  // Update viewport meta tags and body classes dynamically
  useEffect(() => {
    if (!isInitialized) return;

    let meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta') as HTMLMetaElement;
      meta.name = 'viewport';
      document.head.appendChild(meta);
    }

    const isEmbedded = typeof window !== "undefined" && window.self !== window.top;
    if (isProduction || isEmbedded) {
      // Production or iframe is fully responsive, standard mobile viewport
      meta.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=5");
      document.documentElement.classList.remove("forced-desktop", "forced-mobile");
    } else {
      // Development mode simulator controls
      if (viewMode === "desktop") {
        meta.setAttribute("content", "width=1280, initial-scale=0.3, shrink-to-fit=no");
        document.documentElement.classList.add("forced-desktop");
        document.documentElement.classList.remove("forced-mobile");
      } else if (viewMode === "mobile") {
        meta.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=5");
        document.documentElement.classList.add("forced-mobile");
        document.documentElement.classList.remove("forced-desktop");
      } else {
        // split mode: standard viewport for parent
        meta.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=5");
        document.documentElement.classList.remove("forced-desktop", "forced-mobile");
      }
    }
  }, [viewMode, isInitialized, isProduction]);

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    if (!isProduction) {
      localStorage.setItem("ke_view_mode", mode);
    }
  };

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode, isInitialized }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error("useViewMode must be used within a ViewModeProvider");
  }
  return context;
}
