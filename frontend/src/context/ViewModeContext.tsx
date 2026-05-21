"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ViewMode = "desktop" | "mobile";

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isInitialized: boolean;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>("desktop");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("ke_view_mode") as ViewMode | null;
    if (savedMode === "desktop" || savedMode === "mobile") {
      setViewModeState(savedMode);
    } else {
      // Fallback based on initial window size
      const isMobileScreen = window.innerWidth < 768;
      setViewModeState(isMobileScreen ? "mobile" : "desktop");
    }
    setIsInitialized(true);
  }, []);

  // Update viewport meta tags and body classes dynamically
  useEffect(() => {
    if (!isInitialized) return;

    let meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta') as HTMLMetaElement;
      meta.name = 'viewport';
      document.head.appendChild(meta);
    }

    if (viewMode === "desktop") {
      meta.setAttribute("content", "width=1280, initial-scale=0.3, shrink-to-fit=no");
      document.documentElement.classList.add("forced-desktop");
      document.documentElement.classList.remove("forced-mobile");
    } else {
      meta.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=5");
      document.documentElement.classList.add("forced-mobile");
      document.documentElement.classList.remove("forced-desktop");
    }
  }, [viewMode, isInitialized]);

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem("ke_view_mode", mode);
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
