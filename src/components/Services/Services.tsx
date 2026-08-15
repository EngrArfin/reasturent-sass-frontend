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

// 1. Static Configuration (Placed outside component for cleaner code)
const CATEGORIES: Category[] = ["All", "Operations", "Ordering", "Management"];

const SERVICES_DATA: ServiceItem[] = [
    {
        icon: Monitor,
        title: "Cloud Billing & POS System",
        category: "Operations",
        description: "Supercharge your checkout with our offline-first cloud billing system. Manage tables, split checks, and process payments instantly.",
        features: ["Offline Mode Support", "Table & Floor Mapping", "Split Bills & Tip Management"],
        color: "from-orange-500 to-amber-500",
        badge: "Popular",
    },
    {
        icon: QrCode,
        title: "Contactless QR Code Menu",
        category: "Ordering",
        description: "Enable contactless self-ordering. Customers simply scan the table QR code, browse your rich visual menu, order, and pay directly.",
        features: ["Real-time Price Sync", "No App Download Needed", "Multi-lingual Support"],
        color: "from-blue-500 to-indigo-500",
        badge: "High Growth",
    },
    {
        icon: ClipboardList,
        title: "Inventory & Recipe Management",
        category: "Management",
        description: "Track raw ingredient stock levels in real-time. Calculate recipe costs, set automatic re-ordering thresholds, and cut food waste.",
        features: ["Batch Expiry Alerts", "Auto Purchase Orders", "Recipe Costing & Margins"],
        color: "from-emerald-500 to-teal-500",
    },
    {
        icon: Utensils,
        title: "Kitchen Display System (KDS)",
        category: "Operations",
        description: "Go paperless and streamline operations. Route orders instantly from POS or QR Menu to smart kitchen screens with prep-timer tracking.",
        features: ["Color-coded Prep Alerts", "Item Consolidation", "Cook Time Analysis"],
        color: "from-rose-500 to-pink-500",
    },
    {
        icon: Users,
        title: "Staff & Shift Scheduling",
        category: "Management",
        description: "Manage employee shifts, roles, and access levels. Track server attendance, log clock-ins, and calculate tips dynamically.",
        features: ["Advanced Role Permissions", "Tip Pool Allocation", "Payroll Reports Export"],
        color: "from-violet-500 to-purple-500",
    },
    {
        icon: TrendingUp,
        title: "Live Analytics & Sales Reports",
        category: "Management",
        description: "Gain complete visibility into business metrics. Monitor sales patterns, Peak Hours, and waiter efficiency from any device.",
        features: ["Multi-outlet Comparison", "Peak-hour Traffic Audits", "Daily Summary Emails"],
        color: "from-cyan-500 to-blue-500",
        badge: "Essential",
    },
];

// 2. Services Component
const Services = () => {
    const [activeCategory, setActiveCategory] = useState<Category>("All");

    // Filter services logic
    const filteredServices = SERVICES_DATA.filter(
        (service) => activeCategory === "All" || service.category === activeCategory
    );

    return (
        <div className="bg-[#fdfbf7] relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-20 right-10 w-96 h-96 bg-orange-200/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-100/35 blur-[120px] rounded-full pointer-events-none" />

            <CommonWrapper>
                {/* Section Title Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-orange-100 text-primary-orange">
                        <Sparkles className="size-3.5" />
                        Our Services
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-heading-blue leading-tight tracking-tight">
                        Tailored Modules to Scale Your Restaurant
                    </h2>
                    <p className="text-base md:text-lg text-paragraph-gray leading-relaxed">
                        Everything you need to automate billing, streamline kitchen operations, and drive customer retention. Choose the tools that fit your business model.
                    </p>
                </div>

                {/* Filter Navigation Tabs */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                                activeCategory === category
                                    ? "bg-primary-orange text-white shadow-md shadow-orange-500/20 scale-105"
                                    : "bg-white text-paragraph-gray hover:bg-orange-50/50 hover:text-primary-orange border border-gray-100"
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
                                    className="group relative bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                                >
                                    {/* Color border accent */}
                                    <div className={`h-1.5 w-full bg-gradient-to-r ${service.color}`} />

                                    <div className="p-6 md:p-8 space-y-6 flex-grow">
                                        {/* Card Header (Icon & Badge) */}
                                        <div className="flex justify-between items-start">
                                            <div className={`flex items-center justify-center size-12 rounded-xl bg-gradient-to-br ${service.color} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                                <IconComponent className="size-6" />
                                            </div>
                                            {service.badge && (
                                                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-orange-50 text-primary-orange border border-orange-100">
                                                    {service.badge}
                                                </span>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-3">
                                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary-orange transition-colors duration-300">
                                                {service.title}
                                            </h3>
                                            <p className="text-sm text-paragraph-gray leading-relaxed">
                                                {service.description}
                                            </p>
                                        </div>

                                        {/* Features List */}
                                        <ul className="space-y-2 pt-2 border-t border-gray-50">
                                            {service.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-xs text-paragraph-gray">
                                                    <div className="size-4 flex items-center justify-center rounded-full bg-green-50 text-green-600 flex-shrink-0">
                                                        <Check className="size-3" />
                                                    </div>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Card Footer Actions */}
                                    <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between group-hover:bg-orange-50/20 transition-all duration-300">
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            {service.category}
                                        </span>
                                        <button className="flex items-center gap-1.5 text-xs font-bold text-primary-orange hover:text-orange-600 transition-colors cursor-pointer">
                                            Learn More
                                            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                                        </button>
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
                    className="mt-20 bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl"
                >
                    <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-8 space-y-4">
                            <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                                Want to Custom-Build Your Modules?
                            </h3>
                            <p className="text-sm md:text-base text-white/90 max-w-2xl">
                                Our modular architecture allows you to choose exactly what your restaurant needs. Start small with a simple POS and scale up to multi-outlet inventory whenever you are ready.
                            </p>
                        </div>
                        <div className="lg:col-span-4 lg:text-right">
                            <button className="bg-white hover:bg-orange-50 text-primary-orange hover:text-orange-600 font-bold px-8 py-3.5 rounded-xl shadow-lg transition duration-300 hover:scale-105 cursor-pointer">
                                Consult an Expert
                            </button>
                        </div>
                    </div>
                </motion.div>
            </CommonWrapper>
        </div>
    );
};

export default Services;
