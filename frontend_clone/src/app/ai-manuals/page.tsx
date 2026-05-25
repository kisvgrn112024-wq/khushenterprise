import { FileText, Search, History, Download } from "lucide-react";

export default function AIManualsPage() {
  return (
    <div className="bg-theme min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="bg-theme pt-20 pb-24 px-4 rounded-b-[40px] shadow-sm">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-6">
            <FileText size={64} className="text-[#8bceff] opacity-90 drop-shadow-md" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-theme mb-6 tracking-tight">AI Technical Manuals</h1>
          <p className="text-theme/80 text-lg md:text-xl max-w-3xl mx-auto mb-10 font-light leading-relaxed">
            Access precise, up-to-date AI-generated documentation, operation guidelines, and troubleshooting protocols for our entire range of laboratory equipment.
          </p>
          
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-theme">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search technical documentation by model number or instrument..." 
              className="w-full bg-theme text-theme rounded-full py-4 pl-12 pr-32 outline-none border border-transparent focus:border-theme/20 transition-colors shadow-xl placeholder-gray-400"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-theme text-[#8bceff] hover:bg-theme px-6 py-2 rounded-full font-semibold transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Recently Viewed Section */}
      <div className="container mx-auto px-4 lg:px-8 py-16 flex-1">
        <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
          <History size={24} className="text-[#d4c5b0]" />
          <h2 className="text-2xl font-bold text-[#d4c5b0]">Recently Viewed Manuals</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-gradient-to-br from-[#4a5568] to-[#a0aec0] rounded-xl p-6 text-theme shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group cursor-pointer flex flex-col min-h-[220px]">
            <div className="absolute top-0 right-0 p-4">
              <span className="bg-theme text-theme text-[10px] font-bold px-3 py-1 rounded shadow-md">V 2.1</span>
            </div>
            <div className="mb-4">
              <div className="w-10 h-10 border border-theme/30 rounded flex items-center justify-center bg-theme/10 backdrop-blur-sm">
                <FileText size={20} className="text-[#ffa8a8]" />
              </div>
            </div>
            <div className="text-theme/70 text-[10px] uppercase tracking-wider font-bold mb-1">Centrifuges</div>
            <h3 className="text-2xl font-bold mb-2">High-Speed<br/>Microcentrifuge KE-200</h3>
            <p className="text-theme/80 text-xs mb-8 flex-1">Operation guidelines, rotor installation, and maintenance schedules.</p>
            <div className="flex justify-between items-center border-t border-theme/20 pt-4 mt-auto">
              <span className="text-xs text-theme/70 font-semibold">4.2 MB</span>
              <span className="text-[#8bceff] text-xs font-bold flex items-center gap-1 group-hover:text-theme transition-colors">
                <Download size={14} /> Download
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-br from-[#4a5568] to-[#a0aec0] rounded-xl p-6 text-theme shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group cursor-pointer flex flex-col min-h-[220px]">
            <div className="absolute top-0 right-0 p-4">
              <span className="bg-theme text-theme text-[10px] font-bold px-3 py-1 rounded shadow-md">V 1.0</span>
            </div>
            <div className="mb-4">
              <div className="w-10 h-10 border border-theme/30 rounded flex items-center justify-center bg-theme/10 backdrop-blur-sm">
                <FileText size={20} className="text-[#ffa8a8]" />
              </div>
            </div>
            <div className="text-theme/70 text-[10px] uppercase tracking-wider font-bold mb-1">Spectrometers</div>
            <h3 className="text-2xl font-bold mb-2">UV-Vis Spectrophotometer Pro</h3>
            <p className="text-theme/80 text-xs mb-8 flex-1">Calibration protocols and software interface manual.</p>
            <div className="flex justify-between items-center border-t border-theme/20 pt-4 mt-auto">
              <span className="text-xs text-theme/70 font-semibold">8.5 MB</span>
              <span className="text-[#8bceff] text-xs font-bold flex items-center gap-1 group-hover:text-theme transition-colors">
                <Download size={14} /> Download
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-br from-[#4a5568] to-[#a0aec0] rounded-xl p-6 text-theme shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group cursor-pointer flex flex-col min-h-[220px]">
            <div className="absolute top-0 right-0 p-4">
              <span className="bg-theme text-theme text-[10px] font-bold px-3 py-1 rounded shadow-md">V 3.4</span>
            </div>
            <div className="mb-4">
              <div className="w-10 h-10 border border-theme/30 rounded flex items-center justify-center bg-theme/10 backdrop-blur-sm">
                <FileText size={20} className="text-[#ffa8a8]" />
              </div>
            </div>
            <div className="text-theme/70 text-[10px] uppercase tracking-wider font-bold mb-1">Microscopes</div>
            <h3 className="text-2xl font-bold mb-2">Digital Electron Microscope X1</h3>
            <p className="text-theme/80 text-xs mb-8 flex-1">Lens care, focus adjustments, and digital image capture guide.</p>
            <div className="flex justify-between items-center border-t border-theme/20 pt-4 mt-auto">
              <span className="text-xs text-theme/70 font-semibold">12.1 MB</span>
              <span className="text-[#8bceff] text-xs font-bold flex items-center gap-1 group-hover:text-theme transition-colors">
                <Download size={14} /> Download
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
