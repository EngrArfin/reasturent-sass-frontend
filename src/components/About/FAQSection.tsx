import CommonWrapper from "@/common/CommonWrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  return (
    <section className="text-center bg-[#FAFAFA]">
      <CommonWrapper>
        <h2 className="text-2xl md:text-3xl font-bold text-[#373A41] mb-10">
          Frequently Asked Questions
        </h2>

        <div>
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-5"
            defaultValue="item-1"
          >
            <AccordionItem
              value="item-1"
              className="border border-[#F54900] rounded-xl "
            >
              <AccordionTrigger className="px-6 py-5 text-left text-gray-700 text-base md:text-lg font-medium hover:no-underline cursor-pointer">
                How does the restaurant management SaaS system work?
              </AccordionTrigger>

              <AccordionContent className="px-6 pb-5 pt-0 text-left text-gray-600 text-sm md:text-base leading-relaxed space-y-3 cursor-pointer">
                <p className="m-0">
                  It helps you manage orders, tables, menus, billing, and staff
                  from a single dashboard in real time.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="border-2 border-[#F54900] rounded-[12px]"
            >
              <AccordionTrigger className="px-6 py-5 text-left text-gray-700 text-base md:text-lg font-medium hover:no-underline cursor-pointer">
                Can I manage online orders and dine-in orders together?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 pt-0 text-left text-gray-600 text-sm md:text-base leading-relaxed space-y-3 cursor-pointer">
                <p>
                  Yes, the system allows you to handle dine-in, takeaway, and
                  online delivery orders in one unified panel.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="border-2 border-[#F54900] rounded-[12px]"
            >
              <AccordionTrigger className="px-6 py-5 text-left text-gray-700 text-base md:text-lg font-medium hover:no-underline cursor-pointer">
                Can I update my restaurant menu anytime?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 pt-0 text-left text-gray-600 text-sm md:text-base leading-relaxed space-y-3 cursor-pointer">
                <p>
                  Yes, you can easily add, edit, or remove menu items including
                  price, availability, and descriptions in real time.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="border-2 border-[#F54900] rounded-[12px]"
            >
              <AccordionTrigger className="px-6 py-5 text-left text-gray-700 text-base md:text-lg font-medium hover:no-underline cursor-pointer">
                Does the system support online payments?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 pt-0 text-left text-gray-600 text-sm md:text-base leading-relaxed space-y-3 cursor-pointer">
                <p>
                  Yes, it supports secure online payments through multiple
                  gateways including cards and mobile payment systems.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-5"
              className="border-2 border-[#F54900] rounded-[12px]"
            >
              <AccordionTrigger className="px-6 py-5 text-left text-gray-700 text-base md:text-lg font-medium hover:no-underline cursor-pointer">
                Can I manage staff roles and permissions?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 pt-0 text-left text-gray-600 text-sm md:text-base leading-relaxed space-y-3 cursor-pointer">
                <p>
                  Yes, you can assign roles like admin, manager, cashier, or
                  waiter with specific permissions for secure operations.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-6"
              className="border-2 border-[#F54900] rounded-[12px]"
            >
              <AccordionTrigger className="px-6 py-5 text-left text-gray-700 text-base md:text-lg font-medium hover:no-underline cursor-pointer">
                Does it provide reports and analytics?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 pt-0 text-left text-gray-600 text-sm md:text-base leading-relaxed space-y-3 cursor-pointer">
                <p>
                  Yes, you can view sales reports, order history, revenue
                  tracking, and performance analytics in real time.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CommonWrapper>
    </section>
  );
}
