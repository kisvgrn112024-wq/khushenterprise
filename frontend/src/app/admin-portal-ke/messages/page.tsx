"use client";

import { MessageSquare, Reply } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-theme">Customer Messages</h1>
          <p className="text-slate-400 text-sm">Manage website inquiries and RFQs.</p>
        </div>
      </div>

      <div className="glass border border-theme/10 rounded-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
          <div className="border-r border-theme/10 bg-theme/20">
             <div className="p-4 border-b border-theme/10 bg-theme/5 border-l-4 border-l-electric-blue cursor-pointer">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-theme text-sm">Apex Labs</span>
                  <span className="text-[10px] text-slate-400">10 mins ago</span>
                </div>
                <p className="text-xs text-slate-400 truncate">Looking for bulk pricing on Microscopes...</p>
             </div>
             <div className="p-4 border-b border-theme/10 cursor-pointer hover:bg-theme/5">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-theme text-sm">City High School</span>
                  <span className="text-[10px] text-slate-400">1 day ago</span>
                </div>
                <p className="text-xs text-slate-400 truncate">We need a quote for our chemistry lab setup.</p>
             </div>
          </div>
          <div className="col-span-2 p-6 flex flex-col">
             <div className="flex justify-between items-start mb-6 pb-6 border-b border-theme/10">
               <div>
                 <h2 className="text-lg font-bold text-theme">RFQ: Bulk Pricing Microscopes</h2>
                 <p className="text-sm text-slate-400">From: apex.labs@example.com | Phone: +91 9876543210</p>
               </div>
               <button className="bg-electric-blue hover:bg-blue-600 text-theme px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm">
                 <Reply size={16} /> Reply via Email
               </button>
             </div>
             <div className="flex-1 text-sm text-slate-300">
               <p>Hello Khush Enterprises team,</p>
               <br/>
               <p>We are setting up a new diagnostic center and are interested in bulk ordering 20 units of your Advanced Binocular Microscopes (SKU: KE-M1-100).</p>
               <p>Please provide an official quotation including GST and delivery timelines.</p>
               <br/>
               <p>Regards,<br/>Dr. Arvind<br/>Apex Labs</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
