
// import React from "react";
// import { ChevronRight } from "lucide-react";
// import { Link } from "react-router-dom";

interface ICommonBannerProp {
  title: string;
  route?: string;
  bgImage: string;
  description?: string;
}

const CommonBanner = ({ title, bgImage, description }: ICommonBannerProp) => {

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
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-4 max-w-4xl mx-auto space-y-3">
        {/* Title */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
          {title}
        </h1>

        {/* Subtitle / Paragraph */}
        {description && (
          <p className="text-sm md:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed text-balance drop-shadow-sm">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default CommonBanner;
