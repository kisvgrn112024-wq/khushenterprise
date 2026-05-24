"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Beaker, Printer, ArrowLeft, Award, Globe, Mail, Phone } from "lucide-react";
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

interface PageLayout {
  type: "cover" | "product-page";
  categoryName?: string;
  categoryIndex?: number;
  primary?: any;
  secondary?: any;
  pageNum: number;
}

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("data:")) {
    return imagePath;
  }
  const baseUrl = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? `http://${window.location.hostname}:5000` : '';
  return `${baseUrl}${imagePath}`;
};

const getMaterialGrade = (product: any) => {
  const title = (product.title || "").toLowerCase();
  const desc = (product.description || "").toLowerCase();
  const cat = (product.category || "").toLowerCase();
  
  if (cat.includes("ortho") || cat.includes("surgical") || title.includes("collar") || title.includes("belt") || title.includes("support")) {
    return "Medical Grade Neoprene & Ortho Polyethylene";
  }
  if (title.includes("glass") || title.includes("flask") || title.includes("beaker") || cat.includes("ml")) {
    return "Borosilicate 3.3 Lab Glass (ASTM E438)";
  }
  if (title.includes("microscope")) {
    return "Optical Glass & Die-Cast Aluminum Alloy";
  }
  if (title.includes("scale") || title.includes("balance")) {
    return "Brushed Stainless Steel & ABS Enclosure";
  }
  if (title.includes("pipette")) {
    return "PVDF & Autoclavable Polymer Compound";
  }
  return "Premium Laboratory Grade Material";
};

const getPackConfig = (product: any) => {
  const title = (product.title || "").toLowerCase();
  if (title.includes("set of")) {
    const match = title.match(/set of\s*(\d+)/);
    return match ? `Pack of ${match[1]} Units` : "Custom Set";
  }
  if (product.moq && product.moq > 1) {
    return `Standard Bulk Case (MOQ: ${product.moq})`;
  }
  return "Single Unit (Individual Box)";
};

const getProductSpecs = (product: any) => {
  return [
    { label: "Manufacturer", value: product.brand || "Khush Enterprises" },
    { label: "Model / SKU", value: product.sku || `KE-${product.id.slice(-6).toUpperCase()}` },
    { label: "Compliance", value: "ISO 9001:2015, CE Compliant" },
    { label: "Material Grade", value: getMaterialGrade(product) },
    { label: "Pack Configuration", value: getPackConfig(product) },
    { label: "Availability Status", value: product.stock > 0 ? `In Stock (${product.stock} units)` : "Pre-Order (14 Days)" }
  ];
};

const generatePages = (matchingProds: any[]): { pages: PageLayout[], categoryPageMap: { [cat: string]: number } } => {
  const pages: PageLayout[] = [];
  const categoryPageMap: { [cat: string]: number } = {};
  
  // Page 1: Cover Page
  pages.push({
    type: "cover",
    pageNum: 1
  });
  
  // Group products by category
  const grouped: { [cat: string]: any[] } = {};
  matchingProds.forEach(p => {
    const cat = p.category || "General Scientific Apparatus";
    if (!grouped[cat]) {
      grouped[cat] = [];
    }
    grouped[cat].push(p);
  });
  
  let currentPage = 2;
  const sortedCategories = Object.keys(grouped).sort();
  
  sortedCategories.forEach((catName, catIdx) => {
    categoryPageMap[catName] = currentPage;
    const catProducts = grouped[catName];
    
    // Chunk products by 2 (exactly 1 primary and 1 secondary per page)
    for (let i = 0; i < catProducts.length; i += 2) {
      pages.push({
        type: "product-page",
        categoryName: catName,
        categoryIndex: catIdx + 1,
        primary: catProducts[i],
        secondary: catProducts[i + 1] || null,
        pageNum: currentPage
      });
      currentPage++;
    }
  });
  
  return { pages, categoryPageMap };
};

function PrintContent() {
  const searchParams = useSearchParams();
  const fileParam = searchParams.get("file") || "document.pdf";
  const catIdParam = searchParams.get("catId");
  const decodedFileName = decodeURIComponent(fileParam);

  const typeParam = searchParams.get("type");
  const orderIdParam = searchParams.get("orderId");

  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [matchingProducts, setMatchingProducts] = useState<any[]>([]);
  const [pages, setPages] = useState<PageLayout[]>([]);
  const [categoryPageMap, setCategoryPageMap] = useState<{ [cat: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    setIsLoading(true);

    if (typeParam === "order-slip" && orderIdParam) {
      const fetchOrder = async () => {
        try {
          const API_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
            ? `http://${window.location.hostname}:5000/api/orders`
            : '/api/orders';
          const res = await fetch(API_URL);
          if (res.ok) {
            const orders = await res.json();
            const found = orders.find((o: any) => o.id === orderIdParam);
            if (found) {
              setOrder(found);
              setIsLoading(false);
              return;
            }
          }
        } catch (e) {
          console.warn("API offline or error fetching orders.");
        }

        // Local storage fallback
        const saved = localStorage.getItem("ke_orders");
        if (saved) {
          const orders = JSON.parse(saved);
          const found = orders.find((o: any) => o.id === orderIdParam);
          if (found) {
            setOrder(found);
          }
        }
        setIsLoading(false);
      };
      fetchOrder();
      return;
    }

    // Load catalogue metadata
    const savedCats = localStorage.getItem("ke_catalogues");
    const catalogues: Catalogue[] = savedCats ? JSON.parse(savedCats) : [];
    const targetCat = catalogues.find(c => c.id === catIdParam);
    setCatalogue(targetCat || null);

    // Load active products
    const savedProds = localStorage.getItem("ke_products");
    const allProducts: any[] = savedProds ? JSON.parse(savedProds) : getProducts();

    let filtered: any[] = [];
    if (targetCat) {
      if (targetCat.autoSync) {
        filtered = allProducts.filter(p => p.category === targetCat.category && p.product_status !== 'inactive');
      } else {
        filtered = allProducts.filter(p => 
          (targetCat.selectedProductIds?.includes(p.id) || 
          p.catalog_id === targetCat.id) &&
          p.product_status !== 'inactive'
        );
      }
    } else {
      filtered = allProducts.filter(p => p.product_status !== 'inactive').slice(0, 12);
    }
    setMatchingProducts(filtered);

    // Generate A4 pages mapping
    const generated = generatePages(filtered);
    setPages(generated.pages);
    setCategoryPageMap(generated.categoryPageMap);
    setIsLoading(false);
  }, [catIdParam, typeParam, orderIdParam]);

  // Trigger print dialog on load with a tiny delay
  useEffect(() => {
    if (pages.length > 0 || order) {
      const timer = setTimeout(() => {
        window.print();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [pages, order]);

  const coverTitle = catalogue?.title || "OFFICIAL PRODUCT CATALOGUE";
  const coverSubtitle = catalogue?.description || "Precision apparatus, surgical orthopedic supports, and clinical diagnostics reference matrix.";
  const coverDate = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }).toUpperCase();
  const coverVolume = `VOL. ${new Date().getFullYear()} / 1`;
  
  const getCoverImage = () => {
    if (catalogue?.image) {
      return getImageUrl(catalogue.image);
    }
    const firstProdWithImg = matchingProducts.find(p => p.images && p.images.length > 0);
    if (firstProdWithImg) {
      return getImageUrl(firstProdWithImg.images[0]);
    }
    return "https://images.unsplash.com/photo-1576086213369-97a306dca665?auto=format&fit=crop&w=800&q=80";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center font-sans">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-900 border-t-transparent mb-4"></div>
        <p className="text-sm font-bold uppercase tracking-wider">Generating Dynamic Catalog Templates...</p>
      </div>
    );
  }

  if (typeParam === "order-slip") {
    if (!order) {
      return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center font-sans p-6">
          <p className="text-sm font-bold uppercase tracking-wider text-red-500">Order Slip Not Found</p>
          <button onClick={() => window.close()} className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase rounded cursor-pointer">Close Window</button>
        </div>
      );
    }

    const subtotal = order.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || order.total;
    const tax = subtotal * 0.18;
    const shipping = subtotal > 999 ? 0 : 150;
    const grandTotal = subtotal + tax + shipping;

    return (
      <div className="print-view-container min-h-screen text-slate-900 font-sans print-body flex flex-col items-center justify-center">
        {/* Styles Injection */}
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600;700&family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap');
          .print-view-container { font-family: 'Inter', sans-serif; }
          .font-outfit { font-family: 'Outfit', sans-serif; }
          .font-mono { font-family: 'Fira Code', monospace; }
          @media screen {
            .print-body { background-color: #f8fafc; padding: 40px 20px; }
            .a4-page {
              width: 210mm;
              height: 297mm;
              background: white;
              box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              position: relative;
              box-sizing: border-box;
              padding: 20mm;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
          }
          @media print {
            .print-hidden { display: none !important; }
            html, body { margin: 0 !important; padding: 0 !important; background: white !important; }
            .print-body { padding: 0 !important; }
            .a4-page {
              width: 210mm;
              height: 297mm;
              margin: 0 !important;
              padding: 20mm !important;
              box-shadow: none !important;
              border: none !important;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
          }
        `}} />

        {/* Print controls */}
        <div className="print-hidden w-full max-w-[210mm] flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
           <button onClick={() => window.close()} className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer">
             <ArrowLeft size={14} /> Close
           </button>
           <button onClick={() => window.print()} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded shadow-sm flex items-center gap-2 font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer">
             <Printer size={13} /> Print Slip / Save PDF
           </button>
        </div>

        {/* Slip Document */}
        <div className="a4-page relative flex flex-col justify-between">
          <div>
            {/* Logo and title */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 text-white p-2 rounded">
                  <Beaker size={28} className="stroke-[2.5]" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight leading-none text-slate-900 font-outfit">KHUSH ENTERPRISES</h1>
                  <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mt-1 font-outfit">Laboratory Infrastructure & Ortho Aids</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-black text-slate-950 tracking-wider uppercase font-outfit">ORDER CONFIRMATION SLIP</h2>
                <p className="text-xs text-slate-500 font-mono mt-1">ID: {order.id}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{order.date}</p>
              </div>
            </div>

            {/* Billing/Shipping details */}
            <div className="grid grid-cols-2 gap-8 mb-8 text-xs">
              <div>
                <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2 font-outfit">CUSTOMER DETAILS</h3>
                <p className="font-extrabold text-slate-800 text-sm mb-1">{order.customer}</p>
                {order.email && <p className="text-slate-600 mb-0.5">Email: {order.email}</p>}
                {order.phone && <p className="text-slate-600">Phone: {order.phone}</p>}
              </div>
              <div>
                <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-2 font-outfit">SHIPPING ADDRESS</h3>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {order.address},<br />
                  {order.city}, {order.state} - {order.pincode}
                </p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-slate-50 border border-slate-200 rounded p-4 mb-8 text-xs grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px] mb-1">PAYMENT METHOD</span>
                <span className="font-extrabold text-slate-800 text-sm flex items-center gap-1">
                  {order.payment}
                </span>
                {order.payment.includes("UPI") && (
                  <p className="text-slate-500 text-[10px] mt-1">Paid to: immalhotra57-2@okhdfcbank</p>
                )}
                {order.payment.includes("COD") && (
                  <p className="text-slate-500 text-[10px] mt-1">Please pay the delivery partner at the door.</p>
                )}
              </div>
              <div>
                <span className="text-slate-400 block font-bold uppercase tracking-wider text-[9px] mb-1">ORDER STATUS</span>
                <span className="font-black text-emerald-600 text-sm uppercase tracking-wider font-outfit bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {order.status === "Placed" ? "CONFIRMED & RECEIVED" : order.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <h3 className="font-bold text-slate-800 uppercase tracking-widest text-[10px] mb-3 border-b border-slate-200 pb-1 font-outfit">ORDER ITEMS</h3>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-400 font-bold">
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-center w-16">Qty</th>
                    <th className="py-2 text-right w-24">Unit Price</th>
                    <th className="py-2 text-right w-28">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item: any, idx: number) => (
                      <tr key={idx} className="text-slate-800">
                        <td className="py-3 font-bold">{item.title}</td>
                        <td className="py-3 text-center">{item.quantity}</td>
                        <td className="py-3 text-right">₹{item.price.toLocaleString("en-IN")}</td>
                        <td className="py-3 text-right font-extrabold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="text-slate-800">
                      <td className="py-3 font-bold">Scientific Equipment Consignment</td>
                      <td className="py-3 text-center">1</td>
                      <td className="py-3 text-right">₹{subtotal.toLocaleString("en-IN")}</td>
                      <td className="py-3 text-right font-extrabold">₹{subtotal.toLocaleString("en-IN")}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Financial breakdown */}
            <div className="flex justify-end text-xs">
              <div className="w-64 space-y-2 font-medium">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal MRP</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Estimated GST (18%)</span>
                  <span>₹{tax.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-500 pb-2 border-b border-slate-200">
                  <span>Shipping Fee</span>
                  <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-1 font-outfit">
                  <span>Total Payable</span>
                  <span>₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stamp, seal and signature */}
          <div className="flex justify-between items-end border-t border-slate-200 pt-8 mt-auto">
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
              Verification Code: {order.id.replace("KE-", "KE-VERIFY-")}<br />
              Authorized Digital Signature Matrix
            </div>
            <div className="text-center relative">
              <div className="w-24 h-24 border-2 border-dashed border-blue-500/20 rounded-full flex flex-col items-center justify-center -rotate-12 absolute -top-12 right-4 pointer-events-none opacity-40 select-none bg-white">
                <span className="text-[8px] font-bold text-blue-500">KHUSH ENTERPRISES</span>
                <span className="text-[9px] font-black text-blue-600 tracking-wider">VERIFIED</span>
                <span className="text-[7px] text-blue-500">B2B PROCUREMENT</span>
              </div>
              <div className="w-32 h-[1px] bg-slate-350 mx-auto mb-2"></div>
              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold font-outfit">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="print-view-container min-h-screen text-slate-900 font-sans print-body">
      {/* Styles Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600;700&family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap');

        .print-view-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .font-outfit {
          font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
        }

        .font-mono {
          font-family: 'Fira Code', monospace;
        }

        /* Screen Simulated View */
        @media screen {
          .print-body {
            background-color: #f8fafc; /* Slate 50 */
            padding: 40px 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
          }
          .a4-page {
            width: 210mm;
            height: 297mm;
            background: white;
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            margin-bottom: 40px;
            position: relative;
            box-sizing: border-box;
            padding: 16mm 18mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        }

        /* Print View */
        @media print {
          .print-hidden {
            display: none !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-body {
            padding: 0 !important;
            background: none !important;
          }
          .a4-page {
            width: 210mm;
            height: 297mm;
            margin: 0 !important;
            padding: 16mm 18mm !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            page-break-after: always;
            page-break-inside: avoid;
            box-sizing: border-box;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        }

        /* Table of Contents Dots */
        .toc-list {
          padding: 0;
          margin: 0;
          list-style: none;
        }
        .toc-item {
          display: flex;
          align-items: flex-end;
          margin-bottom: 14px;
          font-size: 13px;
        }
        .toc-name {
          font-weight: 700;
          color: #1e293b; /* Slate 800 */
          padding-right: 8px;
          background: white;
          font-family: 'Outfit', sans-serif;
          letter-spacing: -0.01em;
        }
        .toc-dots {
          flex-grow: 1;
          border-bottom: 2px dotted #cbd5e1; /* Slate 300 */
          margin-bottom: 3px;
        }
        .toc-page {
          font-family: 'Fira Code', monospace;
          font-weight: 700;
          color: #0f172a; /* Slate 900 */
          padding-left: 8px;
          background: white;
        }
      `}} />

      {/* Print / Action bar (hidden in final PDF print layout) */}
      <div className="print-hidden w-full max-w-[210mm] flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
         <button 
           onClick={() => window.close()}
           className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
         >
           <ArrowLeft size={14} /> Close Preview
         </button>
         <div className="text-xs text-slate-600 font-semibold font-outfit">
           Document Frame: <strong className="text-slate-900 font-bold">{catalogue?.title || decodedFileName}</strong>
         </div>
         <button 
           onClick={() => window.print()} 
           className="bg-slate-900 hover:bg-slate-800 text-theme px-4 py-2 rounded shadow-sm flex items-center gap-2 font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
         >
           <Printer size={13} /> Print/Save PDF
         </button>
      </div>

      {/* Pages Container */}
      <div className="flex flex-col items-center w-full">
        {pages.map((page, idx) => {
          if (page.type === "cover") {
            return (
              <div key={idx} className="a4-page relative flex flex-col justify-between" id="page-1">
                {/* Top Header */}
                <div className="flex justify-between items-start border-b border-slate-900 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-900 text-theme p-2 rounded">
                      <Beaker size={24} className="stroke-[2.5]" />
                    </div>
                    <div>
                      <h1 className="text-xl font-black tracking-tight leading-none text-slate-900 font-outfit">KHUSH ENTERPRISES</h1>
                      <p className="text-[8px] uppercase tracking-widest text-slate-500 font-bold mt-1 font-outfit">Laboratory Infrastructure & Ortho Aids</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-extrabold text-slate-800 tracking-wider uppercase font-outfit">Official Product Catalogue</p>
                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">{coverVolume} | {coverDate}</p>
                  </div>
                </div>

                {/* Main Cover Banner & Centered Titles */}
                <div className="my-auto flex flex-col items-center w-full">
                  <div className="w-full h-[240px] relative overflow-hidden rounded border border-slate-200 mb-6 bg-slate-50 flex items-center justify-center">
                    <img 
                      src={getCoverImage()} 
                      alt="Catalogue Cover" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1576086213369-97a306dca665?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  </div>
                  
                  <div className="text-center max-w-xl mx-auto">
                    <div className="inline-block bg-slate-100 text-slate-800 text-[9px] font-black tracking-widest px-3 py-1 rounded-full uppercase mb-4 font-outfit">
                      Portfolio Reference Matrix
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-tight font-outfit">
                      {coverTitle}
                    </h2>
                    <p className="text-xs text-slate-500 mt-3 leading-relaxed max-w-lg mx-auto">
                      {coverSubtitle}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="w-16 h-1 bg-slate-900 mx-auto my-8"></div>

                  {/* Table of Contents */}
                  <div className="w-full max-w-md mx-auto">
                    <h3 className="text-[10px] font-black text-slate-900 tracking-widest uppercase mb-4 text-center font-outfit">
                      TABLE OF CONTENTS
                    </h3>
                    {Object.keys(categoryPageMap).length === 0 ? (
                      <p className="text-xs text-center text-slate-400 italic">No category mappings found in current export.</p>
                    ) : (
                      <ul className="toc-list">
                        {Object.keys(categoryPageMap).map((catName, cIdx) => (
                          <li key={catName} className="toc-item">
                            <span className="toc-name">{String(cIdx + 1).padStart(2, "0")}.0 {catName.toUpperCase()}</span>
                            <span className="toc-dots"></span>
                            <span className="toc-page">PAGE {String(categoryPageMap[catName]).padStart(2, "0")}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Cover Page Footer */}
                <div className="border-t border-slate-200 pt-4 flex justify-between items-center text-[8px] font-mono text-slate-500 uppercase tracking-wider">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1"><Globe size={9} /> khushenterprises.com</span>
                    <span className="flex items-center gap-1"><Mail size={9} /> sales@khushenterprises.com</span>
                    <span className="flex items-center gap-1"><Phone size={9} /> +91 97294 57762</span>
                  </div>
                  <div>
                    PAGE 01
                  </div>
                </div>
              </div>
            );
          } else {
            const { categoryName, categoryIndex, primary, secondary, pageNum } = page;

            const primaryImg1 = primary.images?.[0] || "";
            const primaryImg2 = primary.images?.[1] || primary.images?.[0] || "";
            const primaryImg3 = primary.images?.[2] || primary.images?.[0] || "";

            const secondaryImg = secondary?.images?.[0] || "";

            return (
              <div key={idx} className="a4-page relative flex flex-col justify-between" id={`page-${pageNum}`}>
                {/* Category Header */}
                <div className="flex justify-between items-center border-b-2 border-slate-900 pb-2 mb-4">
                  <div>
                    <h2 className="text-xs font-black tracking-tight text-slate-900 uppercase font-outfit">
                      {categoryIndex}.0 {categoryName?.toUpperCase()}
                    </h2>
                    <p className="text-[8px] text-slate-500 uppercase font-mono tracking-wider">Khush Enterprises • Product Catalogue</p>
                  </div>
                  <div className="bg-slate-900 text-theme px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase font-outfit">
                    KE Quality Assured
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow flex flex-col justify-between">
                  
                  {/* Primary Product Block (Top Half) */}
                  <div className="flex flex-col flex-grow justify-start">
                    <div className="flex gap-5">
                      {/* Left: Product Images */}
                      <div className="w-[180px] flex-shrink-0 flex flex-col gap-2">
                        <div className="w-[180px] h-[160px] border border-slate-200 rounded p-1.5 bg-theme flex items-center justify-center overflow-hidden">
                          <img 
                            src={getImageUrl(primaryImg1)} 
                            alt={primary.title} 
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80";
                            }}
                          />
                        </div>
                        <div className="flex gap-2">
                          <div className="w-[86px] h-[60px] border border-slate-200 rounded p-1 bg-theme flex items-center justify-center overflow-hidden">
                            <img 
                              src={getImageUrl(primaryImg2)} 
                              alt="Detail 1" 
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80";
                              }}
                            />
                          </div>
                          <div className="w-[86px] h-[60px] border border-slate-200 rounded p-1 bg-theme flex items-center justify-center overflow-hidden">
                            <img 
                              src={getImageUrl(primaryImg3)} 
                              alt="Detail 2" 
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80";
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Product Details & Specs */}
                      <div className="flex-grow flex flex-col justify-between min-h-[228px]">
                        <div>
                          {/* Badges */}
                          <div className="flex gap-1.5 mb-1.5 flex-wrap">
                            <span className={`text-[7px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase font-outfit ${
                              primary.stock > 0 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                            }`}>
                              {primary.stock > 0 ? "IN STOCK" : "PRE-ORDER"}
                            </span>
                            <span className="bg-slate-100 text-slate-800 text-[7px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase flex items-center gap-0.5 font-outfit">
                              <Award size={8} className="stroke-[2]" /> ISO 9001
                            </span>
                            {primary.tag && (
                              <span className="bg-blue-100 text-blue-800 text-[7px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase font-outfit">
                                {primary.tag}
                              </span>
                            )}
                          </div>

                          <h3 className="text-sm font-bold text-slate-900 leading-tight font-outfit">
                            {primary.title}
                          </h3>
                          <p className="text-[8px] text-slate-400 font-mono mt-0.5">
                            SKU: {primary.sku || `KE-${primary.id.toUpperCase()}`}
                          </p>
                          <p className="text-[10px] text-slate-500 leading-relaxed mt-2 text-justify line-clamp-3">
                            {primary.description}
                          </p>
                        </div>

                        {/* Bordered Pricing Box */}
                        <div className="border border-slate-350 rounded bg-slate-50 p-2 mt-2">
                          <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="border-r border-slate-200 pr-1">
                              <p className="text-[7px] uppercase tracking-wider text-slate-400 font-bold">Standard Price</p>
                              <p className="text-xs font-black text-slate-950 mt-0.5">
                                ₹{primary.price?.toLocaleString("en-IN") || "0"}
                              </p>
                            </div>
                            <div className="pl-1">
                              <p className="text-[7px] uppercase tracking-wider text-slate-400 font-bold">
                                Bulk Rate (MOQ: {primary.moq || 5})
                              </p>
                              <p className="text-xs font-black text-emerald-700 mt-0.5">
                                ₹{primary.bulkPrice ? primary.bulkPrice.toLocaleString("en-IN") : Math.round(primary.price * 0.9).toLocaleString("en-IN")}
                              </p>
                            </div>
                          </div>
                          <p className="text-[7px] text-center text-slate-400 font-bold mt-1 uppercase tracking-tight">
                            Excluding 18% GST • Standard Delivery Clearance Applies
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Technical Specifications Section */}
                    <div className="mt-4">
                      <h4 className="text-[9px] font-black text-slate-800 tracking-wider uppercase mb-1.5 border-b border-slate-200 pb-0.5 font-outfit">
                        TECHNICAL SPECIFICATIONS
                      </h4>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[9px] font-medium text-slate-700">
                        {getProductSpecs(primary).map((spec, sIdx) => (
                          <div key={sIdx} className="flex justify-between py-0.5 border-b border-slate-100">
                            <span className="text-slate-400 font-bold">{spec.label}</span>
                            <span className="text-slate-900 font-mono text-right truncate max-w-[170px]">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Separator between Primary and Secondary Blocks */}
                  <div className="border-t border-dashed border-slate-300 my-4"></div>

                  {/* Secondary Product Block (Bottom Half) */}
                  {secondary ? (
                    <div className="h-[95px] flex gap-4 items-center mb-1">
                      {/* Small Image */}
                      <div className="w-[80px] h-[80px] border border-slate-200 rounded p-1 bg-theme flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img 
                          src={getImageUrl(secondaryImg)} 
                          alt={secondary.title} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80";
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow flex flex-col justify-between h-full py-0.5">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xs font-bold text-slate-950 leading-none font-outfit">
                                {secondary.title}
                              </h3>
                              <p className="text-[8px] text-slate-400 font-mono mt-0.5">
                                SKU: {secondary.sku || `KE-${secondary.id.toUpperCase()}`}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[7px] uppercase tracking-wider text-slate-400 font-bold">Wholesale Price</p>
                              <p className="text-xs font-black text-slate-950 leading-none mt-0.5">
                                ₹{secondary.price?.toLocaleString("en-IN") || "0"}
                              </p>
                            </div>
                          </div>
                          <p className="text-[9px] text-slate-500 mt-1 leading-normal line-clamp-2 text-justify">
                            {secondary.description}
                          </p>
                        </div>
                        <div className="flex justify-between items-center text-[7px] font-bold text-slate-400 uppercase tracking-wider">
                          <span>Minimum Order Quantity: {secondary.moq || 5} units</span>
                          <span className="flex items-center gap-0.5 text-slate-500"><Award size={8} /> ISO Certified</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[95px] flex items-center justify-center border border-dashed border-slate-100 rounded text-[8px] text-slate-300 uppercase tracking-widest font-black mb-1">
                      End of Section
                    </div>
                  )}
                </div>

                {/* Page Footer */}
                <div className="border-t border-slate-200 pt-4 flex justify-between items-center text-[8px] font-mono text-slate-500 uppercase tracking-wider mt-2">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1"><Globe size={9} /> khushenterprises.com</span>
                    <span className="flex items-center gap-1"><Mail size={9} /> sales@khushenterprises.com</span>
                    <span className="flex items-center gap-1"><Phone size={9} /> +91 97294 57762</span>
                  </div>
                  <div>
                    PAGE {String(pageNum).padStart(2, "0")}
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default function PrintReadyView() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 text-slate-800 p-10 flex items-center justify-center font-bold font-sans">Loading Catalog Templates...</div>}>
      <PrintContent />
    </Suspense>
  );
}
