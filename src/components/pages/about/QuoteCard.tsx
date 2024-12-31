import React from "react";

interface QuoteCardProps {
  children: React.ReactNode;
}

export default function QuoteCard({ children }: QuoteCardProps) {
  return (
    <div className="bg-[#86C6C6] bg-opacity-80 rounded-xl p-6 relative overflow-hidden">
      {/* Decorative Corners */}
      <div className="absolute top-2 left-2 w-6 h-6 text-[#E1F3F3]">✤</div>
      <div className="absolute bottom-2 right-2 w-6 h-6 text-[#E1F3F3]">✤</div>

      <p
        className="text-white text-center px-4"
        dangerouslySetInnerHTML={{ __html: children as string }}
      ></p>
    </div>
  );
}
