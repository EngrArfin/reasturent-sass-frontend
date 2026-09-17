/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  QrCode,
  ClipboardList,
  Utensils,
  Users,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Check,
} from "lucide-react";
import CommonWrapper from "@/common/CommonWrapper";
import { Link } from "react-router-dom";

// Type definitions
type Category = "All" | "Operations" | "Ordering" | "Management";

interface ServiceItem {
  icon: React.ComponentType<any>;
  title: string;
  category: Category;
  description: string;
  features: string[];
  color: string;
  badge?: string;
}

// 1. Static Configuration
const CATEGORIES: Category[] = ["All", "Operations", "Ordering", "Management"];

const SERVICES_DATA: ServiceItem[] = [
  {
    icon: Monitor,
    title: "Cloud Billing & POS System",
    category: "Operations",
    description:
      "Supercharge your checkout with our offline-first cloud billing system. Manage tables, split checks, and process payments instantly.",
    features: [
      "Offline Mode Support",
      "Table & Floor Mapping",
      "Split Bills & Tip Management",
    ],
    color: "from-orange-500 to-amber-500",
    badge: "Popular",
  },
  {
    icon: QrCode,
    title: "Contactless QR Code Menu",
    category: "Ordering",
    description:
      "Enable contactless self-ordering. Customers simply scan the table QR code, browse your rich visual menu, order, and pay directly.",
    features: [
      "Real-time Price Sync",
      "No App Download Needed",
      "Multi-lingual Support",
    ],
    color: "from-blue-500 to-indigo-500",
    badge: "High Growth",
  },
  {
    icon: ClipboardList,
    title: "Inventory & Recipe Management",
    category: "Management",
    description:
      "Track raw ingredient stock levels in real-time. Calculate recipe costs, set automatic re-ordering thresholds, and cut food waste.",
    features: [
      "Batch Expiry Alerts",
      "Auto Purchase Orders",
      "Recipe Costing & Margins",
    ],
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Utensils,
    title: "Kitchen Display System (KDS)",
    category: "Operations",
    description:
      "Go paperless and streamline operations. Route orders instantly from POS or QR Menu to smart kitchen screens with prep-timer tracking.",
    features: [
      "Color-coded Prep Alerts",
      "Item Consolidation",
      "Cook Time Analysis",
    ],
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: Users,
    title: "Staff & Shift Scheduling",
    category: "Management",
    description:
      "Manage employee shifts, roles, and access levels. Track server attendance, log clock-ins, and calculate tips dynamically.",
    features: [
      "Advanced Role Permissions",
      "Tip Pool Allocation",
      "Payroll Reports Export",
    ],
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: TrendingUp,
    title: "Live Analytics & Sales Reports",
    category: "Management",
    description:
      "Gain complete visibility into business metrics. Monitor sales patterns, Peak Hours, and waiter efficiency from any device.",
    features: [
      "Multi-outlet Comparison",
      "Peak-hour Traffic Audits",
      "Daily Summary Emails",
    ],
    color: "from-cyan-500 to-blue-500",
    badge: "Essential",
  },
];

// 2. Services Component
const Services = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  // Filter services logic
  const filteredServices = SERVICES_DATA.filter(
    (service) =>
      activeCategory === "All" || service.category === activeCategory,
  );

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#07090D] via-[#0B0F17] to-[#07090D] py-20 md:py-28 text-white">
      {/* Ambient Background Glows */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-orange-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />

      <CommonWrapper className="relative z-10">
        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-orange-500/10 border border-orange-500/25 text-orange-400">
            <Sparkles className="size-3.5" />
            Our Modules & Services
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Tailored Modules to Scale Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Restaurant</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 leading-relaxed">
            Everything you need to automate billing, streamline kitchen
            operations, and drive customer retention. Choose the tools that fit
            your business model.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-14">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer border ${
                activeCategory === category
                  ? "bg-gradient-to-r from-orange-500 to-[#F54900] text-white border-orange-500/50 shadow-lg shadow-orange-500/25 scale-105"
                  : "bg-white/[0.04] text-slate-300 border-white/10 hover:border-orange-500/30 hover:bg-white/[0.08]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Services Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  layout
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 hover:border-orange-500/40 hover:bg-white/[0.06] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg shadow-black/20 hover:shadow-[0_12px_35px_rgba(239,104,32,0.12)]"
                >
                  {/* Color border accent */}
                  <div
                    className={`h-1.5 w-full bg-gradient-to-r ${service.color}`}
                  />

                  <div className="p-6 md:p-8 space-y-6 flex-grow">
                    {/* Card Header (Icon & Badge) */}
                    <div className="flex justify-between items-start">
                      <div
                        className={`flex items-center justify-center size-12 rounded-xl bg-gradient-to-br ${service.color} text-white shadow-md shadow-orange-500/15 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className="size-6" />
                      </div>
                      {service.badge && (
                        <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/25">
                          {service.badge}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2.5 pt-3 border-t border-white/5">
                      {service.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2.5 text-xs text-slate-300"
                        >
                          <div className="size-4 flex items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
                            <Check className="size-2.5" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-5 bg-white/[0.02] border-t border-white/10 flex items-center justify-between group-hover:bg-white/[0.04] transition-all duration-300">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {service.category}
                    </span>
                    <Link
                      to="/contact"
                      className="flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
                    >
                      Get Started
                      <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Promotional Consultation Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 bg-gradient-to-r from-orange-500/90 via-[#F54900] to-amber-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-orange-400/30"
        >
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-black/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
                Want to Custom-Build Your Modules?
              </h3>
              <p className="text-sm md:text-base text-white/90 max-w-2xl leading-relaxed">
                Our modular architecture allows you to choose exactly what your
                restaurant needs. Start small with a simple POS and scale up to
                multi-outlet inventory whenever you are ready.
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <Link
                to="/contact"
                className="inline-block bg-slate-950 hover:bg-slate-900 text-white border border-white/15 font-bold px-8 py-3.5 rounded-xl shadow-xl transition duration-300 hover:scale-105 cursor-pointer"
              >
                Consult an Expert
              </Link>
            </div>
          </div>
        </motion.div>
      </CommonWrapper>
    </div>
  );
};

export default Services;
