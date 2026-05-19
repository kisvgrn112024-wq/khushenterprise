"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="relative w-full bg-[#0a0a0a] min-h-[600px] lg:h-[700px] flex items-center overflow-hidden">
      {/* Background gradients/glows */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-electric-blue/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-20 flex flex-col lg:flex-row items-center justify-between gap-12 py-12">
        <div className="max-w-xl w-full lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Badge */}
            <div className="inline-block border border-blue-500/30 bg-blue-500/10 text-electric-blue text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full mb-6 uppercase">
              ISO 9001:2015 CERTIFIED
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Precision for the <br />
              <span className="text-electric-blue">Modern Laboratory.</span>
            </h1>
            
            <p className="text-gray-400 text-sm md:text-base mb-10 leading-relaxed font-light">
              Empowering schools, research centers, and medical facilities across India with world-class laboratory equipment and technical supplies. Built for accuracy, designed for reliability.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <Link href="/products">
                <button className="bg-electric-blue hover:bg-blue-600 text-white px-8 py-3.5 rounded text-xs font-bold uppercase tracking-wider transition-colors">
                  Explore Products
                </button>
              </Link>
              <button className="bg-transparent text-gray-300 px-8 py-3.5 rounded text-xs font-bold uppercase tracking-wider transition-colors border border-white/20 hover:border-white/50 hover:text-white">
                 Download Catalogue
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/2 flex justify-end">
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="relative w-full max-w-lg aspect-square"
          >
             {/* Using a placeholder unsplash image of lab glassware with blue tint to match the design vibe */}
             <div className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
               <div className="absolute inset-0 bg-electric-blue/20 mix-blend-overlay z-10"></div>
               <img 
                 src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80" 
                 alt="Laboratory Glassware" 
                 className="w-full h-full object-cover"
               />
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
