import React, { useEffect, useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { getMyPosts } from "@/app/services/get.my-posts.service";

const TopPerformingClips = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const res = await getMyPosts();

      setPosts(res.data || []);
    }
    fetchPosts();
  }, []);

  return (
    <div className="bg-white rounded-md shadow p-3 sm:p-4 mt-6 sm:mt-8">
      <h3 className="text-base text-[#434342] sm:text-lg font-semibold border-b pb-3 sm:pb-4 mb-3 sm:mb-4">
        Top Performing Clip
      </h3>
      <div className="h-[466px] overflow-y-auto space-y-4 sm:space-y-6">
        {posts.map((clip) => (
          <div
            key={clip.id}
            // className="flex flex-row justify-between gap-3 sm:gap-0 border border-red-500"
            className="
        flex flex-col lg:flex-row 
        justify-between gap-3 sm:gap-0 
     
        
      "
          >
            {/* Image/Video + Text Section */}
            <div className="flex flex-col lg:flex-row  lg:items-center lg:space-x-3 gap-2 lg:gap-0">
              <div className="w-full lg:w-[263px] h-[104px]">
                {/* Show video if video string exists */}
                {clip.video && typeof clip.video === 'string' ? (
                  <video
                    src={clip.video}
                    controls
                    className="w-full lg:w-[263px] h-[104px] rounded-[8px] object-cover flex-shrink-0"
                  />
                ) : (
                  /* Show first image if images array exists with valid src, else fallback to clip.image */
                  Array.isArray(clip.images) && clip.images.length > 0 && clip.images[0] ? (
                    <Image
                      src={clip.images[0]}
                      alt={clip.title}
                      width={263}
                      height={104}
                      className="w-full lg:w-[263px] h-[104px] rounded-[8px] object-cover flex-shrink-0"
                    />
                  ) : clip.image && typeof clip.image === 'string' ? (
                    <Image
                      src={clip.image}
                      alt={clip.title}
                      width={263}
                      height={104}
                      className="w-full lg:w-[263px] h-[104px] rounded-[8px] object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-full lg:w-[263px] h-[104px] rounded-[8px] bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No media</span>
                    </div>
                  )
                )}
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <h4 className="font-[500] font-inter text-[#434342] text-[18px] lg:text-[24px] truncate">
                  {clip.title}
                </h4>
                <p className="font-[400] font-inter text-[#434342] text-[16px]">
                  {clip.createdAt
                    ? `Posted ${formatDistanceToNow(parseISO(clip.createdAt), { addSuffix: true })}`
                    : clip.posted}
                </p>
                <p className="font-[500] font-inter text-[#434342] text-[16px]">
                  {clip.totalViews || 0} views
                </p>
              </div>
            </div>

            {/* Analytics & Product Button */}
            <div className="lg:ml-10 ml-0 flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
              {/* View Product Button */}
              {clip.productLink && (
                <button
                  onClick={() => window.open(clip.productLink, '_blank')}
                  className="font-[500] font-inter text-white text-[16px] whitespace-nowrap px-4 py-2 bg-[#968470] hover:bg-[#5a6a61] rounded-md transition-colors"
                >
                  View Product
                </button>
              )}
              
              {/* View Analytics Button */}
              <button className="font-[500] font-inter text-[#434342] text-[16px] whitespace-nowrap px-3 py-2 border rounded-md hover:bg-gray-50 transition-colors flex items-center">
                View Analytics{" "}
                <ChevronRight size={20} className="ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPerformingClips;
