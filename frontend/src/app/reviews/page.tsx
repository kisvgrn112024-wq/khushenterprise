"use client";

import { useState } from "react";
import { Star, Edit3, X, Send } from "lucide-react";

export default function ReviewsPage() {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        
        {/* Top Section: Summary & Distribution */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          
          {/* Customer Reviews Summary */}
          <div className="bg-[#111111] border border-white/10 rounded-lg p-8 flex-[1] flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Customer<br/>Reviews</h2>
            <div className="text-6xl font-black text-electric-blue mb-3 tracking-tighter">4.7</div>
            <div className="flex items-center gap-1 mb-3 text-brand-yellow">
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" className="opacity-50" />
            </div>
            <p className="text-gray-400 text-xs mb-6">Based on 1,248 laboratory professionals</p>
            <button 
              onClick={() => setIsReviewModalOpen(true)}
              className="bg-[#8bceff] hover:bg-blue-300 text-blue-950 font-bold text-xs px-6 py-3 rounded uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              <Edit3 size={14} /> Write a Review
            </button>
          </div>

          {/* Rating Distribution */}
          <div className="bg-[#111111] border border-white/10 rounded-lg p-8 flex-[2]">
            <h2 className="text-2xl font-bold text-white mb-8">Rating Distribution</h2>
            <div className="flex flex-col gap-4">
              {[
                { stars: 5, pct: "75%", width: "w-[75%]" },
                { stars: 4, pct: "20%", width: "w-[20%]" },
                { stars: 3, pct: "3%", width: "w-[3%]" },
                { stars: 2, pct: "1%", width: "w-[1%]" },
                { stars: 1, pct: "1%", width: "w-[1%]" },
              ].map((row) => (
                <div key={row.stars} className="flex items-center gap-4 text-xs font-bold">
                  <div className="text-white w-12">{row.stars} Stars</div>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full bg-electric-blue ${row.width}`}></div>
                  </div>
                  <div className="text-gray-400 w-8 text-right">{row.pct}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1 */}
          <div className="bg-[#111111] border border-white/10 rounded-lg overflow-hidden flex flex-col">
            <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80" alt="Microscope" className="w-full h-40 object-cover opacity-80" />
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">Dr. Sarah Jenkins</h3>
                  <p className="text-gray-400 text-[10px] uppercase tracking-wider">Biomedical Researcher</p>
                </div>
                <div className="flex text-brand-yellow">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
              </div>
              <h4 className="text-electric-blue text-sm font-bold mb-2">Exceptional Clarity for Cellular Analysis</h4>
              <p className="text-gray-400 text-xs leading-relaxed mb-6 flex-1">
                The optics on the X-200 series are unparalleled in this price bracket. We've been using it for continuous cell culture monitoring and the resolution holds up even at maximum magnification. Build quality feels robust.
              </p>
              <div className="text-[10px] text-gray-500 font-bold border-t border-white/10 pt-4">
                Product: X-200 Phase Contrast Microscope
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#111111] border border-white/10 rounded-lg overflow-hidden flex flex-col">
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">Michael Chen</h3>
                  <p className="text-gray-400 text-[10px] uppercase tracking-wider">University Lab Manager</p>
                </div>
                <div className="flex text-brand-yellow">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
              </div>
              <h4 className="text-electric-blue text-sm font-bold mb-2">Reliable Bulk Glassware</h4>
              <p className="text-gray-400 text-xs leading-relaxed mb-6 flex-1">
                Ordered 500 units of the borosilicate beakers for the undergraduate chemistry labs. Delivery was prompt, and not a single item was damaged during transit. The graduations are highly legible and survive repeated autoclaving.
              </p>
              <div className="text-[10px] text-gray-500 font-bold border-t border-white/10 pt-4 mt-auto">
                Product: Bulk Borosilicate Beakers (250ml)
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#111111] border border-white/10 rounded-lg overflow-hidden flex flex-col">
            <img src="https://images.unsplash.com/photo-1574548450125-9c86422b5123?auto=format&fit=crop&q=80" alt="Centrifuge" className="w-full h-40 object-cover opacity-80" />
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">Elena Rodriguez</h3>
                  <p className="text-gray-400 text-[10px] uppercase tracking-wider">Clinical Diagnostics</p>
                </div>
                <div className="flex text-brand-yellow">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
              </div>
              <h4 className="text-electric-blue text-sm font-bold mb-2">Whisper Quiet Operation</h4>
              <p className="text-gray-400 text-xs leading-relaxed mb-6 flex-1">
                Upgraded to the C-Max Centrifuge last month. The motor is incredibly smooth; you can barely hear it running even at 15,000 RPM. The digital interface is intuitive and the rotor swapping mechanism is a huge time saver.
              </p>
              <div className="text-[10px] text-gray-500 font-bold border-t border-white/10 pt-4">
                Product: C-Max High-Speed Centrifuge
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-[#111111] border border-white/10 rounded-lg overflow-hidden flex flex-col">
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">Dr. James Atherton</h3>
                  <p className="text-gray-400 text-[10px] uppercase tracking-wider">Independent Analyst</p>
                </div>
                <div className="flex text-brand-yellow">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" className="opacity-50" />
                </div>
              </div>
              <h4 className="text-electric-blue text-sm font-bold mb-2">Flawless Calibration Standards</h4>
              <p className="text-gray-400 text-xs leading-relaxed mb-6 flex-1">
                The precision weights arrived fully certified. I ran them against our primary standards and the deviation was well within the stated tolerance. Khush Enterprises remains my go-to for rigorous compliance tools.
              </p>
              <div className="text-[10px] text-gray-500 font-bold border-t border-white/10 pt-4 mt-auto">
                Product: Class E2 Calibration Weights Set
              </div>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-[#111111] border border-white/10 rounded-lg overflow-hidden flex flex-col">
            <img src="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80" alt="Analytical Balance" className="w-full h-40 object-cover opacity-80" />
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">TechCorp Labs</h3>
                  <p className="text-gray-400 text-[10px] uppercase tracking-wider">Quality Control Dept</p>
                </div>
                <div className="flex text-brand-yellow">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
              </div>
              <h4 className="text-electric-blue text-sm font-bold mb-2">Rapid Stabilization Time</h4>
              <p className="text-gray-400 text-xs leading-relaxed mb-6 flex-1">
                The new analytical balances have significantly improved our workflow. Stabilization takes under 2 seconds, and the draft shield is ergonomically designed. Highly recommended for high-throughput QC environments.
              </p>
              <div className="text-[10px] text-gray-500 font-bold border-t border-white/10 pt-4 mt-auto">
                Product: Precision Analytical Balance (0.1mg)
              </div>
            </div>
          </div>

        </div>

        <div className="flex justify-center">
          <button className="border border-white/20 text-white font-bold text-xs px-8 py-3 rounded uppercase tracking-wider hover:bg-white/5 transition-colors">
            Load More Reviews
          </button>
        </div>

      </div>

      {/* Write Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/10 rounded-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Write a Review</h2>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Overall Rating</label>
                <div className="flex gap-2 text-gray-600">
                  <Star size={28} className="hover:text-brand-yellow cursor-pointer transition-colors" />
                  <Star size={28} className="hover:text-brand-yellow cursor-pointer transition-colors" />
                  <Star size={28} className="hover:text-brand-yellow cursor-pointer transition-colors" />
                  <Star size={28} className="hover:text-brand-yellow cursor-pointer transition-colors" />
                  <Star size={28} className="hover:text-brand-yellow cursor-pointer transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Review Title</label>
                <input type="text" placeholder="Summarize your experience..." className="w-full bg-[#1a1a1a] border border-white/10 rounded px-4 py-3 text-white text-sm outline-none focus:border-electric-blue transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Your Review</label>
                <textarea placeholder="What did you like or dislike? How was the product quality and delivery?" className="w-full bg-[#1a1a1a] border border-white/10 rounded px-4 py-3 text-white text-sm outline-none focus:border-electric-blue transition-colors h-32 resize-none"></textarea>
              </div>
              <button 
                onClick={() => {
                  alert("Review submitted successfully! It will be visible after moderation.");
                  setIsReviewModalOpen(false);
                }}
                className="w-full bg-electric-blue hover:bg-blue-600 text-white font-bold py-4 rounded flex items-center justify-center gap-2 transition-colors"
              >
                Submit Review <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
