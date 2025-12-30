"use client";

import React, { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import { Check, ChevronsUpDown } from "lucide-react";

export default function AllClips() {
  // Separate arrays for different clip data
  const clipTitles = [
    "Modern Farmhouse Tour",
    "Minimalist Living Room",
    "Kitchen Renovation",
    "Bedroom Makeover",
    "Garden Design Ideas",
  ];

  const clipThumbnails = [
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1200&auto=format&fit=crop",
  ];

  const clipViews = [18232, 15420, 12350, 9876, 7654];

  const clipWatchTimes = [
    { duration: "0:43", completion: "68%" },
    { duration: "1:25", completion: "82%" },
    { duration: "2:10", completion: "45%" },
    { duration: "1:55", completion: "73%" },
    { duration: "3:20", completion: "56%" },
  ];

  const clipPostDates = [
    "Posted 2 weeks ago",
    "Posted 1 week ago",
    "Posted 3 days ago",
    "Posted 5 days ago",
    "Posted 1 day ago",
  ];

  // Dropdown options
  const filterOptions = [
    { value: "all", label: "All Clips" },
    { value: "high-performance", label: "High Performance" },
    { value: "most-saves", label: "Most Saves" },
  ];

  const sortOptions = [
    { value: "most-recent", label: "Most Recent" },
    { value: "most-view", label: "Most View" },
    { value: "most-saves", label: "Most Saves" },
    { value: "high-to-low", label: "Prices: High to Low" },
    { value: "low-to-high", label: "Prices: Low to High" },
  ];

  const [filterType, setFilterType] = useState(filterOptions[0]);
  const [sortBy, setSortBy] = useState(sortOptions[0]);
  const [expandedClips, setExpandedClips] = useState<number[]>([]);
  const [openMenus, setOpenMenus] = useState<number[]>([]);

  const toggleClipDetails = (index: number) => {
    setExpandedClips((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleMenu = (index: number) => {
    setOpenMenus((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const closeAllMenus = () => {
    setOpenMenus([]);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".menu-container")) {
        closeAllMenus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mt-6">
      {/* Filter dropdowns */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 w-full">
        {/* Filter Type */}
        <div className="w-full md:w-1/2">
          <Dropdown
            value={filterType}
            onChange={setFilterType}
            options={filterOptions}
          />
        </div>

        {/* Sort By */}
        <div className="w-full md:w-1/2">
          <Dropdown value={sortBy} onChange={setSortBy} options={sortOptions} />
        </div>
      </div>

      {/* Clips List */}
      <div
        style={{ scrollbarWidth: "none" }}
        className="space-y-4 max-h-[300px] overflow-y-auto"
      >
        {clipTitles.map((title, index) => (
          <div key={index} className="rounded-xl bg-gray-50 ring-1 ring-gray-200">
            {/* Desktop Layout */}
            <div className="hidden md:grid grid-cols-[1fr,120px,140px,100px] gap-6 items-center p-4">
              {/* Clip info */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-24 overflow-hidden rounded-md bg-gray-200">
                  <img
                    className="h-full w-full object-cover"
                    src={clipThumbnails[index]}
                    alt={`${title} thumbnail`}
                  />
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900 leading-6">
                    {title}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {clipPostDates[index]}
                  </div>
                </div>
              </div>

              {/* Views */}
              <div className="text-xl font-semibold text-gray-900 text-left">
                {clipViews[index].toLocaleString()}
              </div>

              {/* Watch time */}
              <div>
                <div className="text-xl font-semibold text-gray-900">
                  {clipWatchTimes[index].duration}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {clipWatchTimes[index].completion} Completion
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Edit"
                >
               
                </button>
                <button
                  type="button"
                  className="text-gray-600 hover:text-red-600 transition-colors"
                  aria-label="Delete"
                >
               
                </button>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
              {/* Main Mobile Row */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-12 w-16 overflow-hidden rounded-md bg-gray-200 flex-shrink-0">
                    <img
                      className="h-full w-full object-cover"
                      src={clipThumbnails[index]}
                      alt={`${title} thumbnail`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 leading-5 truncate">
                      {title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {clipPostDates[index]}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 relative menu-container">
                  <button
                    type="button"
                    onClick={() => toggleMenu(index)}
                    className="text-gray-600 hover:text-gray-900 transition-colors p-1"
                    aria-label="More options"
                  >
                    ⋮
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleClipDetails(index)}
                    className="text-gray-600 hover:text-gray-900 transition-colors p-1"
                    aria-label="Toggle Details"
                  >
                    ▼
                  </button>

                  {/* Dropdown Menu */}
                  {openMenus.includes(index) && (
                    <div className="absolute right-0 top-8 z-10 w-32 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <button
                          type="button"
                          onClick={closeAllMenus}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                           Edit
                        </button>
                        <button
                          type="button"
                          onClick={closeAllMenus}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                        Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Expandable Details */}
              {expandedClips.includes(index) && (
                <div className="px-4 pb-4 border-t border-gray-200 bg-gray-100/50">
                  <div className="pt-3 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">
                        Views
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {clipViews[index].toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">
                        Watch Time
                      </span>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {clipWatchTimes[index].duration}
                        </div>
                        <div className="text-xs text-gray-500">
                          {clipWatchTimes[index].completion} Completion
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 🔹 Custom Dropdown using Headless UI
function Dropdown({
  value,
  onChange,
  options,
}: {
  value: { value: string; label: string };
  onChange: (val: any) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-pointer rounded-md border bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6F8375] sm:text-sm">
          <span className="block truncate text-[#717680]">{value.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronsUpDown className="h-5 w-5 text-gray-400" />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg z-10">
          {options.map((option) => (
            <Listbox.Option
              key={option.value}
              value={option}
              className={({ active }) =>
                `cursor-pointer select-none py-2 pl-3 pr-9 ${
                  active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                }`
              }
            >
              {({ selected }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? "font-semibold" : "font-normal"
                    }`}
                  >
                    {option.label}
                  </span>
                  {selected ? (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#6F8375]">
                      <Check className="h-5 w-5" />
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
