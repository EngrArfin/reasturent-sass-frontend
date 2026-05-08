import CommonWrapper from "@/common/CommonWrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "How does the restaurant management SaaS system work?",
    a: "It helps you manage orders, tables, cooking, menus, billing, staff and everything from a single dashboard in real time.",
  },
  {
    q: "Can I manage online orders and dine-in orders together?",
    a: "Yes, you can handle dine-in, takeaway, and online delivery orders in one unified system.",
  },
  {
    q: "Can I update my restaurant menu anytime?",
    a: "Yes, you can add, edit, or remove menu items including price, availability, and descriptions instantly.",
  },
  {
    q: "Does the system support online payments?",
    a: "Yes, it supports secure online payments via cards and mobile payment systems.",
  },
  {
    q: "Can I manage staff roles and permissions?",
    a: "Yes, you can assign roles like admin, manager, cashier, waiter with specific permissions.",
  },
  {
    q: "Does it provide reports and analytics?",
    a: "Yes, you can track sales, revenue, orders, and performance analytics in real time.",
  },
];

const FAQSection = () => {
  return (
    <section className="bg-[#FAFAFA]">
      <CommonWrapper>
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-[#373A41] text-center mb-10"
        >
          Frequently Asked Questions
        </motion.h2>

        {/* Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <AccordionItem
                value={`item-${i}`}
                className="border border-[#F54900] rounded-xl px-2"
              >
                {/* Question */}
                <AccordionTrigger className="px-4 py-5 text-left text-base md:text-lg font-medium text-gray-700 hover:no-underline">
                  {item.q}
                </AccordionTrigger>

                {/* Answer (Smooth built-in animation) */}
                <AccordionContent className="px-4 pb-5 text-gray-600 text-sm md:text-base leading-relaxed data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </CommonWrapper>
    </section>
  );
};

export default FAQSection;
