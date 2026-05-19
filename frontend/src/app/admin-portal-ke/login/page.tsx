"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      sessionStorage.setItem("ke_admin_auth", "true");
      router.push("/admin-portal-ke/products");
    } else {
      setError(true);
    }
  };

  return (
    <div className="h-screen bg-[#03060a] flex items-center justify-center relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric-blue/10 blur-[120px] rounded-full"></div>

      <div className="glass-dark border border-white/10 p-10 rounded-2xl w-full max-w-md relative z-10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4 text-electric-blue">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-slate-400 text-sm text-center">Restricted Access. Please enter the master password.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                className={`w-full bg-black/40 border ${error ? "border-red-500" : "border-white/10"} rounded-lg py-3 pl-10 pr-4 text-white outline-none focus:border-electric-blue transition-colors`}
              />
            </div>
            {error && <p className="text-red-500 text-xs">Incorrect password.</p>}
          </div>
          <button type="submit" className="w-full bg-electric-blue hover:bg-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
            Access Dashboard
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-600">
          Powered by Khush Enterprises Secure Core
        </div>
      </div>
    </div>
  );
}
