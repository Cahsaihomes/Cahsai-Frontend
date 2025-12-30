"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getCreatorVideoAnalytics } from "@/app/services/creatorDashboard.service";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
const defaultChartDataSets = {
  Week: [
    { period: "Monday", count: 0 },
    { period: "Tuesday", count: 0 },
    { period: "Wednesday", count: 0 },
    { period: "Thursday", count: 0 },
    { period: "Friday", count: 0 },
    { period: "Saturday", count: 0 },
    { period: "Sunday", count: 0 },
  ],
  Month: [
    { period: "Jan", count: 0 },
    { period: "Feb", count: 0 },
    { period: "Mar", count: 0 },
    { period: "Apr", count: 0 },
    { period: "May", count: 0 },
    { period: "Jun", count: 0 },
    { period: "Jul", count: 0 },
    { period: "Aug", count: 0 },
    { period: "Sep", count: 0 },
    { period: "Oct", count: 0 },
    { period: "Nov", count: 0 },
    { period: "Dec", count: 0 },
  ],
};

interface CustomTooltipPayload {
  value: number;
  payload: {
    total: number;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: CustomTooltipPayload[];
  label?: string;
}
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#6F8375] text-white px-3 py-2 rounded-lg shadow-lg border-0">
        <p className="font-semibold">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function VideoChart() {
  const [activeFilter, setActiveFilter] = useState<"Week" | "Month">("Week");
  const [year, setYear] = useState<string>("2025");
  const [monthData, setMonthData] = useState(defaultChartDataSets.Month);
  const [weekData, setWeekData] = useState(defaultChartDataSets.Week);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCreatorVideoAnalytics(activeFilter.toLowerCase(), year)
      .then((res) => {
        const apiData = res.data?.data || {};
        if (activeFilter === "Month") {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const chartData = months.map((m) => ({ period: m, count: apiData[m] ?? 0 }));
          setMonthData(chartData);
        } else if (activeFilter === "Week") {
          const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
          const chartData = days.map((d) => ({ period: d, count: apiData[d] ?? 0 }));
          setWeekData(chartData);
        }
      })
      .finally(() => setLoading(false));
  }, [activeFilter, year]);

  return (
    <Card className="shadow py-2">
      <CardHeader
        className="flex flex-col md:flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-2 pb-4"
      >
        <div className="py-2">
          <CardTitle className="font-inter font-semibold text-[20px] leading-[30px] text-[#434342]">
            Video Analytics
          </CardTitle>
          <p
            className="font-inter font-medium text-[14px] leading-[20px] text-[#434342] mt-1 opacity-60"
            style={{ letterSpacing: "0%" }}
          >
            View complete video analytics now
          </p>
        </div>
        <div className="flex gap-2">
          {(["Week", "Month"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 rounded-[7px] text-sm w-[77px] font-medium transition-colors h-[32px] ${
                activeFilter === filter
                  ? "bg-[#6F8375] text-white"
                  : "text-[#717680] hover:text-gray-800"
              }`}
            >
              {filter}
            </button>
          ))}
          <select
            value={year}
            onChange={e => setYear(e.target.value)}
            className="w-[88px] h-[32px] px-[14px] text-center align-middle font-inter text-[12px] font-normal leading-[20px] text-[#252B37] bg-white border border-[#E9EAEB] rounded-md hover:text-[#6F8375] focus:text-[#6F8375] cursor-pointer"
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={activeFilter === "Month" ? monthData : weekData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSeekers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6F8375" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6F8375" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="period"
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={10}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />

              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#6F8375"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSeekers)"
              />
            </AreaChart>
          </ResponsiveContainer>
      
        </div>
      </CardContent>
    </Card>
  );
}
