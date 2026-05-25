"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Eye, Compass, Heart, Users, Target, Calendar, ArrowRight, Quote } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-theme text-theme pb-24 selection:bg-brand-yellow/30">
      
      {/* Background Grids and Decorative Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-brand-yellow/5 to-transparent"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-brand-yellow/[0.015] blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-electric-blue/[0.02] blur-[120px] rounded-full"></div>
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-10">
        
        {/* Breadcrumb */}
        <div className="mb-8 text-left">
          <div className="flex items-center gap-2 text-[10px] font-mono text-theme uppercase tracking-widest">
            <Link href="/" className="hover:text-brand-yellow transition-colors">Home</Link>
            <span>/</span>
            <span className="text-brand-yellow">About Us</span>
          </div>
        </div>

        {/* ── HERO GRID ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 border border-brand-yellow/30 bg-brand-yellow/5 text-brand-yellow text-[9px] font-black tracking-widest px-3 py-1 rounded uppercase">
              ✦ EST. 1998
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-theme leading-[1.08] tracking-tight">
              Precision Built, <br />
              <span className="text-brand-yellow font-black">Globally Trusted.</span>
            </h1>
            
            <p className="text-theme text-sm md:text-base font-light leading-relaxed max-w-xl">
              For over two decades, Khush Enterprises has been the bedrock of dynamic logistics supply and precision engineering logistics. We deliver mission-critical components with absolute accuracy.
            </p>

            <div className="flex pt-2">
              <Link href="/bulk-orders">
                <button className="flex items-center gap-2 bg-brand-yellow hover:bg-theme text-theme px-6 py-3 rounded text-xs font-black uppercase tracking-wider transition-all transform active:scale-95 cursor-pointer">
                  Visit B2B Procurement <ArrowRight size={14} />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Image/Badge Grid */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-xl overflow-hidden border border-theme/10 bg-theme p-2 shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" 
                alt="High Precision Production Facility" 
                className="w-full h-full object-cover rounded-lg opacity-80 transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Overlapping Badges */}
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-brand-yellow text-theme text-[8px] font-black px-2.5 py-1 uppercase rounded tracking-wider shadow-lg">
                  CERTIFIED FACILITY
                </span>
              </div>

              <div className="absolute bottom-4 right-4 z-20 text-right font-mono text-[9px] text-theme bg-theme/75 px-3 py-1.5 rounded border border-theme/5 space-y-0.5">
                <div>FACILITY ID: KE-LS-10K</div>
                <div className="text-brand-yellow font-bold">10,000+ SQM WAREHOUSE</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MISSION & VISION CARDS ── */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-20">
          
          {/* Mission Card */}
          <div className="md:col-span-8 bg-theme border border-theme/5 rounded-xl p-8 hover:border-brand-yellow/30 transition-all duration-300 flex flex-col justify-between text-left shadow-2xl relative overflow-hidden group">
            <div className="absolute top-[-10px] right-[-10px] text-theme/[0.01] group-hover:text-brand-yellow/[0.02] transition-colors pointer-events-none">
              <Target size={180} />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Compass className="text-brand-yellow shrink-0 animate-spin" style={{ animationDuration: '8s' }} size={20} />
                <h3 className="text-sm font-black text-theme uppercase tracking-wider">Our Mission</h3>
              </div>
              
              <p className="text-theme text-xs md:text-sm leading-relaxed max-w-2xl font-light">
                To construct dynamic supply-chains for precision work and industrial community. Leveraging cutting-edge logistical models that guarantee high-accuracy precision innovations, offering seamless Pan-India and global B2B fulfillment.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-theme/5 flex gap-8 font-mono text-[10px] uppercase font-bold text-theme">
              <div>
                <span className="text-brand-yellow block text-sm font-black">2.5B+</span>
                <span>GL-REACH</span>
              </div>
              <div>
                <span className="text-theme block text-sm font-black">340+</span>
                <span>PROG. DELIVERIES</span>
              </div>
            </div>
          </div>

          {/* Vision Card */}
          <div className="md:col-span-4 bg-theme border border-theme/5 rounded-xl p-8 hover:border-brand-yellow/30 transition-all duration-300 flex flex-col justify-between text-left shadow-2xl relative overflow-hidden group">
            <div className="absolute top-[-15px] right-[-15px] text-theme/[0.01] group-hover:text-brand-yellow/[0.02] transition-colors pointer-events-none">
              <Eye size={140} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-brand-yellow shrink-0" size={20} />
                <h3 className="text-sm font-black text-theme uppercase tracking-wider">Our Vision</h3>
              </div>
              
              <p className="text-theme text-xs leading-relaxed font-light">
                Becoming the undisputed record holder in international supply-networks, setting estimation industry benchmarks for standardized fulfillment, quality telemetry, and security protocols.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-theme/5 font-mono text-[10px] uppercase font-bold text-theme">
              <span className="text-red-500 block text-sm font-black">+8,320</span>
              <span>PROJECTS UNDERWAY</span>
            </div>
          </div>

        </section>

        {/* ── COMMAND & CONTROL (LEADERSHIP) ── */}
        <section className="py-12 border-t border-theme/5">
          <div className="mb-10 text-left">
            <span className="text-[10px] text-brand-yellow font-bold tracking-widest uppercase">Executive Desk</span>
            <h2 className="text-2xl md:text-3xl font-black text-theme mt-1 tracking-tight">Command & Control</h2>
            <p className="text-theme text-xs mt-1">Driving accuracy across global supply vectors.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Mr. Kish Kumer Chairman Card */}
            <div className="lg:col-span-7 bg-theme border border-theme/5 rounded-xl p-6 lg:p-8 flex flex-col md:flex-row gap-6 shadow-2xl items-center md:items-start text-left">
              {/* Chairman Photo */}
              <div className="w-32 h-36 rounded-lg overflow-hidden shrink-0 bg-theme border border-theme/10 p-1">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300" 
                  alt="Mr. Kish Kumer, Chairman" 
                  className="w-full h-full object-cover rounded grayscale"
                />
              </div>

              {/* Bio details */}
              <div className="space-y-3 flex-1">
                <div>
                  <span className="text-brand-yellow font-mono text-[8px] uppercase tracking-widest font-black block">FOUNDER & CHAIRMAN</span>
                  <h3 className="text-lg font-black text-theme uppercase mt-0.5">Mr. Kish Kumer</h3>
                </div>
                
                <p className="text-theme text-xs font-light leading-relaxed">
                  With 24+ years of industrial experience, Mr. Kish Kumer established Khush Enterprises from a regional supplier into a formidable global logistics and laboratory representation force. His commitment to precision shapes all strategic vectors of the company.
                </p>
                
                <div className="pt-2 border-t border-theme/5 flex items-center gap-2.5 text-theme font-mono text-[10px] uppercase font-bold">
                  <Calendar size={13} className="text-brand-yellow" /> Joined: October 1998
                </div>
              </div>
            </div>

            {/* Other Executives List Column */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              
              {/* Executive 2: Dr. Sarah Jenkins */}
              <div className="bg-theme border border-theme/5 hover:border-brand-yellow/20 rounded-xl p-4 flex items-center justify-between shadow-xl text-left transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-theme border border-theme/10 shrink-0 p-0.5">
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" 
                      alt="Dr. Sarah Jenkins" 
                      className="w-full h-full object-cover rounded-full grayscale"
                    />
                  </div>
                  <div>
                    <span className="text-brand-yellow font-mono text-[7px] uppercase tracking-widest font-bold block">HEAD OF QUALITY ASSURANCE</span>
                    <h4 className="text-theme text-xs font-black uppercase mt-0.5">Dr. Sarah Jenkins</h4>
                    <p className="text-[10px] text-theme leading-normal font-light">Enforcing ISO standards compliance checks.</p>
                  </div>
                </div>
                
                <span className="font-mono text-theme font-bold text-[9px] border border-theme/5 px-2 py-1 bg-theme/40 rounded shrink-0">
                  + ID-805-X2
                </span>
              </div>

              {/* Executive 3: Marcos Vance */}
              <div className="bg-theme border border-theme/5 hover:border-brand-yellow/20 rounded-xl p-4 flex items-center justify-between shadow-xl text-left transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-theme border border-theme/10 shrink-0 p-0.5">
                    <img 
                      src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200" 
                      alt="Marcos Vance" 
                      className="w-full h-full object-cover rounded-full grayscale"
                    />
                  </div>
                  <div>
                    <span className="text-brand-yellow font-mono text-[7px] uppercase tracking-widest font-bold block">GLOBAL LOGISTICS MANAGER</span>
                    <h4 className="text-theme text-xs font-black uppercase mt-0.5">Marcos Vance</h4>
                    <p className="text-[10px] text-theme leading-normal font-light">Directing dual-use freight vectors.</p>
                  </div>
                </div>
                
                <span className="font-mono text-theme font-bold text-[9px] border border-theme/5 px-2 py-1 bg-theme/40 rounded shrink-0">
                  + ID-490-S1
                </span>
              </div>

              {/* Direct Support desk link */}
              <div className="bg-gradient-to-r from-brand-yellow/10 to-transparent border border-brand-yellow/10 rounded-xl p-4 flex justify-between items-center text-xs">
                <div>
                  <span className="text-theme font-bold block">Need Direct Partnering Desk?</span>
                  <span className="text-[10px] text-theme">Connecting institutional channels with our Chairman.</span>
                </div>
                <Link href="/contact-us">
                  <button className="bg-brand-yellow hover:bg-theme text-theme font-black uppercase text-[9px] px-3.5 py-1.5 rounded transition-all shrink-0 cursor-pointer">
                    Contact Desk
                  </button>
                </Link>
              </div>

            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
