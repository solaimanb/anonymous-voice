import React from "react";

interface TitleHeaderProps {
  getHeaderText: (() => string) | string;
}

const TitleHeader: React.FC<TitleHeaderProps> = ({ getHeaderText }) => {
  const headerText =
    typeof getHeaderText === "function" ? getHeaderText() : getHeaderText;

  return (
    <div className="relative mb-8 w-full">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#7FCCCC] rounded-lg" />
        <div className="absolute top-0 left-0 w-16 h-16">
          <div className="absolute inset-0 bg-[#98D9D9] rounded-full -translate-x-1/4 -translate-y-1/4" />
          <div className="absolute inset-0 bg-[#98D9D9] rounded-full translate-x-1/4 translate-y-1/4 scale-75" />
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 transform rotate-90">
          <div className="absolute inset-0 bg-[#98D9D9] rounded-full -translate-x-1/4 -translate-y-1/4" />
          <div className="absolute inset-0 bg-[#98D9D9] rounded-full translate-x-1/4 translate-y-1/4 scale-75" />
        </div>
      </div>
      <h1 className="relative text-center text-white text-2xl md:text-3xl font-semibold py-6">
        {headerText}
      </h1>
    </div>
  );
};

export default TitleHeader;
