import CommonWrapper from "@/common/CommonWrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle, MessageCircleQuestion, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "How does the restaurant management SaaS system work?",
    a: "It provides a unified cloud dashboard to manage real-time orders, table arrangements, kitchen display systems (KDS), digital menus, billing, and staff permissions across all your branches.",
  },
  {
    q: "Can I manage online orders and dine-in orders together?",
    a: "Yes! Our platform automatically aggregates dine-in, takeaway, and multi-channel online delivery orders into one synchronized live queue.",
  },
  {
    q: "Can I update my restaurant menu in real-time?",
    a: "Absolutely. You can update menu items, prices, modifiers, category visibility, and 86'd (out-of-stock) items instantly across all POS stations and digital menus.",
  },
  {
    q: "Does the system support multiple payment methods?",
    a: "Yes, it supports all major payment methods including credit/debit cards, contactless mobile wallets, split bills, and cash register tracking with automated receipt generation.",
  },
  {
    q: "Can I assign custom roles and permissions to my staff?",
    a: "Yes, you can create and manage dedicated roles such as Super Admin, Branch Manager, Kitchen Chef, Server, and Cashier with granular permission controls.",
  },
  {
    q: "Does it provide deep analytics and financial reporting?",
    a: "Yes! Track daily gross/net sales, peak dining hours, inventory consumption, staff productivity, and profit margins with live interactive charts and exportable reports.",
  },
];

const FAQSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#07090D] via-[#0B0F17] to-[#07090D] py-24 md:py-32 text-white">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-orange-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/10 blur-[130px] pointer-events-none rounded-full" />

      <CommonWrapper className="relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-400">
            <HelpCircle className="w-3.5 h-3.5" />
            Got Questions?
          </span>

          <h2 className="mt-5 text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Questions</span>
          </h2>

          <p className="mt-4 text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about our restaurant management system, features, setup, and subscription plans.
          </p>
        </motion.div>

        {/* Accordion List */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                viewport={{ once: true }}
              >
                <AccordionItem
                  value={`item-${i}`}
                  className="border border-white/10 bg-white/[0.03] backdrop-blur-md rounded-2xl px-5 md:px-7 transition-all duration-300 hover:border-orange-500/30 data-[state=open]:border-orange-500/50 data-[state=open]:bg-white/[0.06] data-[state=open]:shadow-[0_10px_35px_rgba(239,104,32,0.12)]"
                >
                  {/* Question */}
                  <AccordionTrigger className="py-5 text-left text-base md:text-lg font-semibold text-slate-100 hover:text-orange-400 hover:no-underline transition-colors [&>svg]:text-orange-400 [&>svg]:w-5 [&>svg]:h-5">
                    <span className="flex items-center gap-3 pr-2">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-xs font-bold text-orange-400 border border-orange-500/20">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item.q}
                    </span>
                  </AccordionTrigger>

                  {/* Answer */}
                  <AccordionContent className="pb-6 pt-1 text-slate-300 text-sm md:text-base leading-relaxed border-t border-white/5">
                    <div className="pl-10">
                      {item.a}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>

          {/* Bottom Help CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.04] to-orange-500/[0.06] p-6 md:p-8 backdrop-blur-lg text-center flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="text-left flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0 text-orange-400">
                <MessageCircleQuestion className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Still have questions?</h4>
                <p className="text-sm text-slate-400">Can't find what you're looking for? Our team is happy to help.</p>
              </div>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-[#F54900] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-orange-500/30 shrink-0"
            >
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </CommonWrapper>
    </section>
  );
};

export default FAQSection;
