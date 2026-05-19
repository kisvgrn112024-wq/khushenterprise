"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, Printer, ArrowLeft } from "lucide-react";
import { getProducts } from "@/lib/products";

interface Catalogue {
  id: string;
  title: string;
  department: string;
  description: string;
  image: string;
  version: string;
  autoSync: boolean;
  category: string;
  selectedProductIds: string[];
  stockCount: number;
  fileName: string;
}

function PrintContent() {
  const searchParams = useSearchParams();
  const fileParam = searchParams.get("file") || "document.pdf";
  const catIdParam = searchParams.get("catId");
  const decodedFileName = decodeURIComponent(fileParam);

  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [matchingProducts, setMatchingProducts] = useState<any[]>([]);

  useEffect(() => {
    // Load catalogue metadata
    const savedCats = localStorage.getItem("ke_catalogues");
    const catalogues: Catalogue[] = savedCats ? JSON.parse(savedCats) : [];
    const targetCat = catalogues.find(c => c.id === catIdParam);
    setCatalogue(targetCat || null);

    // Load active products
    const savedProds = localStorage.getItem("ke_products");
    const allProducts: any[] = savedProds ? JSON.parse(savedProds) : getProducts();

    if (targetCat) {
      if (targetCat.autoSync) {
        // Filter by category
        const filtered = allProducts.filter(p => p.category === targetCat.category);
        setMatchingProducts(filtered);
      } else {
        // Filter by specific IDs OR explicitly mapped catalog_id
        const filtered = allProducts.filter(p => 
          targetCat.selectedProductIds?.includes(p.id) || 
          p.catalog_id === targetCat.id
        );
        setMatchingProducts(filtered);
      }
    } else {
      // Fallback
      setMatchingProducts(allProducts.slice(0, 5));
    }
  }, [catIdParam]);

  // Trigger print dialog on load with a tiny delay
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 1500);
    return () => clearTimeout(timer);
  }, [matchingProducts]);

  return (
    <div className="min-h-screen bg-white text-black p-6 md:p-10 font-sans print:p-0">
      
      {/* Print / Action bar (hidden in final PDF print layout) */}
      <div className="print:hidden flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
         <button 
           onClick={() => window.close()}
           className="text-sm text-gray-500 hover:text-black flex items-center gap-1.5 transition-colors"
         >
           <ArrowLeft size={16} /> Back to Hub
         </button>
         <div className="text-sm text-gray-600 font-medium">
           Consignment Guide: <strong className="text-black font-bold">{catalogue?.title || decodedFileName}</strong>
         </div>
         <button 
           onClick={() => window.print()} 
           className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded shadow flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-colors"
         >
           <Printer size={15} /> Print / Export PDF
         </button>
      </div>

      <div className="max-w-4xl mx-auto border border-gray-200 p-8 md:p-12 shadow-sm relative bg-white print:border-0 print:shadow-none print:p-0">
        
        {/* KE Corporate Letterhead Header */}
        <div className="flex justify-between items-start mb-10 border-b-2 border-slate-900 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">KHUSH</h1>
            <h2 className="text-lg font-bold tracking-widest text-gray-600 uppercase mt-0.5">ENTERPRISES</h2>
            <p className="text-[10px] text-gray-500 mt-3 font-mono leading-relaxed">
              Wholesale Contract Laboratory Infrastructure<br/>
              Office: Block C-4, Sector 7, Science Industrial Park<br/>
              Mumbai, MH, IN 400076 | dispatch@khushenterprises.com
            </p>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-extrabold text-slate-800 uppercase tracking-widest leading-none mb-1.5">Official Inventory Specification Sheet</h3>
            <p className="text-xs font-bold text-gray-600">Date Generated: {new Date().toLocaleDateString("en-IN")}</p>
            <p className="text-[10px] text-gray-400 mt-2 font-mono">EXPORT REQ: {Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
          </div>
        </div>

        {/* Dynamic Title */}
        <div className="mb-8 text-center bg-gray-50 py-6 border border-gray-100 rounded-lg">
           <ShieldCheck size={36} className="mx-auto mb-2 text-[#8bceff]" />
           <h2 className="text-xl font-bold text-gray-900 mb-1">{catalogue?.title || "Custom Curation Index"}</h2>
           <p className="text-xs text-gray-500 max-w-md mx-auto">{catalogue?.description || "Curated precision apparatus checklist."}</p>
           <div className="text-[10px] font-mono text-gray-400 mt-2">
             Verification Version: {catalogue?.version || "V1.0"} | Format: ISO 9001 Certified Printout
           </div>
        </div>

        {/* Core Product Inventory Spreadsheet */}
        <div className="space-y-6">
           <p className="text-xs text-gray-600 leading-relaxed text-justify mb-4">
             The following items represent precision equipment certified under Khush Enterprises contract terms. Standard warranties apply. Prices are exclusive of local GST (18%) and HSN clearances.
           </p>
           
           <table className="w-full text-left border-collapse border border-gray-300">
             <thead>
               <tr className="bg-slate-900 text-white text-[10px] uppercase font-bold tracking-wider">
                 <th className="border border-slate-700 p-2.5">SKU / Model</th>
                 <th className="border border-slate-700 p-2.5">Product Title</th>
                 <th className="border border-slate-700 p-2.5">Category</th>
                 <th className="border border-slate-700 p-2.5">HSN Code</th>
                 <th className="border border-slate-700 p-2.5 text-right">Contract Price</th>
                 <th className="border border-slate-700 p-2.5 text-center">Status</th>
               </tr>
             </thead>
             <tbody>
               {matchingProducts.length === 0 ? (
                 <tr>
                   <td colSpan={6} className="border border-gray-300 p-6 text-center text-xs text-gray-400">
                     No products mapped in this dynamic catalogue booklet category.
                   </td>
                 </tr>
               ) : (
                 matchingProducts.map((prod) => (
                   <tr key={prod.id} className="hover:bg-gray-50 transition-colors text-xs">
                     <td className="border border-gray-300 p-2.5 font-mono text-[10px] text-gray-600">{prod.sku || "N/A"}</td>
                     <td className="border border-gray-300 p-2.5 font-bold text-gray-900">{prod.title}</td>
                     <td className="border border-gray-300 p-2.5 text-gray-600">{prod.category}</td>
                     <td className="border border-gray-300 p-2.5 font-mono text-[10px] text-gray-500">{prod.hsnCode || "HSN 9011"}</td>
                     <td className="border border-gray-300 p-2.5 text-right font-bold text-slate-800">
                       ₹{prod.price?.toLocaleString("en-IN") || "0"}
                     </td>
                     <td className="border border-gray-300 p-2.5 text-center">
                       <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                         prod.inStock ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                       }`}>
                         {prod.inStock ? "In Stock" : "Pre-Order"}
                       </span>
                     </td>
                   </tr>
                 ))
               )}
             </tbody>
           </table>
        </div>

        {/* Dynamic Verification SHA Code */}
        <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between items-center text-[9px] font-mono text-gray-400">
          <div>
            ISO-9001:2015 REGISTERED | GOVERNMENT LABORATORY CONTRACTOR
          </div>
          <div>
            PAGE 1 of 1
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PrintReadyView() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white text-black p-10 flex items-center justify-center font-bold">Loading PDF Blueprint...</div>}>
      <PrintContent />
    </Suspense>
  );
}
