import { useEffect, useState, useRef } from "react";
import backgroundPhoto from "../../assets/sas/photo/bacground.jpeg";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Restaurant3DScene from "./Restaurant3DScene";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default function HeroSection() {
  const words = ["smarter,", "effortlessly,", "and profitably."];
  const [index, setIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const opacityParallax = useTransform(scrollYProgress, [0, 0.8], [1, 0.85]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden mt-[70px]">
      {/* 🌆 Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${backgroundPhoto})` }}
      />

      {/* 🌑 Deep Atmospheric Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617]/95 via-[#0B132B]/90 to-[#020617]/95" />

      {/* 🔥 Ambient Floating Glow Spheres */}
      <motion.div
        animate={{ y: [0, 25, 0], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-16 left-8 w-96 h-96 bg-orange-500/20 blur-[140px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, -25, 0], opacity: [0.15, 0.22, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 right-8 w-[420px] h-[420px] bg-cyan-500/18 blur-[150px] rounded-full pointer-events-none"
      />

      <div className="relative max-w-[1320px] mx-auto px-4 sm:px-6 md:px-10 xl:px-8">
        <motion.div
          style={{ y: yParallax, opacity: opacityParallax }}
          className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[88vh] py-10 lg:py-16"
        >
          {/* 🌟 Left Content (6 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 text-white space-y-6"
          >
            {/* Minimal High-Tech Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-orange-500/30 text-orange-400 text-xs font-semibold tracking-wide shadow-lg shadow-black/40 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
              <span>Next-Gen 3D Restaurant OS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black leading-[1.12] tracking-tight text-slate-100">
              Run your restaurant
              <br />
              <span className="relative inline-block text-orange-400">
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="inline-block"
                >
                  {words[index]}
                </motion.span>

                {/* Curved underline */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3"
                  viewBox="0 0 300 12"
                  fill="none"
                >
                  <path
                    d="M5 8C50 2 100 1 150 3C200 5 250 7 295 8"
                    stroke="#FB923C"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-normal">
              Connect POS billing, smart kitchen display, real-time table orders,
              and live analytics into one cohesive high-performance operating system.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 gap-3.5 pt-1 text-sm text-slate-300">
              <div className="flex items-center gap-2.5 bg-slate-900/40 border border-white/5 px-3 py-2 rounded-xl backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Real-Time KDS Sync</span>
              </div>
              <div className="flex items-center gap-2.5 bg-slate-900/40 border border-white/5 px-3 py-2 rounded-xl backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Instant Table Orders</span>
              </div>
              <div className="flex items-center gap-2.5 bg-slate-900/40 border border-white/5 px-3 py-2 rounded-xl backdrop-blur-sm">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Multi-branch POS</span>
              </div>
              <div className="flex items-center gap-2.5 bg-slate-900/40 border border-white/5 px-3 py-2 rounded-xl backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Live Analytics & Profit</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white transition px-7 py-3.5 rounded-2xl text-base font-semibold shadow-lg shadow-orange-500/30"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>

              <Link to="/services">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="border border-slate-700/80 cursor-pointer bg-slate-900/70 hover:bg-slate-800 hover:border-orange-500/50 hover:text-white px-7 py-3.5 rounded-2xl text-base font-semibold text-gray-300 transition backdrop-blur-md"
                >
                  Explore Features
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* 🎮 Right Side 3D Interactive Restaurant Hub (6 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            className="lg:col-span-6 w-full"
          >
            <Restaurant3DScene />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
