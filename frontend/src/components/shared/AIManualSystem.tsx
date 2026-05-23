"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Zap, BrainCircuit, Image as ImageIcon } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function AIManualSystem({ sku = "SKU-9901X" }: { sku?: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [manualData, setManualData] = useState<{ title: string; safety: string; experiments: string[] } | null>(null);
  const manualRef = useRef<HTMLDivElement>(null);

  const generateManual = () => {
    setIsGenerating(true);
    // Simulate AI Generation
    setTimeout(() => {
      setManualData({
        title: "Advanced Spectrometer Protocol",
        safety: "Class 2 Laser Product. Wear protective eyewear (O.D. > 4).",
        experiments: [
          "Raman Spectroscopy of Carbon Nanotubes",
          "Fluorescence mapping of biological tissues",
        ],
      });
      setIsGenerating(false);
    }, 2000);
  };

  const exportPDF = async () => {
    if (!manualRef.current) return;
    const canvas = await html2canvas(manualRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`KE-Manual-${sku}.pdf`);
  };

  const exportImage = async () => {
    if (!manualRef.current) return;
    const canvas = await html2canvas(manualRef.current, { scale: 2 });
    const link = document.createElement("a");
    link.download = `KE-Manual-${sku}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const exportDOCX = () => {
    if (!manualData) return;
    const content = `
      Khush Enterprises - AI Manual
      Email: khushenterprisesupppy@gmail.com
      Phone: +91 9890011762, 9729457762
      ---------------------------------
      Title: ${manualData.title}
      SKU: ${sku}
      
      SAFETY WARNING:
      ${manualData.safety}
      
      EXPERIMENTS:
      ${manualData.experiments.map(e => "- " + e).join("\n")}
      
      Powered by Khush Enterprises Secure Core
    `;
    const blob = new Blob([content], { type: "application/msword" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `KE-Manual-${sku}.doc`;
    link.click();
  };

  return (
    <div className="glass-dark rounded-2xl p-8 max-w-3xl mx-auto my-12 border border-neon-cyan/20 box-glow">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-theme flex items-center gap-2">
            <BrainCircuit className="text-neon-cyan" />
            AI Manual Generator
          </h2>
          <p className="text-slate-400 mt-1">Real-time safety & protocol generation for {sku}</p>
        </div>
        <button
          onClick={generateManual}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan px-4 py-2 rounded-lg hover:bg-neon-cyan hover:text-deep-navy transition-all duration-300 disabled:opacity-50"
        >
          {isGenerating ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
              <Zap size={18} />
            </motion.div>
          ) : (
            <Zap size={18} />
          )}
          {isGenerating ? "Synthesizing..." : "Generate Data"}
        </button>
      </div>

      <div className="space-y-4 min-h-[200px]">
        {!manualData && !isGenerating && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 py-12">
            <FileText size={48} className="mb-4 opacity-50" />
            <p>Click generate to synthesize manuals using AI</p>
          </div>
        )}

        {isGenerating && (
          <div className="space-y-4">
            <div className="h-6 bg-slate-800 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-slate-800 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-slate-800 rounded animate-pulse w-5/6"></div>
          </div>
        )}

        {manualData && !isGenerating && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div ref={manualRef} className="bg-theme text-theme p-8 rounded-xl shadow-xl">
              <div className="border-b-2 border-theme pb-4 mb-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-theme text-theme font-bold flex items-center justify-center rounded-lg text-xl">KE</div>
                  <div>
                    <h1 className="text-2xl font-black">KHUSH ENTERPRISES</h1>
                    <p className="text-sm font-medium text-theme">Scientific Laboratory Equipment</p>
                  </div>
                </div>
                <div className="text-right text-xs text-theme font-medium">
                  <p>khushenterprisesupppy@gmail.com</p>
                  <p>+91 9890011762</p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-theme mb-4">Manual: {manualData.title}</h3>
              <p className="text-xs text-theme mb-6 font-mono">Product ID: {sku}</p>
              
              <div className="bg-red-50 p-4 border-l-4 border-red-500 mb-6">
                <h4 className="text-red-700 font-bold mb-1">SAFETY PRECAUTIONS</h4>
                <p className="text-red-900 text-sm font-mono">{manualData.safety}</p>
              </div>
              
              <div>
                <h4 className="font-bold border-b border-gray-300 pb-2 mb-3">Protocol / Experiments</h4>
                <ul className="space-y-2 list-disc pl-5">
                  {manualData.experiments.map((exp: string, idx: number) => (
                    <li key={idx} className="text-theme text-sm">{exp}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-12 text-center text-[10px] text-theme border-t pt-4">
                Generated securely via Khush Enterprises AI Core. © {new Date().getFullYear()}
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-4 border-t border-slate-800">
              <button onClick={exportImage} className="flex items-center gap-2 bg-slate-800 text-theme px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
                <ImageIcon size={16} /> Export Image
              </button>
              <button onClick={exportDOCX} className="flex items-center gap-2 bg-slate-800 text-theme px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
                <FileText size={16} /> Export DOCX
              </button>
              <button onClick={exportPDF} className="flex items-center gap-2 bg-electric-blue text-theme px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-lg">
                <Download size={16} /> Export PDF
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
