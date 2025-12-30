"use client";

import PerformanceCardGrid from "@/app/components/creatordashboard/performance/performancecard";

import { ArrowUpFromDot } from "lucide-react";

import TransactionTable from "@/app/components/creatordashboard/performance/transactions";
import RevenueSources from "@/app/components/creatordashboard/performance/revenue";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Earnings",
      value: "$1230",
      badge: {
        text: "+18.5% this month",
        color: "bg-green-100 text-[#089206]",
        icon: ArrowUpFromDot,
      },
    },
    {
      title: "Conversion Rate",
      value: "0.083%",
      badge: {
        text: "+2.1% improvement",
        color: "bg-blue-100 text-blue-600",
        icon: ArrowUpFromDot,
      },
    },
    {
      title: "This Month",
      value: "$200",
      badge: {
        text: "Next payout: March 15",
        color: "bg-purple-100 text-purple-600",
        icon: ArrowUpFromDot,
      },
    },
    {
      title: "Avg. Per Lead",
      value: "$27.33",
      badge: {
        text: "+5.2% vs last month",
        color: "bg-green-100 text-green-600",
        icon: ArrowUpFromDot,
      },
    },
  ];

  return (
    <div className="bg-white w-full border border-[#D5D7DA] rounded-[12px] lg:p-6 py-4 px-1 p-0 max-w-auto mx-auto">
      {/* Header */}
      <div className="p-4 lg:p-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 mb-6">
        <h1 className="font-inter font-semibold lg:text-[24px] text-[20px] leading-[38px] tracking-[0] text-[#434342]">
          Performance & Earnings
        </h1>
      </div>

      {/* Stats Grid */}
      <PerformanceCardGrid stats={stats} />
      <div className="mt-6">
        <RevenueSources />
      </div>
      <TransactionTable />
    </div>
  );
}
