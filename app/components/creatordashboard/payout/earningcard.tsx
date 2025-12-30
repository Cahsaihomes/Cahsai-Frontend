"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

type StatItem = {
  title: string;
  value: string;
  badge: {
    text: string;
    color: string; // Tailwind classes like "bg-blue-100 text-blue-600"
    icon: LucideIcon; // Lucide icon component
  };
};

interface EarningsCardGridProps {
  stats: StatItem[];
}

export default function EarningsCardGrid({ stats }: EarningsCardGridProps) {
  return (
    <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(220px,1fr))] mt-4">
      {stats.map((stat, idx) => {
        const Icon = stat.badge.icon;
        return (
          <Card
            key={idx}
            className="rounded-[10px] p-[16px] border border-[#E9EAEB] [box-shadow:1px_2px_4px_0px_#00000008,3px_7px_7px_0px_#00000008,7px_15px_10px_0px_#00000005,13px_26px_12px_0px_#00000000,20px_41px_13px_0px_#00000000]"
          >
            <CardContent className="p-4 space-y-2">
              <p className="text-[14px] text-[#434342] opacity-50 font-inter font-[500]">
                {stat.title}
              </p>
              <h3 className="text-[#434342] text-[24px] font-[500] font-inter">
                {stat.value}
              </h3>
              <div
                className={`inline-flex items-center text-xs px-2 py-1 rounded-md font-medium ${stat.badge.color}`}
              >
                <Icon className="w-3 h-3 mr-1" />
                {stat.badge.text}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
