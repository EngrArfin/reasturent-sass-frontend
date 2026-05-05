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
              className="border border-blue-300 rounded-xl "
            >
              <AccordionTrigger className="px-6 py-5 text-left text-gray-700 text-base md:text-lg font-medium hover:no-underline cursor-pointer">
                How do I get a quote for my delivery?
              </AccordionTrigger>

              <AccordionContent className="px-6 pb-5 pt-0 text-left text-gray-600 text-sm md:text-base leading-relaxed space-y-3 cursor-pointer">
                <p className="m-0">
                  Visit the courier service’s website and enter your pickup and
                  delivery details to get an instant quote.
                </p>
                {/* <p className="m-0">
      Key features include advanced processing capabilities, a user-friendly
      interface, and smart integrations designed for both beginners and experts.
    </p> */}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="border-2 border-[#B2DDFF] rounded-[12px]"
            >
              <AccordionTrigger className="px-6 py-5 text-left text-gray-700 text-base md:text-lg font-medium hover:no-underline cursor-pointer">
                Can I track my delivery in real time?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 pt-0 text-left text-gray-600 text-sm md:text-base leading-relaxed space-y-3 cursor-pointer">
                <p>
                  Yes, most courier services offer real-time tracking on their
                  website. Just enter your tracking number to view your parcel’s
                  live status and location.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-3"
              className="border-2 border-[#B2DDFF] rounded-[12px]"
            >
              <AccordionTrigger className="px-6 py-5 text-left text-gray-700 text-base md:text-lg font-medium hover:no-underline cursor-pointer">
                What happens if I need to change my delivery address after
                placing the order?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 pt-0 text-left text-gray-600 text-sm md:text-base leading-relaxed space-y-3 cursor-pointer">
                <p>
                  Contact the courier’s customer support through their website
                  as soon as possible. Some services allow changes before
                  dispatch, but extra charges or delays may apply.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-4"
              className="border-2 border-[#B2DDFF] rounded-[12px]"
            >
              <AccordionTrigger className="px-6 py-5 text-left text-gray-700 text-base md:text-lg font-medium hover:no-underline cursor-pointer">
                How do I pay for my order?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 pt-0 text-left text-gray-600 text-sm md:text-base leading-relaxed space-y-3 cursor-pointer">
                <p>
                  Payments can be made securely through the courier’s website
                  using credit/debit cards or other supported online payment
                  methods.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-5"
              className="border-2 border-[#B2DDFF] rounded-[12px]"
            >
              <AccordionTrigger className="px-6 py-5 text-left text-gray-700 text-base md:text-lg font-medium hover:no-underline cursor-pointer">
                Are there any size or weight restrictions for deliveries?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 pt-0 text-left text-gray-600 text-sm md:text-base leading-relaxed space-y-3 cursor-pointer">
                <p>
                  Yes, courier services typically have size and weight limits.
                  Check the delivery guidelines on their website before placing
                  your order.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="item-6"
              className="border-2 border-b border-[#B2DDFF] rounded-[12px]"
            >
              <AccordionTrigger className="px-6 py-5 text-left text-gray-700 text-base md:text-lg font-medium hover:no-underline cursor-pointer">
                Return Policy
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 pt-0 text-left text-gray-600 text-sm md:text-base leading-relaxed space-y-3 cursor-pointer">
                <p>
                  We stand behind our products with a comprehensive 30-day
                  return policy. If you&apos;re not completely satisfied, simply
                  return the item in its original condition.
                </p>
                <p>
                  Our hassle-free return process includes free return shipping
                  and full refunds processed within 48 hours of receiving the
                  returned item.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CommonWrapper>
    </section>
  );
}
