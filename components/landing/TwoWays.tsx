"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, Search } from "lucide-react";

export default function TwoWays() {
  const [activeTab, setActiveTab] = useState<"watch" | "search">("watch");

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white" id="two-ways">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center text-gray-900 mb-3 sm:mb-6">
          Two Ways to Experience Homes
        </h2>
        <p className="flex justify-center mb-8 sm:mb-10 text-[#737373] text-sm sm:text-base lg:text-lg">
          Choose your journey
        </p>

        {/* Tab Switch */}
        <div className="flex justify-center mb-8 sm:mb-12 lg:mb-16">
          <div className="flex items-center bg-[#f5f6f7] shadow-sm rounded-full p-1 gap-1 border border-gray-200">
            
            <button
              onClick={() => setActiveTab("watch")}
              className={`flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-4 rounded-full text-xs sm:text-sm font-medium transition-all
                ${activeTab === "watch" 
                  ? "bg-white shadow-sm text-gray-900" 
                  : "text-gray-500"}
              `}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Watch Homes</span>
              <span className="sm:hidden">Watch</span>
            </button>

            <button
              onClick={() => setActiveTab("search")}
              className={`flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-4 rounded-full text-xs sm:text-sm font-medium transition-all
                ${activeTab === "search" 
                  ? "bg-white shadow-sm text-gray-900" 
                  : "text-gray-500"}
              `}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search Homes</span>
              <span className="sm:hidden">Search</span>
            </button>

          </div>
        </div>

        {/* BOTH CARDS ALWAYS SHOW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-10 items-start px-0 sm:px-4 lg:px-[150px]">

          {/* WATCH CARD */}
          <div
            className={`
              transition-all duration-300 
              p-4 sm:p-6 rounded-2xl border 
              ${activeTab === "watch" 
                ? "scale-105 shadow-xl border-gray-200" 
                : "scale-95 opacity-60 border-gray-100"}
            `}
          >
             <Eye className="w-5 sm:w-6 h-5 sm:h-6 mb-2" />
            <div className="flex items-center gap-2 mb-3 sm:mb-4 text-gray-800">
             
              <h3 className="text-lg sm:text-2xl font-bold">Watch Homes</h3>
            </div>

            <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              Scroll through short-form, emotional video tours. Discover homes 
              through the eyes of creators and fall in love before you search.
            </p>

            <Image
              src="/images/watch-home.png"
              alt="Watch Homes Interface"
              width={1000}
              height={1000}
              className="rounded-lg shadow-md object-contain w-full h-auto"
            />
          </div>

          {/* SEARCH CARD */}
          <div
            className={`
              transition-all duration-300 
              p-4 sm:p-6 rounded-2xl border 
              ${activeTab === "search" 
                ? "scale-105 shadow-xl border-gray-200" 
                : "scale-95 opacity-60 border-gray-100"}
            `}
          >
              <Search className="w-5 sm:w-6 h-5 sm:h-6 mb-2" />
            <div className="flex items-center gap-2 mb-3 sm:mb-4 text-gray-800">
            
              <h3 className="text-lg sm:text-2xl font-bold">Search Listings</h3>
            </div>

            <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              Browse clean, curated listings with all the details you need. Filter by 
              location, price, and features—traditional search, beautifully reimagined.
            </p>

            <Image
              src="/images/search-home.png"
              alt="Search Homes Interface"
              width={1000}
              height={1000}
              className="rounded-lg shadow-md object-contain w-full h-auto"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
