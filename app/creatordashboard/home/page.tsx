"use client";

import { Plus, Search } from "lucide-react";

import { useState } from "react";
import TopPerformingClips from "@/app/components/creatordashboard/home/top-performing-clips";
import UploadPost from "@/app/components/creatordashboard/upload-post";
import MetrixCard from "@/app/components/Cards/metrix-card";
import VideoChart from "@/app/components/Cards/video-chart";

export default function CreatorHomePage() {
  const [showUploadPost, setShowUploadPost] = useState(false);

  if (showUploadPost) {
    return <UploadPost setShowUploadPost={setShowUploadPost} />;
  }

  return (
    <div className="bg-white full border rounded-[12px] lg:p-6 py-4 px-1 p-0 max-w-auto mx-auto border-[#D5D7DA]">
      {/* Header */}

      <div className="p-4 lg:p-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <div className="flex flex-col gap-2">
          <h1 className="font-inter font-semibold lg:text-[24px] text-[20px] leading-[38px] tracking-[0] text-[#434342]">
            Dashboard
          </h1>
          <p className="text-[16px] font-[400] font-inter text-[#434342]">
            Welcome to Cahsai
          </p>
        </div>

        {/* Search + Upload */}
        <div className="px-2 lg:px-0 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <div className="flex items-center rounded-lg px-3 py-2 bg-white shadow-sm flex-grow sm:flex-grow-0">
            <Search className="w-4 h-8 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="outline-none text-sm"
            />
          </div>
          {/* Upload Post Button */}
          <button
            onClick={() => setShowUploadPost(true)}
            className="bg-[#6f8375] h-[40px] text-white px-4 py-2 rounded-md shadow-sm whitespace-nowrap w-full sm:w-auto flex gap-x-1 items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Upload Post</span>
          </button>
        </div>
      </div>
      <div className="max-w-7xl ">
        <MetrixCard />
      </div>
      <div className="bg-white rounded-[10px]  py-2 mt-6 sm:mt-8">
        <VideoChart />
      </div>

      {/* Top Performing Clip Section */}
      <TopPerformingClips />
    </div>
  );
}
