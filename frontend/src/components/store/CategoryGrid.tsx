import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";

export default function CategoryGrid() {
  const categories = [
    {
      title: "Instruments",
      subtitle: "Precision testing tools",
      image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800",
      className: "md:col-span-1 md:row-span-1 h-[250px]",
      hasIcon: true
    },
    {
      title: "Safety Equipment",
      subtitle: "Essential protection",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800",
      className: "md:col-span-1 md:row-span-1 h-[250px]",
    },
  ];

  return (
    <div className="w-full bg-theme py-16 relative">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <span className="text-electric-blue text-[10px] font-bold tracking-widest uppercase mb-2 block">Specializations</span>
            <h2 className="text-3xl font-bold text-theme">Scientific Domains</h2>
          </div>
          <Link href="/catalogue" className="text-brand-yellow text-xs font-bold uppercase tracking-wider hover:text-yellow-500 transition-colors">
            View All Categories
          </Link>
        </div>

        {/* Floating Button (absolute to screen) */}
        <div className="absolute right-0 top-1/4 translate-x-1/2 md:translate-x-0 hidden md:flex items-center justify-center w-14 h-14 bg-brand-yellow rounded-l-xl shadow-lg z-30 cursor-pointer hover:w-16 transition-all duration-300">
          <MessageSquare size={20} className="text-theme" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
          
          {/* Main Large Category (Left) */}
          <Link href="/products?category=chemical-analysis" className="group relative rounded-xl overflow-hidden border border-theme/10 md:col-span-1 md:row-span-2 h-[300px] md:h-full bg-theme hover:border-electric-blue/50 transition-colors">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-50 mix-blend-luminosity group-hover:mix-blend-normal"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-8 w-full z-10">
              <h3 className="text-2xl font-bold text-theme mb-2 group-hover:text-electric-blue transition-colors">Chemical Analysis</h3>
              <p className="text-theme text-sm">Advanced reagents and specialized glassware for molecular research.</p>
            </div>
          </Link>

          {/* Right Top Card */}
          <Link href="/products?category=physics" className="group relative rounded-xl overflow-hidden border border-theme/10 md:col-span-2 md:row-span-1 h-[250px] md:h-full bg-theme hover:border-electric-blue/50 transition-colors">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-50 mix-blend-luminosity group-hover:mix-blend-normal"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-6 w-full z-10">
              <h3 className="text-xl font-bold text-theme mb-1 group-hover:text-electric-blue transition-colors">Physics & Electronics</h3>
            </div>
          </Link>

          {/* Right Bottom Left Card */}
          <Link href="/products?category=microbiology" className="group relative rounded-xl overflow-hidden border border-theme/10 md:col-span-1 md:row-span-1 h-[250px] md:h-full bg-theme hover:border-electric-blue/50 transition-colors">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-50 mix-blend-luminosity group-hover:mix-blend-normal"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-6 w-full z-10">
              <h3 className="text-xl font-bold text-theme mb-1 group-hover:text-electric-blue transition-colors">Microbiology</h3>
            </div>
          </Link>

          {/* Right Bottom Right Card */}
          <Link href="/products?category=diagnostics" className="group relative rounded-xl overflow-hidden border border-theme/10 md:col-span-1 md:row-span-1 h-[250px] md:h-full bg-theme hover:border-electric-blue/50 transition-colors">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-50 mix-blend-luminosity group-hover:mix-blend-normal"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-6 w-full z-10">
              <h3 className="text-xl font-bold text-theme mb-1 group-hover:text-electric-blue transition-colors">Diagnostics</h3>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
