"use client";

import { useState } from "react";
import MoodboardCard from "@/components/ui/moodboard-card";

import { RootState } from "@/app/redux";
import { useSelector } from "react-redux";
import { useBuyerPost, useBuyerSavedPost } from "@/hooks/useHooks";

export default function Page() {
  const user = useSelector((state: RootState) => state.auth.user);

  const { data: posts, isLoading } = useBuyerPost();
  const { data: savedPosts } = useBuyerSavedPost();

  // Pills
  const tabs = [
    "All",
    "Inspired by creators",
    "From agents you follow",
  ] as const;

  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("All");

  const properties =
    posts?.data?.map((post: any) => ({
      id: post.id,
      price: `$ ${post.price}`,
      name: `${post.user.first_name} ${post.user.last_name}`,
      profile_pic: post.user.avatarUrl,
      type: post.homeStyle?.length
        ? post.homeStyle.slice(0, 2).join(" | ")
        : post.title || "N/A",
      location: `${post.city}, ${post.location || ""}`,
      image: post.images?.[0] || "/images/frame2.jpg",
      tag: post.user?.role,
      isSaved:
        savedPosts?.data?.some((sp: any) => sp.postId === post.id) || false,
      ...post,
      userContact: post.user?.contact,
      userEmail: post.user?.email,
      userId: post.userId,
    })) || [];

  const filtered = properties.filter(
    (p: any) =>
      activeTab === "All" ||
      (activeTab === "Inspired by creators" && p.tag === "creator") ||
      (activeTab === "From agents you follow" && p.tag === "agent")
  );

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8 border border-[#D5D7DA] rounded-[12px]">
      {/* Header */}
      <header className="flex items-center justify-between py-4 mb-6">
        {/* Title */}
        <h1 className="text-[20px] lg:text-2xl font-semibold text-gray-700 text-left flex-1">
          {user?.first_name} {user?.last_name} Dreamboard
        </h1>

        {/* Right side (empty spacer so text stays centered) */}
        <div className="w-9" />
      </header>

      {/* Pills row */}
      <div className="w-full mx-auto mb-8 flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            aria-pressed={activeTab === tab}
            className={[
              "px-4 py-2 rounded-md text-sm font-medium border transition",
              activeTab === tab
                ? "bg-[#6C806F] text-white border-transparent shadow-sm"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50",
            ].join(" ")}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loader */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-[#6C806F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500 w-full">No Record found!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mx-auto">
          {filtered.map((property: any, index: number) => (
            <div key={index} className="relative rounded-2xl overflow-hidden">
              {/* Tag badge */}
              <span
                className={`absolute top-2 left-2 z-10 px-2.5 py-1 rounded-md text-xs font-semibold
              ${
                property.tag === "Agent"
                  ? "bg-[#3232321F] text-[#746200]"
                  : "bg-[#3232321F] text-black"
              }`}
              >
                {property.tag}
              </span>

              <MoodboardCard
                post={{
                  id: property?.id,
                  price: property.price,
                  name: property.name,
                  type: property.type,
                  location: property.location,
                  city: property.city,
                  image: property.image || "/images/tour.png",
                  profile_pic: property?.profile_pic,
                  isSaved: property?.isSaved,
                  bedrooms: property.bedrooms,
                  bathrooms: property.bathrooms,
                  description: property.description,
                  tags: property.tags,
                  amenities: property.amenities,
                  video: property.video,
                  isPromoted: property.isPromoted,
                  forYou: property.forYou,
                  contact: property.userContact,
                  email: property.userEmail,
                  userId: property.userId,
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
