"use client";

import { Save, Store, Globe2, Link as LinkIcon, CloudUpload, Play, Edit2, Download, AlertTriangle, CheckCircle2, Settings as SettingsIcon, Info, ShieldCheck } from "lucide-react";
import { useDownload } from "@/components/admin/DownloadToast";

export default function SystemSettings() {
  const { startDownload } = useDownload();

  const handleManualBackup = () => {
    startDownload("KE_System_Backup_Manual.zip", "2.4 GB", "System Archive");
  };

  const handleSave = () => {
    alert("System Settings have been saved successfully.");
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">System Settings</h1>
          <p className="text-gray-400 text-sm">Manage store configuration, regional preferences, API integrations, and ensure data safety with robust backup controls.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#111111] border border-white/5 hover:bg-white/5 text-gray-300 text-sm px-6 py-2.5 rounded transition-colors font-bold">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-[#8bceff] hover:bg-[#6ab3f0] text-black font-bold px-6 py-2.5 rounded text-sm flex items-center gap-2 transition-colors">
            <Save size={16} strokeWidth={2.5} /> Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Store Profile */}
        <div className="lg:col-span-2 bg-[#161616] border border-white/5 rounded-xl p-8">
          <h2 className="text-lg font-bold text-[#8bceff] mb-6 flex items-center gap-2">
            <Store size={18} /> Store Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Store Name</label>
              <input type="text" defaultValue="Khush Enterprises" className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-white text-sm outline-none focus:border-[#8bceff] transition-colors" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Support Email</label>
              <input type="text" defaultValue="support@khushenterprises.com" className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-white text-sm outline-none focus:border-[#8bceff] transition-colors" />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Primary Address</label>
            <input type="text" defaultValue="123 Science Park, Tech Boulevard, Sector 4" className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-white text-sm outline-none focus:border-[#8bceff] transition-colors" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Contact Phone</label>
              <input type="text" defaultValue="+1 (555) 019-2837" className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-white text-sm outline-none focus:border-[#8bceff] transition-colors" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Tax / VAT ID</label>
              <input type="text" defaultValue="KE-VAT-883921" className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-white text-sm outline-none focus:border-[#8bceff] transition-colors" />
            </div>
          </div>
        </div>

        {/* Regional */}
        <div className="bg-[#161616] border border-white/5 rounded-xl p-8">
          <h2 className="text-lg font-bold text-[#8bceff] mb-6 flex items-center gap-2">
            <Globe2 size={18} /> Regional
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Default Currency</label>
              <select className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-white text-sm outline-none focus:border-[#8bceff] transition-colors appearance-none">
                <option>INR (₹) - Indian Rupee</option>
                <option>USD ($) - US Dollar</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">System Timezone</label>
              <select className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-white text-sm outline-none focus:border-[#8bceff] transition-colors appearance-none">
                <option>IST (Indian Standard Time)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Weight Unit</label>
              <div className="flex bg-[#111111] border border-white/5 rounded p-1 w-full text-center">
                <button className="flex-1 py-1.5 rounded bg-white/10 text-white text-sm font-bold">kg</button>
                <button className="flex-1 py-1.5 rounded text-gray-500 hover:text-gray-300 text-sm font-bold">lbs</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Integrations */}
      <div className="bg-[#161616] border border-white/5 rounded-xl p-8 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-[#8bceff] flex items-center gap-2">
            <LinkIcon size={18} /> API Integrations
          </h2>
          <button className="text-sm text-[#8bceff] hover:text-white font-bold transition-colors">+ Add Webhook</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Integration 1 */}
          <div className="bg-[#111111] border border-white/5 rounded-lg p-5">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#0c1825] border border-[#8bceff]/20 flex items-center justify-center text-[#8bceff]">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.282.793 15.614 0 12.279 0 6.949 0 3.18 2.619 3.18 7.043c0 4.14 3.282 5.359 8.623 6.851 2.877 1.041 3.595 1.739 3.595 2.774 0 .962-.841 1.621-2.455 1.621-2.91 0-5.639-1.222-7.16-2.051l-.97 5.653C6.761 22.829 9.69 24 13.197 24c5.472 0 9.062-2.682 9.062-7.058 0-4.004-3.136-5.01-8.283-6.792z"/></svg>
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Stripe Gateway</div>
                  <div className="text-gray-500 text-xs">Payment Processing</div>
                </div>
              </div>
              <div className="w-10 h-5 bg-[#0c1825] rounded-full border border-[#8bceff]/30 relative cursor-pointer">
                <div className="w-4 h-4 bg-[#8bceff] rounded-full absolute right-0.5 top-0.5 flex items-center justify-center">
                   <CheckCircle2 size={10} className="text-[#0c1825]" />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center text-gray-400 text-sm border-t border-white/5 pt-4">
               <span className="font-mono text-xs">sk_live_...93kd</span>
               <button className="hover:text-white transition-colors"><Edit2 size={14} /></button>
            </div>
          </div>

          {/* Integration 2 */}
          <div className="bg-[#111111] border border-white/5 rounded-lg p-5">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <div className="text-white font-bold text-sm">ShipStation</div>
                  <div className="text-gray-500 text-xs">Logistics & Fulfillment</div>
                </div>
              </div>
              <div className="w-10 h-5 bg-white/5 rounded-full border border-white/10 relative cursor-pointer">
                <div className="w-4 h-4 bg-gray-500 rounded-full absolute left-0.5 top-0.5"></div>
              </div>
            </div>
            <div className="flex justify-between items-center text-gray-500 text-sm border-t border-white/5 pt-4">
               <span className="text-xs italic">Not Configured</span>
               <button className="hover:text-white transition-colors"><SettingsIcon size={14} /></button>
            </div>
          </div>

          {/* Integration 3 */}
          <div className="bg-[#111111] border border-white/5 rounded-lg p-5">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center text-brand-yellow">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 4H2C.9 4 0 4.9 0 6v12c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-10 6L2 8V6l10 6 10-6v2z"/></svg>
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Mailchimp</div>
                  <div className="text-gray-500 text-xs">Marketing Automation</div>
                </div>
              </div>
              <div className="w-10 h-5 bg-[#0c1825] rounded-full border border-[#8bceff]/30 relative cursor-pointer">
                <div className="w-4 h-4 bg-[#8bceff] rounded-full absolute right-0.5 top-0.5 flex items-center justify-center">
                   <CheckCircle2 size={10} className="text-[#0c1825]" />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center text-gray-400 text-sm border-t border-white/5 pt-4">
               <span className="text-xs flex items-center gap-1.5 text-brand-yellow"><CheckCircle2 size={14}/> Connected</span>
               <button className="hover:text-white transition-colors"><Edit2 size={14} /></button>
            </div>
          </div>

        </div>
      </div>

      {/* Certifications & About Us (Content Management) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Certifications Management */}
        <div className="bg-[#161616] border border-white/5 rounded-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[#8bceff] flex items-center gap-2">
              <ShieldCheck size={18} /> Manage Certifications
            </h2>
            <button className="text-[10px] bg-[#111111] hover:bg-white/5 border border-white/10 px-3 py-1.5 rounded text-white font-bold transition-colors">+ Add Certificate</button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-[#111111] border border-white/5 rounded-lg p-4 flex justify-between items-center">
               <div>
                 <h3 className="text-sm font-bold text-white mb-1">ISO 9001:2015</h3>
                 <p className="text-xs text-gray-500">Quality Management Systems</p>
               </div>
               <button onClick={() => startDownload("ISO_9001_2015_Certificate.pdf", "1.2 MB", "PDF Document")} className="text-[#8bceff] hover:text-white transition-colors p-2 bg-[#0c1825] rounded border border-[#8bceff]/20">
                 <Download size={14} />
               </button>
            </div>
            <div className="bg-[#111111] border border-white/5 rounded-lg p-4 flex justify-between items-center">
               <div>
                 <h3 className="text-sm font-bold text-white mb-1">CE Marking</h3>
                 <p className="text-xs text-gray-500">European Conformity standard</p>
               </div>
               <button onClick={() => startDownload("CE_Marking_Certificate.pdf", "800 KB", "PDF Document")} className="text-[#8bceff] hover:text-white transition-colors p-2 bg-[#0c1825] rounded border border-[#8bceff]/20">
                 <Download size={14} />
               </button>
            </div>
          </div>
        </div>

        {/* About Us Management */}
        <div className="bg-[#161616] border border-white/5 rounded-xl p-8">
          <h2 className="text-lg font-bold text-[#8bceff] mb-6 flex items-center gap-2">
            <Info size={18} /> About Us Page Content
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Our Mission</label>
              <textarea defaultValue="To provide highest quality precision laboratory tools..." className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-white text-sm outline-none focus:border-[#8bceff] transition-colors resize-none h-20" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Our Journey / History</label>
              <textarea defaultValue="Founded in 2005, Khush Enterprises has grown to be a trusted supplier..." className="w-full bg-[#111111] border border-white/5 rounded px-4 py-3 text-white text-sm outline-none focus:border-[#8bceff] transition-colors resize-none h-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Management & Backup */}
      <div className="bg-[#161616] border border-white/5 rounded-xl p-8 relative overflow-hidden">
        {/* Graph background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
        
        <div className="relative z-10 flex justify-between items-center mb-8">
          <h2 className="text-lg font-bold text-[#8bceff] flex items-center gap-2">
            <CloudUpload size={18} /> Data Management & Backup
          </h2>
          <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest bg-[#1f1a11] border border-brand-yellow/20 px-3 py-1.5 rounded-full text-brand-yellow">
            <CheckCircle2 size={12} /> System Healthy
          </span>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="bg-[#111111] border border-white/5 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Automated Backup Schedule</h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">Daily snapshot of database, user files, and product catalog.</p>
              
              <div className="bg-[#161616] border border-white/5 rounded p-3 mb-6 flex justify-between items-center">
                <span className="text-sm text-gray-300">Daily at 02:00 AM (IST)</span>
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Next run: Today, 02:00 AM</span>
                <button className="text-[#8bceff] hover:text-white font-bold transition-colors">Edit</button>
              </div>
            </div>
            
            <button onClick={handleManualBackup} className="w-full mt-6 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm px-4 py-3 rounded transition-colors font-bold">
              <Play size={14} /> Trigger Manual Backup Now
            </button>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-gray-400 mb-4">Recent Backup History</h3>
            <div className="bg-[#111111] border border-white/5 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#161616] text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-white/5">
                  <tr>
                    <th className="px-5 py-3">Date & Time</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3 text-right">Size</th>
                    <th className="px-5 py-3 text-center">Status</th>
                    <th className="px-5 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-gray-300 text-xs">Oct 24, 2023 - 02:00 AM</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">Automated</td>
                    <td className="px-5 py-3 text-gray-300 text-xs text-right">2.4 GB</td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-flex items-center gap-1.5 text-[10px] text-gray-400"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Success</span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button onClick={() => startDownload("KE_System_Backup_Auto.zip", "2.4 GB", "System Archive")} className="text-gray-500 hover:text-white transition-colors"><Download size={14} className="mx-auto" /></button>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-gray-300 text-xs">Oct 23, 2023 - 02:00 AM</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">Automated</td>
                    <td className="px-5 py-3 text-gray-300 text-xs text-right">2.4 GB</td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-flex items-center gap-1.5 text-[10px] text-gray-400"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Success</span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button onClick={() => startDownload("KE_System_Backup_Auto.zip", "2.4 GB", "System Archive")} className="text-gray-500 hover:text-white transition-colors"><Download size={14} className="mx-auto" /></button>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-gray-300 text-xs">Oct 22, 2023 - 14:30 PM</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">Manual</td>
                    <td className="px-5 py-3 text-gray-300 text-xs text-right">2.3 GB</td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-brand-yellow bg-brand-yellow/10 px-2 py-0.5 rounded"><div className="w-1.5 h-1.5 rounded-full bg-brand-yellow"></div> Warning</span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button onClick={() => startDownload("KE_System_Backup_Manual.zip", "2.3 GB", "System Archive")} className="text-gray-500 hover:text-white transition-colors"><Download size={14} className="mx-auto" /></button>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-gray-300 text-xs">Oct 21, 2023 - 02:00 AM</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">Automated</td>
                    <td className="px-5 py-3 text-gray-500 text-xs text-right">--</td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#ff4d4d] bg-[#ff4d4d]/10 px-2 py-0.5 rounded"><div className="w-1.5 h-1.5 rounded-full bg-[#ff4d4d]"></div> Failed</span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button className="text-gray-500 hover:text-white transition-colors"><Info size={14} className="mx-auto" /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="p-3 border-t border-white/5 text-center">
                <button className="text-xs font-bold text-[#8bceff] hover:text-white transition-colors">View Full Log</button>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
