"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";
import Head from "next/head";

export default function SecureAdminPortalLogin() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulated short delay for realistic secure feel
    setTimeout(() => {
      // Accept both password only or email + password
      const isPasswordOnlyValid = password === "admin123";
      const isEmailPasswordValid = email === "admin@khushenterprises.com" && password === "admin123";

      if (isPasswordOnlyValid || isEmailPasswordValid) {
        sessionStorage.setItem("ke_admin_auth", "true");
        router.push("/admin-portal-ke/products");
      } else {
        setError("Access Denied: Invalid credentials.");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      {/* Explicit meta tag in viewport for browser indexing prevention */}
      <meta name="robots" content="noindex, nofollow" />

      <div className="h-screen bg-[#03060a] flex items-center justify-center relative overflow-hidden font-sans">
        {/* Sleek Dark Mode Background Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full -z-10"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#8bceff]/5 blur-[150px] rounded-full -z-10"></div>

        <div className="w-full max-w-md p-8 bg-[#090f1a]/80 border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-md relative z-10 mx-4">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-4 text-[#8bceff] shadow-[0_0_20px_rgba(139,206,255,0.15)]">
              <ShieldCheck size={36} className="animate-pulse" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white mb-1.5 uppercase">System Access</h1>
            <p className="text-slate-400 text-xs text-center font-medium">
              Enter your administrative credentials to establish a secure session.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-950/40 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-xs font-semibold mb-6 animate-shake">
              <AlertTriangle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@khushenterprises.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-white text-xs outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Master Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-4 pr-10 text-white text-xs outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-blue-800 disabled:to-cyan-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_4px_12px_rgba(59,130,246,0.2)] text-xs uppercase tracking-wider cursor-pointer"
            >
              {loading ? "Authenticating..." : "Authorize Access"}
            </button>
          </form>

          <div className="mt-8 text-center text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
            SECURE ACCESS GATEWAY
          </div>
        </div>
      </div>
    </>
  );
}
