"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Papa from "papaparse";
import { addProductsBulk, Product } from "@/lib/products";

export default function BulkUploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState<"idle" | "parsing" | "success" | "error">("idle");
  const [mode, setMode] = useState<"excel" | "direct">("excel");
  const [directRows, setDirectRows] = useState<any[]>([{ title: "", price: "", stock: "", sku: "" }]);
  const [message, setMessage] = useState("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setStatus("parsing");
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const newProducts: Product[] = results.data.map((row: any, idx: number) => ({
            id: `bulk-${Date.now()}-${idx}`,
            title: row.Title,
            description: "",
            price: Number(row.Price),
            originalPrice: row.OriginalPrice ? Number(row.OriginalPrice) : null,
            rating: 5.0,
            reviews: 0,
            icon: "Package",
            tag: "NEW",
            discount: null,
            stock: Number(row.Stock) || 0,
            category: row.Category || "Uncategorized",
            brand: row.Brand || "Khush Enterprises",
            sku: row.SKU || `KE-B-${Math.floor(Math.random() * 10000)}`,
            bulkPrice: row.BulkPrice ? Number(row.BulkPrice) : undefined,
            moq: row.MOQ ? Number(row.MOQ) : undefined,
          }));
          addProductsBulk(newProducts);
          setMessage(`Successfully imported ${newProducts.length} products.`);
          setStatus("success");
        } catch (err) {
          setMessage("Failed to parse CSV. Please check the template format.");
          setStatus("error");
        }
      },
      error: () => {
        setMessage("Failed to read the file.");
        setStatus("error");
      }
    });
  };

  const handleDirectAddRow = () => {
    setDirectRows([...directRows, { title: "", price: "", stock: "", sku: "" }]);
  };

  const handleDirectSubmit = () => {
    const validRows = directRows.filter(r => r.title && r.price);
    if (validRows.length === 0) return alert("Please fill at least one row with Title and Price.");

    const newProducts: Product[] = validRows.map((row, idx) => ({
      id: `direct-${Date.now()}-${idx}`,
      title: row.title,
      description: "",
      price: Number(row.price),
      originalPrice: null,
      rating: 5.0,
      reviews: 0,
      icon: "Package",
      tag: "NEW",
      discount: null,
      stock: Number(row.stock) || 0,
      category: "Uncategorized",
      brand: "Khush Enterprises",
      sku: row.sku || `KE-${Math.floor(Math.random() * 10000)}`
    }));

    addProductsBulk(newProducts);
    setDirectRows([{ title: "", price: "", stock: "", sku: "" }]);
    alert(`Successfully added ${newProducts.length} products!`);
  };

  return (
    <div className="text-slate-300 max-w-5xl mx-auto pb-20">
      <div className="mb-8 border-b border-theme/10 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-theme mb-1">Bulk Upload Inventory</h1>
          <p className="text-sm text-slate-400">Import hundreds of products at once using a CSV file or Direct UI. Perfect for updating B2B prices and MOQs.</p>
        </div>
        <div className="flex bg-theme/40 border border-theme/10 rounded-lg overflow-hidden p-1">
          <button
            onClick={() => setMode("excel")}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${mode === "excel" ? "bg-electric-blue text-theme" : "text-slate-400 hover:text-theme"}`}
          >
            Excel / CSV Mode
          </button>
          <button
            onClick={() => setMode("direct")}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${mode === "direct" ? "bg-electric-blue text-theme" : "text-slate-400 hover:text-theme"}`}
          >
            Direct Input Mode
          </button>
        </div>
      </div>

      {mode === "excel" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all bg-theme/80 shadow-lg relative overflow-hidden ${dragActive ? "border-electric-blue bg-electric-blue/5" : "border-slate-700 hover:border-slate-500"
                }`}
            >
              {status === "idle" && (
                <>
                  <UploadCloud size={64} className={`mx-auto mb-6 ${dragActive ? "text-electric-blue scale-110 transition-transform" : "text-slate-500"}`} />
                  <h3 className="text-xl font-bold text-theme mb-2">Drag & Drop CSV File Here</h3>
                  <p className="text-slate-400 mb-6">or click to browse your computer</p>
                  <label className="bg-theme/10 hover:bg-theme/20 text-theme px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors border border-theme/10 inline-block">
                    Select File
                    <input type="file" accept=".csv" className="hidden" onChange={handleChange} />
                  </label>
                </>
              )}

              {status === "parsing" && (
                <div className="flex flex-col items-center py-8">
                  <Loader2 size={48} className="text-electric-blue animate-spin mb-4" />
                  <h3 className="text-lg font-bold text-theme">Processing Data...</h3>
                  <p className="text-slate-400">Parsing rows and updating inventory database</p>
                </div>
              )}

              {status === "success" && (
                <div className="flex flex-col items-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-theme mb-2">Upload Successful!</h3>
                  <p className="text-slate-400 mb-6">{message}</p>
                  <button onClick={() => setStatus("idle")} className="text-electric-blue hover:underline font-medium">Upload Another File</button>
                </div>
              )}

              {status === "error" && (
                <div className="flex flex-col items-center py-8">
                  <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-theme mb-2">Upload Failed</h3>
                  <p className="text-red-400 mb-6">{message}</p>
                  <button onClick={() => setStatus("idle")} className="bg-theme/10 px-4 py-2 rounded text-theme hover:bg-theme/20 transition-colors">Try Again</button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass bg-theme/80 p-6 rounded-2xl border border-theme/5 shadow-lg">
              <h3 className="font-bold text-theme mb-4">CSV Template Format</h3>
              <p className="text-sm text-slate-400 mb-4">Please ensure your CSV file includes the following headers exactly as shown:</p>
              <ul className="space-y-2 text-xs font-mono text-neon-cyan bg-theme/40 p-4 rounded-lg border border-theme/5">
                <li>Title (Required)</li>
                <li>Price (Required)</li>
                <li>OriginalPrice</li>
                <li>Stock</li>
                <li>Category</li>
                <li>Brand</li>
                <li>SKU</li>
                <li className="text-green-400">BulkPrice (For B2B)</li>
                <li className="text-green-400">MOQ (For B2B)</li>
              </ul>
              <button className="mt-4 w-full bg-theme/5 hover:bg-theme/10 text-theme text-sm py-2 rounded border border-theme/10 transition-colors">
                Download Sample CSV
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-dark border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <h3 className="font-bold text-theme mb-4 flex justify-between items-center">
            <span>Direct Mode Bulk Listing</span>
            <button onClick={handleDirectAddRow} className="text-sm bg-theme/10 hover:bg-theme/20 px-3 py-1.5 rounded transition-colors border border-theme/10">+ Add Row</button>
          </h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-sm">
              <thead className="bg-theme border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="p-3 font-semibold w-12">#</th>
                  <th className="p-3 font-semibold">Title*</th>
                  <th className="p-3 font-semibold">Price (₹)*</th>
                  <th className="p-3 font-semibold">Stock</th>
                  <th className="p-3 font-semibold">SKU</th>
                </tr>
              </thead>
              <tbody>
                {directRows.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-800/50">
                    <td className="p-3 text-slate-500">{idx + 1}</td>
                    <td className="p-3">
                      <input type="text" value={row.title} onChange={e => {
                        const newRows = [...directRows]; newRows[idx].title = e.target.value; setDirectRows(newRows);
                      }} className="w-full bg-theme/40 border border-slate-700 rounded px-3 py-2 text-theme outline-none focus:border-neon-cyan" placeholder="Product Title" />
                    </td>
                    <td className="p-3">
                      <input type="number" value={row.price} onChange={e => {
                        const newRows = [...directRows]; newRows[idx].price = e.target.value; setDirectRows(newRows);
                      }} className="w-full bg-theme/40 border border-slate-700 rounded px-3 py-2 text-theme outline-none focus:border-neon-cyan" placeholder="Price" />
                    </td>
                    <td className="p-3">
                      <input type="number" value={row.stock} onChange={e => {
                        const newRows = [...directRows]; newRows[idx].stock = e.target.value; setDirectRows(newRows);
                      }} className="w-full bg-theme/40 border border-slate-700 rounded px-3 py-2 text-theme outline-none focus:border-neon-cyan" placeholder="Stock" />
                    </td>
                    <td className="p-3">
                      <input type="text" value={row.sku} onChange={e => {
                        const newRows = [...directRows]; newRows[idx].sku = e.target.value; setDirectRows(newRows);
                      }} className="w-full bg-theme/40 border border-slate-700 rounded px-3 py-2 text-theme outline-none focus:border-neon-cyan" placeholder="SKU" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end">
            <button onClick={handleDirectSubmit} className="bg-electric-blue hover:bg-blue-600 text-theme font-bold px-8 py-3 rounded-lg transition-colors">
              Save {directRows.length} Products
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
