"use client";

import { FileText, Download } from "lucide-react";

export default function LogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Manual Logs</h1>
          <p className="text-slate-400 text-sm">Track generated manuals and downloads.</p>
        </div>
        <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Download size={18} /> Export Logs
        </button>
      </div>

      <div className="glass border border-white/10 rounded-xl overflow-hidden p-6 text-center text-slate-400">
        <FileText size={48} className="mx-auto mb-4 opacity-50" />
        <p>No recent manual generation logs.</p>
      </div>
    </div>
  );
}
