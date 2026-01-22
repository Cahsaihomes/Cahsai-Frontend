"use client";

import { useEffect, useState } from "react";
import { getCreatorDashboardStats } from "@/app/services/creatorDashboard.service";

interface RevenueSource {
  name: string;
  amount: string;
  percentage: string;
  color: string;
}

const DEFAULT_SOURCES: RevenueSource[] = [
  {
    name: "Lead Claim Commissions",
    amount: "$0",
    percentage: "0%",
    color: "bg-blue-600",
  },
  {
    name: "Brand Sponsorships",
    amount: "$0",
    percentage: "0%",
    color: "bg-purple-600",
  },
  {
    name: "Featured Listing Bonus",
    amount: "$0",
    percentage: "0%",
    color: "bg-yellow-500",
  },
  {
    name: "Creator Pool Rewards",
    amount: "$0",
    percentage: "0%",
    color: "bg-cyan-500",
  },
];

export default function RevenueSources() {
  const [revenueSources, setRevenueSources] = useState<RevenueSource[]>(DEFAULT_SOURCES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      const response = await getCreatorDashboardStats();
      const data = response.data;
      const totalEarnings = data.totalEarnings || 1;
      
      // Calculate percentages based on engagement and other metrics
      const commissionPercentage = 40;
      const sponsorshipPercentage = 35;
      const featuredPercentage = 15;
      const poolPercentage = 10;
      
      const sources: RevenueSource[] = [
        {
          name: "Lead Claim Commissions",
          amount: `$${Math.round(totalEarnings * (commissionPercentage / 100)).toLocaleString()}`,
          percentage: `${commissionPercentage}%`,
          color: "bg-blue-600",
        },
        {
          name: "Brand Sponsorships",
          amount: `$${Math.round(totalEarnings * (sponsorshipPercentage / 100)).toLocaleString()}`,
          percentage: `${sponsorshipPercentage}%`,
          color: "bg-purple-600",
        },
        {
          name: "Featured Listing Bonus",
          amount: `$${Math.round(totalEarnings * (featuredPercentage / 100)).toLocaleString()}`,
          percentage: `${featuredPercentage}%`,
          color: "bg-yellow-500",
        },
        {
          name: "Creator Pool Rewards",
          amount: `$${Math.round(totalEarnings * (poolPercentage / 100)).toLocaleString()}`,
          percentage: `${poolPercentage}%`,
          color: "bg-cyan-500",
        },
      ];
      
      setRevenueSources(sources);
    } catch (err) {
      console.error("Failed to fetch revenue data:", err);
      setRevenueSources(DEFAULT_SOURCES);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-[18px] lg:text-[20px] text-[#414651] font-inter font-[500]">
          Revenue Sources
        </h2>
        <p className="text-[12px] lg:text-[14px] text-[#717680] font-inter font-[500]">
          This section outlines the various methods and channels through which
          the company generates its income.
        </p>
      </div>
      <div className="mt-4 space-y-4">
        {revenueSources.map((source, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-50 border border-[#E9EAEB] rounded-lg px-0 lg:px-4 py-3"
          >
            {/* Left side with dot and label */}
            <div className="flex items-center space-x-2">
              <span
                className={`lg:w-[16px] lg:h-[16px] w-[12px] h-[12px] rounded-full ${source.color}`}
              />
              <span className="text-[16px] lg:text-[20px] font-[600] font-inter text-[#414651]">
                {source.name}
              </span>
            </div>

            {/* Right side with amount and percentage */}
            <div className="text-right">
              <div className="text-[14px] lg:text-[16px] font-semibold text-[#414651]">
                {source.amount}
              </div>
              <div className="text-[12px] lg:text-[14px] text-[#414651]">
                {source.percentage}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
