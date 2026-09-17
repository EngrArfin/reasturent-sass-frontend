
// import React from "react";
// import { ChevronRight } from "lucide-react";
// import { Link } from "react-router-dom";

interface ICommonBannerProp {
  title: string;
  route: string;
  bgImage: string;
}

const CommonBanner = ({ title, route, bgImage }: ICommonBannerProp) => {
  const parts = route.split("/").map((s) => s.trim());

  return (
    <div className="relative h-72 md:h-[380px] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <img
        src={bgImage}
        alt="bannerBg"
        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
      />

      {/* Dark & Brand Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/90 via-[#07090D]/80 to-[#07090D]" />
      <div className="absolute inset-0 bg-radial from-orange-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-40 bg-orange-500/15 blur-[120px] pointer-events-none rounded-full" />

      {/* Centered Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-4 max-w-4xl mx-auto space-y-4">
        {/* Breadcrumb pill */}
        {/* <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md text-xs font-medium text-slate-300">
          <Link to="/" className="text-slate-400 hover:text-orange-400 transition-colors">
            {parts[0] || "Home"}
          </Link>
          {parts.slice(1).map((part, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-orange-400 font-semibold">{part}</span>
            </React.Fragment>
          ))}
        </div> */}

        {/* Title */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default CommonBanner;
