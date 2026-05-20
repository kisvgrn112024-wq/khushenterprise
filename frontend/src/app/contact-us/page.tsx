import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Precision Support.</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Whether you require high-volume procurement or technical specifications for specialized laboratory equipment, our dedicated scientific sales team is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Box 1: Khush Enterprises Info */}
            <div className="bg-[#111111] border border-white/10 rounded-lg p-8">
              <div className="mb-8 border-b border-white/10 pb-6">
                <h2 className="text-xl font-bold text-white tracking-wider mb-1">KHUSH ENTERPRISES</h2>
                <p className="text-brand-yellow text-[10px] font-bold uppercase tracking-widest">LABORATORY EQUIPMENT & GENERAL SUPPLIES</p>
              </div>
              
              <div className="mb-8">
                <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">CONTACT SALES</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-gray-300 text-sm">
                    <Phone size={16} className="text-brand-yellow" /> +91 98900 11762
                  </div>
                  <div className="flex items-center gap-3 text-gray-300 text-sm">
                    <Phone size={16} className="text-brand-yellow" /> +91 97294 57762
                  </div>
                  <div className="flex items-center gap-3 text-gray-300 text-sm">
                    <Mail size={16} className="text-brand-yellow" /> khushenterprises@gmail.com
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">HEADQUARTERS</h3>
                <div className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                  <MapPin size={16} className="text-electric-blue mt-1 shrink-0" />
                  <div>
                    123 Science Park, Tech Boulevard<br/>
                    Mumbai, Maharashtra<br/>
                    India 400001
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: Operating Hours */}
            <div className="bg-[#111111] border border-white/10 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Clock size={20} className="text-white" />
                <h2 className="text-lg font-bold text-white">Operating Hours</h2>
              </div>
              
              <div className="flex flex-col gap-4 text-sm">
                <div className="flex justify-between items-center text-gray-300 border-b border-white/5 pb-4">
                  <span>Monday - Friday</span>
                  <span className="text-white font-medium">8:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between items-center text-gray-300 border-b border-white/5 pb-4">
                  <span>Saturday</span>
                  <span className="text-white font-medium">9:00 AM - 2:00 PM EST</span>
                </div>
                <div className="flex justify-between items-center text-gray-300">
                  <span>Sunday</span>
                  <span className="text-gray-500">Closed</span>
                </div>
              </div>
            </div>
            
          </div>

          {/* Right Column: Direct Inquiry Form */}
          <div className="lg:col-span-7 bg-[#111111] border border-white/10 rounded-lg p-8 md:p-10 flex flex-col">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Direct Inquiry</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Complete the form below to connect with our procurement specialists. We aim to respond to all technical queries within 24 hours.
              </p>
            </div>

            <form className="flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">FULL NAME</label>
                  <input type="text" placeholder="Dr. Jane Doe" className="w-full bg-[#1a1a1a] border border-transparent rounded px-4 py-3 text-white text-sm outline-none focus:border-electric-blue transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">EMAIL ADDRESS</label>
                  <input type="email" placeholder="jane.doe@institution.edu" className="w-full bg-[#1a1a1a] border border-transparent rounded px-4 py-3 text-white text-sm outline-none focus:border-electric-blue transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">INSTITUTION / COMPANY</label>
                  <input type="text" placeholder="University of Science" className="w-full bg-[#1a1a1a] border border-transparent rounded px-4 py-3 text-white text-sm outline-none focus:border-electric-blue transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">INQUIRY TYPE</label>
                  <select className="w-full bg-[#1a1a1a] border border-transparent rounded px-4 py-3 text-white text-sm outline-none focus:border-electric-blue transition-colors appearance-none">
                    <option>Bulk Order Quote</option>
                    <option>Technical Support</option>
                    <option>General Inquiry</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">MESSAGE</label>
                <textarea 
                  placeholder="Please provide specific details regarding required equipment, quantities, or technical specifications..." 
                  className="w-full flex-1 min-h-[120px] bg-[#1a1a1a] border border-transparent rounded px-4 py-3 text-white text-sm outline-none focus:border-electric-blue transition-colors resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end mt-2">
                <button type="button" className="bg-[#e6e6e6] hover:bg-white text-black font-bold text-xs px-8 py-3 rounded uppercase tracking-wider flex items-center gap-2 transition-colors">
                  Submit Inquiry <Send size={14} />
                </button>
              </div>
            </form>
          </div>
          
        </div>

        {/* Map Image Section */}
        <div className="w-full h-64 md:h-80 relative rounded-lg overflow-hidden border border-white/10 group cursor-crosshair">
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80" alt="Map" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity grayscale" />
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div className="absolute bottom-6 left-6 bg-[#111111]/90 backdrop-blur-sm border border-white/10 p-4 rounded flex items-start gap-3">
             <div className="w-8 h-8 rounded-full bg-electric-blue/20 flex items-center justify-center shrink-0">
                <MapPin size={16} className="text-electric-blue" />
             </div>
             <div>
               <div className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">GLOBAL HEADQUARTERS</div>
               <div className="text-gray-400 text-xs">Mumbai, India</div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
