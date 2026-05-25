"use client";

import { FileText, Download } from "lucide-react";

export default function LogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-theme">AI Manual Logs</h1>
          <p className="text-slate-400 text-sm">Track generated manuals and downloads.</p>
        </div>
        <button className="bg-theme/5 border border-theme/10 hover:bg-theme/10 text-theme px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Download size={18} /> Export Logs
        </button>
      </div>

      <div className="glass border border-theme/10 rounded-xl overflow-hidden p-6 text-center text-slate-400">
        <FileText size={48} className="mx-auto mb-4 opacity-50" />
        <p>No recent manual generation logs.</p>
      </div>
    </div>
  );
}
