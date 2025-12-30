import React, { useState } from 'react'
import {
    Bookmark,
    ChevronDown,
    ChevronRight,
    Heart,
    Search,
    Share2,
} from "lucide-react";


import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Customized,
} from "recharts";
const VideoAnalytics = () => {
    const [timeframe, setTimeframe] = useState("week");
    const [year, setYear] = useState(2025);

    const [selectedMonth, setSelectedMonth] = useState<string>("September"); // default to current month
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    const [showYearDropdown, setShowYearDropdown] = useState(false);

    const data = [
        { day: "Monday", views: 60 },
        { day: "Tuesday", views: 70 },
        { day: "Wednesday", views: 55 },
        { day: "Thursday", views: 65 },
        { day: "Friday", views: 100 },
        { day: "Saturday", views: 110 },
        { day: "Sunday", views: 115 },
    ];

    const [activePoint, setActivePoint] = useState<any>(
        data.find((d) => d.day === "Friday")
    );
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
                {/* Total Clip Views */}
                <div className="bg-white rounded-md shadow p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-500">Total Clip Views</p>
                    <h3 className="text-xl sm:text-2xl font-semibold mt-2 sm:mt-4">54,320</h3>
                </div>

                {/* Total Earnings */}
                <div className="bg-white rounded-md shadow p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-xs sm:text-sm text-gray-500">Total Earnings</p>
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                    </div>
                    <div className="flex items-center justify-between mt-2 sm:mt-4">
                        <h3 className="text-xl sm:text-2xl font-semibold">$1,230</h3>
                        <span className="text-xs sm:text-sm text-gray-800">This Month</span>
                    </div>
                </div>

                {/* Engagement Score */}
                <div className="bg-white rounded-md shadow p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-500">Engagement Score</p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 sm:mt-4 gap-2 sm:gap-0">
                        <h3 className="text-xl sm:text-2xl font-semibold">82</h3>
                        <div className="flex items-center space-x-1 sm:space-x-1.5 text-xs sm:text-sm text-gray-500">
                            <Heart
                                className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500"
                                fill="#6f8375"
                                strokeWidth={0}
                            />
                            <span>1.2k</span>
                            <Share2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                            <span>458</span>
                            <Bookmark
                                className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500"
                                fill="#6f8375"
                                strokeWidth={0}
                            />
                            <span>326</span>
                        </div>
                    </div>
                </div>

                {/* Upcoming Payout */}
                <div className="bg-white rounded-md shadow p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gray-500">Upcoming Payout</p>
                    <div className="flex items-center mt-2 sm:mt-4">
                        <p className="text-sm sm:text-md text-gray-800 mr-2">March 15,</p>
                        <span className="text-xl sm:text-2xl font-semibold">$125</span>
                    </div>
                </div>
            </div>

            {/* Video Analytics Section */}
            <div className="bg-white rounded-md shadow p-3 sm:p-4 mt-6 sm:mt-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-3 sm:gap-0">
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold">Video Analytics</h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                            View complete video analytics now
                        </p>
                    </div>

                    <div className="flex items-center border rounded-md py-1 overflow-hidden relative w-full sm:w-auto">
                        {/* Week Button */}
                        <button
                            className={`px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-md ml-1 flex-1 sm:flex-none transition-colors ${timeframe === "week"
                                ? "bg-[#6f8375] text-white"
                                : "bg-white text-gray-700"
                                }`}
                            onClick={() => setTimeframe("week")}
                        >
                            Week
                        </button>

                        {/* Month Dropdown */}
                        <div className="relative flex-1 sm:flex-none">
                            <button
                                className={`px-2 sm:px-4 py-2 text-xs sm:text-sm min-w-[80px] sm:min-w-[120px] text-center rounded-md transition-colors w-full ${timeframe === "month"
                                    ? "bg-[#6f8375] text-white"
                                    : "bg-white text-gray-700"
                                    }`}
                                onClick={() => {
                                    setTimeframe("month");
                                    setShowMonthDropdown(!showMonthDropdown);
                                    setShowYearDropdown(false); // close year dropdown if open
                                }}
                            >
                                {selectedMonth || "Month"}
                            </button>

                            {showMonthDropdown && (
                                <ul className="absolute left-0 top-full mt-1 bg-white border rounded-md shadow w-32 sm:w-40 max-h-60 overflow-y-auto z-50">
                                    {[
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
                                    ].map((month) => (
                                        <li
                                            key={month}
                                            onClick={() => {
                                                setSelectedMonth(month);
                                                setShowMonthDropdown(false);
                                            }}
                                            className={`px-2 sm:px-3 py-2 cursor-pointer transition-colors text-xs sm:text-sm ${selectedMonth === month
                                                ? "bg-[#6f8375] text-white"
                                                : "hover:bg-[#6f8375] hover:text-white text-gray-700"
                                                }`}
                                        >
                                            {month}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Year Dropdown */}
                        <div className="relative flex-1 sm:flex-none">
                            <button
                                className={`px-2 sm:px-4 py-2 text-xs sm:text-sm min-w-[70px] sm:min-w-[100px] text-center rounded-md transition-colors flex items-center justify-between w-full ${timeframe === "year"
                                    ? "bg-[#6f8375] text-white"
                                    : "bg-white text-gray-700"
                                    }`}
                                onClick={() => {
                                    setTimeframe("year");
                                    setShowYearDropdown(!showYearDropdown);
                                    setShowMonthDropdown(false); // close month dropdown if open
                                }}
                            >
                                {year || "Year"}
                                <ChevronDown className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                            </button>

                            {showYearDropdown && (
                                <ul className="absolute left-0 top-full mt-1 bg-white border rounded-md shadow w-24 sm:w-32 max-h-60 overflow-y-auto z-50">
                                    {Array.from({ length: 21 }, (_, i) => 2010 + i).map((yr) => (
                                        <li
                                            key={yr}
                                            onClick={() => {
                                                setYear(yr);
                                                setShowYearDropdown(false);
                                            }}
                                            className={`px-2 sm:px-3 py-2 cursor-pointer transition-colors text-xs sm:text-sm ${year === yr
                                                ? "bg-[#6f8375] text-white"
                                                : "hover:bg-[#6f8375] hover:text-white text-gray-700"
                                                }`}
                                        >
                                            {yr}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="h-48 sm:h-56 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            onMouseMove={(state) => {
                                if (state.isTooltipActive && state.activePayload) {
                                    const point = state.activePayload[0].payload;
                                    setActivePoint(point);
                                }
                            }}
                            onMouseLeave={() => setActivePoint(null)}
                        >
                            <defs>
                                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6f8375" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6f8375" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <XAxis
                                dataKey="day"
                                interval={0}
                                scale="point"
                                padding={{ left: 15, right: 15 }}
                                tick={{ fontSize: 6.5, dy: 8 }}
                                height={40}
                            />
                            <YAxis hide />
                            <Tooltip content={() => null} />

                            <Area
                                type="monotone"
                                dataKey="views"
                                stroke="#6f8375"
                                fill="url(#colorViews)"
                                strokeWidth={2}
                            />

                            <Customized
                                component={(props: any) => {
                                    const { xAxisMap, yAxisMap } = props;
                                    if (!activePoint) return null;

                                    const xScale = xAxisMap[0].scale;
                                    const yScale = yAxisMap[0].scale;

                                    const x = xScale(activePoint.day);
                                    const y = yScale(activePoint.views);

                                    return (
                                        <g>
                                            <line
                                                x1={x}
                                                x2={x}
                                                y1={y}
                                                y2={yScale(0)}
                                                stroke="#6f8375"
                                                strokeDasharray="4 4"
                                            />
                                            <circle
                                                cx={x}
                                                cy={y}
                                                r={4}
                                                fill="#6f8375"
                                                stroke="#fff"
                                                strokeWidth={2}
                                            />
                                        </g>
                                    );
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>

                    {activePoint && (
                        <div
                            className="absolute bg-[#6f8375] text-white text-xs font-medium px-2 sm:px-3 py-1 rounded-md shadow-md pointer-events-none"
                            style={{
                                top: `${Math.max(10, (1 - activePoint.views / 120) * 100)}%`,
                                left: `${(data.findIndex((d) => d.day === activePoint.day) /
                                    (data.length - 1)) *
                                    100
                                    }%`,
                                transform: "translate(-50%, -100%)",
                                marginTop: "-8px",
                            }}
                        >
                            {activePoint.views}
                        </div>
                    )}
                </div>
            </div>

        </>
    )
}

export default VideoAnalytics