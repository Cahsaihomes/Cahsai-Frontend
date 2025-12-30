"use client";

import React, { useState, useEffect } from "react";
import { getAgentDashboardStats } from "../../services/agentDashboard.service";
import { Search, Upload, MoreVertical, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getVideoAnalytics } from "./../../services/analytics.service";
import { getCustomers } from "../../services/analytics.service";
import { getUpcomingTours, Tour } from "../../services/agentDashboard.service";
import {
  getClaimedTours,
  ClaimedTour,
} from "../../services/agentDashboard.service";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Check } from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";

const weekData = [
  { label: "Monday", value: 4 },
  { label: "Tuesday", value: 5 },
  { label: "Wednesday", value: 6 },
  { label: "Thursday", value: 8 },
  { label: "Friday", value: 10 },
  { label: "Saturday", value: 7 },
  { label: "Sunday", value: 6 },
];

const monthData = [
  { label: "Jan", value: 3 },
  { label: "Feb", value: 4 },
  { label: "Mar", value: 6 },
  { label: "Apr", value: 5 },
  { label: "May", value: 8 },
  { label: "Jun", value: 9 },
  { label: "Jul", value: 10 },
  { label: "Aug", value: 9 },
  { label: "Sep", value: 10 },
  { label: "Oct", value: 11 },
  { label: "Nov", value: 12 },
  { label: "Dec", value: 13 },
];
const tourData = [
  {
    id: 1,
    name: "Joun Slame",
    address: "123 Main ST",
    time: "10:00 AM",
    status: "Confirmed",
    type: "Virtual",
    avatar: "/images/agent.png",
  },
  {
    id: 2,
    name: "Joun Slame",
    address: "123 Main ST",
    status: "Pending",
    avatar: "/images/agent.png",
    time: "12:00 AM",
  },
];

const ChartTooltipContent = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#6F8375] text-white text-xs rounded px-2 py-1 shadow">
        {payload[0].value}
      </div>
    );
  }
  return null;
};

const salesData = [
  // Outer ring
  { name: "Social Media", value: 95, ring: "outer", color: "#ECE6DB" },
  { name: "Social Media", value: 5, ring: "outer", color: "#E9E9E9" },

  // Middle ring
  { name: "Social Media", value: 90, ring: "middle", color: "#6F8375" },
  { name: "Social Media", value: 10, ring: "middle", color: "#E9E9E9" },

  // Inner ring
  { name: "Social Media", value: 85, ring: "inner", color: "#E4C79D" },
  { name: "Social Media", value: 15, ring: "inner", color: "#E9E9E9" },

  // most Inner ring
  { name: "Social Media", value: 80, ring: "mostInner", color: "#628E8E" },
  { name: "Social Media", value: 20, ring: "mostInner", color: "#E9E9E9" },
];

const outerRingData = salesData.filter((item) => item.ring === "outer");
const middleRingData = salesData.filter((item) => item.ring === "middle");
const innerRingData = salesData.filter((item) => item.ring === "inner");
const mostInnerRingData = salesData.filter((item) => item.ring === "mostInner");

const revenueData = [
  { month: "Jan", primary: 25, secondary: 15 },
  { month: "Feb", primary: 35, secondary: 25 },
  { month: "Mar", primary: 15, secondary: 10 },
  { month: "Apr", primary: 30, secondary: 20 },
  { month: "May", primary: 20, secondary: 15 },
  { month: "Jun", primary: 40, secondary: 30 },
  { month: "Jul", primary: 25, secondary: 15 },
  { month: "Aug", primary: 30, secondary: 20 },
  { month: "Sep", primary: 20, secondary: 15 },
  { month: "Oct", primary: 35, secondary: 25 },
  { month: "Nov", primary: 45, secondary: 35 },
  { month: "Dec", primary: 25, secondary: 15 },
];

// Update the revenueChartConfig
const revenueChartConfig = {
  primary: {
    label: "Primary Revenue",
    color: "#4a5d4a",
  },
  secondary: {
    label: "Secondary Revenue",
    color: "#a8b5a8",
  },
};
const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
};

const salesChartConfig = {
  social1: {
    label: "Social Media",
    color: "#10b981",
  },
  social2: {
    label: "Social Media",
    color: "#6b7280",
  },
  social3: {
    label: "Social Media",
    color: "#d1d5db",
  },
  social4: {
    label: "Social Media",
    color: "#f3f4f6",
  },
};

const circleColors = ["#E4C79D", "#6C9898", "#B9B9B3", "#6F8375"];

export default function Dashboard() {
  const [view, setView] = useState<"week" | "month">("week");
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState(2025);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = 2025;
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);
  const staticData = view === "week" ? weekData : monthData;
  const referenceIndex = view === "week" ? 4 : 8;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const router = useRouter();
  const handleClick = () => {
    router.push("/agentdashboard/clips-edit/upload-post");
  };

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await getAgentDashboardStats();
        setDashboardStats(res?.data || null);
      } catch (error) {}
    }
    fetchStats();
  }, []);

  const {
    data: analyticsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["videoAnalytics", view, selectedYear],
    queryFn: async () => {
      const res = await getVideoAnalytics(view, selectedYear);

      if (res?.data) {
        return Object.entries(res.data).map(([label, value]) => ({
          label,
          value,
        }));
      }

      return [];
    },
  });

  const {
    data: customersData,
    isLoading: isCustomersLoading,
    isError: isCustomersError,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const {
    data: upcomingTours,
    isLoading: isToursLoading,
    isError: isToursError,
  } = useQuery({
    queryKey: ["upcomingTours"],
    queryFn: getUpcomingTours,
  });

  const {
    data: claimedTours,
    isLoading: isClaimedLoading,
    isError: isClaimedError,
  } = useQuery({
    queryKey: ["claimedTours"],
    queryFn: getClaimedTours,
  });

  return (
    <div className="min-h-screen bg-white border border-[#D5D7DA] rounded-[12px] px-0 py-6 sm:px-2 lg:px-1">
      <div className="max-w-full mx-auto space-y-6 px-2 sm:px-4 lg:px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-inter font-semibold lg:text-[24px] text-[20px] leading-[38px] tracking-[0] text-[#434342]">
              Dashboard
            </h1>
            <p className="text-sm text-gray-600">Welcome to Cahsai</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search"
                className="pl-10 w-full sm:w-64 bg-white border-gray-200"
              />
            </div>
            <Button
              onClick={handleClick}
              className="bg-[#6F8375] hover:bg-[#6F8375] text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Post
            </Button>
          </div>
        </div>

        {/* <div className="w-full flex flex-col sm:flex-row gap-4 mb-4"> */}
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(220px,1fr))] mt-4 mb-4">
          {[
            {
              label: "Total Post Views",
              value: dashboardStats?.totalPostsView ?? "0", // ✅ fixed
            },

            {
              label: "Converted Leads",
              value: dashboardStats?.convertedLeads ?? "0", // ✅ add this too
            },
            {
              label: "Lead Conversion Rate",
              value: dashboardStats?.leadConversionRate ?? "--",
            },
            {
              label: "Pending Tours",
              value: dashboardStats?.pendingTours ?? "0",
            },
            {
              label: "Confirmed Tours",
              value: dashboardStats?.confirmedTours ?? "0",
            },
          ].map((item, idx) => (
            <div
              key={item.label}
              className="flex-1 min-w-[180px] max-w-xs h-[100px] rounded-[10px] border border-gray-200 p-4 flex flex-col justify-center gap-1 bg-white shadow-sm overflow-hidden"
            >
              <p className="text-sm text-gray-600 mb-1 truncate">
                {item.label}
              </p>
              <p className="text-2xl font-semibold text-gray-900 truncate">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-2">
          {/* Video Analytics Card */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Video Analytics
                </h2>
                <p className="text-sm text-gray-500">
                  View complete video analytics now
                </p>
              </div>
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 py-1">
                <button
                  onClick={() => setView("week")}
                  className={`px-4 py-1 rounded-md text-sm font-medium focus:outline-none transition-all ${
                    view === "week"
                      ? "bg-[#6F8375] text-white shadow"
                      : "bg-transparent text-gray-700"
                  }`}
                  style={{ minWidth: 60 }}
                >
                  Week
                </button>
                <button
                  onClick={() => setView("month")}
                  className={`px-4 py-1 rounded-md text-sm font-medium focus:outline-none transition-all ${
                    view === "month"
                      ? "bg-[#6F8375] text-white shadow"
                      : "bg-transparent text-gray-700"
                  }`}
                  style={{ minWidth: 60 }}
                >
                  Month
                </button>
                <div className="flex gap-3 ml-3 mr-0">
                  <div className="relative">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="appearance-none bg-transparent border-none text-gray-700 text-sm font-medium pr-2 focus:outline-none flex items-center gap-2"
                          type="button"
                        >
                          {selectedYear}
                          <ChevronDown className="w-5 h-5 text-[#6F8375]" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-[6rem]">
                        {years.map((year) => (
                          <DropdownMenuItem
                            key={year}
                            onSelect={() => setSelectedYear(year)}
                            className={`px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:bg-blue-50 ${
                              selectedYear === year
                                ? "bg-gray-100 text-[#6F8375]"
                                : ""
                            }`}
                          >
                            {selectedYear === year && (
                              <Check className="w-4 h-4 mr-2 text-[#6F8375] inline" />
                            )}
                            {year}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
            {/* 📊 Chart */}
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analyticsData ?? staticData}
                  onMouseMove={(state) => {
                    if (state && state.activeTooltipIndex != null) {
                      setHoveredIndex(state.activeTooltipIndex);
                    }
                  }}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <defs>
                    <linearGradient
                      id="areaGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#6F8375"
                        stopOpacity={0.18}
                      />
                      <stop offset="100%" stopColor="#6F8375" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#6F8375"
                    strokeWidth={3}
                    fill="url(#areaGradient)"
                    dot={false}
                    activeDot={{ r: 6, fill: "#6F8375" }}
                  />
                  {hoveredIndex !== null && (
                    <ReferenceLine
                      x={(analyticsData ?? staticData)[hoveredIndex]?.label}
                      strokeDasharray="3 3"
                      stroke="#6F8375"
                    />
                  )}
                  <RechartsTooltip
                    content={({ active, payload }) =>
                      active && payload?.length ? (
                        <div className="bg-[#6F8375] text-white px-2 py-1 text-xs rounded shadow">
                          {payload[0].value}
                        </div>
                      ) : null
                    }
                    cursor={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <Card>
            <CardHeader className="pt-3 pb-2">
              <CardTitle>Recent Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isCustomersLoading && <p>Loading customers...</p>}
                {isCustomersError && (
                  <p className="text-red-500">Failed to load customers.</p>
                )}
                {customersData?.map((customer: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={customer.avatar || "/images/agent.png"}
                      />
                      <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                        {customer.name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("") || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {customer.name}
                      </p>
                      <p className="text-xs text-gray-600">{customer.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-2">
          {/* upcoming tours */}
          <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <CardHeader className="pb-6 pt-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Upcoming Tours
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-6 w-6 mt-2" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {isToursLoading && <p>Loading tours...</p>}
              {isToursError && (
                <p className="text-red-500">Failed to load upcoming tours.</p>
              )}
              {upcomingTours?.length === 0 && !isToursLoading && (
                <p className="text-gray-500 text-sm">
                  No upcoming tours found.
                </p>
              )}
              {upcomingTours?.map((tour) => (
                <div
                  key={tour.id}
                  className="p-4 rounded-md border border-gray-100 shadow-sm space-y-3"
                >
                  {/* Row 1: Profile and Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={tour.avatar || "/images/agent.png"}
                        alt={`${tour.name} avatar`}
                        className="w-10 h-10 rounded-full"
                      />
                      <p className="font-medium text-gray-900">{tour.name}</p>
                    </div>
                    <span
                      className={`text-sm px-3 py-0.5 rounded-full font-medium ${
                        tour.status === "Confirmed"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {tour.status}
                    </span>
                  </div>

                  {/* Row 2: Location */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="bg-orange-50 p-1.5 rounded-full">
                      <MapPin className="w-4 h-4 text-orange-500" />
                    </div>
                    <span>{tour.address}</span>
                  </div>

                  {/* Row 3: Time & Type */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="bg-blue-50 p-1.5 rounded-full">
                      <Clock className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex justify-between w-full">
                      <span>{tour.time}</span>
                      {tour.type && (
                        <span className="text-gray-500">{tour.type}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Revenue Statistic (Projects Claimed Overview) */}
          <Card className="bg-white border-gray-200 flex flex-col justify-between min-h-[22rem] lg:min-h-[26rem]">
            <CardHeader className="pb-4">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 mt-2">
                  Projects Claimed Overview
                </CardTitle>
                <hr className="border-gray-200 my-4" />
              </div>
            </CardHeader>

            <CardContent>
              {isClaimedLoading && <p>Loading claimed tours...</p>}

              {isClaimedError && (
                <p className="text-red-500">Failed to load claimed tours.</p>
              )}

              {!isClaimedLoading &&
                Array.isArray(claimedTours) &&
                claimedTours.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    No claimed tours found.
                  </p>
                )}

              {Array.isArray(claimedTours) && claimedTours.length > 0 && (
                <div className="h-50 w-full relative">
                  <ChartContainer
                    config={revenueChartConfig}
                    className="h-full w-full"
                  >
                    <BarChart data={claimedTours} barCategoryGap="25%">
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        interval={1}
                        tickFormatter={(value) => {
                          const showMonths = [
                            "Jan",
                            "Mar",
                            "May",
                            "Jul",
                            "Sep",
                            "Nov",
                            "Dec",
                          ];
                          return showMonths.includes(value) ? value : "";
                        }}
                      />
                      <YAxis hide />
                      <Bar
                        dataKey="primary"
                        stackId="revenue"
                        fill="#4a5d4a"
                        radius={[0, 0, 0, 0]}
                        maxBarSize={25}
                      />
                      <Bar
                        dataKey="secondary"
                        stackId="revenue"
                        fill="#a8b5a8"
                        radius={[3, 3, 0, 0]}
                        maxBarSize={25}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        cursor={false}
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
