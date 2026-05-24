"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search, Heart, ShoppingCart, User, Mic, Camera, Loader2, BotMessageSquare, Menu, X, ChevronDown, BookOpen, Package, Star, Award, Mail, Globe, Shield } from "lucide-react";
import { getProducts } from "@/lib/products";
import { useStore } from "@/context/StoreContext";
import { useViewMode } from "@/context/ViewModeContext";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

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
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Read user login status
    const saved = localStorage.getItem("ke_user");
    if (saved) {
      setUserSession(JSON.parse(saved));
    }
  }, [pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <header className="w-full bg-theme border-b border-theme/5 sticky top-0 z-50 overflow-x-hidden">
      <div className="container mx-auto px-4 lg:px-8 py-4">
        {/* Top Row: Logo, Search, Icons */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-6 mb-4">
          {/* Logo */}
          <Link href="/" className={`flex-shrink-0 flex items-center ${viewMode === 'mobile' ? 'gap-1.5 max-w-[120px]' : 'gap-1.5 md:gap-3 max-w-[120px] sm:max-w-none'}`}>
            <img src="/logo.png" alt="KE" className={`object-contain ${viewMode === 'mobile' ? 'w-6 h-6' : 'w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9'}`} />
            <div className={`flex items-baseline ${viewMode === 'mobile' ? 'gap-0.5' : 'gap-0.5 md:gap-1.5'}`}>
              <span className={`font-black text-theme tracking-wider ${viewMode === 'mobile' ? 'text-xs' : 'text-xs sm:text-lg md:text-2xl'}`}>KHUSH</span>
              <span className={`font-bold text-theme tracking-widest mt-1 ${viewMode === 'mobile' ? 'hidden' : 'text-[8px] sm:text-sm md:text-xl hidden sm:block'}`}>ENTERPRISES</span>
            </div>
          </Link>

          {/* Smart Search Bar (Desktop) */}
          <div className={`relative w-full max-w-2xl ${viewMode === "mobile" ? "hidden" : "hidden md:block"}`}>
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-theme rounded overflow-hidden h-10 border border-theme/10 focus-within:border-theme/30 transition-all px-4">
              <input 
                type="text" 
                placeholder={isListening ? "Listening with AI voice desk..." : "Search model, or say 'my orders', 'catalogue'..."} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className={`flex-1 bg-transparent text-sm text-theme placeholder-gray-400 outline-none w-full ${isListening ? "text-red-400 font-bold" : ""}`}
                disabled={isListening}
              />
              
              <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                {/* Voice speech recognition button */}
                <button 
                  type="button" 
                  onClick={startSpeechRecognition}
                  className={`transition-colors p-1 rounded hover:bg-theme/5 ${isListening ? "text-red-500 animate-pulse" : "text-theme hover:text-theme"}`}
                  title="Search by voice"
                >
                  <Mic size={16} />
                </button>

                {/* AI Visual Image Search */}
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-theme hover:text-theme p-1 rounded hover:bg-theme/5"
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

                <div className="w-[1px] h-4 bg-theme/10"></div>

                <button type="submit" className="text-theme hover:text-theme">
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* Live Search Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-theme border border-theme/10 rounded shadow-xl overflow-hidden z-50">
                {searchResults.map(product => (
                  <Link key={product.id} href={`/products?q=${encodeURIComponent(product.title)}`} className="flex items-center gap-3 p-3 hover:bg-theme border-b border-theme/5 last:border-0">
                    <div className="w-8 h-8 bg-theme rounded flex items-center justify-center">
                      <Search size={14} className="text-theme" />
                    </div>
                    <div>
                      <div className="text-theme text-sm font-medium line-clamp-1">{product.title}</div>
                      <div className="text-theme text-xs font-semibold">₹{product.price.toLocaleString("en-IN")}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Icons & Mobile controls */}
          {/* Icons & Mobile controls */}
          <div className={`flex items-center text-theme ${viewMode === 'mobile' ? 'gap-1 flex-shrink' : 'gap-1.5 sm:gap-3.5 md:gap-6 flex-shrink-0'}`}>
            {/* Search Icon (Mobile View Only) */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className={`hover:text-[#8bceff] transition-colors p-0.5 cursor-pointer ${
                viewMode === "mobile" ? "block" : "md:hidden block"
              }`}
              title="Search"
            >
              <Search className={viewMode === 'mobile' ? 'w-4 h-4' : 'w-4 h-4 sm:w-5 sm:h-5'} />
            </button>

            {/* Live Chat link shortcut */}
            <Link href="/my-orders" className="hover:text-[#8bceff] transition-colors relative" title="Consignment Assistant Desk">
              <BotMessageSquare className={viewMode === 'mobile' ? 'w-4 h-4' : 'w-4 h-4 sm:w-5 sm:h-5'} />
            </Link>
            
            <Link href="/wishlist" className="hover:text-theme transition-colors relative">
              <Heart className={`${viewMode === 'mobile' ? 'w-4 h-4' : 'w-4 h-4 sm:w-5 sm:h-5'} ${wishlist.length > 0 ? "fill-white text-theme" : ""}`} />
              {wishlist.length > 0 && (
                <span className={`absolute bg-brand-yellow text-theme font-bold rounded-full flex items-center justify-center ${viewMode === 'mobile' ? '-top-1.5 -right-1.5 text-[8px] w-3 h-3' : '-top-1.5 -right-1.5 sm:-top-2 sm:-right-2 text-[8px] sm:text-[10px] w-3 h-3 sm:w-4 sm:h-4'}`}>{wishlist.length}</span>
              )}
            </Link>
            
            <button onClick={() => setIsCartOpen(true)} className="hover:text-theme transition-colors relative cursor-pointer p-0.5">
               <ShoppingCart className={viewMode === 'mobile' ? 'w-4 h-4' : 'w-4 h-4 sm:w-5 sm:h-5'} />
               {cart.length > 0 && (
                 <span className={`absolute bg-brand-yellow text-theme font-bold rounded-full flex items-center justify-center ${viewMode === 'mobile' ? '-top-1.5 -right-1.5 text-[8px] w-3 h-3' : '-top-1.5 -right-1.5 sm:-top-2 sm:-right-2 text-[8px] sm:text-[10px] w-3 h-3 sm:w-4 sm:h-4'}`}>{cart.reduce((a,c) => a + c.quantity, 0)}</span>
               )}
            </button>
            <div className={`${viewMode === 'mobile' ? 'ml-0.5 scale-[0.65]' : 'ml-0.5 sm:ml-4 scale-[0.65] sm:scale-100'} origin-center`}><ThemeSwitcher /></div>
            
            <div ref={profileRef} className="relative cursor-pointer" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} onMouseEnter={() => viewMode !== 'mobile' && setIsProfileDropdownOpen(true)} onMouseLeave={() => viewMode !== 'mobile' && setIsProfileDropdownOpen(false)}>
              <div className={`flex items-center hover:text-theme ${viewMode === 'mobile' ? 'gap-0.5' : 'gap-0.5 sm:gap-1'}`}>
                <User className={viewMode === 'mobile' ? 'w-4 h-4' : 'w-4 h-4 sm:w-5 sm:h-5'} />
                {userSession && <span className={`bg-green-500/10 text-green-400 px-1 py-0.5 rounded border border-green-500/20 font-bold truncate ${viewMode === 'mobile' ? 'text-[8px] max-w-[50px] block' : 'text-[8px] sm:text-[10px] max-w-[50px] sm:max-w-[80px] hidden sm:block'}`}>{userSession.name}</span>}
              </div>
              
              {/* Dropdown menu */}
              <div className={`absolute top-full mt-2 right-0 w-48 bg-theme border border-theme/10 rounded shadow-xl transition-all z-50 p-2 ${isProfileDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                {!userSession ? (
                  <>
                    <Link href="/account/login" onClick={() => setIsProfileDropdownOpen(false)} className="block p-2 text-sm text-theme hover:bg-theme hover:text-theme rounded font-medium">Login / Register</Link>
                    <div className="h-[1px] bg-theme/5 my-1"></div>
                    <Link href="/secure-portal-access" onClick={() => setIsProfileDropdownOpen(false)} className="block p-2 text-sm text-theme hover:bg-theme hover:text-theme rounded font-medium">Admin Portal</Link>
                  </>
                ) : (
                  <>
                    <div className="px-2 py-1.5 text-[10px] font-bold text-theme uppercase border-b border-theme/5 mb-1">{userSession.org}</div>
                    <Link href="/my-orders" onClick={() => setIsProfileDropdownOpen(false)} className="block p-2 text-sm text-theme hover:bg-theme hover:text-theme rounded font-medium">Consignment Status</Link>
                    <div className="h-[1px] bg-theme/5 my-1"></div>
                    <Link href="/secure-portal-access" onClick={() => setIsProfileDropdownOpen(false)} className="block p-2 text-sm text-theme hover:bg-theme hover:text-theme rounded font-medium">Admin Portal</Link>
                  </>
                )}
              </div>
            </div>

            {/* Hamburger Button (Mobile View Only) */}
            <button
              onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen); setIsProfileDropdownOpen(false); }}
              className={`hover:text-[#8bceff] transition-colors p-0.5 cursor-pointer ${
                viewMode === "mobile" ? "block" : "md:hidden block"
              }`}
              title="Menu"
            >
              {isMobileMenuOpen ? <X className={viewMode === 'mobile' ? 'w-5 h-5' : 'w-5 h-5 sm:w-5 sm:h-5'} /> : <Menu className={viewMode === 'mobile' ? 'w-5 h-5' : 'w-5 h-5 sm:w-5 sm:h-5'} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Expandable, Mobile View Only) */}
        {isMobileSearchOpen && (
          <div className={`mb-4 w-full ${viewMode === "mobile" ? "block" : "md:hidden block"}`}>
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-theme rounded overflow-hidden h-10 border border-theme/10 focus-within:border-theme/30 transition-all px-4">
              <input 
                type="text" 
                placeholder={isListening ? "Listening with AI voice desk..." : "Search laboratory equipment..."} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className={`flex-1 bg-transparent text-sm text-theme placeholder-gray-400 outline-none w-full ${isListening ? "text-red-400 font-bold" : ""}`}
                disabled={isListening}
              />
              
              <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                <button 
                  type="button" 
                  onClick={startSpeechRecognition}
                  className={`transition-colors p-1 rounded hover:bg-theme/5 ${isListening ? "text-red-500 animate-pulse" : "text-theme hover:text-theme"}`}
                >
                  <Mic size={16} />
                </button>
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-theme hover:text-theme p-1 rounded hover:bg-theme/5"
                  title="Visual Camera Search"
                >
                  {isAiAnalyzing ? <Loader2 size={16} className="animate-spin text-[#8bceff]" /> : <Camera size={16} />}
                </button>
                <div className="w-[1px] h-4 bg-theme/10"></div>
                <button type="submit" className="text-theme hover:text-theme">
                  <Search size={18} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Navigation Links (Desktop md+ only - Mobile uses hamburger drawer) */}
        <nav className={`${viewMode === "mobile" ? "hidden" : "hidden md:flex md:justify-center md:overflow-visible whitespace-nowrap pb-2 md:pb-0 hide-scrollbar"} items-center gap-5 sm:gap-8 text-[9px] sm:text-xs font-semibold text-theme uppercase tracking-wider mt-1 px-1`}>
          <Link href="/catalogue" className="hover:text-theme transition-colors border-b-2 border-transparent hover:border-brand-yellow text-theme pb-1 flex-shrink-0">Catalogue</Link>
          
          {/* Bulk Orders Dropdown */}
          <div 
            className="relative group py-1"
            onMouseEnter={() => setIsBulkDropdownOpen(true)}
            onMouseLeave={() => setIsBulkDropdownOpen(false)}
          >
            <Link 
              href="/bulk-orders" 
              className="hover:text-theme transition-colors border-b-2 border-transparent hover:border-brand-yellow pb-1 flex items-center gap-1 cursor-pointer uppercase"
            >
              Bulk Orders
              <span className="text-[8px] transition-transform group-hover:rotate-180">▼</span>
            </Link>
            <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 bg-theme border border-theme/10 rounded shadow-2xl transition-all duration-200 z-50 p-1.5 flex flex-col gap-0.5 text-left normal-case ${
              isBulkDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
            }`}>
              <Link 
                href="/bulk-orders?sector=b2b" 
                className="block px-3 py-2 text-[11px] text-theme hover:bg-theme/5 hover:text-theme rounded transition-colors font-medium"
              >
                💼 B2B Business
              </Link>
              <div className="h-[1px] bg-theme/5 my-0.5"></div>
              <Link 
                href="/bulk-orders?sector=institutional&sub=schools" 
                className="block px-3 py-2 text-[11px] text-theme hover:bg-theme/5 hover:text-theme rounded transition-colors font-medium"
              >
                🏫 School Lab Solutions
              </Link>
              <Link 
                href="/bulk-orders?sector=institutional&sub=colleges" 
                className="block px-3 py-2 text-[11px] text-theme hover:bg-theme/5 hover:text-theme rounded transition-colors font-medium"
              >
                🎓 College Lab Packages
              </Link>
              <Link 
                href="/bulk-orders?sector=institutional&sub=research" 
                className="block px-3 py-2 text-[11px] text-theme hover:bg-theme/5 hover:text-theme rounded transition-colors font-medium"
              >
                🔬 Advanced Research Labs
              </Link>
              <div className="h-[1px] bg-theme/5 my-0.5"></div>
              <Link 
                href="/bulk-orders?sector=commercial" 
                className="block px-3 py-2 text-[11px] text-theme hover:bg-theme/5 hover:text-theme rounded transition-colors font-medium"
              >
                🏭 Commercial Labs
              </Link>
            </div>
          </div>

          <Link href="/products" className="hover:text-theme py-2.5 border-b border-theme/5">Products</Link>
          <Link href="/reviews" className="hover:text-theme py-2.5 border-b border-theme/5">Reviews</Link>
          <Link href="/certifications" className="hover:text-theme py-2.5 border-b border-theme/5">Certifications</Link>
          <Link href="/catalogue" className="hover:text-theme py-2.5 border-b border-theme/5">Catalogue</Link>
          <Link href="/export" className="hover:text-theme py-2.5 border-b border-theme/5">Export Centre</Link>
        </nav>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-theme/75 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Drawer content */}
          <div className="relative w-64 max-w-xs bg-theme border-l border-theme/5 h-full p-6 flex flex-col z-50 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-theme/5 mb-6">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                <span className="text-xs font-black text-theme tracking-widest uppercase">Menu</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-theme hover:text-theme cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile User, Theme & Utilities */}
            <div className="flex flex-col gap-3 pb-4 mb-4 border-b border-theme/5">
              {/* Theme Switcher — prominently displayed */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-theme uppercase tracking-wider">Theme</span>
                <div className="scale-90 origin-right"><ThemeSwitcher /></div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-xs font-semibold text-theme">
                  <Heart className={`w-4 h-4 ${wishlist.length > 0 ? "fill-theme" : ""}`} /> Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
                </Link>
                <button onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 text-xs font-semibold text-theme">
                  <ShoppingCart className="w-4 h-4" /> Cart {cart.length > 0 && `(${cart.reduce((a,c) => a + c.quantity, 0)})`}
                </button>
              </div>
              
              <Link href="/my-orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-xs font-semibold text-theme">
                <BotMessageSquare className="w-4 h-4" /> Assistant Desk
              </Link>
              
              {/* Profile / Login */}
              {userSession ? (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-1.5 rounded">
                    <User className="w-4 h-4" /> {userSession.name}
                    {userSession.org && <span className="text-[9px] text-green-300/70 ml-auto">{userSession.org}</span>}
                  </div>
                  <Link href="/my-orders" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-semibold text-theme pl-2 hover:text-theme">Consignment Status</Link>
                </div>
              ) : (
                <Link href="/account/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-xs font-semibold text-theme">
                  <User className="w-4 h-4" /> Login / Register
                </Link>
              )}
            </div>

            <nav className="grid grid-cols-2 gap-2 text-xs font-semibold uppercase tracking-wider text-theme">
              <div className="text-[10px] font-bold text-theme/50 uppercase tracking-widest mb-1">Navigation</div>
              <Link 
                href="/catalogue" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-theme py-2.5 border-b border-theme/5 block"
              >
                ★ Catalogue
              </Link>

              {/* Bulk Orders Collapsible */}
              <div className="flex flex-col">
                <button 
                  onClick={() => setIsMobileBulkOpen(!isMobileBulkOpen)}
                  className="flex items-center justify-between py-2.5 border-b border-theme/5 text-left w-full cursor-pointer hover:text-theme"
                >
                  <span>Bulk Orders</span>
                  <span className={`text-[10px] transform transition-transform ${isMobileBulkOpen ? "rotate-180" : ""}`}>▼</span>
                </button>
                
                {isMobileBulkOpen && (
                  <div className="pl-4 py-2 flex flex-col gap-3 text-[11px] normal-case text-theme border-l border-theme/5 ml-2 mt-1">
                    <Link href="/bulk-orders" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-theme">All Bulk Orders</Link>
                    <Link href="/bulk-orders?sector=b2b" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-theme">💼 B2B Business</Link>
                    <Link href="/bulk-orders?sector=institutional&sub=schools" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-theme">🏫 School Lab Solutions</Link>
                    <Link href="/bulk-orders?sector=institutional&sub=colleges" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-theme">🎓 College Packages</Link>
                    <Link href="/bulk-orders?sector=institutional&sub=research" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-theme">🔬 Advanced Research Labs</Link>
                    <Link href="/bulk-orders?sector=commercial" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-theme">🏭 Commercial Labs</Link>
                  </div>
                )}
              </div>

              <Link 
                href="/products" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-theme py-2.5 border-b border-theme/5 block"
              >
                Products
              </Link>
              
              <Link 
                href="/reviews" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-theme py-2.5 border-b border-theme/5 block"
              >
                Reviews
              </Link>
              
              <Link 
                href="/certifications" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-theme py-2.5 border-b border-theme/5 block"
              >
                Certifications
              </Link>
              
              <Link 
                href="/contact-us" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-theme py-2.5 border-b border-theme/5 block"
              >
                Contact Us
              </Link>

              <Link 
                href="/secure-portal-access" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-theme py-2.5 border-b border-theme/5 block text-theme font-medium"
              >
                Admin Portal
              </Link>

              <Link 
                href="/export" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-brand-yellow text-brand-yellow/90 py-2.5 border-b border-theme/5 flex items-center justify-between"
              >
                <span>Export Centre</span>
                <span className="bg-brand-yellow text-theme text-[8px] font-black px-1.5 py-0.5 rounded-sm">New</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
      {/* Custom Scrollbar Hiding CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </header>
  );
}
