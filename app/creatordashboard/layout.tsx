"use client";
import React from "react";
import Sidebar from "@/components/ui/sidebar";

export default function BuyerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex bg-[#f9f7f3] rounded-lg overflow-hidden">
      <Sidebar />
      {/* Main content */}
      <main className="flex-1 h-screen overflow-y-auto p-0 lg:p-4">
        {children}
      </main>
      {/* <main className="flex-1 h-screen overflow-y-auto px-2 sm:px-4 lg:px-4 py-4">
  {children}
</main> */}
    </div>
  );
}
