"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import DashboardHeader from "./_components/DashboardHeader";
import DashboardSidebar from "./_components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 gap-4">
        <DashboardSidebar />
        <div className="flex-1 px-4">
          <DashboardHeader />
          <main className="mt-4 p-6 bg-white shadow rounded-sm h-[calc(100vh-100px)] overflow-y-scroll">
            <ScrollArea>{children}</ScrollArea>
          </main>
        </div>
      </div>
    </div>
  );
}
