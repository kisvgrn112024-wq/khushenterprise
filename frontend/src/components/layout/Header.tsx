"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search, Heart, ShoppingCart, User, Mic, Camera, Loader2, BotMessageSquare, Menu, X, ChevronDown } from "lucide-react";
import { getProducts } from "@/lib/products";
import { useStore } from "@/context/StoreContext";
import { useViewMode } from "@/context/ViewModeContext";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, wishlist, setIsCartOpen } = useStore();
  const { viewMode } = useViewMode();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userSession, setUserSession] = useState<any>(null);
  const [isBulkDropdownOpen, setIsBulkDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileBulkOpen, setIsMobileBulkOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Read user login status
    const saved = localStorage.getItem("ke_user");
    if (saved) {
      setUserSession(JSON.parse(saved));
    }
  }, [pathname]);

  const searchResults = searchQuery.length > 1 
    ? getProducts().filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  // Speech Recognition voice search handler
  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported by your current browser. Try Chrome or Edge!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-IN";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setSearchQuery("");
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      executeSmartRoute(transcript);
    };

    recognition.start();
  };

  // Keyword query router
  const executeSmartRoute = (query: string) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return;

    // Checks for keyword matching
    if (normalized.includes("review") || normalized.includes("rating") || normalized.includes("stars") || normalized.includes("feedback")) {
      router.push("/reviews");
    } else if (normalized.includes("order") || normalized.includes("consignment") || normalized.includes("track") || normalized.includes("timeline") || normalized.includes("ship")) {
      router.push("/my-orders");
    } else if (normalized.includes("catalog") || normalized.includes("pdf") || normalized.includes("brochure") || normalized.includes("download")) {
      router.push("/catalogue");
    } else if (normalized.includes("contact") || normalized.includes("phone") || normalized.includes("address") || normalized.includes("email")) {
      router.push("/contact-us");
    } else if (normalized.includes("cert") || normalized.includes("iso")) {
      router.push("/certifications");
    } else if (normalized.includes("bulk") || normalized.includes("quote")) {
      router.push("/bulk-orders");
    } else {
      // Default to general products catalog search query parameter
      router.push(`/products?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      setIsMobileSearchOpen(false);
      executeSmartRoute(searchQuery);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsAiAnalyzing(true);
      // Simulate AI Vision recognition pipeline
      setTimeout(() => {
        setIsAiAnalyzing(false);
        setSearchQuery("Microscope");
        router.push("/products?q=Microscope&visual_search=true");
      }, 2000);
    }
  };

  if (pathname?.startsWith("/admin-portal-ke")) {
    return null;
  }

  return (
    <header className="w-full bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8 py-4">
        {/* Top Row: Logo, Search, Icons */}
        <div className="flex items-center justify-between gap-6 mb-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 md:gap-3">
            <img src="/logo.png" alt="KE" className="w-8 h-8 md:w-9 md:h-9 object-contain" />
            <div className="flex items-baseline gap-1 md:gap-1.5">
              <span className="text-lg md:text-2xl font-black text-white tracking-wider">KHUSH</span>
              <span className="text-sm md:text-xl font-bold text-white tracking-widest mt-1">ENTERPRISES</span>
            </div>
          </Link>

          {/* Smart Search Bar (Desktop) */}
          <div className={`relative w-full max-w-2xl ${viewMode === "mobile" ? "hidden" : "hidden md:block"}`}>
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-[#1a1a1a] rounded overflow-hidden h-10 border border-white/10 focus-within:border-white/30 transition-all px-4">
              <input 
                type="text" 
                placeholder={isListening ? "Listening with AI voice desk..." : "Search model, or say 'my orders', 'catalogue'..."} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className={`flex-1 bg-transparent text-sm text-white placeholder-gray-400 outline-none w-full ${isListening ? "text-red-400 font-bold" : ""}`}
                disabled={isListening}
              />
              
              <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                {/* Voice speech recognition button */}
                <button 
                  type="button" 
                  onClick={startSpeechRecognition}
                  className={`transition-colors p-1 rounded hover:bg-white/5 ${isListening ? "text-red-500 animate-pulse" : "text-gray-400 hover:text-white"}`}
                  title="Search by voice"
                >
                  <Mic size={16} />
                </button>

                {/* AI Visual Image Search */}
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/5"
                  title="Visual Camera Search"
                >
                  {isAiAnalyzing ? <Loader2 size={16} className="animate-spin text-[#8bceff]" /> : <Camera size={16} />}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />

                <div className="w-[1px] h-4 bg-white/10"></div>

                <button type="submit" className="text-gray-400 hover:text-white">
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* Live Search Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-[#1a1a1a] border border-white/10 rounded shadow-xl overflow-hidden z-50">
                {searchResults.map(product => (
                  <Link key={product.id} href={`/products?q=${encodeURIComponent(product.title)}`} className="flex items-center gap-3 p-3 hover:bg-[#2a2a2a] border-b border-white/5 last:border-0">
                    <div className="w-8 h-8 bg-[#2a2a2a] rounded flex items-center justify-center">
                      <Search size={14} className="text-gray-400" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium line-clamp-1">{product.title}</div>
                      <div className="text-gray-400 text-xs font-semibold">₹{product.price.toLocaleString("en-IN")}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Icons & Mobile controls */}
          <div className="flex items-center gap-3.5 md:gap-6 text-white ml-2 flex-shrink-0">
            {/* Search Icon (Mobile View Only) */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className={`hover:text-[#8bceff] transition-colors p-1 cursor-pointer ${
                viewMode === "mobile" ? "block" : "md:hidden block"
              }`}
              title="Search"
            >
              <Search size={20} />
            </button>

            {/* Live Chat link shortcut */}
            <Link href="/my-orders" className="hover:text-[#8bceff] transition-colors relative" title="Consignment Assistant Desk">
              <BotMessageSquare size={20} />
            </Link>
            
            <Link href="/wishlist" className="hover:text-gray-300 transition-colors relative">
              <Heart size={20} className={wishlist.length > 0 ? "fill-white text-white" : ""} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-yellow text-black font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{wishlist.length}</span>
              )}
            </Link>
            
            <button onClick={() => setIsCartOpen(true)} className="hover:text-gray-300 transition-colors relative cursor-pointer">
               <ShoppingCart size={20} />
               {cart.length > 0 && (
                 <span className="absolute -top-2 -right-2 bg-brand-yellow text-black font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cart.reduce((a,c) => a + c.quantity, 0)}</span>
               )}
            </button>
            
            <div className="relative group cursor-pointer hover:text-gray-300">
              <div className="flex items-center gap-1">
                <User size={20} />
                {userSession && <span className="text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded border border-green-500/20 font-bold max-w-[80px] truncate">{userSession.name}</span>}
              </div>
              
              {/* Dropdown menu */}
              <div className="absolute top-full mt-2 right-0 w-48 bg-[#1a1a1a] border border-white/10 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
                {!userSession ? (
                  <>
                    <Link href="/account/login" className="block p-2 text-sm text-gray-300 hover:bg-[#2a2a2a] hover:text-white rounded font-medium">Login / Register</Link>
                    <div className="h-[1px] bg-white/5 my-1"></div>
                    <Link href="/secure-portal-access" className="block p-2 text-sm text-gray-400 hover:bg-[#2a2a2a] hover:text-white rounded font-medium">Admin Portal</Link>
                  </>
                ) : (
                  <>
                    <div className="px-2 py-1.5 text-[10px] font-bold text-gray-500 uppercase border-b border-white/5 mb-1">{userSession.org}</div>
                    <Link href="/my-orders" className="block p-2 text-sm text-gray-300 hover:bg-[#2a2a2a] hover:text-white rounded font-medium">Consignment Status</Link>
                    <div className="h-[1px] bg-white/5 my-1"></div>
                    <Link href="/secure-portal-access" className="block p-2 text-sm text-gray-400 hover:bg-[#2a2a2a] hover:text-white rounded font-medium">Admin Portal</Link>
                  </>
                )}
              </div>
            </div>

            {/* Hamburger Button (Mobile View Only) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`hover:text-[#8bceff] transition-colors p-1 cursor-pointer ${
                viewMode === "mobile" ? "block" : "md:hidden block"
              }`}
              title="Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Expandable, Mobile View Only) */}
        {isMobileSearchOpen && (
          <div className={`mb-4 w-full ${viewMode === "mobile" ? "block" : "md:hidden block"}`}>
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-[#1a1a1a] rounded overflow-hidden h-10 border border-white/10 focus-within:border-white/30 transition-all px-4">
              <input 
                type="text" 
                placeholder={isListening ? "Listening with AI voice desk..." : "Search laboratory equipment..."} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className={`flex-1 bg-transparent text-sm text-white placeholder-gray-400 outline-none w-full ${isListening ? "text-red-400 font-bold" : ""}`}
                disabled={isListening}
              />
              
              <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                <button 
                  type="button" 
                  onClick={startSpeechRecognition}
                  className={`transition-colors p-1 rounded hover:bg-white/5 ${isListening ? "text-red-500 animate-pulse" : "text-gray-400 hover:text-white"}`}
                >
                  <Mic size={16} />
                </button>
                <button type="submit" className="text-gray-400 hover:text-white">
                  <Search size={18} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Navigation Links (Desktop, Hidden in Mobile View) */}
        <nav className={`${viewMode === "mobile" ? "hidden" : "hidden md:flex"} items-center justify-center gap-8 text-xs font-semibold text-gray-400 uppercase tracking-wider`}>
          <Link href="/catalogue" className="hover:text-white transition-colors border-b-2 border-transparent hover:border-brand-yellow text-white pb-1">Catalogue</Link>
          
          {/* Bulk Orders Dropdown */}
          <div 
            className="relative group py-1"
            onMouseEnter={() => setIsBulkDropdownOpen(true)}
            onMouseLeave={() => setIsBulkDropdownOpen(false)}
          >
            <Link 
              href="/bulk-orders" 
              className="hover:text-white transition-colors border-b-2 border-transparent hover:border-brand-yellow pb-1 flex items-center gap-1 cursor-pointer uppercase"
            >
              Bulk Orders
              <span className="text-[8px] transition-transform group-hover:rotate-180">▼</span>
            </Link>
            <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 bg-[#161616] border border-white/10 rounded shadow-2xl transition-all duration-200 z-50 p-1.5 flex flex-col gap-0.5 text-left normal-case ${
              isBulkDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
            }`}>
              <Link 
                href="/bulk-orders?sector=b2b" 
                className="block px-3 py-2 text-[11px] text-gray-300 hover:bg-white/5 hover:text-white rounded transition-colors font-medium"
              >
                💼 B2B Business
              </Link>
              <div className="h-[1px] bg-white/5 my-0.5"></div>
              <Link 
                href="/bulk-orders?sector=institutional&sub=schools" 
                className="block px-3 py-2 text-[11px] text-gray-300 hover:bg-white/5 hover:text-white rounded transition-colors font-medium"
              >
                🏫 School Lab Solutions
              </Link>
              <Link 
                href="/bulk-orders?sector=institutional&sub=colleges" 
                className="block px-3 py-2 text-[11px] text-gray-300 hover:bg-white/5 hover:text-white rounded transition-colors font-medium"
              >
                🎓 College Lab Packages
              </Link>
              <Link 
                href="/bulk-orders?sector=institutional&sub=research" 
                className="block px-3 py-2 text-[11px] text-gray-300 hover:bg-white/5 hover:text-white rounded transition-colors font-medium"
              >
                🔬 Advanced Research Labs
              </Link>
              <div className="h-[1px] bg-white/5 my-0.5"></div>
              <Link 
                href="/bulk-orders?sector=commercial" 
                className="block px-3 py-2 text-[11px] text-gray-300 hover:bg-white/5 hover:text-white rounded transition-colors font-medium"
              >
                🏭 Commercial Labs
              </Link>
            </div>
          </div>

          <Link href="/products" className="hover:text-white transition-colors border-b-2 border-transparent hover:border-brand-yellow pb-1">Products</Link>
          <Link href="/reviews" className="hover:text-white transition-colors border-b-2 border-transparent hover:border-brand-yellow pb-1">Reviews</Link>
          <Link href="/certifications" className="hover:text-white transition-colors border-b-2 border-transparent hover:border-brand-yellow pb-1">Certifications</Link>
          <Link href="/contact-us" className="hover:text-white transition-colors border-b-2 border-transparent hover:border-brand-yellow pb-1">Contact Us</Link>
          <Link
            href="/export"
            className={`relative hover:text-brand-yellow transition-colors border-b-2 pb-1 font-black tracking-wider ${
              pathname.startsWith("/export")
                ? "text-brand-yellow border-brand-yellow"
                : "text-brand-yellow/80 border-brand-yellow/40 hover:border-brand-yellow"
            }`}
          >
            Export Centre
            <span className="absolute -top-2 -right-3 bg-brand-yellow text-black text-[7px] font-black px-1 py-0.5 rounded-sm leading-none uppercase">New</span>
          </Link>
        </nav>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Drawer content */}
          <div className="relative w-64 max-w-xs bg-[#111111] border-l border-white/5 h-full p-6 flex flex-col z-50 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                <span className="text-xs font-black text-white tracking-widest uppercase">Navigation</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-3 text-xs font-semibold uppercase tracking-wider text-gray-300">
              <Link 
                href="/catalogue" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-white py-2.5 border-b border-white/5 block"
              >
                ★ Catalogue
              </Link>

              {/* Bulk Orders Collapsible */}
              <div className="flex flex-col">
                <button 
                  onClick={() => setIsMobileBulkOpen(!isMobileBulkOpen)}
                  className="flex items-center justify-between py-2.5 border-b border-white/5 text-left w-full cursor-pointer hover:text-white"
                >
                  <span>Bulk Orders</span>
                  <span className={`text-[10px] transform transition-transform ${isMobileBulkOpen ? "rotate-180" : ""}`}>▼</span>
                </button>
                
                {isMobileBulkOpen && (
                  <div className="pl-4 py-2 flex flex-col gap-3 text-[11px] normal-case text-gray-400 border-l border-white/5 ml-2 mt-1">
                    <Link href="/bulk-orders" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">All Bulk Orders</Link>
                    <Link href="/bulk-orders?sector=b2b" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">💼 B2B Business</Link>
                    <Link href="/bulk-orders?sector=institutional&sub=schools" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">🏫 School Lab Solutions</Link>
                    <Link href="/bulk-orders?sector=institutional&sub=colleges" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">🎓 College Packages</Link>
                    <Link href="/bulk-orders?sector=institutional&sub=research" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">🔬 Advanced Research Labs</Link>
                    <Link href="/bulk-orders?sector=commercial" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white">🏭 Commercial Labs</Link>
                  </div>
                )}
              </div>

              <Link 
                href="/products" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-white py-2.5 border-b border-white/5 block"
              >
                Products
              </Link>
              
              <Link 
                href="/reviews" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-white py-2.5 border-b border-white/5 block"
              >
                Reviews
              </Link>
              
              <Link 
                href="/certifications" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-white py-2.5 border-b border-white/5 block"
              >
                Certifications
              </Link>
              
              <Link 
                href="/contact-us" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-white py-2.5 border-b border-white/5 block"
              >
                Contact Us
              </Link>

              <Link 
                href="/secure-portal-access" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-white py-2.5 border-b border-white/5 block text-gray-400 font-medium"
              >
                Admin Portal
              </Link>

              <Link 
                href="/export" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-brand-yellow text-brand-yellow/90 py-2.5 border-b border-white/5 flex items-center justify-between"
              >
                <span>Export Centre</span>
                <span className="bg-brand-yellow text-black text-[8px] font-black px-1.5 py-0.5 rounded-sm">New</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
