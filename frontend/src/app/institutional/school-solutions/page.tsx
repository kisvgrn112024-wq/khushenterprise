import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronRight, FileText } from "lucide-react";

export default function SchoolSolutionsPage() {
  return (
    <div className="flex flex-col min-h-full p-8 md:p-12">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-10">
        <Link href="/institutional" className="hover:text-white transition-colors">Institutional Hub</Link>
        <ChevronRight size={12} />
        <span className="text-[#e5a93b] font-bold">School Laboratory Solutions</span>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="max-w-2xl">
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3 border border-white/10 bg-white/5 px-2 py-0.5 rounded w-fit">
            K-12 / SECONDARY LAB SUITES
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4">
            School Laboratory Solutions
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
            Standardized, durable, and compliant equipment packages designed specifically for secondary educational institutions. Engineered to withstand high-volume student use.
          </p>
        </div>
        
        <button className="bg-[#e5a93b] hover:bg-[#d49932] text-black px-6 py-3.5 rounded font-bold text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-3 shrink-0 h-fit">
          <FileText size={16} />
          <span>Request Custom Quote</span>
        </button>
      </div>

      {/* Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Biology */}
        <div className="bg-[#161616] border border-white/10 rounded-xl overflow-hidden hover:border-[#e5a93b]/40 transition-colors flex flex-col group">
          <div className="aspect-[4/3] bg-[#1a1a1a] relative overflow-hidden flex items-center justify-center border-b border-white/5">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-700 mix-blend-luminosity"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent opacity-90"></div>
             <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm border border-white/10 px-2 py-1 rounded text-[9px] font-mono text-[#e5a93b] font-bold uppercase flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 bg-[#e5a93b] rounded-full"></div> IN STOCK
             </div>
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6">Biology Lab Infrastructure</h3>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Binocular Compound Microscopes (LED Illumination, 1000x max)",
                "Anatomical Model Sets (Human torso, cellular structures)",
                "Quality Borosilicate and Dissection Chambers",
                "Durable Dissection Kits & Safety Equipment"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <CheckCircle2 size={14} className="text-[#e5a93b] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/institutional/packages/biology" className="border border-white/20 hover:border-white text-white font-bold text-[11px] uppercase tracking-wider py-3 rounded text-center transition-colors">
              Configure Suite Package
            </Link>
          </div>
        </div>

        {/* Chemistry */}
        <div className="bg-[#161616] border border-white/10 rounded-xl overflow-hidden hover:border-[#e5a93b]/40 transition-colors flex flex-col group">
          <div className="aspect-[4/3] bg-[#1a1a1a] relative overflow-hidden flex items-center justify-center border-b border-white/5">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-700 mix-blend-luminosity"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent opacity-90"></div>
             <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm border border-white/10 px-2 py-1 rounded text-[9px] font-mono text-gray-400 font-bold uppercase flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div> LIMITED STOCK
             </div>
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6">Chemistry Lab Infrastructure</h3>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Comprehensive volumetric glassware clusters (Class A, assorted)",
                "High-Temp Heating Mantles & Bunsen burner arrays",
                "Precision Analytical Balances (0.01g resolution)",
                "Industrial-Grade Fume Hoods & Safety Cabinets"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <CheckCircle2 size={14} className="text-[#e5a93b] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/institutional/packages/chemistry" className="border border-white/20 hover:border-white text-white font-bold text-[11px] uppercase tracking-wider py-3 rounded text-center transition-colors">
              Configure Suite Package
            </Link>
          </div>
        </div>

        {/* Physics */}
        <div className="bg-[#161616] border border-white/10 rounded-xl overflow-hidden hover:border-[#e5a93b]/40 transition-colors flex flex-col group">
          <div className="aspect-[4/3] bg-[#1a1a1a] relative overflow-hidden flex items-center justify-center border-b border-white/5">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1628126235206-5260b9ea6441?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-700 mix-blend-luminosity"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent opacity-90"></div>
             <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm border border-white/10 px-2 py-1 rounded text-[9px] font-mono text-[#e5a93b] font-bold uppercase flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 bg-[#e5a93b] rounded-full"></div> IN STOCK
             </div>
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6">Physics Lab Infrastructure</h3>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Advanced Optics Benches (Lasers, lenses, prisms)",
                "Modular Circuit Training Boards (Breadboards, components)",
                "Kinematics & Dynamics Track Systems",
                "Digital Oscilloscopes & Electromagnets"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <CheckCircle2 size={14} className="text-[#e5a93b] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/institutional/packages/physics" className="border border-white/20 hover:border-white text-white font-bold text-[11px] uppercase tracking-wider py-3 rounded text-center transition-colors">
              Configure Suite Package
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
