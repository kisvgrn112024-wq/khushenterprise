"use client";

import { FileText, Send, Truck, Package, ShieldCheck, User, Clock } from "lucide-react";

export default function BulkOrdersPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Hero Section */}
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <span className="text-electric-blue text-[10px] font-bold tracking-widest uppercase mb-4 block">B2B PROCUREMENT SOLUTIONS</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Streamline Your Bulk<br/>Sourcing
            </h1>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              Partner with Khush Enterprises for precision laboratory equipment at scale. Enjoy dedicated account management, tiered pricing structures, and priority fulfillment for bulk orders.
            </p>
            <button className="bg-electric-blue hover:bg-blue-600 text-white px-8 py-3.5 rounded text-xs font-bold uppercase tracking-wider transition-colors">
              Request a Quote
            </button>
          </div>
          <div className="flex-1 w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-electric-blue/10 mix-blend-overlay z-10"></div>
              <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80" alt="Bulk test tubes" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Tiered Pricing Structures */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Tiered Pricing Structures</h2>
          <p className="text-gray-400 text-sm">Transparent discount thresholds designed for educational institutions and research facilities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Tier 1 */}
          <div className="bg-[#111111] border border-white/10 rounded-lg p-8 hover:border-electric-blue/30 transition-colors">
            <div className="mb-4">
              <Truck size={24} className="text-electric-blue mb-4" />
              <h3 className="text-xl font-bold text-white mb-1">Volume Tier 1</h3>
              <p className="text-gray-500 text-xs">For orders spanning 50-199 units per SKU.</p>
            </div>
            <div className="mt-8 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-electric-blue">10%</span>
              <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">OFF BASE PRICE</span>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="bg-[#111111] border border-electric-blue/30 rounded-lg p-8 relative hover:border-electric-blue/50 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.1)]">
            <div className="absolute top-0 right-0 bg-electric-blue/20 text-electric-blue text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-tr-lg rounded-bl-lg">
              POPULAR
            </div>
            <div className="mb-4">
              <Package size={24} className="text-electric-blue mb-4" />
              <h3 className="text-xl font-bold text-white mb-1">Volume Tier 2</h3>
              <p className="text-gray-500 text-xs">For orders spanning 200-499 units per SKU.</p>
            </div>
            <div className="mt-8 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-electric-blue">18%</span>
              <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">OFF BASE PRICE</span>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="bg-[#111111] border border-brand-yellow/30 rounded-lg p-8 hover:border-brand-yellow/50 transition-colors shadow-[0_0_15px_rgba(252,211,77,0.05)]">
            <div className="mb-4">
              <ShieldCheck size={24} className="text-brand-yellow mb-4" />
              <h3 className="text-xl font-bold text-white mb-1">Enterprise Tier</h3>
              <p className="text-gray-500 text-xs">For orders exceeding 500+ units per SKU.</p>
            </div>
            <div className="mt-8 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-brand-yellow">25%</span>
              <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">OFF BASE PRICE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Sourced Table */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Frequently Sourced in Bulk</h2>
        
        <div className="w-full overflow-x-auto bg-[#111111] border border-white/10 rounded-lg">
          <table className="w-full text-left text-sm text-gray-400 whitespace-nowrap">
            <thead className="text-xs uppercase bg-black/40 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-bold">SKU</th>
                <th className="px-6 py-4 font-bold">Product Description</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Min. Bulk Qty</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-electric-blue font-medium">BKR-250-GL</td>
                <td className="px-6 py-4 text-gray-300">Borosilicate Glass Beakers, 250ml, Graduated</td>
                <td className="px-6 py-4">Glassware</td>
                <td className="px-6 py-4">100 pcs</td>
                <td className="px-6 py-4"><span className="bg-electric-blue/10 text-electric-blue text-[10px] font-bold px-2 py-1 uppercase rounded">IN STOCK</span></td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-electric-blue font-medium">PIP-10-MC</td>
                <td className="px-6 py-4 text-gray-300">Micropipettes, Variable Volume 1-10μL</td>
                <td className="px-6 py-4">Liquid Handling</td>
                <td className="px-6 py-4">50 pcs</td>
                <td className="px-6 py-4"><span className="bg-electric-blue/10 text-electric-blue text-[10px] font-bold px-2 py-1 uppercase rounded">IN STOCK</span></td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-electric-blue font-medium">PET-90-PS</td>
                <td className="px-6 py-4 text-gray-300">Petri Dishes, Polystyrene, 90mm x 15mm, Sterile</td>
                <td className="px-6 py-4">Consumables</td>
                <td className="px-6 py-4">500 pcs</td>
                <td className="px-6 py-4"><span className="bg-brand-yellow/10 text-brand-yellow text-[10px] font-bold px-2 py-1 uppercase rounded">LOW STOCK</span></td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-electric-blue font-medium">CEN-15-PP</td>
                <td className="px-6 py-4 text-gray-300">Centrifuge Tubes, Conical Bottom, 15ml, PP</td>
                <td className="px-6 py-4">Consumables</td>
                <td className="px-6 py-4">1000 pcs</td>
                <td className="px-6 py-4"><span className="bg-electric-blue/10 text-electric-blue text-[10px] font-bold px-2 py-1 uppercase rounded">IN STOCK</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quote Form */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="bg-[#111111] border border-white/10 rounded-xl p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row gap-12">
            
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Request a Custom Quote</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
                Provide details about your procurement needs, and our B2B specialists will respond within 24 hours with a comprehensive proposal.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <User size={16} className="text-electric-blue" />
                  <span>Dedicated Account Manager Assigned</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <FileText size={16} className="text-electric-blue" />
                  <span>Formal PDF Quote Provided</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Clock size={16} className="text-electric-blue" />
                  <span>24-Hour SLA Guarantee</span>
                </div>
              </div>
            </div>

            <div className="flex-[1.5]">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">First Name</label>
                    <input type="text" placeholder="Dr. Jane" className="w-full bg-[#1a1a1a] border border-white/10 rounded px-4 py-3 text-white text-sm outline-none focus:border-white/30 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Last Name</label>
                    <input type="text" placeholder="Doe" className="w-full bg-[#1a1a1a] border border-white/10 rounded px-4 py-3 text-white text-sm outline-none focus:border-white/30 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Institution / Company Name</label>
                  <input type="text" placeholder="Global Research Labs" className="w-full bg-[#1a1a1a] border border-white/10 rounded px-4 py-3 text-white text-sm outline-none focus:border-white/30 transition-colors" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Work Email</label>
                    <input type="email" placeholder="jane@research.edu" className="w-full bg-[#1a1a1a] border border-white/10 rounded px-4 py-3 text-white text-sm outline-none focus:border-white/30 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Phone Number</label>
                    <input type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-[#1a1a1a] border border-white/10 rounded px-4 py-3 text-white text-sm outline-none focus:border-white/30 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-2 uppercase tracking-wider">Equipment Requirements & Estimated Quantities</label>
                  <textarea placeholder="Please list SKUs, product descriptions, and desired quantities..." className="w-full bg-[#1a1a1a] border border-white/10 rounded px-4 py-3 text-white text-sm outline-none focus:border-white/30 transition-colors h-32 resize-none"></textarea>
                </div>

                <button type="submit" className="w-full bg-electric-blue hover:bg-blue-600 text-white font-bold text-sm py-4 rounded flex items-center justify-center gap-2 transition-colors">
                  Submit Inquiry <Send size={16} />
                </button>
              </form>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
