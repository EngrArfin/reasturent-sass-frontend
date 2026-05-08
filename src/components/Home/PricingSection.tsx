import { useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Check } from "lucide-react";

type Plan = {
  name: string;
  monthly: number | null;
  yearly: number | null;
  description: string;
  features: string[];
  popular?: boolean;
};

const plans: Plan[] = [
  {
    name: "Starter",
    monthly: 29,
    yearly: 19,
    description: "Perfect for small restaurants starting digital operations.",
    features: [
      "1 Restaurant Branch",
      "POS Integration",
      "Basic Analytics",
      "Menu Management",
      "Email Support",
    ],
  },
  {
    name: "Professional",
    monthly: 79,
    yearly: 59,
    description: "Best for growing restaurants needing advanced management.",
    features: [
      "Up to 5 Branches",
      "AI Sales Analytics",
      "Inventory Tracking",
      "Priority Support",
      "Custom Reports",
      "Unlimited Staff Roles",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    monthly: null,
    yearly: null,
    description: "Advanced solution for large restaurant chains & franchises.",
    features: [
      "Unlimited Branches",
      "Dedicated Manager",
      "Custom Integrations",
      "White Label Solution",
      "24/7 Premium Support",
      "Advanced Security",
    ],
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const featureVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

type PricingCardProps = {
  plan: Plan;
  yearly: boolean;
};

const PricingCard = ({ plan, yearly }: PricingCardProps) => {
  const price = useMemo(() => {
    return yearly ? plan.yearly : plan.monthly;
  }, [yearly, plan.monthly, plan.yearly]);

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -10,
      }}
      className={`relative rounded-3xl p-8 border overflow-hidden transition-all duration-300 ${
        plan.popular
          ? "border-orange-500 bg-gradient-to-b from-orange-500/10 to-transparent shadow-[0_0_40px_rgba(249,115,22,0.25)]"
          : "border-white/10 bg-white/5 hover:border-orange-500/30"
      }`}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.15),transparent_60%)] pointer-events-none" />

      {/* Popular Badge */}
      {plan.popular && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="absolute -top-4 left-1/2 -translate-x-1/2"
        >
          <span className="bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2 rounded-full text-xs font-bold tracking-wide">
            MOST POPULAR
          </span>
        </motion.div>
      )}

      {/* Plan Info */}
      <div className="mb-8 relative z-10">
        <h3 className="text-2xl font-bold mb-3">{plan.name}</h3>

        <div className="flex items-end gap-2 mb-4">
          {price ? (
            <>
              <motion.span
                key={price}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-5xl font-black"
              >
                ${price}
              </motion.span>

              <span className="text-gray-400 mb-1">/month</span>
            </>
          ) : (
            <span className="text-4xl font-black">Custom</span>
          )}
        </div>

        <p className="text-gray-400 leading-relaxed">{plan.description}</p>
      </div>

      {/* Features */}
      <motion.ul
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-4 mb-8 relative z-10"
      >
        {plan.features.map((feature) => (
          <motion.li
            key={feature}
            variants={featureVariants}
            whileHover={{ x: 4 }}
            className="flex items-center gap-3 text-gray-300"
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                plan.popular
                  ? "bg-orange-500/20 text-orange-400"
                  : "bg-white/10 text-green-400"
              }`}
            >
              <Check size={14} />
            </div>

            <span>{feature}</span>
          </motion.li>
        ))}
      </motion.ul>

      {/* Button */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.02 }}
        className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 relative z-10 ${
          plan.popular
            ? "bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 text-white"
            : "border border-white/10 hover:border-orange-500 hover:bg-orange-500/10"
        }`}
      >
        {price ? "Start Free Trial" : "Contact Sales"}
      </motion.button>
    </motion.div>
  );
};

const PricingSection = () => {
  const [yearly, setYearly] = useState(true);

  const pricingLabel = useMemo(() => {
    return yearly ? "Yearly Billing" : "Monthly Billing";
  }, [yearly]);

  return (
    <section
      id="pricing"
      className="bg-[#0A0A0A] py-24 px-5 text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex px-4 py-2 rounded-full text-sm font-semibold bg-orange-500/10 border border-orange-500/20 text-orange-400">
            PRICING PLAN
          </span>

          <h2 className="text-4xl md:text-6xl font-black mt-6 leading-tight">
            Flexible Pricing <br /> For Every Restaurant
          </h2>

          <p className="text-gray-400 mt-5 max-w-2xl mx-auto text-lg">
            Choose a plan that fits your restaurant business. No hidden fees,
            cancel anytime.
          </p>

          {/* Toggle */}
          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            <span
              className={`text-sm transition-colors duration-300 ${
                !yearly ? "text-white" : "text-gray-500"
              }`}
            >
              Monthly
            </span>

            <button
              type="button"
              aria-label="Toggle pricing plan"
              aria-pressed={yearly}
              onClick={() => setYearly((prev) => !prev)}
              className={`relative w-14 h-7 rounded-full flex items-center px-1 transition-all duration-300 ${
                yearly ? "bg-orange-500" : "bg-gray-700"
              }`}
            >
              <motion.div
                layout
                transition={{
                  type: "spring",
                  stiffness: 700,
                  damping: 30,
                }}
                animate={{
                  x: yearly ? 28 : 0,
                }}
                className="w-5 h-5 bg-white rounded-full"
              />
            </button>

            <span
              className={`text-sm transition-colors duration-300 ${
                yearly ? "text-white" : "text-gray-500"
              }`}
            >
              Yearly
            </span>

            <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs px-3 py-1 rounded-full font-semibold">
              Save 25%
            </span>
          </div>

          <p className="mt-4 text-sm text-gray-500">{pricingLabel}</p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} yearly={yearly} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;

// import { useState } from "react";
// import { Check } from "lucide-react";

// const plans = [
//   {
//     name: "Starter",
//     monthly: 29,
//     yearly: 19,
//     description: "Perfect for small restaurants starting digital operations.",
//     features: [
//       "1 Restaurant Branch",
//       "POS Integration",
//       "Basic Analytics",
//       "Menu Management",
//       "Email Support",
//     ],
//     popular: false,
//   },
//   {
//     name: "Professional",
//     monthly: 79,
//     yearly: 59,
//     description: "Best for growing restaurants needing advanced management.",
//     features: [
//       "Up to 5 Branches",
//       "AI Sales Analytics",
//       "Inventory Tracking",
//       "Priority Support",
//       "Custom Reports",
//       "Unlimited Staff Roles",
//     ],
//     popular: true,
//   },
//   {
//     name: "Enterprise",
//     monthly: null,
//     yearly: null,
//     description: "Advanced solution for large restaurant chains & franchises.",
//     features: [
//       "Unlimited Branches",
//       "Dedicated Manager",
//       "Custom Integrations",
//       "White Label Solution",
//       "24/7 Premium Support",
//       "Advanced Security",
//     ],
//     popular: false,
//   },
// ];

// const PricingSection = () => {
//   const [yearly, setYearly] = useState(true);

//   return (
//     <section id="pricing" className="bg-[#0A0A0A] py-24 px-5 text-white">
//       <div className="max-w-7xl mx-auto">
//         {/* Heading */}
//         <div className="text-center mb-16">
//           <span className="px-4 py-2 rounded-full text-sm font-semibold bg-orange-500/10 border border-orange-500/20 text-orange-400">
//             PRICING PLAN
//           </span>

//           <h2 className="text-4xl md:text-6xl font-black mt-6 leading-tight">
//             Flexible Pricing <br /> For Every Restaurant
//           </h2>

//           <p className="text-gray-400 mt-5 max-w-2xl mx-auto text-lg">
//             Choose a plan that fits your restaurant business. No hidden fees,
//             cancel anytime.
//           </p>

//           {/* Toggle */}
//           <div className="mt-8 flex items-center justify-center gap-4">
//             <span
//               className={`text-sm ${!yearly ? "text-white" : "text-gray-500"}`}
//             >
//               Monthly
//             </span>

//             <button
//               onClick={() => setYearly(!yearly)}
//               className={`w-14 h-7 rounded-full flex items-center px-1 transition-all duration-300 ${
//                 yearly ? "bg-orange-500" : "bg-gray-700"
//               }`}
//             >
//               <div
//                 className={`w-5 h-5 bg-white rounded-full transition-all duration-300 ${
//                   yearly ? "translate-x-7" : ""
//                 }`}
//               />
//             </button>

//             <span
//               className={`text-sm ${yearly ? "text-white" : "text-gray-500"}`}
//             >
//               Yearly
//             </span>

//             <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs px-3 py-1 rounded-full font-semibold">
//               Save 25%
//             </span>
//           </div>
//         </div>

//         {/* Pricing Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
//           {plans.map((plan, index) => (
//             <div
//               key={index}
//               className={`relative rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-2 ${
//                 plan.popular
//                   ? "border-orange-500 bg-gradient-to-b from-orange-500/10 to-transparent shadow-[0_0_40px_rgba(249,115,22,0.25)]"
//                   : "border-white/10 bg-white/5 hover:border-orange-500/30"
//               }`}
//             >
//               {/* Popular Badge */}
//               {plan.popular && (
//                 <div className="absolute -top-4 left-1/2 -translate-x-1/2">
//                   <span className="bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2 rounded-full text-xs font-bold tracking-wide">
//                     MOST POPULAR
//                   </span>
//                 </div>
//               )}

//               {/* Plan Info */}
//               <div className="mb-8">
//                 <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>

//                 <div className="flex items-end gap-2 mb-4">
//                   {plan.monthly ? (
//                     <>
//                       <span className="text-5xl font-black">
//                         ${yearly ? plan.yearly : plan.monthly}
//                       </span>
//                       <span className="text-gray-400 mb-1">/month</span>
//                     </>
//                   ) : (
//                     <span className="text-4xl font-black">Custom</span>
//                   )}
//                 </div>

//                 <p className="text-gray-400 leading-relaxed">
//                   {plan.description}
//                 </p>
//               </div>

//               {/* Features */}
//               <ul className="space-y-4 mb-8">
//                 {plan.features.map((feature, i) => (
//                   <li key={i} className="flex items-center gap-3 text-gray-300">
//                     <div
//                       className={`w-5 h-5 rounded-full flex items-center justify-center ${
//                         plan.popular
//                           ? "bg-orange-500/20 text-orange-400"
//                           : "bg-white/10 text-green-400"
//                       }`}
//                     >
//                       <Check size={14} />
//                     </div>

//                     {feature}
//                   </li>
//                 ))}
//               </ul>

//               {/* Button */}
//               <button
//                 className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
//                   plan.popular
//                     ? "bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
//                     : "border border-white/10 hover:border-orange-500 hover:bg-orange-500/10"
//                 }`}
//               >
//                 {plan.monthly ? "Start Free Trial" : "Contact Sales"}
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default PricingSection;
