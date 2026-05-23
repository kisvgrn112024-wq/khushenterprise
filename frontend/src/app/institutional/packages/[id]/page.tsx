import Link from "next/link";
import { ChevronRight, CheckCircle2, ArrowRight, FileText, Download, Zap, Beaker, ShieldPlus } from "lucide-react";

export function generateStaticParams() {
  return [
    { id: 'biology' },
    { id: 'chemistry' },
    { id: 'physics' }
  ];
}

export default function SuiteDetailPage({ params }: { params: { id: string } }) {
  const isPhysics = params.id === "physics";
  const isBiology = params.id === "biology";
  
  const title = isPhysics ? "Institutional Physics Lab Suite" 
              : isBiology ? "Institutional Biology Lab Suite" 
              : "Institutional Chemistry Lab Suite";
              
  const tag = isPhysics ? "PRECISION HARDWARE" 
            : isBiology ? "RESEARCH GRADE" 
            : "PREMIUM TECH INFRASTRUCTURE";

  return (
    <div className="flex flex-col min-h-full p-8 md:p-12">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-theme uppercase tracking-widest mb-10">
        <Link href="/institutional" className="hover:text-theme transition-colors">Institutional Hub</Link>
        <ChevronRight size={12} />
        <Link href="/institutional/packages" className="hover:text-theme transition-colors">Lab Packages</Link>
        <ChevronRight size={12} />
        <span className="text-[#e5a93b] font-bold">{title}</span>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        
        {/* Left: Text & Actions */}
        <div className="flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-theme border border-theme/10 px-3 py-1.5 rounded-md w-fit mb-6 shadow-sm">
            <CheckCircle2 size={14} className="text-[#e5a93b]" />
            <span className="text-[10px] font-mono font-bold text-theme uppercase tracking-wider">In Stock - Ready For Deployment</span>
          </div>

          <div className="text-[10px] font-mono text-[#e5a93b] border border-theme/30 px-2.5 py-1 rounded bg-theme/5 uppercase tracking-widest font-black w-fit mb-4">
            {tag}
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-theme leading-[1.1] tracking-tight mb-6">
            {title.split(' ').map((word, i) => (
              word === "Physics" || word === "Biology" || word === "Chemistry" 
                ? <span key={i} className="text-theme block">{word}</span>
                : <span key={i} className={i === 0 ? "block" : ""}>{word} </span>
            ))}
          </h1>

          <p className="text-theme text-sm leading-relaxed mb-10 max-w-md">
            A comprehensive, research-grade hardware package designed for high-throughput academic and industrial environments. Engineered for absolute precision, long-term durability, and seamless integration into modern workflows.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="bg-theme hover:bg-theme text-theme px-6 py-3.5 rounded font-bold text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-3 w-full sm:w-auto">
              <ArrowRight size={18} />
              <span>Place Bulk Order</span>
            </button>
            <button className="bg-transparent hover:bg-theme/5 border border-theme/20 hover:border-theme text-theme px-6 py-3.5 rounded font-bold text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-3 w-full sm:w-auto">
              <FileText size={18} />
              <span>Request Custom Quotation</span>
            </button>
          </div>
          
          <div className="flex items-center gap-8 mt-10 text-[10px] font-mono text-theme uppercase tracking-widest">
            <div>
              <div className="text-theme mb-1">SKU REFERENCE</div>
              <div className="text-theme font-bold">KE-INST-7800-X</div>
            </div>
            <div>
              <div className="text-theme mb-1">COMPLIANCE</div>
              <div className="text-theme font-bold flex items-center gap-1.5"><ShieldPlus size={12} className="text-[#e5a93b]" /> ISO 9001, GLP</div>
            </div>
          </div>
        </div>

        {/* Right: Image Representation */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#1a1a1a] to-[#252525] rounded-2xl border border-theme/5 -z-10 shadow-2xl"></div>
          {/* Conceptual abstract lab image based on user reference */}
          <div className="w-full aspect-square bg-theme rounded-xl border border-theme/10 relative overflow-hidden flex items-center justify-center group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity duration-700 mix-blend-luminosity"></div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80"></div>
            
            {/* Tech overlays */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              <div className="bg-theme/60 backdrop-blur-md border border-theme/10 px-3 py-1.5 rounded flex flex-col">
                <span className="text-[8px] font-mono text-[#e5a93b] uppercase">VOLUMETRIC TOLERANCE</span>
                <span className="text-theme text-xs font-mono font-bold mt-0.5">±0.005 mL (CLASS A)</span>
              </div>
            </div>
            
            <div className="absolute bottom-6 right-6">
              <div className="w-12 h-12 rounded-full border-2 border-theme/30 flex items-center justify-center relative animate-[spin_10s_linear_infinite]">
                 <div className="w-1.5 h-1.5 bg-theme rounded-full absolute -top-1"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                {isPhysics ? <Zap size={16} className="text-[#e5a93b]" /> : <Beaker size={16} className="text-[#e5a93b]" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-theme/10 my-8"></div>

      {/* Specifications Section */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-bold text-theme flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-theme border border-theme/30 flex items-center justify-center">
            <SettingsIcon className="text-[#e5a93b] w-3 h-3" />
          </div>
          {isPhysics ? "Technical Specifications" : "Package Manifest"}
        </h2>
        
        <div className="text-[10px] font-mono text-theme border border-theme/10 px-3 py-1.5 rounded uppercase tracking-widest bg-theme">
          SYS_DATA_2026V7
        </div>
      </div>

      {isPhysics ? (
        /* Physics: Data Table Layout */
        <div className="w-full border border-theme/10 rounded-xl overflow-hidden bg-theme">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-theme/10 bg-theme text-xs font-bold text-theme uppercase tracking-wider">
            <div className="col-span-1 text-center">ID</div>
            <div className="col-span-4">Component Sub-System</div>
            <div className="col-span-5">Key Features / Tolerances</div>
            <div className="col-span-2 text-right">Qty per Suite</div>
          </div>
          
          <div className="divide-y divide-white/5">
            {[
              { id: "01", name: "Optical Bench with Lasers", desc: "Aluminum rail (1.2m), Class II HeNe laser, precision sliders (±0.1mm)", qty: "1 Unit" },
              { id: "02", name: "Modular Circuit Board", desc: "Breadboard matrix, integrated power supply (±15V, 5V), gold-plated contacts", qty: "3 Units" },
              { id: "03", name: "Digital Oscilloscope", desc: "100 MHz bandwidth, 2 channels, 1 GSa/s sample rate, 7\" TFT display", qty: "1 Unit" },
              { id: "04", name: "Kinematics Track System", desc: "Low-friction aluminum track (1.5m), photogates, variable mass carts", qty: "1 Unit" },
            ].map((row) => (
              <div key={row.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-theme/[0.02] transition-colors items-center">
                <div className="col-span-1 text-center">
                  <span className="bg-theme text-theme border border-theme/10 px-2 py-1 rounded font-mono text-xs">{row.id}</span>
                </div>
                <div className="col-span-4 text-theme font-bold text-sm">{row.name}</div>
                <div className="col-span-5 text-theme text-xs leading-relaxed font-mono">{row.desc}</div>
                <div className="col-span-2 text-right text-[#e5a93b] font-bold text-xs">{row.qty}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Bio/Chem: 3-Column Card Layout */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              title: isBiology ? "Binocular Microscope" : "Borosilicate Glassware Suite",
              icon: <SettingsIcon className="w-4 h-4 text-theme" />,
              specs: isBiology 
                ? [ {k: "Magnification", v: "40X - 1000X"}, {k: "Illumination", v: "LED (Variable)"}, {k: "Head Type", v: "Siedentopf 30°"} ]
                : [ {k: "Volumetric Flasks", v: "Class A (50ml - 1000ml)"}, {k: "Erlenmeyer Flasks", v: "Heavy Wall, Baffled"}, {k: "Pipettes", v: "Precision Burettes"} ]
            },
            { 
              title: isBiology ? "Petri Dish Sets" : "Digital Heating Mantle",
              icon: <SettingsIcon className="w-4 h-4 text-theme" />,
              specs: isBiology
                ? [ {k: "Material", v: "Polystyrene"}, {k: "Diameter", v: "90mm"}, {k: "Sterilization", v: "Gamma Irradiated"} ]
                : [ {k: "Stirring", v: "Multi-position magnetic"}, {k: "PID Control", v: "Up to 400°C"}, {k: "Top Plate", v: "Ceramic-coated"} ]
            },
            { 
              title: isBiology ? "Anatomical Models" : "Precision Balances",
              icon: <SettingsIcon className="w-4 h-4 text-theme" />,
              specs: isBiology
                ? [ {k: "Type", v: "Human Torso (Multi-part)"}, {k: "Scale", v: "1:1 Life Size"}, {k: "Material", v: "High-grade PVC"} ]
                : [ {k: "Analytical", v: "To 0.1mg readability"}, {k: "Calibration", v: "Internal Automatic"}, {k: "Draft Shield", v: "Anti-static coating"} ]
            }
          ].map((card, i) => (
            <div key={i} className="bg-theme border border-theme/10 rounded-xl p-6 hover:border-theme/20 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded border border-theme/10 bg-theme flex items-center justify-center">
                  {card.icon}
                </div>
                <h3 className="font-bold text-theme text-sm tracking-wide">{card.title}</h3>
              </div>
              <ul className="space-y-4">
                {card.specs.map((spec, j) => (
                  <li key={j} className="flex justify-between items-center text-xs border-b border-theme/5 pb-2 last:border-0 last:pb-0">
                    <span className="text-theme">{spec.k}</span>
                    <span className="text-theme font-mono font-bold text-right w-1/2">{spec.v}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-theme/5 text-[9px] font-mono text-theme tracking-widest text-center">
                QTY: {isBiology ? "10 UNITS" : "5 KITS"} (MIN)
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Download Banner */}
      <div className="mt-12 bg-gradient-to-r from-[#161616] to-[#121212] border border-theme/10 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-theme/40 transition-colors group">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-lg bg-red-950/30 border border-red-500/20 flex flex-col items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-theme transition-colors">
            <span className="font-bold text-[10px] uppercase">PDF</span>
          </div>
          <div>
            <h3 className="text-theme font-bold text-lg">Download Technical Catalogue</h3>
            <p className="text-theme text-xs mt-1">Detailed schematics, full inventory lists, and compliance certificates. (PDF, 4.2 MB)</p>
          </div>
        </div>
        
        <button className="bg-transparent border border-theme/20 hover:border-theme text-theme px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0">
          <Download size={14} />
          <span>Download Document</span>
        </button>
      </div>

    </div>
  );
}

// Simple placeholder icon
function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
