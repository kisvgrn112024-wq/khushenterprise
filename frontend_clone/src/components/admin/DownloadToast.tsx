"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Download, X, FileText } from 'lucide-react';
import Link from 'next/link';

interface DownloadState {
  isActive: boolean;
  filename: string;
  size: string;
  type: string;
  progress: number;
}

interface DownloadContextType {
  startDownload: (filename: string, size: string, type: string) => void;
}

const DownloadContext = createContext<DownloadContextType | undefined>(undefined);

export function useDownload() {
  const context = useContext(DownloadContext);
  if (!context) throw new Error("useDownload must be used within DownloadProvider");
  return context;
}

export function DownloadProvider({ children }: { children: React.ReactNode }) {
  const [download, setDownload] = useState<DownloadState>({
    isActive: false,
    filename: "",
    size: "",
    type: "",
    progress: 0
  });

  const startDownload = (filename: string, size: string, type: string) => {
    setDownload({
      isActive: true,
      filename,
      size,
      type,
      progress: 0
    });
  };

  useEffect(() => {
    if (download.isActive && download.progress < 100) {
      const timer = setTimeout(() => {
        setDownload(prev => ({
          ...prev,
          progress: Math.min(prev.progress + Math.floor(Math.random() * 20) + 10, 100)
        }));
      }, 500);
      return () => clearTimeout(timer);
    } else if (download.isActive && download.progress >= 100) {
      const timer = setTimeout(() => {
        // Automatically open the generic print tab
        window.open(`/print?file=${encodeURIComponent(download.filename)}`, '_blank');
        setDownload(prev => ({ ...prev, isActive: false }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [download.isActive, download.progress]);

  const closeToast = () => setDownload(prev => ({ ...prev, isActive: false }));

  return (
    <DownloadContext.Provider value={{ startDownload }}>
      {children}
      {download.isActive && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] bg-theme border border-theme/10 rounded-xl shadow-2xl overflow-hidden font-sans">
          <div className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded bg-theme border border-brand-yellow/20 flex items-center justify-center text-brand-yellow shrink-0">
                  <Download size={18} />
                </div>
                <div>
                  <h3 className="text-theme font-bold text-sm">Download Started</h3>
                  <p className="text-theme text-xs">Processing export...</p>
                </div>
              </div>
              <button onClick={closeToast} className="text-theme hover:text-theme transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* File Asset Box */}
            <div className="bg-theme border border-theme/5 rounded-lg p-3 flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded bg-theme border border-theme/20 flex items-center justify-center text-[#8bceff] shrink-0">
                <FileText size={14} />
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-theme truncate">{download.filename}</div>
                <div className="text-xs text-theme">{download.size} • {download.type}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-theme uppercase tracking-widest">Progress</span>
                <span className="text-[10px] font-bold text-brand-yellow">{download.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-theme rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-yellow transition-all duration-300 ease-out"
                  style={{ width: `${download.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Footer Link */}
            <div className="border-t border-theme/5 pt-4 text-center">
              <Link href="#" className="text-[10px] font-bold text-theme hover:text-theme transition-colors uppercase tracking-widest">
                View Downloads History →
              </Link>
            </div>
          </div>
        </div>
      )}
    </DownloadContext.Provider>
  );
}
