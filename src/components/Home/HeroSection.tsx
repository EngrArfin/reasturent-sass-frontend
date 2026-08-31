import { useEffect, useState } from "react";
import heroImage from "../../assets/sas/photo/photo1.jpg";
import backgroundPhoto from "../../assets/sas/photo/bacground.jpeg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function HeroSection() {
  const words = ["smarter,", "effortlessly,", "and profitably."];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden mt-[70px]">
      {/* 🌆 Background */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${backgroundPhoto})` }}
      />

      {/* 🌑 Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617]/90 via-[#0F172A]/85 to-[#020617]/90" />

      {/* 🔥 Glow */}
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 blur-[120px] rounded-full"
      />
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/20 blur-[120px] rounded-full"
      />

      <div className="relative max-w-[1200px] mx-auto px-4 md:px-10 xl:px-0">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[85vh]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-white space-y-6 pt-10 lg:pb-20"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Run your restaurant
              <br />
              <span className="relative inline-block text-orange-400">
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="inline-block"
                >
                  {words[index]}
                </motion.span>

                {/* underline */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3"
                  viewBox="0 0 300 12"
                  fill="none"
                >
                  <path
                    d="M5 8C50 2 100 1 150 3C200 5 250 7 295 8"
                    stroke="#FB923C"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-md">
              Manage orders, deliveries, and customers in one powerful platform.
              Built for modern restaurants that move fast.
            </p>

            {/* CTA */}
            <div className="flex gap-4">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer bg-orange-500 hover:bg-orange-600 transition px-8 py-3 rounded-2xl text-lg font-semibold shadow-lg shadow-orange-500/30"
                >
                  Get Started
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-gray-500 cursor-pointer hover:bg-[#F54900] hover:border-orange-400 hover:text-white px-8 py-3 rounded-2xl text-lg font-semibold transition"
              >
                Live Demo
              </motion.button>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hidden lg:block relative"
          >
            {/* Glass */}
            <div className="absolute inset-0 bg-[#192037]/70 backdrop-blur-xl rounded-3xl border border-white/10" />

            <motion.img
              src={heroImage}
              alt="hero"
              className="relative z-10 rounded-3xl shadow-2xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import heroImage from "../../assets/sas/photo/photo1.jpg";
// import backgroundPhoto from "../../assets/sas/photo/bacground.jpeg";
// import { Link } from "react-router-dom";

// export default function HeroSection() {
//   const words = ["smarter,", "effortlessly,", "and profitably."];
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prev) => (prev + 1) % words.length);
//     }, 1800);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="relative overflow-hidden mt-[70px]">

//       {/* 🌆 Background Image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center scale-105"
//         style={{ backgroundImage: `url(${backgroundPhoto})` }}
//       />

//       {/* 🌑 Dark Overlay */}
//       <div className="absolute inset-0 bg-gradient-to-br from-[#020617]/90 via-[#0F172A]/85 to-[#020617]/90" />

//       {/* 🔥 Glow Effects */}
//       <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 blur-[120px] rounded-full" />
//       <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/20 blur-[120px] rounded-full" />

//       {/* Content */}
//       <div className="relative max-w-[1200px] mx-auto px-4 md:px-10 xl:px-0">
//         <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[85vh]">

//           {/* Left Content */}
//           <div className="text-white space-y-6 pt-10 lg:pb-20">

//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
//               Run your restaurant
//               <br />

//               <span className="relative inline-block text-orange-400">
//                 <span className="transition-all duration-500 ease-in-out">
//                   {words[index]}
//                 </span>

//                 {/* Curved underline */}
//                 <svg
//                   className="absolute -bottom-2 left-0 w-full h-3"
//                   viewBox="0 0 300 12"
//                   fill="none"
//                 >
//                   <path
//                     d="M5 8C50 2 100 1 150 3C200 5 250 7 295 8"
//                     stroke="#FB923C"
//                     strokeWidth="4"
//                     strokeLinecap="round"
//                   />
//                 </svg>
//               </span>
//             </h1>

//             <p className="text-lg md:text-xl text-gray-300 max-w-md">
//               Manage orders, deliveries, and customers in one powerful platform.
//               Built for modern restaurants that move fast.
//             </p>

//             {/* CTA Buttons */}
//             <div className="flex gap-4">
//               <Link to="/signup">
//                 <button className="bg-orange-500 cursor-pointer hover:bg-orange-600 transition px-8 py-3 rounded-2xl text-lg font-semibold shadow-lg shadow-orange-500/30">
//                   Get Started
//                 </button>
//               </Link>

//               <button className="border border-gray-500 cursor-pointer hover:bg-[#F54900] hover:border-orange-400 hover:text-white px-8 py-3 rounded-2xl text-lg font-semibold transition">
//                 Live Demo
//               </button>
//             </div>
//           </div>

//           {/* Right Image */}
//           <div className="hidden lg:block relative">

//             {/* Glass Card Effect */}
//             <div className="absolute inset-0 bg-[#192037]/70 backdrop-blur-xl rounded-3xl border border-white/10" />

//             <img
//               src={heroImage}
//               alt="hero"
//               className="relative z-10 rounded-3xl shadow-2xl"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
