import Header from "@/components/layout/header/Header";
import React from "react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-center items-center">
      <Header />
      {children}
    </div>
  );
}
