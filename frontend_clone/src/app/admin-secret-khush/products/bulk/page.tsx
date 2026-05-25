"use client";

import { ArrowLeft, Download, UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Papa from "papaparse";
import { addProductsBulk, Product } from "@/lib/products";
import { useRouter } from "next/navigation";

export default function BulkUploadPage() {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [parsedProducts, setParsedProducts] = useState<Product[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const downloadTemplate = () => {
    const csvRows = [
      ["Product Name", "SKU", "Category", "Price", "Description", "HSN Code", "Image URL"],
      ["Premium Conical Flask 250ml", "KE-CF-250", "Chemistry Lab", "350.00", "High quality borosilicate glass conical flask graduated.", "7017", "https://images.unsplash.com/photo-1582719508461-905c673771fd"],
      ["Standard Digital Multimeter", "KE-DM-99", "Physics Lab", "1499.00", "Handheld digital multimeter with LCD display.", "9030", "https://images.unsplash.com/photo-1581092160607-ee22621dd758"],
      ["Advanced Biological Microscope", "KE-BM-100", "Microscopes", "14500.00", "High performance biological study microscope with digital eye.", "9011", "https://images.unsplash.com/photo-1516549655169-df83a0774514"]
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "khush_enterprises_bulk_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setUploadState("uploading");
    setProgress(10);
    setErrorMessage("");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        setProgress(50);
        setUploadState("processing");

        try {
          const rows = results.data as any[];
          const newProducts: Product[] = rows.map((row, index) => {
            const title = row["Product Name"] || row["title"] || "";
            const sku = row["SKU"] || row["sku"] || `KE-BLK-${Date.now().toString().slice(-4)}-${index}`;
            const category = row["Category"] || row["category"] || "Physics Lab";
            const price = Number(row["Price"] || row["price"]) || 0;
            const description = row["Description"] || row["description"] || "High precision scientific instrument.";
            const imageUrl = row["Image URL"] || row["ImageURL"] || row["image"] || "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=400";
            
            // Generate MRP as 20% higher automatically
            const originalPrice = price * 1.2;

            return {
              id: `p_bulk_${Date.now()}_${index}`,
              title,
              sku,
              category,
              price,
              originalPrice,
              description,
              rating: 4.7,
              reviews: Math.floor(Math.random() * 50 + 5),
              icon: category === "Physics Lab" ? "Scale" : category === "Chemistry Lab" ? "FlaskConical" : "Microscope",
              tag: "NEW",
              discount: "16% OFF",
              stock: 100,
              images: [imageUrl],
              brand: "Khush Enterprises",
              // Storefront visibility settings
              product_status: "active",
              edited_by_admin: true,
              createdAt: new Date().toISOString()
            };
          }).filter(p => p.title.length > 0);

          if (newProducts.length === 0) {
            throw new Error("No valid products found in the sheet. Make sure 'Product Name' column is present.");
          }

          // Optional: bulk POST to backend server
          try {
            const BASE_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
              ? `http://${window.location.hostname}:5000` 
              : '';
            await fetch(`${BASE_URL}/api/products/bulk`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ products: newProducts })
            });
          } catch (err) {
            console.log("Offline mode: direct save only");
          }

          setParsedProducts(newProducts);
          setProgress(100);
          setUploadState("success");
        } catch (error: any) {
          setErrorMessage(error.message || "Failed to parse CSV file.");
          setUploadState("error");
        }
      },
      error: (error) => {
        setErrorMessage(error.message || "Failed to upload file.");
        setUploadState("error");
      }
    });
  };

  const handlePublish = () => {
    if (parsedProducts.length > 0) {
      addProductsBulk(parsedProducts);
      alert(`Successfully published ${parsedProducts.length} new products to the B2B storefront!`);
      router.push("/admin-secret-khush/products");
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-theme mb-1">Add Bulk Listing</h1>
          <p className="text-theme text-sm">Upload multiple B2B equipment products simultaneously using a CSV template.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin-secret-khush/products" className="flex items-center gap-2 bg-theme border border-theme/5 hover:bg-theme/5 text-theme text-sm px-4 py-2.5 rounded transition-colors font-bold">
            <ArrowLeft size={16} /> Back to Products
          </Link>
          <button onClick={downloadTemplate} className="flex items-center gap-2 bg-theme text-[#4ade80] hover:bg-theme border border-theme/20 font-bold px-4 py-2.5 rounded text-sm transition-colors cursor-pointer">
            <Download size={16} /> Download CSV Template
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-theme border border-theme/5 rounded-lg p-6 mb-8 flex gap-8 items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 rounded-full bg-theme border border-theme/5 flex items-center justify-center text-[#8bceff] font-bold shrink-0">1</div>
          <div>
            <div className="text-theme font-bold text-sm mb-0.5">Download Template</div>
            <div className="text-xs text-theme">Get the pre-formatted CSV layout.</div>
          </div>
        </div>
        <div className="w-8 border-t border-theme/10"></div>
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 rounded-full bg-theme border border-theme/5 flex items-center justify-center text-[#8bceff] font-bold shrink-0">2</div>
          <div>
            <div className="text-theme font-bold text-sm mb-0.5">Fill Specs</div>
            <div className="text-xs text-theme">Input names, SKUs, and prices.</div>
          </div>
        </div>
        <div className="w-8 border-t border-theme/10"></div>
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 rounded-full bg-theme border border-theme/5 flex items-center justify-center text-[#8bceff] font-bold shrink-0">3</div>
          <div>
            <div className="text-theme font-bold text-sm mb-0.5">Upload & Publish</div>
            <div className="text-xs text-theme">Instant database listing sync.</div>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="bg-theme border border-theme/5 rounded-lg p-8">
        {!file ? (
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-16 text-center transition-all ${
              dragActive ? "border-theme bg-theme/5" : "border-theme/10 bg-theme hover:border-theme/20 hover:bg-theme"
            }`}
          >
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleChange} 
              className="hidden" 
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center h-full w-full">
              <UploadCloud size={48} className={`mb-4 ${dragActive ? "text-[#8bceff]" : "text-theme"}`} />
              <div className="text-lg font-bold text-theme mb-2">Drag and drop your completed CSV template here</div>
              <div className="text-sm text-theme mb-6">or <span className="text-[#8bceff] hover:underline">browse files</span> from your computer</div>
              <div className="text-xs text-theme">Max file size: 50MB. Supported format: .csv only</div>
            </label>
          </div>
        ) : (
          <div>
            <div className="bg-theme border border-theme/5 rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-theme text-[#4ade80] rounded">
                    <FileSpreadsheet size={24} />
                  </div>
                  <div>
                    <div className="text-theme font-bold mb-1">{file.name}</div>
                    <div className="text-xs text-theme">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                  </div>
                </div>
                {uploadState === "idle" && (
                  <button onClick={() => setFile(null)} className="text-theme hover:text-theme text-xs">Remove</button>
                )}
              </div>

              {uploadState !== "idle" && (
                <div className="mt-6">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-[#8bceff] font-bold">
                      {uploadState === "uploading" && "Reading CSV file..."}
                      {uploadState === "processing" && "Generating storefront payloads..."}
                      {uploadState === "success" && "Products Validated"}
                      {uploadState === "error" && "Error Parsing"}
                    </span>
                    <span className="text-theme">{progress}%</span>
                  </div>
                  <div className="w-full bg-theme h-2 rounded-full overflow-hidden border border-theme/5">
                    <div 
                      className={`h-full transition-all duration-200 ${
                        uploadState === "success" ? "bg-theme" : 
                        uploadState === "error" ? "bg-theme" : "bg-theme"
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {uploadState === "success" && (
              <div className="bg-theme border border-theme/20 rounded-lg p-4 flex items-center gap-3 text-[#4ade80] text-sm mb-6">
                <CheckCircle2 size={18} />
                <span>Successfully validated {parsedProducts.length} new items. Ready to publish on the customer storefront.</span>
              </div>
            )}

            {uploadState === "error" && (
              <div className="bg-theme border border-theme/20 rounded-lg p-4 flex items-center gap-3 text-[#ff4d4d] text-sm mb-6">
                <AlertCircle size={18} />
                <span>{errorMessage || "Failed to process the sheet. Please make sure the structure is correct."}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-theme/5 pt-6">
              <button 
                onClick={() => { setFile(null); setUploadState("idle"); setProgress(0); setParsedProducts([]); }} 
                className="px-4 py-2 text-sm font-bold text-theme hover:text-theme transition-colors"
                disabled={uploadState === "uploading" || uploadState === "processing"}
              >
                Cancel
              </button>
              {uploadState === "success" ? (
                <button 
                  onClick={handlePublish}
                  className="bg-theme hover:bg-theme text-theme px-6 py-2 rounded text-sm font-bold transition-colors cursor-pointer"
                >
                  Publish {parsedProducts.length} Products Live
                </button>
              ) : (
                <button 
                  onClick={handleUpload}
                  disabled={uploadState !== "idle"}
                  className="bg-theme hover:bg-theme disabled:opacity-50 text-theme px-6 py-2 rounded text-sm font-bold transition-colors cursor-pointer flex items-center gap-2"
                >
                  {uploadState === "uploading" && <Loader2 size={14} className="animate-spin" />}
                  Validate CSV Rows
                </button>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
