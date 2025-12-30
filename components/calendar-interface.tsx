"use client";

import { useState, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  getDayTours,
  getMonthTours,
  getWeekTours,
  GroupedTours,
  TourAppointment,
} from "@/app/services/calendar.service";

const tabs = ["Days", "Week", "Months"] as const;

export default function Component() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Days");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  // Add state for month/year/week/day navigation
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // 0-indexed
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  // For week navigation, store the start date of the week (as a Date object)
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const d = new Date(today);
    d.setDate(d.getDate() - d.getDay()); // set to Sunday
    return d;
  });
  // For day navigation, store the current day (as a Date object)
  const [currentDay, setCurrentDay] = useState<Date>(today);
  const dayQuery = useQuery<TourAppointment[]>({
    queryKey: ["tours", "day", currentDay.toISOString().slice(0, 10)],
    queryFn: () => getDayTours(currentDay.toISOString().slice(0, 10)),
    enabled: activeTab === "Days",
  });

  const weekQuery = useQuery<GroupedTours[]>({
    queryKey: ["tours", "week", currentWeekStart.toISOString().slice(0, 10), (() => {
      const end = new Date(currentWeekStart);
      end.setDate(end.getDate() + 6);
      return end.toISOString().slice(0, 10);
    })()],
    queryFn: () => {
      const start = currentWeekStart.toISOString().slice(0, 10);
      const end = (() => {
        const d = new Date(currentWeekStart);
        d.setDate(d.getDate() + 6);
        return d.toISOString().slice(0, 10);
      })();
      return getWeekTours(start, end);
    },
    enabled: activeTab === "Week",
  });

  const monthQuery = useQuery<GroupedTours[]>({
    queryKey: ["tours", "month", currentMonth, currentYear],
    queryFn: () => getMonthTours(currentMonth, currentYear),
    enabled: activeTab === "Months",
  });

  const appointmentsData =
    activeTab === "Days"
      ? dayQuery.data || []
      : activeTab === "Week"
      ? weekQuery.data || []
      : monthQuery.data || [];

  const headingDate = useMemo(() => {
    if (activeTab === "Days") {
      return currentDay.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    if (activeTab === "Week") {
      const start = currentWeekStart;
      const end = new Date(currentWeekStart);
      end.setDate(end.getDate() + 6);
      return `${start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    }

    if (activeTab === "Months") {
      // Always show the current month/year, even if no data
      return new Date(currentYear, currentMonth, 1).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }

    return "";
  }, [activeTab, dayQuery.data, weekQuery.data, monthQuery.data, currentMonth, currentYear]);

  const daysInMonth = useMemo(() => {
    if (monthQuery.data?.length) {
      const firstDate = new Date(monthQuery.data[0].date);
      const year = firstDate.getFullYear();
      const month = firstDate.getMonth();
      return new Date(year, month + 1, 0).getDate();
    }
    return 30;
  }, [monthQuery.data]);

  const selectedDateAppointments =
    activeTab === "Months" && selectedDate
      ? (appointmentsData as GroupedTours[]).find(
          (g) => new Date(g.date).getDate() === selectedDate
        )?.appointments || []
      : [];

  function getCalendarGridDates(year: number, month: number) {
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    const startDay = startOfMonth.getDay();
    const endDay = endOfMonth.getDay();

    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const prevMonthDates = Array.from({ length: startDay }, (_, i) => ({
      date: new Date(year, month - 1, daysInPrevMonth - startDay + i + 1),
      isCurrentMonth: false,
    }));

    const currentMonthDates = Array.from(
      { length: endOfMonth.getDate() },
      (_, i) => ({
        date: new Date(year, month, i + 1),
        isCurrentMonth: true,
      })
    );

    const nextMonthDates = Array.from({ length: 6 - endDay }, (_, i) => ({
      date: new Date(year, month + 1, i + 1),
      isCurrentMonth: false,
    }));

    return [...prevMonthDates, ...currentMonthDates, ...nextMonthDates];
  }

  return (
    <div className="lg:p-6 py-4 px-1 p-0 bg-white border border-[#D5D7DA] rounded-[12px] min-h-screen ">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="mb-4 font-inter font-semibold lg:text-[24px] text-[20px] leading-[38px] tracking-[0] text-[#434342]">
          Calendar
        </h1>

        {/* Tab Navigation */}
        <div className="flex gap-2 bg-white border border-gray-200 rounded-lg p-1 w-full sm:w-fit whitespace-nowrap">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none rounded-md px-4 sm:px-6 text-sm sm:text-base transition-colors ${
                activeTab === tab
                  ? "bg-[#6F8375] text-white hover:bg-[#6F8375]"
                  : "text-gray-600 hover:text-white hover:bg-[#6F8375]"
              }`}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 sm:h-10 sm:w-10 bg-transparent"
          onClick={() => {
            if (activeTab === "Months") {
              setCurrentMonth((prev) => {
                if (prev === 0) {
                  setCurrentYear((y) => y - 1);
                  return 11;
                }
                return prev - 1;
              });
            } else if (activeTab === "Week") {
              setCurrentWeekStart((prev) => {
                const d = new Date(prev);
                d.setDate(d.getDate() - 7);
                return d;
              });
            } else if (activeTab === "Days") {
              setCurrentDay((prev) => {
                const d = new Date(prev);
                d.setDate(d.getDate() - 1);
                return d;
              });
            }
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-base sm:text-lg font-medium text-gray-900 text-center">
          {headingDate}
        </h2>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 sm:h-10 sm:w-10 bg-transparent"
          onClick={() => {
            if (activeTab === "Months") {
              setCurrentMonth((prev) => {
                if (prev === 11) {
                  setCurrentYear((y) => y + 1);
                  return 0;
                }
                return prev + 1;
              });
            } else if (activeTab === "Week") {
              setCurrentWeekStart((prev) => {
                const d = new Date(prev);
                d.setDate(d.getDate() + 7);
                return d;
              });
            } else if (activeTab === "Days") {
              setCurrentDay((prev) => {
                const d = new Date(prev);
                d.setDate(d.getDate() + 1);
                return d;
              });
            }
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day Tab */}
  {activeTab === "Days" && (
        <div className="space-y-4">
          {(appointmentsData as TourAppointment[]).map((appointment) => (
            <Card
              key={appointment.id}
              className="border border-gray-200 shadow-sm"
            >
              <CardContent className="p-6">
                {/* Top Section */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  {/* Left: avatar + info */}
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={appointment.avatar || ""} />
                      <AvatarFallback>
                        {appointment.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {appointment.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {appointment.phone}
                      </p>
                      <p className="text-sm text-gray-600">
                        {appointment.email}
                      </p>
                      <p className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                        {appointment.address}
                      </p>
                    </div>
                  </div>

                  {/* Right: status + role + time ago */}
                  <div className="mt-4 sm:mt-0 text-right">
                    <Badge
                      className={
                        appointment.status === "Confirmed"
                          ? "bg-green-100 text-[#6F8375]"
                          : "bg-green-100 text-[#6F8375]"
                      }
                    >
                      {appointment.status}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-2 gap-7">
                      {appointment.role} {appointment.timeAgo}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="text-gray-600 border-gray-300 bg-transparent"
                  >
                    Start Tour Notes
                  </Button>
                  <Button
                    variant="outline"
                    className="text-gray-600 border-gray-300 bg-transparent"
                  >
                    Send Pre-Tour Message
                  </Button>
                  <Button
                    variant="outline"
                    className="text-gray-600 border-gray-300 bg-transparent"
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="outline"
                    className="text-gray-600 border-gray-300 bg-transparent"
                  >
                    Send DreamDrop Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* Week Tab */}
      {activeTab === "Week" && (
        <div className="space-y-6">
          {(appointmentsData as GroupedTours[]).map((group) => (
            <div key={group.date}>
              {/* Date Heading */}
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
                {new Date(group.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </h3>

              {/* Cards in 2-column grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {group.appointments.map((appointment) => (
                  <Card
                    key={appointment.id}
                    className="border border-gray-200 shadow-sm"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {appointment.time}
                        </span>
                        <Badge
                          className={
                            appointment.status === "Confirmed"
                              ? "bg-green-100 text-[#6F8375]"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          {appointment.address}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.name}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Month Tab */}
      {activeTab === "Months" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg">
            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 mb-2 sm:mb-4">
              {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs sm:text-sm font-medium text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-7 gap-2 sm:gap-4">
              {Array.from({ length: daysInMonth }, (_, i) => {
                const date = i + 1;
                const datesWithAppointments = new Set(
                  (appointmentsData as GroupedTours[]).map((g) =>
                    new Date(g.date).getDate()
                  )
                );
                const hasAppointment = datesWithAppointments.has(date);

                return (
                  <div
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`p-2 sm:p-4 border rounded-lg text-center cursor-pointer ${
                      selectedDate === date
                        ? "bg-[#6F8375] text-white border-[#6F8375]"
                        : hasAppointment
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <span className="text-sm font-medium">{date}</span>
                    {hasAppointment && (
                      <div className={`mt-1 w-2 h-2 rounded-full mx-auto ${selectedDate === date ? "bg-white" : "bg-green-500"}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Appointments */}
            {selectedDateAppointments.length > 0 && (
              <div className="mt-6 sm:mt-8">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                  Appointments for {headingDate} {selectedDate}
                </h3>
                <div className="space-y-4">
                  {selectedDateAppointments.map((appointment) => (
                    <Card
                      key={appointment.id}
                      className="border border-gray-200 shadow-sm"
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={appointment.avatar || "/placeholder.svg"}
                              />
                              <AvatarFallback className="bg-gray-300 text-xs">
                                {appointment.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {appointment.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {appointment.phone}
                              </p>
                              <p className="text-sm text-gray-600">
                                {appointment.email}
                              </p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right mt-2 sm:mt-0">
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              {appointment.time}
                            </div>
                            <Badge
                              variant={
                                appointment.status === "Confirmed"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                appointment.status === "Confirmed"
                                  ? "bg-green-100 text-[#6F8375]"
                                  : "bg-gray-100 text-gray-700"
                              }
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            {appointment.address}
                          </div>
                          <span className="text-sm text-gray-500 sm:ml-auto mt-1 sm:mt-0">
                            {appointment.role} {appointment.timeAgo}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Button
                            variant="outline"
                            className="text-gray-600 border-gray-300 bg-transparent"
                          >
                            Start Tour Notes
                          </Button>
                          <Button
                            variant="outline"
                            className="text-gray-600 border-gray-300 bg-transparent"
                          >
                            Send Pre-Tour Message
                          </Button>
                          <Button
                            variant="outline"
                            className="text-gray-600 border-gray-300 bg-transparent"
                          >
                            Reschedule
                          </Button>
                          <Button
                            variant="outline"
                            className="text-gray-600 border-gray-300 bg-transparent"
                          >
                            Send DreamDrop Preview
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
