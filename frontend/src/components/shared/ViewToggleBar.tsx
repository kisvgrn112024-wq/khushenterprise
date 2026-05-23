"use client";

import React from "react";
import { useViewMode } from "@/context/ViewModeContext";
import { Monitor, Smartphone } from "lucide-react";

export default function ViewToggleBar() {
  const { viewMode, setViewMode, isInitialized } = useViewMode();

  if (!isInitialized) return null;

  return (
    <div className="w-full bg-theme border-b border-theme/5 py-1.5 px-4 flex items-center justify-between text-xs text-theme font-sans z-[100] relative select-none">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="font-semibold text-[10px] uppercase tracking-widest text-theme">Responsive Simulation Engine</span>
      </div>

      <div className="flex items-center bg-theme border border-theme/10 rounded-full p-0.5">
        <button
          onClick={() => setViewMode("desktop")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
            viewMode === "desktop"
              ? "bg-theme text-theme shadow-[0_0_10px_rgba(139,206,255,0.3)]"
              : "hover:text-theme text-theme hover:bg-theme/5"
          }`}
        >
          <Monitor size={12} strokeWidth={2.5} />
          <span>Desktop View</span>
        </button>
        
        <button
          onClick={() => setViewMode("mobile")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
            viewMode === "mobile"
              ? "bg-theme text-theme shadow-[0_0_10px_rgba(252,211,77,0.3)]"
              : "hover:text-theme text-theme hover:bg-theme/5"
          }`}
        >
          <Smartphone size={12} strokeWidth={2.5} />
          <span>Mobile View</span>
        </button>
      </div>

      <div className="hidden sm:flex items-center gap-2 text-[10px] text-theme uppercase tracking-wider font-bold">
        <span>Active View:</span>
        <span className={viewMode === "desktop" ? "text-[#8bceff]" : "text-[#fcd34d]"}>
          {viewMode === "desktop" ? "Desktop (Locked 1280px)" : "Mobile (Responsive)"}
        </span>
      </div>
    </div>
  );
}
