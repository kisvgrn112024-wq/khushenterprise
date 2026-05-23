import { ShieldCheck, Download, BriefcaseMedical, FlaskConical, Leaf, ArrowRight } from "lucide-react";

export default function CertificationsPage() {
  return (
    <div className="min-h-screen bg-theme pb-24">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="mb-12 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-theme mb-4">Quality & Standards</h1>
          <p className="text-theme text-sm leading-relaxed">
            Our commitment to precision and reliability is validated by internationally recognized standards. We maintain rigorous quality control protocols across all laboratory equipment procurement and supply chains.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Primary Certification */}
          <div className="flex-[1.5]">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={16} className="text-electric-blue" />
              <h2 className="text-electric-blue text-[10px] font-bold uppercase tracking-widest">PRIMARY CERTIFICATION</h2>
            </div>
            
            <div className="bg-theme border border-theme/10 rounded-lg overflow-hidden flex flex-col h-full">
              <div className="p-8 bg-theme flex-1 flex items-center justify-center min-h-[400px]">
                <img 
                  src="https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80" 
                  alt="ISO Certificate" 
                  className="max-w-full h-auto drop-shadow-2xl border border-theme/5 opacity-80"
                />
              </div>
              <div className="p-6 md:p-8 border-t border-theme/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-theme mb-1">ISO 9001:2015</h3>
                  <p className="text-theme text-xs">Quality Management System for Laboratory Supply</p>
                </div>
                <button className="bg-theme hover:bg-blue-300 text-blue-950 font-bold text-xs px-6 py-3 rounded uppercase tracking-wider flex items-center gap-2 transition-colors">
                  <Download size={14} /> DOWNLOAD PDF
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Additional Standards */}
          <div className="flex-1">
            <div className="mb-4">
              <h2 className="text-theme text-[10px] font-bold uppercase tracking-widest pt-1">ADDITIONAL STANDARDS</h2>
            </div>
            
            <div className="flex flex-col gap-4">
              {/* Card 1 */}
              <div className="bg-theme border border-theme/10 rounded-lg p-6 hover:border-electric-blue/50 transition-colors group cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <BriefcaseMedical size={20} className="text-theme group-hover:text-electric-blue transition-colors" />
                  <span className="bg-theme border border-theme/10 text-theme text-[8px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> ACTIVE
                  </span>
                </div>
                <h3 className="text-lg font-bold text-theme mb-2">ISO 13485:2016</h3>
                <p className="text-theme text-xs mb-6">Medical devices quality management systems.</p>
                <div className="flex items-center gap-2 text-electric-blue text-[10px] font-bold uppercase tracking-wider group-hover:text-blue-400">
                  VIEW DETAILS <ArrowRight size={12} />
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-theme border border-theme/10 rounded-lg p-6 hover:border-electric-blue/50 transition-colors group cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <FlaskConical size={20} className="text-theme group-hover:text-electric-blue transition-colors" />
                  <span className="bg-theme border border-theme/10 text-theme text-[8px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> ACTIVE
                  </span>
                </div>
                <h3 className="text-lg font-bold text-theme mb-2">GLP Compliance</h3>
                <p className="text-theme text-xs mb-6">Good Laboratory Practice for non-clinical safety studies.</p>
                <div className="flex items-center gap-2 text-electric-blue text-[10px] font-bold uppercase tracking-wider group-hover:text-blue-400">
                  VIEW DETAILS <ArrowRight size={12} />
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-theme border border-theme/10 rounded-lg p-6 hover:border-electric-blue/50 transition-colors group cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <Leaf size={20} className="text-theme group-hover:text-electric-blue transition-colors" />
                  <span className="bg-theme border border-theme/10 text-theme text-[8px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> ACTIVE
                  </span>
                </div>
                <h3 className="text-lg font-bold text-theme mb-2">ISO 14001:2015</h3>
                <p className="text-theme text-xs mb-6">Environmental management systems compliance.</p>
                <div className="flex items-center gap-2 text-electric-blue text-[10px] font-bold uppercase tracking-wider group-hover:text-blue-400">
                  VIEW DETAILS <ArrowRight size={12} />
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
