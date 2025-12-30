"use client";
import { Bookmark, ChevronDown, Heart, Share2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getCreatorClipStats, CreatorClipStatsResponse } from "@/app/services/creatorDashboard.service";

const VideoMetrixCard = () => {
  const [stats, setStats] = useState<CreatorClipStatsResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCreatorClipStats()
      .then((res) => setStats(res.data))
      .catch(() => setError("Failed to fetch clip metrics"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading metrics...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(220px,1fr))] mt-4">
        {/* Total Videos */}
        <div className="flex flex-col gap-2 bg-white h-[100px] rounded-[10px] p-[16px] border border-[#E9EAEB] [box-shadow:1px_2px_4px_0px_#00000008,3px_7px_7px_0px_#00000008,7px_15px_10px_0px_#00000005,13px_26px_12px_0px_#00000000,20px_41px_13px_0px_#00000000]">
          <p className="text-[14px] text-[#434342] opacity-50 font-inter font-[500]">Total Videos</p>
          <h3 className="text-[#434342] text-[24px] font-[500] font-inter">{stats?.totalVideos ?? 0}</h3>
        </div>

        {/* Total Clip Views */}
        <div className="flex flex-col gap-2 bg-white h-[100px] rounded-[10px] p-[16px] border border-[#E9EAEB] [box-shadow:1px_2px_4px_0px_#00000008,3px_7px_7px_0px_#00000008,7px_15px_10px_0px_#00000005,13px_26px_12px_0px_#00000000,20px_41px_13px_0px_#00000000]">
          <p className="text-[14px] text-[#434342] opacity-50 font-inter font-[500]">Total Clip Views</p>
          <h3 className="text-[#434342] text-[24px] font-[500] font-inter">{stats?.totalViews ?? 0}</h3>
        </div>

        {/* Total Earnings */}
        <div className="flex flex-col gap-2 bg-white h-[100px] rounded-[10px] p-[16px] border border-[#E9EAEB] [box-shadow:1px_2px_4px_0px_#00000008,3px_7px_7px_0px_#00000008,7px_15px_10px_0px_#00000005,13px_26px_12px_0px_#00000000,20px_41px_13px_0px_#00000000]">
          <div className="flex items-center justify-between">
            <p className="text-[14px] text-[#434342] opacity-50 font-inter font-[500]">Total Earnings</p>
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-[#434342] text-[24px] font-[500] font-inter">${typeof stats?.totalEarning === "number" ? stats.totalEarning.toFixed(2) : "0.00"}</h3>
            <span className="text-[12px] text-[#434342]">This Month</span>
          </div>
        </div>

        {/* Engagement Score */}
        <div className="flex flex-col gap-2 bg-white h-[100px] rounded-[10px] p-[16px] border border-[#E9EAEB] [box-shadow:1px_2px_4px_0px_#00000008,3px_7px_7px_0px_#00000008,7px_15px_10px_0px_#00000005,13px_26px_12px_0px_#00000000,20px_41px_13px_0px_#00000000]">
          <p className="text-[14px] text-[#434342] opacity-50 font-inter font-[500]">Engagement Score</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <h3 className="text-xl sm:text-2xl font-semibold">{stats?.engagementScore ?? 0}</h3>
            <div className="flex items-center text-[12px] gap-1 text-[#434342]">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" fill="#6f8375" strokeWidth={0} />
              <span>{stats?.totalLikes ?? 0}</span>
              <Share2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              <span>{stats?.totalShares ?? 0}</span>
              <Bookmark className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" fill="#6f8375" strokeWidth={0} />
              <span>{stats?.totalSaves ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoMetrixCard;
