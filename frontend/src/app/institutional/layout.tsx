"use client";

export default function InstitutionalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-theme text-theme min-h-screen font-sans selection:bg-theme selection:text-theme relative">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto py-10">
        {children}
      </div>
    </div>
  );
}
