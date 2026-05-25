"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/lib/products";

interface Banner {
  id: string;
  title: string;
  link: string;
  startDate: string;
  endDate: string;
  image: string;
  status: "active" | "draft" | "scheduled";
  placement: string;
}

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Read banners from localStorage
    const saved = localStorage.getItem("ke_banners");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Show only active banners
          const activeBanners = parsed.filter(b => b.status === "active");
          setBanners(activeBanners);
        }
      } catch (e) {
        console.error("Error parsing banners from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    // Start auto-slide timer
    startAutoPlay();
    return () => stopAutoPlay();
  }, [banners, currentIndex]);

  const startAutoPlay = () => {
    if (banners.length <= 1) return;
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 4000);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  if (banners.length === 0) return null;

  return (
    <section 
      className="relative w-full max-w-6xl mx-auto my-6 px-4"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      <div className="relative h-44 sm:h-64 md:h-80 w-full overflow-hidden rounded-2xl border border-theme/5 bg-theme/5">
        
        {/* Slides */}
        {banners.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Link href={banner.link || "/products"}>
                <div className="relative w-full h-full cursor-pointer group">
                  <img
                    src={getImageUrl(banner.image)}
                    alt={banner.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  {/* Text Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent flex flex-col justify-end p-6 md:p-10">
                    <h3 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white mb-2 leading-tight drop-shadow-md">
                      {banner.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs font-bold tracking-widest text-[#8bceff] uppercase drop-shadow-md">
                      {banner.placement || "Featured Offer"} &bull; Shop Now &rarr;
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}

        {/* Prev / Next Buttons */}
        {banners.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-[#8bceff] w-5" 
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
