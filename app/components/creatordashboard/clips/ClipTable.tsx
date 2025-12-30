"use client";

import { Check, ChevronsUpDown, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Listbox } from "@headlessui/react";

import { getMyPosts } from "@/app/services/get.my-posts.service";

const formatPostedDate = (createdAt: string) => {
  if (!createdAt) return "-";
  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 1) return "Posted today";
  if (diffDays === 1) return "Posted 1 day ago";
  if (diffDays < 7) return `Posted ${diffDays} days ago`;
  if (diffDays < 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `Posted ${Math.floor(diffDays / 30)} months ago`;
  return `Posted ${Math.floor(diffDays / 365)} years ago`;
};

const ClipTable = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getMyPosts()
      .then((res) => setPosts(res.data || []))
      .catch(() => setError("Failed to fetch posts"))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = posts.slice(startIndex, startIndex + itemsPerPage);
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

  return (
    <div className="w-full max-w-6xl mt-6">
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
      <div className="w-full overflow-x-auto border rounded-lg">
        <table className="w-full min-w-[600px] text-left">
          <thead className="bg-gray-100 text-black">
            <tr>
              <th className="p-3 font-[500] text-[16px] font-inter">Clips</th>
              <th className="p-3 font-[500] text-[16px]text-center font-inter">
                Views
              </th>
              <th className="p-3 font-[500] text-[16px] text-center font-inter">
                Watch Time
              </th>
              <th className="p-3 font-[500] text-[16px] text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={4} className="text-center py-8 text-red-500">{error}</td></tr>
            ) : currentItems.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8">No posts found.</td></tr>
            ) : currentItems.map((clip, idx) => (
              <tr key={idx} className="">
                {/* Clip Info */}
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={Array.isArray(clip.images) && clip.images.length > 0 ? clip.images[0] : clip.image || "/images/placeholder.png"}
                      alt={clip.title || "Clip"}
                      width={150}
                      height={105}
                      className="rounded-lg object-cover w-[100px] h-[100px] lg:w-[150px] lgh-[105px] "
                    />
                    <div className="flex flex-col h-[105px] justify-between">
                      <span className="font-[500] text-[#434342] font-inter text-[18px]  lg:text-[24px]">
                        {clip.title}
                      </span>
                      <span className="text-[14px] lg:text-[16px] font-[400] font-inter text-[#717680]">
                        {formatPostedDate(clip.createdAt)}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Views */}
                <td className="p-3 text-center text-black text-[18px] lg:text-[24px]">
                  {(clip.totalViews ?? clip.views ?? 0).toLocaleString()}
                </td>

                {/* Watch Time */}
                <td className="p-3 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-black text-[18px] lg:text-[24px]">
                      {clip.watch_time?.duration || "-"}
                    </span>
                    <span className="text-[#717680] text-[14px] lg:text-[16px]">
                      {clip.watch_time?.completion ? `${clip.watch_time.completion} Completion` : "-"}
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2 text-black">
                    <SquarePen size={24} className="cursor-pointer" />
                    <Trash2 size={24} className="cursor-pointer " />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between p-3 border-t text-sm text-gray-600">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClipTable;
