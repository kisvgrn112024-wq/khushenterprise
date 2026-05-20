"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, User, Globe, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

interface B2BAccount {
  name: string;
  email: string;
  avatar: string;
  org: string;
}

const MOCK_B2B_GMAILS: B2BAccount[] = [
  { name: "Dr. Alok Kapoor", email: "alok.kapoor@kailashdiagnostics.com", avatar: "AK", org: "Kailash Diagnostics Pvt. Ltd." },
  { name: "Priya Sharma (Procurement)", email: "p.sharma@maxhealthcare.in", avatar: "PS", org: "Max Healthcare Procurement" },
  { name: "Prof. Rajesh Sinha", email: "r.sinha@aiims.edu.in", avatar: "RS", org: "AIIMS Research Laboratory" }
];

export default function LoginRegisterPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Google Sign-In Mocking Modal States
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [authStep, setAuthStep] = useState<"choose" | "verifying" | "done">("choose");
  const [selectedAccount, setSelectedAccount] = useState<B2BAccount | null>(null);
  const [authProgress, setAuthProgress] = useState("");

  const validateForm = () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email is required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email format.");
      return false;
    }

    if (!password) {
      setError("Password is required.");
      return false;
    }

    if (!isLogin) {
      if (!name) {
        setError("Name is required for registration.");
        return false;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return false;
      }

      if (password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;


    setSuccess(isLogin ? "Logging in..." : "Creating account...");
    
    setTimeout(() => {
      // Direct session mock
      localStorage.setItem("ke_user", JSON.stringify({
        name: name || "B2B Representative",
        email: email,
        org: "Independent Laboratory"
      }));
      router.push("/my-orders");
    }, 1200);
  };

  // Google One-Tap/Gmail Mock sequence
  const startGoogleAuth = () => {
    setAuthStep("choose");
    setSelectedAccount(null);
    setIsGoogleModalOpen(true);
  };

  const handleSelectGoogleAccount = (acc: B2BAccount) => {
    setSelectedAccount(acc);
    setAuthStep("verifying");
    
    setAuthProgress("Connecting Google identity service...");
    setTimeout(() => {
      setAuthProgress("Validating B2B credit & contract lines...");
      setTimeout(() => {
        setAuthProgress("Gmail passwordless security handshake complete!");
        setTimeout(() => {
          setAuthStep("done");
          // Save session
          localStorage.setItem("ke_user", JSON.stringify({
            name: acc.name,
            email: acc.email,
            org: acc.org,
            googleAuth: true
          }));
          setTimeout(() => {
            setIsGoogleModalOpen(false);
            router.push("/my-orders");
          }, 1200);
        }, 1000);
      }, 1200);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Dynamic glow backgrounds */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#8bceff]/5 blur-[120px] rounded-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full -z-10"></div>

      {/* Google Sign-in Verification Modal */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 w-[450px] shadow-2xl relative">
            <button 
              onClick={() => { if (authStep !== "verifying") setIsGoogleModalOpen(false); }} 
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
              disabled={authStep === "verifying"}
            >
              <XIcon size={20} />
            </button>

            {authStep === "choose" && (
              <div>
                <div className="flex items-center gap-2.5 mb-6 justify-center">
                  <Globe className="text-[#8bceff]" size={24} />
                  <span className="text-white font-bold text-lg">Sign in with Google</span>
                </div>
                <p className="text-xs text-gray-400 text-center mb-6 leading-relaxed">
                  Choose a verified lab Gmail account to connect instantly to the Khush Enterprises wholesale contract dashboard.
                </p>

                <div className="space-y-3">
                  {MOCK_B2B_GMAILS.map((acc, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleSelectGoogleAccount(acc)}
                      className="w-full bg-[#111111] hover:bg-white/5 border border-white/5 hover:border-white/10 p-3 rounded-lg flex items-center gap-3 transition-all text-left cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#8bceff]/10 text-[#8bceff] flex items-center justify-center font-bold text-sm">
                        {acc.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-bold text-sm truncate group-hover:text-[#8bceff] transition-colors">{acc.name}</div>
                        <div className="text-xs text-gray-400 truncate">{acc.email}</div>
                        <div className="text-[10px] text-gray-500 font-mono mt-0.5 truncate">{acc.org}</div>
                      </div>
                      <ArrowRight size={14} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {authStep === "verifying" && (
              <div className="text-center py-10">
                <Loader2 className="animate-spin text-[#8bceff] mx-auto mb-6" size={48} />
                <h3 className="text-white font-bold text-base mb-2">Passwordless Verification</h3>
                <p className="text-xs text-gray-400 font-mono tracking-wide">{authProgress}</p>
              </div>
            )}

            {authStep === "done" && (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-green-400 font-bold text-lg mb-1">Authenticated!</h3>
                <p className="text-xs text-gray-400 font-medium">Redirecting to order dashboard...</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-md w-full bg-[#161616] border border-white/5 rounded-2xl shadow-2xl overflow-hidden p-8">
        <div className="text-center mb-8">
          <ShieldCheck className="mx-auto h-12 w-12 text-[#8bceff] mb-3" />
          <h2 className="text-2xl font-black text-white">
            {isLogin ? "Sign In to B2B Portal" : "Join B2B Network"}
          </h2>
          <p className="mt-2 text-xs text-gray-400">
            {isLogin ? "Welcome back to Khush Enterprises Procurement Portal" : "Create contract account with Khush Enterprises"}
          </p>
        </div>

        {error && (
          <div className="bg-[#1f0f0f] text-red-500 p-3 rounded-lg text-xs font-bold border border-red-500/10 mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-[#0f1f14] text-green-400 p-3 rounded-lg text-xs font-bold border border-green-500/10 mb-6">
            {success}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 bg-[#111111] border border-white/5 rounded text-white text-xs outline-none focus:border-[#8bceff] transition-colors"
                  placeholder="Dr. John Doe"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 bg-[#111111] border border-white/5 rounded text-white text-xs outline-none focus:border-[#8bceff] transition-colors"
                placeholder="procurement@kailashdiagnostics.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 bg-[#111111] border border-white/5 rounded text-white text-xs outline-none focus:border-[#8bceff] transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 bg-[#111111] border border-white/5 rounded text-white text-xs outline-none focus:border-[#8bceff] transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded bg-slate-100 hover:bg-slate-200 text-xs font-bold text-black transition-colors cursor-pointer"
          >
            {isLogin ? "Sign In with Credentials" : "Create Enterprise Account"}
          </button>
        </form>

        {/* Google One-Tap Mock Button */}
        {isLogin && (
          <div className="mt-4">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-[#161616] px-2 text-gray-500">Or Bypassed Access</span></div>
            </div>
            
            <button
              onClick={startGoogleAuth}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-white/10 rounded bg-[#111111] hover:bg-white/5 text-xs font-bold text-[#8bceff] transition-colors cursor-pointer"
            >
              <Globe size={14} /> Continue with Google One-Tap
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setSuccess("");
            }}
            className="text-xs font-bold text-[#8bceff] hover:underline transition-all"
          >
            {isLogin 
              ? "Don't have an enterprise account? Register here" 
              : "Already registered? Sign in"}
          </button>
        </div>

      </div>
    </div>
  );
}

function XIcon({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  );
}
