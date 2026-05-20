import Link from "next/link";
import { ArrowRight, MessageSquare, GraduationCap, FlaskConical, Microscope, CheckCircle2 } from "lucide-react";

export default function InstitutionalHubPage() {
  return (
    <div className="flex flex-col min-h-full">
      
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-4 py-24 md:py-32">
        <div className="inline-flex items-center justify-center px-3 py-1 mb-6 border border-[#e5a93b]/30 bg-[#e5a93b]/5 text-[#e5a93b] rounded text-[10px] font-mono uppercase tracking-widest font-bold">
          PROCUREMENT PORTAL / INSTITUTIONAL
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 max-w-4xl">
          Institutional Procurement Suite
        </h1>
        
        <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed mb-10">
          Precision-engineered solutions for every stage of scientific discovery. Streamlined bulk ordering for educational and tier-1 research facilities.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/institutional/catalog" className="w-full sm:w-auto bg-[#e5a93b] hover:bg-[#d49932] text-black px-8 py-3.5 rounded font-bold text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2">
            <span>Request Institutional Catalog</span>
            <ArrowRight size={16} />
          </Link>
          <Link href="/institutional/custom-quotation" className="w-full sm:w-auto bg-[#e5a93b] hover:bg-[#d49932] text-black px-8 py-3.5 rounded font-bold text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2">
            <span>Request Custom Quotation</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="border-t border-white/5 w-full"></div>

      {/* Core Institutional Pillars */}
      <div className="px-8 md:px-12 py-16 flex-1">
        
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white tracking-tight">Core Institutional Pillars</h2>
          <p className="text-gray-500 text-xs mt-1 font-mono uppercase tracking-wider">Standardized packages for scale.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: School */}
          <div className="bg-[#161616] border border-white/10 rounded-xl p-8 hover:border-white/20 transition-all flex flex-col relative group">
            <div className="absolute right-6 top-6 text-white/5 group-hover:text-white/10 transition-colors pointer-events-none">
              <GraduationCap size={80} strokeWidth={1} />
            </div>
            
            <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-3">K-12 / Secondary</div>
            <h3 className="text-xl font-bold text-white leading-tight mb-4 pr-12">School Laboratory Solutions</h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-8 h-16">
              Curriculum-aligned kits prioritizing safety, durability, and ease of deployment across district levels.
            </p>
            
            <ul className="space-y-3 mb-10 flex-1">
              {[
                "High-impact resistant glassware",
                "Basic safety compliance kits",
                "Pre-packaged curriculum modules"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <CheckCircle2 size={14} className="text-[#e5a93b] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/institutional/school-solutions" className="text-[#e5a93b] hover:text-[#f0b743] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 w-fit border-b border-transparent hover:border-[#e5a93b] pb-0.5 transition-all">
              Explore Solutions <ArrowRight size={12} />
            </Link>
          </div>

          {/* Pillar 2: College */}
          <div className="bg-[#161616] border border-white/10 rounded-xl p-8 hover:border-[#e5a93b]/40 transition-all flex flex-col relative group">
            <div className="absolute right-6 top-6 text-white/5 group-hover:text-[#e5a93b]/10 transition-colors pointer-events-none">
              <FlaskConical size={80} strokeWidth={1} />
            </div>
            
            <div className="text-[9px] font-mono text-[#e5a93b] uppercase tracking-widest mb-3 border border-[#e5a93b]/30 bg-[#e5a93b]/10 px-2 py-0.5 rounded w-fit">Undergrad / Graduate</div>
            <h3 className="text-xl font-bold text-white leading-tight mb-4 pr-12">College & University Packages</h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-8 h-16">
              Comprehensive departmental setups featuring advanced analytical tools and scalable bulk glassware ordering.
            </p>
            
            <ul className="space-y-3 mb-10 flex-1">
              {[
                "Analytical-grade instrumentation",
                "Department-wide bulk procurement",
                "Specialized fume hood configurations"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <CheckCircle2 size={14} className="text-[#e5a93b] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/institutional/packages" className="text-[#e5a93b] hover:text-[#f0b743] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 w-fit border-b border-transparent hover:border-[#e5a93b] pb-0.5 transition-all">
              Explore Packages <ArrowRight size={12} />
            </Link>
          </div>

          {/* Pillar 3: Research */}
          <div className="bg-[#161616] border border-white/10 rounded-xl p-8 hover:border-red-500/30 transition-all flex flex-col relative group">
            <div className="absolute right-6 top-6 text-white/5 group-hover:text-red-500/10 transition-colors pointer-events-none">
              <Microscope size={80} strokeWidth={1} />
            </div>
            
            <div className="text-[9px] font-mono text-red-500 uppercase tracking-widest mb-3 border border-red-500/30 bg-red-500/10 px-2 py-0.5 rounded w-fit">Tier-1 Facilities</div>
            <h3 className="text-xl font-bold text-white leading-tight mb-4 pr-12">Advanced Research Labs</h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-8 h-16">
              High-precision instrumentation, ISO-certified calibration, and complete clean-room outfitting for critical research.
            </p>
            
            <ul className="space-y-3 mb-10 flex-1">
              {[
                "ISO-certified precision equipment",
                "Cleanroom infrastructure elements",
                "Dedicated installation engineers"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <CheckCircle2 size={14} className="text-[#e5a93b] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/institutional/catalog" className="text-[#e5a93b] hover:text-[#f0b743] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 w-fit border-b border-transparent hover:border-[#e5a93b] pb-0.5 transition-all">
              Explore Systems <ArrowRight size={12} />
            </Link>
          </div>

        </div>
      </div>
      
    </div>
  );
}
