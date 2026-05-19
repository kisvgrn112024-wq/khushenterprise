import { Settings2, Quote, ShieldCheck, Package, Headphones, Truck } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-0">
      
      {/* Top Hero Section */}
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">Precision in Every Detail.</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              For over two decades, Khush Enterprises has been the bedrock of scientific advancement, providing premium laboratory equipment and supplies to institutions that demand unwavering accuracy and reliability.
            </p>
          </div>
          <div className="h-64 md:h-96 rounded-lg overflow-hidden border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80" 
              alt="Headquarters" 
              className="w-full h-full object-cover grayscale opacity-80"
            />
          </div>
        </div>

        {/* Mission & Quote Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-20">
          <div className="md:col-span-8 bg-[#111111] border border-white/10 rounded-lg p-8 md:p-10 relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-white/5 group-hover:text-electric-blue/10 transition-colors">
              <Settings2 size={120} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4 relative z-10">Our Mission</h2>
            <p className="text-gray-400 text-sm leading-relaxed relative z-10 max-w-2xl">
              To empower scientific discovery and educational excellence by supplying state-of-the-art laboratory infrastructure. We believe that the foundation of a great experiment is the uncompromising quality of its tools.
            </p>
          </div>
          
          <div className="md:col-span-4 bg-[#111111] border border-white/10 rounded-lg p-8 flex flex-col justify-between">
            <div>
              <Quote className="text-electric-blue mb-4" size={24} />
              <p className="text-gray-300 text-sm italic leading-relaxed mb-6">
                "Integrity in our supply chain means precision in your results. We don't just sell equipment; we facilitate breakthroughs."
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Ishan Malhotra</h4>
              <p className="text-gray-500 text-xs">Proprietor, Khush Enterprises</p>
            </div>
          </div>
        </div>

        {/* Our Journey */}
        <div className="max-w-4xl mb-24">
          <h2 className="text-2xl font-bold text-white mb-2">Our Journey</h2>
          <p className="text-gray-400 text-sm mb-12">A legacy of growth and commitment to quality.</p>
          
          <div className="relative pl-8 md:pl-0">
            {/* Vertical Line */}
            <div className="absolute left-3.5 md:left-8 top-2 bottom-2 w-px bg-white/10"></div>
            
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 group">
                <div className="absolute left-[-23px] md:static w-3 h-3 rounded-full bg-gray-600 border-2 border-[#0a0a0a] group-hover:bg-gray-400 transition-colors shrink-0 z-10"></div>
                <div className="bg-[#111111] border border-white/10 rounded-lg p-6 flex-1 hover:border-white/20 transition-colors w-full">
                  <h3 className="text-white font-bold mb-2">1998 - Foundation</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Established in a modest facility with a singular focus on providing basic glassware to local educational institutions.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 group">
                <div className="absolute left-[-23px] md:static w-3 h-3 rounded-full bg-gray-600 border-2 border-[#0a0a0a] group-hover:bg-gray-400 transition-colors shrink-0 z-10"></div>
                <div className="bg-[#111111] border border-white/10 rounded-lg p-6 flex-1 hover:border-white/20 transition-colors w-full">
                  <h3 className="text-white font-bold mb-2">2005 - Expansion into Analytical Instruments</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Partnered with global manufacturers to introduce advanced analytical instrumentation to our catalogue.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 group">
                <div className="absolute left-[-23px] md:static w-3 h-3 rounded-full bg-electric-blue border-2 border-[#0a0a0a] shadow-[0_0_10px_rgba(37,99,235,0.8)] shrink-0 z-10"></div>
                <div className="bg-[#111111] border border-electric-blue/40 rounded-lg p-6 flex-1 shadow-[0_0_20px_rgba(37,99,235,0.05)] w-full">
                  <h3 className="text-electric-blue font-bold mb-2">2020 - National Distribution Network</h3>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Achieved full national coverage, supplying top-tier research facilities and universities across the country.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Added here per user request */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24 max-w-4xl">
           <div className="bg-[#111111] border border-brand-yellow/20 rounded-lg p-6 flex items-center gap-4">
             <div className="bg-[#1f1a11] text-brand-yellow p-3 rounded-full shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
             </div>
             <div>
               <h4 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Direct Phone</h4>
               <p className="text-white font-bold">+91 98900 11762</p>
             </div>
           </div>
           
           <div className="bg-[#111111] border border-electric-blue/20 rounded-lg p-6 flex items-center gap-4">
             <div className="bg-[#0c1825] text-electric-blue p-3 rounded-full shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
             </div>
             <div>
               <h4 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Email Address</h4>
               <p className="text-white font-bold">khushenterprises@gmail.com</p>
             </div>
           </div>
        </div>

      </div>

      {/* Why Choose Us */}
      <div className="bg-[#1a1a1a] border-t border-white/5 py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-white text-center mb-12">Why Choose Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#111111] border border-white/5 rounded-lg p-6">
              <ShieldCheck className="text-electric-blue mb-4" size={24} />
              <h3 className="text-white font-bold text-sm mb-2">Certified Quality</h3>
              <p className="text-gray-400 text-xs leading-relaxed">All equipment adheres to strict international standards.</p>
            </div>
            
            <div className="bg-[#111111] border border-white/5 rounded-lg p-6">
              <Package className="text-electric-blue mb-4" size={24} />
              <h3 className="text-white font-bold text-sm mb-2">Vast Catalogue</h3>
              <p className="text-gray-400 text-xs leading-relaxed">Over 5,000 SKUs covering general supplies to advanced tech.</p>
            </div>

            <div className="bg-[#111111] border border-white/5 rounded-lg p-6">
              <Headphones className="text-electric-blue mb-4" size={24} />
              <h3 className="text-white font-bold text-sm mb-2">Technical Support</h3>
              <p className="text-gray-400 text-xs leading-relaxed">Dedicated experts available for installation and troubleshooting.</p>
            </div>

            <div className="bg-[#111111] border border-white/5 rounded-lg p-6">
              <Truck className="text-electric-blue mb-4" size={24} />
              <h3 className="text-white font-bold text-sm mb-2">Reliable Logistics</h3>
              <p className="text-gray-400 text-xs leading-relaxed">Secure packaging and prompt delivery for sensitive instruments.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
