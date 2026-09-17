import React from "react";

interface LoaderProps {
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-center py-6 ${className}`}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1F2E4D] border-t-blue-500" />
    </div>
  );
};

export default Loader;
