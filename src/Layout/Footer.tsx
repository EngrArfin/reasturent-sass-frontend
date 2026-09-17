import React from "react";
import logo from "../assets/icons/logoSAS.png";
import { Link } from "react-router-dom";
import img1 from "../assets/Common/visa.svg";
import img2 from "../assets/Common/paypal.svg";
import img3 from "../assets/Common/amex.svg";
import img4 from "../assets/Common/card.svg";
import img5 from "../assets/Common/stripe 1.svg";
import { Mail, MapPin, Phone, ShieldCheck, ChevronRight } from "lucide-react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa6";
import CommonWrapper from "@/common/CommonWrapper";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#04060A] text-slate-300 pt-16 pb-10 overflow-hidden border-t border-white/10">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-44 bg-orange-500/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-44 bg-blue-500/5 blur-[120px] pointer-events-none rounded-full" />

      <CommonWrapper className="relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-white/10"
        >
          {/* Brand & About (4 cols) */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-block">
              <img
                src={logo}
                alt="RestoSync SaaS Logo"
                className="h-10 w-auto brightness-110 drop-shadow-[0_4px_12px_rgba(249,115,22,0.2)]"
              />
            </Link>

            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-sm">
              An all-in-one cloud restaurant SaaS platform built to power high-speed dining operations, digital orders, live kitchen sync, inventory, and multi-branch intelligence.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: FaFacebookF, href: "#", label: "Facebook" },
                { icon: FaTwitter, href: "#", label: "Twitter" },
                { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
                { icon: FaInstagram, href: "#", label: "Instagram" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition-all duration-300 hover:border-orange-500/40 hover:bg-orange-500/15 hover:text-orange-400 hover:scale-105"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links (2 cols) */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
            <h3 className="text-base font-bold uppercase tracking-wider text-white">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {[
                { name: "Home", to: "/" },
                { name: "About Us", to: "/about" },
                { name: "Services", to: "/services" },
                { name: "Pricing", to: "/#pricing" },
                { name: "Contact", to: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.to}
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-400 transition-all duration-200 hover:text-orange-400 hover:translate-x-1"
                  >
                    <ChevronRight className="h-3 w-3 text-slate-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-orange-400" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Details (3 cols) */}
          <motion.div variants={itemVariants} className="lg:col-span-3 space-y-4">
            <h3 className="text-base font-bold uppercase tracking-wider text-white">
              Get in Touch
            </h3>

            <div className="space-y-3.5 text-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/10 text-orange-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <p className="text-slate-400 leading-snug">
                  Mirpur-10, Dhaka-1260, Bangladesh
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/10 text-orange-400">
                  <Mail className="h-4 w-4" />
                </div>
                <p className="text-slate-400 leading-snug break-all">
                  support@restosync.io
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/10 text-orange-400">
                  <Phone className="h-4 w-4" />
                </div>
                <p className="text-slate-400 leading-snug">
                  (+880) 1923-434574
                </p>
              </div>
            </div>
          </motion.div>

          {/* Payment & Security (3 cols) */}
          <motion.div variants={itemVariants} className="lg:col-span-3 space-y-4">
            <h3 className="text-base font-bold uppercase tracking-wider text-white">
              Accepted Payments
            </h3>

            <div className="flex flex-wrap gap-2.5">
              {[img1, img2, img3, img4, img5].map((img, idx) => (
                <div
                  key={idx}
                  className="flex h-10 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] p-1.5 backdrop-blur-sm transition-all duration-300 hover:border-orange-500/40 hover:bg-white/[0.08]"
                >
                  <img src={img} alt="Payment Method" className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>256-bit SSL encrypted secure checkout.</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} RestoSync SaaS. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </a>
            <span className="text-white/10">•</span>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </a>
            <span className="text-white/10">•</span>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Security
            </a>
            <span className="text-white/10">•</span>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </CommonWrapper>
    </footer>
  );
};

export default Footer;
