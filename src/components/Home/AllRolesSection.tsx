import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACCENT = "#E86C17";

const roles = [
  {
    id: "superadmin",
    emoji: "👑",
    label: "Super Admin",
    tag: "Enterprise Control",
    desc: "Manage every branch, team, and operational insight from one centralized platform with complete visibility and control.",
    perks: [
      "Multi-branch management",
      "Role & permission control",
      "Advanced analytics",
      "Billing management",
      "Audit & activity logs",
      "Custom branding settings",
    ],
  },
  {
    id: "manager",
    emoji: "🏢",
    label: "Manager",
    tag: "Operations",
    desc: "Monitor staff, inventory, reports, and restaurant performance with streamlined operational tools.",
    perks: [
      "Shift scheduling",
      "Inventory tracking",
      "Sales reporting",
      "Menu management",
      "Performance insights",
      "Vendor coordination",
    ],
  },
  {
    id: "kitchen",
    emoji: "🔥",
    label: "Kitchen",
    tag: "Execution",
    desc: "Keep kitchen operations fast, organized, and efficient with real-time order synchronization.",
    perks: [
      "Live order queue",
      "Prep prioritization",
      "Dietary alerts",
      "Station workflow",
      "Kitchen timing",
      "Team communication",
    ],
  },
  {
    id: "server",
    emoji: "🍽️",
    label: "Server",
    tag: "Guest Experience",
    desc: "Deliver a smooth dining experience with smart order handling and real-time table management.",
    perks: [
      "Table management",
      "Quick order taking",
      "Guest preferences",
      "Split billing",
      "Kitchen ETA updates",
      "Upsell suggestions",
    ],
  },
  {
    id: "cashier",
    emoji: "💳",
    label: "Cashier",
    tag: "Payments",
    desc: "Handle transactions efficiently with secure payment processing and automated reconciliation.",
    perks: [
      "Multiple payment methods",
      "Discount management",
      "Tax automation",
      "Receipt generation",
      "Payment tracking",
      "Daily reconciliation",
    ],
  },
];

export default function AllRolesSection() {
  const [active, setActive] = useState(0);

  const role = roles[active];

  return (
    <section id="roles" className="relative overflow-hidden bg-[#0A0A0B] py-24">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div
          className="absolute left-1/2 top-32 h-[320px] w-[320px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{
            background: "rgba(232,108,23,0.12)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span
            className="inline-flex items-center rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{
              borderColor: "rgba(232,108,23,0.25)",
              background: "rgba(232,108,23,0.08)",
              color: ACCENT,
            }}
          >
            Role Management
          </span>

          <h2 className="mt-6 text-4xl font-bold leading-tight text-white md:text-6xl">
            Built for every
            <br />
            restaurant team.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/55 md:text-lg">
            Each role is designed with a focused workflow to improve speed,
            collaboration, and operational efficiency across your restaurant.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-14 flex flex-wrap items-center justify-center gap-4">
          {roles.map((r, i) => {
            const isActive = active === i;

            return (
              <motion.button
                key={r.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActive(i)}
                className={`rounded-2xl border px-5 py-4 transition-all duration-300 ${
                  isActive
                    ? "border-transparent bg-white/[0.06]"
                    : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
                style={{
                  boxShadow: isActive
                    ? "0 10px 40px rgba(232,108,23,0.18)"
                    : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${
                      isActive ? "bg-[#E86C17]/15" : "bg-white/[0.05]"
                    }`}
                  >
                    {r.emoji}
                  </div>

                  <div className="text-left">
                    <p
                      className={`text-sm font-semibold ${
                        isActive ? "text-white" : "text-white/70"
                      }`}
                    >
                      {r.label}
                    </p>

                    <span
                      className={`text-xs ${
                        isActive ? "text-[#E86C17]" : "text-white/35"
                      }`}
                    >
                      {r.tag}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Main Card */}
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl">
          {/* Accent Line */}
          <div
            className="absolute left-0 top-0 h-full w-[4px]"
            style={{
              background: ACCENT,
            }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.4 }}
              className="grid gap-14 p-8 md:grid-cols-2 md:p-14"
            >
              {/* Left Content */}
              <div className="flex flex-col justify-center">
                <div
                  className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]"
                  style={{
                    borderColor: "rgba(232,108,23,0.2)",
                    background: "rgba(232,108,23,0.08)",
                    color: ACCENT,
                  }}
                >
                  <span className="text-base">{role.emoji}</span>
                  {role.tag}
                </div>

                <h3 className="text-4xl font-bold text-white md:text-5xl">
                  {role.label}
                </h3>

                <p className="mt-6 max-w-xl text-base leading-8 text-white/55">
                  {role.desc}
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl px-7 py-4 text-sm font-semibold text-white transition-all duration-300"
                    style={{
                      background: ACCENT,
                    }}
                  >
                    Explore Dashboard
                  </motion.button>

                  <button className="rounded-xl border border-white/10 bg-white/[0.03] px-7 py-4 text-sm font-semibold text-white/70 transition-all duration-300 hover:bg-white/[0.06] hover:text-white">
                    View Features
                  </button>
                </div>
              </div>

              {/* Right Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {role.perks.map((perk, index) => (
                  <motion.div
                    key={perk}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.05,
                    }}
                    whileHover={{ y: -3 }}
                    className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-[#E86C17]/20 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="mt-2 h-2.5 w-2.5 rounded-full"
                        style={{
                          background: ACCENT,
                        }}
                      />

                      <p className="text-sm leading-7 text-white/65 transition-colors duration-300 group-hover:text-white">
                        {perk}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const roles = [
//   {
//     id: "superadmin",
//     emoji: "👑",
//     label: "Super Admin",
//     color: "#f97316",
//     glow: "rgba(249,115,22,.4)",
//     tag: "God Mode",
//     desc: "Total command over every branch, every user, every dollar. Real-time organization-wide intelligence and enterprise-grade control.",
//     perks: [
//       "Multi-branch command center",
//       "User & role provisioning",
//       "Billing & subscription control",
//       "Global analytics dashboard",
//       "Audit logs & compliance",
//       "White-label configuration",
//     ],
//   },
//   {
//     id: "manager",
//     emoji: "🏢",
//     label: "Manager",
//     color: "#3b82f6",
//     glow: "rgba(59,130,246,.4)",
//     tag: "Operations",
//     desc: "Run operations efficiently with staff scheduling, inventory forecasting, reporting, and performance tracking in one place.",
//     perks: [
//       "Staff scheduling & shifts",
//       "Inventory forecasting",
//       "P&L live dashboard",
//       "Menu & pricing control",
//       "Performance reports",
//       "Vendor management",
//     ],
//   },
//   {
//     id: "kitchen",
//     emoji: "🔥",
//     label: "Kitchen",
//     color: "#22c55e",
//     glow: "rgba(34,197,94,.4)",
//     tag: "Execution",
//     desc: "Streamline kitchen workflows with real-time orders, smart prep prioritization, and instant team communication.",
//     perks: [
//       "Real-time order stream",
//       "Smart prep queue",
//       "Allergy & diet alerts",
//       "Station assignment",
//       "Timing analytics",
//       "Chef communication",
//     ],
//   },
//   {
//     id: "server",
//     emoji: "🍽️",
//     label: "Server",
//     color: "#a855f7",
//     glow: "rgba(168,85,247,.4)",
//     tag: "Tableside",
//     desc: "Provide a premium guest experience with AI-assisted order management and real-time kitchen visibility.",
//     perks: [
//       "Smart table mapping",
//       "One-tap order entry",
//       "AI upsell suggestions",
//       "Guest preference memory",
//       "Split-check handling",
//       "Live kitchen ETA",
//     ],
//   },
//   {
//     id: "cashier",
//     emoji: "💳",
//     label: "Cashier",
//     color: "#ec4899",
//     glow: "rgba(236,72,153,.4)",
//     tag: "Checkout",
//     desc: "Deliver seamless checkout experiences with fast payments, reconciliation tools, and fraud protection.",
//     perks: [
//       "Multi-tender payments",
//       "Bill split engine",
//       "Discount & promo codes",
//       "End-of-day reconciliation",
//       "Tax & tip automation",
//       "Fraud detection",
//     ],
//   },
// ];

// const AllRolesSection = () => {
//   const [active, setActive] = useState(0);

//   const role = roles[active];

//   return (
//     <section id="roles" className="relative overflow-hidden bg-[#070709] py-28">
//       {/* Background Glow */}
//       <div
//         className="absolute left-1/2 top-32 h-[400px] w-[400px] -translate-x-1/2 rounded-full blur-[120px]"
//         style={{
//           background: role.glow,
//         }}
//       />

//       <div className="relative z-10 mx-auto max-w-7xl px-6">
//         {/* Heading */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//           className="mx-auto mb-20 max-w-3xl text-center"
//         >
//           <span
//             className="mb-5 inline-flex items-center rounded-full border px-5 py-2 text-[11px] font-bold uppercase tracking-[0.25em]"
//             style={{
//               color: role.color,
//               borderColor: `${role.color}40`,
//               background: `${role.color}12`,
//             }}
//           >
//             Role-Based Access
//           </span>

//           <h2 className="font-display text-4xl font-black leading-tight text-white md:text-6xl">
//             One platform.
//             <br />
//             Five powerful roles.
//           </h2>

//           <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/45 md:text-lg">
//             Every team member gets a precision-crafted dashboard optimized for
//             their responsibilities and workflow.
//           </p>
//         </motion.div>

//         {/* Role Tabs */}
//         <div className="mb-14 flex flex-wrap items-center justify-center gap-4">
//           {roles.map((r, i) => {
//             const isActive = active === i;

//             return (
//               <motion.button
//                 whileHover={{ y: -3 }}
//                 whileTap={{ scale: 0.97 }}
//                 key={r.id}
//                 onClick={() => setActive(i)}
//                 className="relative overflow-hidden rounded-2xl border px-5 py-3 transition-all duration-300"
//                 style={{
//                   borderColor: isActive
//                     ? `${r.color}80`
//                     : "rgba(255,255,255,.08)",
//                   background: isActive
//                     ? `${r.color}15`
//                     : "rgba(255,255,255,.03)",
//                   boxShadow: isActive ? `0 0 35px ${r.glow}` : "none",
//                 }}
//               >
//                 <div className="flex items-center gap-3">
//                   <span className="text-lg">{r.emoji}</span>

//                   <div className="text-left">
//                     <p
//                       className="text-sm font-semibold"
//                       style={{
//                         color: isActive ? r.color : "rgba(255,255,255,.7)",
//                       }}
//                     >
//                       {r.label}
//                     </p>

//                     <span className="text-xs text-white/35">{r.tag}</span>
//                   </div>
//                 </div>
//               </motion.button>
//             );
//           })}
//         </div>

//         {/* Main Card */}
//         <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl">
//           {/* Gradient Border */}
//           <div
//             className="absolute inset-0 opacity-20"
//             style={{
//               background: `radial-gradient(circle at top left, ${role.color}, transparent 45%)`,
//             }}
//           />

//           <AnimatePresence mode="wait">
//             <motion.div
//               key={role.id}
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -30 }}
//               transition={{ duration: 0.4 }}
//               className="relative z-10 grid gap-16 p-8 md:grid-cols-2 md:p-14"
//             >
//               {/* Left */}
//               <div className="flex flex-col justify-center">
//                 <div
//                   className="mb-6 inline-flex w-fit items-center gap-3 rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-[0.2em]"
//                   style={{
//                     color: role.color,
//                     borderColor: `${role.color}40`,
//                     background: `${role.color}12`,
//                   }}
//                 >
//                   <span className="text-lg">{role.emoji}</span>
//                   {role.tag}
//                 </div>

//                 <h3 className="font-display text-4xl font-black text-white md:text-5xl">
//                   {role.label}
//                 </h3>

//                 <p className="mt-6 max-w-xl text-base leading-8 text-white/50">
//                   {role.desc}
//                 </p>

//                 <div className="mt-10 flex flex-wrap gap-4">
//                   <motion.button
//                     whileHover={{ y: -2, scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     className="rounded-xl px-7 py-4 text-sm font-semibold text-white"
//                     style={{
//                       background: `linear-gradient(135deg, ${role.color}, ${role.color}cc)`,
//                       boxShadow: `0 0 30px ${role.glow}`,
//                     }}
//                   >
//                     Explore Dashboard →
//                   </motion.button>

//                   <button className="rounded-xl border border-white/10 bg-white/[0.03] px-7 py-4 text-sm font-semibold text-white/70 transition hover:bg-white/[0.06]">
//                     View Features
//                   </button>
//                 </div>
//               </div>

//               {/* Right */}
//               <div className="grid gap-4 sm:grid-cols-2">
//                 {role.perks.map((perk, index) => (
//                   <motion.div
//                     key={perk}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{
//                       delay: index * 0.05,
//                     }}
//                     whileHover={{
//                       y: -4,
//                     }}
//                     className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:bg-white/[0.05]"
//                   >
//                     <div
//                       className="mb-4 h-2.5 w-2.5 rounded-full"
//                       style={{
//                         background: role.color,
//                         boxShadow: `0 0 12px ${role.color}`,
//                       }}
//                     />

//                     <p className="text-sm leading-7 text-white/70 transition-colors duration-300 group-hover:text-white">
//                       {perk}
//                     </p>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AllRolesSection;
