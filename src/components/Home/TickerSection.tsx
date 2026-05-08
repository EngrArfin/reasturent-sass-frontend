import { motion } from "framer-motion";

const integrations = [
  "Square POS",
  "Stripe",
  "QuickBooks",
  "Uber Eats",
  "DoorDash",
  "Toast",
  "Lightspeed",
  "Xero",
  "Grubhub",
  "PayPal",
  "Clover",
  "Shopify",
];

const tickerItems = [...integrations, ...integrations];

export default function TickerSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 py-4">
      {/* glow blur */}
      <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-orange-600 to-transparent z-10" />
      <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-red-600 to-transparent z-10" />

      <motion.div
        className="flex w-max items-center"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {tickerItems.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.08, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="group mx-3 flex items-center gap-4 rounded-full border border-white/15 bg-white/10 px-5 py-2 backdrop-blur-md"
          >
            <span className="text-sm font-semibold tracking-wide text-white md:text-base">
              {item}
            </span>

            <span className="text-white/40 group-hover:text-white transition-colors duration-300">
              ✦
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
