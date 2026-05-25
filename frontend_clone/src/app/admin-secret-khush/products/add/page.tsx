"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddProductPage() {
  return (
    <div className="max-w-6xl mx-auto pb-20 text-slate-300">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-theme/5">
        <div className="flex items-center gap-4">
          <Link href="/admin-secret-khush/products" className="p-2 bg-theme hover:bg-theme/10 rounded-lg transition-colors border border-theme/5">
            <ArrowLeft size={20} className="text-theme" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-theme mb-1">Add New Product</h1>
            <p className="text-sm text-theme">Configure product details and upload images.</p>
          </div>
        </div>
      </div>

      <div className="bg-theme border border-theme/10 rounded-xl p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-theme mb-2">Product Name</label>
            <input 
              type="text" 
              placeholder="Enter product name"
              className="w-full bg-theme border border-theme/10 rounded-lg px-4 py-3 text-theme outline-none focus:border-theme"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-theme mb-2">Price</label>
            <input 
              type="number" 
              placeholder="Enter selling price"
              className="w-full bg-theme border border-theme/10 rounded-lg px-4 py-3 text-theme outline-none focus:border-theme"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-theme mb-2">Category</label>
            <select className="w-full bg-theme border border-theme/10 rounded-lg px-4 py-3 text-theme outline-none focus:border-theme">
              <option>Glassware</option>
              <option>Laboratory Equipment</option>
              <option>Chemicals</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-theme mb-2">Description</label>
            <textarea 
              placeholder="Enter product description"
              rows={4}
              className="w-full bg-theme border border-theme/10 rounded-lg px-4 py-3 text-theme outline-none focus:border-theme"
            ></textarea>
          </div>

          <div className="flex gap-4">
            <Link href="/admin-secret-khush/products" className="px-6 py-2.5 rounded text-sm font-bold bg-theme border border-theme/10 hover:bg-theme/5 text-theme">
              Cancel
            </Link>
            <button className="px-6 py-2.5 rounded text-sm font-bold bg-theme text-theme hover:bg-theme">
              Save Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
