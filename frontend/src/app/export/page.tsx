"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Package, FileText, ShieldCheck, TrendingUp, Zap, ArrowRight, ChevronRight } from "lucide-react";

// ---------- 3D Rotating Container (Canvas) ----------
function KE3DContainer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const CX = W / 2;
    const CY = H / 2;

    // Isometric-style box vertices
    const BOX_W = 140;
    const BOX_H = 80;
    const BOX_D = 100;

    function project(x: number, y: number, z: number, angleY: number) {
      const cos = Math.cos(angleY);
      const sin = Math.sin(angleY);
      const rx = x * cos - z * sin;
      const rz = x * sin + z * cos;
      const scale = 1 + rz / 400;
      return {
        sx: CX + rx * scale,
        sy: CY - y * scale + rz * 0.15,
        scale,
      };
    }

    function drawFace(
      pts: Array<{ x: number; y: number; z: number }>,
      fill: string,
      stroke: string,
      angle: number
    ) {
      if (!ctx) return;
      const projected = pts.map((p) => project(p.x, p.y, p.z, angle));
      ctx.beginPath();
      ctx.moveTo(projected[0].sx, projected[0].sy);
      for (let i = 1; i < projected.length; i++) {
        ctx.lineTo(projected[i].sx, projected[i].sy);
      }
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    function drawText(angle: number) {
      if (!ctx) return;
      const p = project(0, 0, 0, angle);
      const cos = Math.cos(angle);
      // Only draw KE text on front face when visible
      if (cos > 0) {
        ctx.save();
        ctx.translate(p.sx, p.sy);
        ctx.font = `bold ${32 * p.scale}px monospace`;
        ctx.fillStyle = `rgba(252, 211, 77, ${cos})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("KE", 0, 0);
        ctx.restore();
      }
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      const a = angleRef.current;

      const hw = BOX_W / 2;
      const hh = BOX_H / 2;
      const hd = BOX_D / 2;

      // Front face
      drawFace(
        [
          { x: -hw, y: -hh, z: hd },
          { x: hw, y: -hh, z: hd },
          { x: hw, y: hh, z: hd },
          { x: -hw, y: hh, z: hd },
        ],
        "rgba(30,30,30,0.95)",
        "rgba(252,211,77,0.6)",
        a
      );

      // Top face
      drawFace(
        [
          { x: -hw, y: -hh, z: -hd },
          { x: hw, y: -hh, z: -hd },
          { x: hw, y: -hh, z: hd },
          { x: -hw, y: -hh, z: hd },
        ],
        "rgba(50,50,50,0.95)",
        "rgba(252,211,77,0.4)",
        a
      );

      // Right face
      drawFace(
        [
          { x: hw, y: -hh, z: -hd },
          { x: hw, y: -hh, z: hd },
          { x: hw, y: hh, z: hd },
          { x: hw, y: hh, z: -hd },
        ],
        "rgba(20,20,20,0.95)",
        "rgba(252,211,77,0.3)",
        a
      );

      // Left face
      drawFace(
        [
          { x: -hw, y: -hh, z: -hd },
          { x: -hw, y: -hh, z: hd },
          { x: -hw, y: hh, z: hd },
          { x: -hw, y: hh, z: -hd },
        ],
        "rgba(15,15,15,0.95)",
        "rgba(252,211,77,0.2)",
        a
      );

      // Bottom face
      drawFace(
        [
          { x: -hw, y: hh, z: -hd },
          { x: hw, y: hh, z: -hd },
          { x: hw, y: hh, z: hd },
          { x: -hw, y: hh, z: hd },
        ],
        "rgba(10,10,10,0.95)",
        "rgba(252,211,77,0.15)",
        a
      );

      // Back face
      drawFace(
        [
          { x: -hw, y: -hh, z: -hd },
          { x: hw, y: -hh, z: -hd },
          { x: hw, y: hh, z: -hd },
          { x: -hw, y: hh, z: -hd },
        ],
        "rgba(25,25,25,0.95)",
        "rgba(252,211,77,0.25)",
        a
      );

      // Draw KE text on front face
      drawText(a);

      // Draw corner bolts (dots)
      const corners = [
        { x: -hw + 10, y: -hh + 10, z: hd },
        { x: hw - 10, y: -hh + 10, z: hd },
        { x: hw - 10, y: hh - 10, z: hd },
        { x: -hw + 10, y: hh - 10, z: hd },
      ];
      const cos = Math.cos(a);
      corners.forEach((c) => {
        const p = project(c.x, c.y, c.z, a);
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(252,211,77,${Math.max(0, cos) * 0.8})`;
        ctx.fill();
      });

      // Glow under box (shadow ellipse)
      const center = project(0, hh + 5, 0, a);
      const grad = ctx.createRadialGradient(
        center.sx, center.sy + 10, 5,
        center.sx, center.sy + 10, 120
      );
      grad.addColorStop(0, "rgba(252,211,77,0.12)");
      grad.addColorStop(1, "rgba(252,211,77,0)");
      ctx.beginPath();
      ctx.ellipse(center.sx, center.sy + 10, 120, 20, 0, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    function animate() {
      angleRef.current += 0.008;
      draw();
      animRef.current = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Mouse drag interaction
  const isDragging = useRef(false);
  const lastX = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastX.current;
    angleRef.current += dx * 0.01;
    lastX.current = e.clientX;
  };
  const onMouseUp = () => { isDragging.current = false; };

  return (
    <canvas
      ref={canvasRef}
      width={340}
      height={260}
      className="cursor-grab active:cursor-grabbing select-none"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{ touchAction: "none" }}
    />
  );
}

// ---------- Stats ----------
const STATS = [
  { label: "Countries Served", value: "48+", icon: Globe },
  { label: "Export Consignments", value: "1,200+", icon: Package },
  { label: "Active Certifications", value: "12", icon: ShieldCheck },
  { label: "YoY Growth", value: "34%", icon: TrendingUp },
];

// ---------- Features ----------
const FEATURES = [
  {
    icon: Globe,
    title: "Global Reach",
    desc: "Established supply chains across 48+ countries including Middle East, Africa, South-East Asia, and Europe with compliant freight routing.",
  },
  {
    icon: Zap,
    title: "Absolute Precision",
    desc: "Precision-engineered products cleared for international freight. All items comply with G2G logistics standards and dual-use regulations.",
  },
  {
    icon: ShieldCheck,
    title: "Telemetry",
    desc: "End-to-end shipment tracking with real-time telemetry, customs documentation automation, and proactive status notifications.",
  },
  {
    icon: FileText,
    title: "Export Certification",
    desc: "Fully accredited under ISO 9001:2015. Every consignment is accompanied by a certified export declaration and quality assurance record.",
  },
];

// ---------- Main Page ----------
export default function ExportPage() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[680px] flex items-center overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-brand-yellow/5 blur-[140px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-electric-blue/8 blur-[100px] rounded-full" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#fcd34d 1px, transparent 1px), linear-gradient(90deg, #fcd34d 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container mx-auto px-4 lg:px-8 relative z-10 py-16 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-brand-yellow/30 bg-brand-yellow/10 text-brand-yellow text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full mb-6 uppercase">
              <div className="w-1.5 h-1.5 bg-brand-yellow rounded-full animate-pulse" />
              KHUSH GLOBAL EXPORT
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-[1.05] tracking-tight">
              Khush Global<br />
              <span className="text-brand-yellow">Export</span>
            </h1>
            <p className="text-gray-400 text-sm mb-2 tracking-wide">
              Ishan &amp; Vikas Malhotra, Proprietors ✦
            </p>
            <p className="text-gray-500 text-sm mb-10 max-w-md leading-relaxed">
              Precision-engineered goods cleared for international freight. Compliant G2G logistics, ISO-certified documentation, and global supply chains — all from a single desk.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/export/products">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-brand-yellow hover:bg-yellow-400 text-black px-6 py-3 rounded text-xs font-black uppercase tracking-wider transition-colors"
                >
                  <Package size={14} />
                  View Products
                </motion.button>
              </Link>

              <Link href="/export/enquiry">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-transparent border border-white/20 hover:border-brand-yellow/60 hover:text-brand-yellow text-gray-300 px-6 py-3 rounded text-xs font-black uppercase tracking-wider transition-all"
                >
                  <FileText size={14} />
                  Send Enquiry
                </motion.button>
              </Link>

              <Link href="/export/catalogue">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-transparent border border-white/20 hover:border-electric-blue/60 hover:text-electric-blue text-gray-300 px-6 py-3 rounded text-xs font-black uppercase tracking-wider transition-all"
                >
                  <Globe size={14} />
                  View Catalogue
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Right — 3D Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="relative">
              <KE3DContainer />
              <div className="absolute -inset-8 pointer-events-none">
                <div className="absolute inset-0 bg-brand-yellow/5 blur-[60px] rounded-full" />
              </div>
            </div>
            <p className="text-gray-600 text-[10px] font-mono mt-2 tracking-widest uppercase">
              ↔ Drag to rotate
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-y border-white/5 bg-[#0d0d0d]">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-black text-brand-yellow mb-1">{s.value}</div>
                <div className="text-gray-500 text-[10px] uppercase tracking-widest font-semibold">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="container mx-auto px-4 lg:px-8 py-20">
        <div className="mb-10">
          <div className="text-brand-yellow text-[10px] font-bold tracking-widest uppercase mb-2">INDUSTRIAL PRECISION</div>
          <h2 className="text-2xl md:text-3xl font-black text-white">KBL UNIFIED OPERATIONS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onMouseEnter={() => setActiveFeature(i)}
              onMouseLeave={() => setActiveFeature(null)}
              className={`group relative bg-[#111111] border rounded-xl p-6 cursor-default transition-all duration-300 ${
                activeFeature === i
                  ? "border-brand-yellow/40 shadow-[0_0_30px_rgba(252,211,77,0.1)]"
                  : "border-white/5"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors ${
                activeFeature === i ? "bg-brand-yellow/15 text-brand-yellow" : "bg-white/5 text-gray-500"
              }`}>
                <f.icon size={20} />
              </div>
              <h3 className="text-white font-bold text-base mb-2 group-hover:text-brand-yellow transition-colors">{f.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
              <div className={`absolute bottom-6 right-6 transition-all ${activeFeature === i ? "opacity-100" : "opacity-0"}`}>
                <ChevronRight size={16} className="text-brand-yellow" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="container mx-auto px-4 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-brand-yellow/10 via-brand-yellow/5 to-transparent border border-brand-yellow/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="text-white font-black text-xl mb-1">Ready to Export Globally?</h3>
            <p className="text-gray-400 text-sm">Submit your export enquiry and our logistics team will respond within 24 hours.</p>
          </div>
          <Link href="/export/enquiry">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 bg-brand-yellow hover:bg-yellow-400 text-black px-8 py-3.5 rounded text-xs font-black uppercase tracking-wider transition-colors whitespace-nowrap"
            >
              Submit Inquiry to Anvil
              <ArrowRight size={14} />
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
