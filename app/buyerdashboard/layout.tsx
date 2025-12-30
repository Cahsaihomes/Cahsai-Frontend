// app/buyerdashboard/layout.tsx
import React from "react";
import Sidebar from "@/components/ui/sidebar";

export default function BuyerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex bg-[#f9f7f3] rounded-lg overflow-hidden ">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 h-screen overflow-y-auto px-0 sm:px-4 lg:px-4 lg:py-4 py-2 ">
        {children}
      </main>
    </div>
  );
}
