"use client";
import React from "react";
import Sidebar from "@/components/ui/sidebar";
export default function AgentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex bg-[#f9f7f3] rounded-lg overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      {/* Main content */}
      <main className="flex-1 h-screen overflow-y-auto px-2 sm:px-4 lg:px-4 py-4">
        {children}
      </main>
    </div>
  );
}
