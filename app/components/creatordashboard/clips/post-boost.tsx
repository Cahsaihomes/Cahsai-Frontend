"use client";

import { useState, useEffect } from "react";
import { getMyPosts } from "@/app/services/get.my-posts.service";
import {
  ArrowLeft,
  Bookmark,
  ChevronDown,
  Eye,
  MapPin,
  Share2,
} from "lucide-react";
import Image from "next/image";
import BoostPostModal from "@/app/components/creatordashboard/clips/postmodal"; // import modal

export default function BoostPostPage({
  setShowPostBoost,
}: {
  setShowPostBoost: (show: boolean) => void;
}) {
  const [promotedExpanded, setPromotedExpanded] = useState(true);
  const [postsExpanded, setPostsExpanded] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = [
    "Home Office",
    "Hardwood Floors",
    "Fireplace",
    "Smart Home Features",
    "Washing Machine Access",
    "Mini Fridge",
    "Shared Kitchen Access",
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const PropertyCard = ({
    isPromoted = false,
    post
  }: {
    isPromoted?: boolean;
    post?: any;
  }) => (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 transition hover:shadow-md">
      <div className="relative">
        {isPromoted && (
          <div className="mb-2 mt-3 ml-2 bg-[#E8F0E0] text-[#417E00] text-xs px-2 py-1 rounded inline-block">
            Promoted
          </div>
        )}
        <div
          className="p-2 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
        >
          <Image
            src={post && Array.isArray(post.images) && post.images.length > 0 ? post.images[0] : post?.image || "/images/tour.png"}
            alt={post?.title || "Property"}
            width={400}
            height={160}
            className="w-full h-40 object-cover rounded"
          />
        </div>
      </div>
      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">{post?.price ? `$${post.price}` : "$ 20,000"}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{post?.location || "09 Arnolds Crossing, Botsfordborough"}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4 mr-1" />
            <span>{post?.totalViews ?? post?.views ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bookmark className="w-4 h-4 mr-1" />
            <span>{post?.totalSaves ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="w-4 h-4 mr-1" />
            <span>{post?.totalShares ?? 0}</span>
          </div>
        </div>
        {/* Tags */}
        <h3 className="text-sm font-medium text-gray-800 mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTag(tag);
                }}
                className={`px-3 py-1 text-xs rounded-lg border transition ${
                  isSelected
                    ? "bg-[#5A6B61] border-[#5A6B61] text-white"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Assume posts with isPromoted: true are boosted
  const promotedPosts = posts.filter((p) => p.isPromoted);

  useEffect(() => {
    getMyPosts()
      .then((res) => setPosts(res.data || []))
      .catch(() => setError("Failed to fetch posts"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen  border border-[#D5D7DA] rounded-[12px] lg:p-6 py-4 px-1 p-0">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ArrowLeft
            className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer text-gray-600"
            onClick={() => setShowPostBoost(false)}
          />
          <h1 className="font-inter font-semibold lg:text-[24px] text-[20px] leading-[38px] tracking-[0] text-[#434342]">
            Boost Your Post
          </h1>
        </div>

        {/* Promoted Posts Section */}
        <div className="space-y-4">
          <button
            onClick={() => setPromotedExpanded(!promotedExpanded)}
            className="flex items-center justify-between w-full text-left"
          >
            <h2 className="text-[18px] lg:text-xl font-semibold text-gray-900">
              Promoted Posts
            </h2>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${
                promotedExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          {promotedExpanded && (
            loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : promotedPosts.length === 0 ? (
              <div className="text-center py-8">No boosted post yet</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {promotedPosts.map((post, idx) => (
                  <PropertyCard key={post.id || idx} isPromoted={true} post={post} />
                ))}
              </div>
            )
          )}
        </div>

        {/* See Your Posts Section */}
        <div className="space-y-4">
          <button
            onClick={() => setPostsExpanded(!postsExpanded)}
            className="flex items-center justify-between w-full text-left"
          >
            <h2 className="text-[18px] lg:text-xl font-semibold text-gray-900">
              See Your Posts
            </h2>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${
                postsExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          {postsExpanded && (
            loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8">No posts found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {posts.map((post, idx) => (
                  <PropertyCard key={post.id || idx} post={post} />
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Modal */}
      <BoostPostModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
