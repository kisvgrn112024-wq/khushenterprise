import HeroSection from "@/components/store/HeroSection";
import LatestProducts from "@/components/store/LatestProducts";
import CategoryGrid from "@/components/store/CategoryGrid";
import ProductGrid from "@/components/store/ProductGrid";
import TrustBar from "@/components/store/TrustBar";


export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      <HeroSection />
      
      <LatestProducts />
      
      <div className="relative z-10">
        <CategoryGrid />
      </div>

      <section className="relative">
        <ProductGrid />
      </section>
      
      <div className="bg-[#0a0a0a]">
        <TrustBar />
      </div>
    </main>
  );
}
