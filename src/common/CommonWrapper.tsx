import React, { ReactNode } from "react";

// Define the props interface
interface CommonWrapperProps {
  children: ReactNode; // Type for children (can be any valid React node)
  className?: string; // Optional className prop
}

// Define the component
const CommonWrapper: React.FC<CommonWrapperProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`max-w-[1200px] mx-auto px-4 sm:px-3 md:px-10 lg:px-10 xl:px-0 py-16 md:py-20 lg:py-32 ${className}`}
    >
      {children}
    </div>
  );
};

export default CommonWrapper;
