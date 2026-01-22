"use client";

import { useEffect, useState } from "react";
import PerformanceCardGrid from "@/app/components/creatordashboard/performance/performancecard";
import { ArrowUpFromDot } from "lucide-react";
import TransactionTable from "@/app/components/creatordashboard/performance/transactions";
import RevenueSources from "@/app/components/creatordashboard/performance/revenue";
import { getCreatorDashboardStats } from "@/app/services/creatorDashboard.service";

export default function DashboardPage() {
  const [stats, setStats] = useState([
    {
      title: "Total Earnings",
      value: "Loading...",
      badge: {
        text: "Fetching data",
        color: "bg-gray-100 text-gray-600",
        icon: ArrowUpFromDot,
      },
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await getCreatorDashboardStats();
      const data = response.data;
      
      const upcomingPayout = data.payouts[0]?.upcomingPayout || 0;
      const payoutDate = data.payouts[0]?.payoutDate || "TBD";
      const nextPayoutDate = new Date(payoutDate).toLocaleDateString();
      
      const newStats = [
        {
          title: "Total Earnings",
          value: `$${data.totalEarnings.toLocaleString()}`,
          badge: {
            text: "Lifetime earnings",
            color: "bg-green-100 text-[#089206]",
            icon: ArrowUpFromDot,
          },
        },
        {
          title: "Engagement Score",
          value: `${(data.engagementScore).toFixed(1)}%`,
          badge: {
            text: "Overall performance",
            color: "bg-blue-100 text-blue-600",
            icon: ArrowUpFromDot,
          },
        },
        {
          title: "Upcoming Payout",
          value: `$${upcomingPayout.toLocaleString()}`,
          badge: {
            text: `Next payout: ${nextPayoutDate}`,
            color: "bg-purple-100 text-purple-600",
            icon: ArrowUpFromDot,
          },
        },
        {
          title: "Total Views",
          value: `${(data.totalViews / 1000).toFixed(1)}K`,
          badge: {
            text: `${data.totalPosts} posts`,
            color: "bg-green-100 text-green-600",
            icon: ArrowUpFromDot,
          },
        },
      ];
      setStats(newStats);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError("Failed to load performance data");
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
      <div className="bg-white w-full border border-[#D5D7DA] rounded-[12px] lg:p-6 py-4 px-1 p-0 max-w-auto mx-auto">
        <div className="p-4 lg:p-0">
          <h1 className="font-inter font-semibold lg:text-[24px] text-[20px] leading-[38px] tracking-[0] text-[#434342] mb-6">
            Performance & Earnings
          </h1>
          <div className="text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full border border-[#D5D7DA] rounded-[12px] lg:p-6 py-4 px-1 p-0 max-w-auto mx-auto">
      {/* Header */}
      <div className="p-4 lg:p-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 mb-6">
        <h1 className="font-inter font-semibold lg:text-[24px] text-[20px] leading-[38px] tracking-[0] text-[#434342]">
          Performance & Earnings
        </h1>
      </div>

      {/* Stats Grid */}
      <PerformanceCardGrid stats={stats} loading={loading} />
      <div className="mt-6">
        <RevenueSources />
      </div>
      <TransactionTable />
    </div>
  );
}
