"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

interface Banner {
  id: string;
  title: string;
  link: string;
  image: string;
  status: "active" | "draft" | "scheduled";
  placement: string;
}

const DEFAULT_BANNERS: Banner[] = [
  {
    id: "b1",
    title: "Q4 Analytical Instruments Promo",
    link: "/products",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1400",
    status: "active",
    placement: "Homepage Hero",
  },
  {
    id: "b2",
    title: "Essential Glassware Restock",
    link: "/products",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1400",
    status: "active",
    placement: "Homepage Hero",
  },
];

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ke_banners");
    let allBanners: Banner[] = saved ? JSON.parse(saved) : DEFAULT_BANNERS;
    // Only show active banners placed on Homepage Hero
    const active = allBanners.filter(
      (b) => b.status === "active" && b.placement === "Homepage Hero"
    );
    setBanners(active.length > 0 ? active : DEFAULT_BANNERS);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? banners.length - 1 : c - 1));
  }, [banners.length]);

  const next = useCallback(() => {
    setCurrent((c) => (c === banners.length - 1 ? 0 : c + 1));
  }, [banners.length]);

  // Auto-slide every 4 seconds unless hovered
  useEffect(() => {
    if (banners.length <= 1 || isHovered) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [banners.length, isHovered, next]);

  if (banners.length === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-theme/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ aspectRatio: "16/6" }}
    >
      {/* Slides */}
      {banners.map((banner, idx) => (
        <Link
          key={banner.id}
          href={banner.link || "/products"}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          {/* Text */}
          <div className="absolute bottom-6 left-8 z-20">
            <p className="text-[10px] font-black text-[#1A73E8] tracking-widest uppercase mb-1">Featured Promotion</p>
            <h3 className="text-xl md:text-2xl font-black text-white leading-tight max-w-sm">
              {banner.title}
            </h3>
            <span className="mt-3 inline-flex items-center gap-1 text-white/80 text-xs font-bold hover:text-white transition-colors">
              Shop Now <ExternalLink size={12} />
            </span>
          </div>
        </Link>
      ))}

      {/* Navigation arrows (only if multiple banners) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); prev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/40 hover:bg-black/70 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous banner"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); next(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/40 hover:bg-black/70 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next banner"
          >
            <ChevronRight size={18} />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-3 right-6 z-20 flex items-center gap-1.5">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.preventDefault(); setCurrent(idx); }}
                className={`rounded-full transition-all duration-300 ${
                  idx === current
                    ? "w-5 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
