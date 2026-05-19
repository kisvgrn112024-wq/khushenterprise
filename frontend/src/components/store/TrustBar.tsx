import { ShieldCheck, Truck, Headphones, Tag } from "lucide-react";

export default function TrustBar() {
  const features = [
    {
      icon: ShieldCheck,
      title: "5000+",
      description: "INSTITUTIONS SUPPLIED"
    },
    {
      icon: ShieldCheck, // Using ShieldCheck as a placeholder for the badge
      title: "25 Years",
      description: "INDUSTRY EXPERTISE"
    },
    {
      icon: Truck,
      title: "Pan-India",
      description: "RELIABLE DELIVERY"
    },
    {
      icon: Headphones,
      title: "Expert Support",
      description: "TECHNICAL ASSISTANCE"
    }
  ];

  return (
    <div className="bg-[#0a0a0a] py-16 border-y border-white/5 mt-10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center justify-center md:justify-start gap-4 group">
              <feature.icon size={32} className="text-gray-400 group-hover:text-white transition-colors" />
              <div>
                <h3 className="text-xl font-bold text-white leading-tight">{feature.title}</h3>
                <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
